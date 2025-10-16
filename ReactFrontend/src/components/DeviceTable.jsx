import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";

function sortData(data, sortBy, direction) {
  const sorted = [...data].sort((a, b) => {
    const av = (a[sortBy] || "").toString().toLowerCase();
    const bv = (b[sortBy] || "").toString().toLowerCase();
    if (av < bv) return -1;
    if (av > bv) return 1;
    return 0;
  });
  return direction === "desc" ? sorted.reverse() : sorted;
}

// PUBLIC_INTERFACE
export default function DeviceTable({
  devices,
  onBulkDelete,
}) {
  /** Displays a sortable, filterable table of devices with checkbox selection for bulk delete. */
  const [query, setQuery] = useState("");
  const [sortBy, setSortBy] = useState("name");
  const [direction, setDirection] = useState("asc");
  const [selected, setSelected] = useState({});
  const filterInputRef = useRef(null);

  useEffect(() => {
    // focus filter input on mount
    filterInputRef.current?.focus();
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const result = devices.filter((d) => {
      const composite = [
        d.name,
        d.ip_address,
        d.mac_address,
        d.location,
        d.type,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      return composite.includes(q);
    });
    return sortData(result, sortBy, direction);
  }, [devices, query, sortBy, direction]);

  const allSelected = useMemo(() => {
    if (!filtered.length) return false;
    return filtered.every((d) => selected[d.id]);
  }, [filtered, selected]);

  function toggleAll() {
    if (allSelected) {
      const newSel = { ...selected };
      filtered.forEach((d) => delete newSel[d.id]);
      setSelected(newSel);
    } else {
      const newSel = { ...selected };
      filtered.forEach((d) => (newSel[d.id] = true));
      setSelected(newSel);
    }
  }

  function toggleOne(id) {
    setSelected((prev) => ({ ...prev, [id]: !prev[id] }));
  }

  function doBulkDelete() {
    const ids = Object.keys(selected).filter((id) => selected[id]);
    if (!ids.length) return;
    if (window.confirm(`Delete ${ids.length} selected device(s)?`)) {
      onBulkDelete(ids).then(() => {
        const newSel = { ...selected };
        ids.forEach((id) => delete newSel[id]);
        setSelected(newSel);
      });
    }
  }

  function handleSort(col) {
    if (sortBy === col) {
      setDirection((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortBy(col);
      setDirection("asc");
    }
  }

  return (
    <div className="table-container" role="region" aria-label="Devices table">
      <div className="table-toolbar" style={{ display: "flex", gap: 8, marginBottom: 12, flexWrap: "wrap" }}>
        <input
          ref={filterInputRef}
          aria-label="Filter devices"
          placeholder="Filter devices..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          style={{ padding: 8, minWidth: 220 }}
        />
        <button
          className="btn"
          onClick={doBulkDelete}
          aria-label="Delete selected devices"
          disabled={!Object.keys(selected).some((k) => selected[k])}
        >
          Delete Selected
        </button>
        <Link to="/devices/new" className="btn" aria-label="Add new device">
          + Add Device
        </Link>
      </div>

      <div className="responsive-table-wrapper">
        <table className="device-table" role="table" aria-label="Device list">
          <thead>
            <tr>
              <th scope="col">
                <input
                  type="checkbox"
                  aria-label={allSelected ? "Unselect all devices" : "Select all devices"}
                  checked={allSelected}
                  onChange={toggleAll}
                />
              </th>
              {[
                ["name", "Name"],
                ["ip_address", "IP Address"],
                ["mac_address", "MAC Address"],
                ["location", "Location"],
                ["type", "Type"],
                ["actions", "Actions"],
              ].map(([key, label]) => (
                <th
                  key={key}
                  scope="col"
                  aria-sort={sortBy === key ? (direction === "asc" ? "ascending" : "descending") : "none"}
                >
                  {key !== "actions" ? (
                    <button
                      className="link-like"
                      onClick={() => handleSort(key)}
                      aria-label={`Sort by ${label}`}
                    >
                      {label} {sortBy === key ? (direction === "asc" ? "▲" : "▼") : ""}
                    </button>
                  ) : (
                    label
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((d) => (
              <tr key={d.id}>
                <td>
                  <input
                    type="checkbox"
                    aria-label={`Select device ${d.name}`}
                    checked={!!selected[d.id]}
                    onChange={() => toggleOne(d.id)}
                  />
                </td>
                <td>{d.name}</td>
                <td>{d.ip_address}</td>
                <td>{d.mac_address}</td>
                <td>{d.location}</td>
                <td>{d.type}</td>
                <td>
                  <div style={{ display: "flex", gap: 8 }}>
                    <Link to={`/devices/${encodeURIComponent(d.id)}`} className="btn btn-small" aria-label={`View ${d.name}`}>
                      View
                    </Link>
                    <Link to={`/devices/${encodeURIComponent(d.id)}/edit`} className="btn btn-small" aria-label={`Edit ${d.name}`}>
                      Edit
                    </Link>
                  </div>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={7} style={{ textAlign: "center", padding: 16 }}>
                  No devices found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <style>{`
        .responsive-table-wrapper { overflow-x: auto; }
        .device-table { width: 100%; border-collapse: collapse; }
        .device-table th, .device-table td { border-bottom: 1px solid var(--border-color, #e9ecef); padding: 8px; text-align: left; }
        .device-table th { background: var(--bg-secondary, #f8f9fa); position: sticky; top: 0; }
        .link-like { background: none; border: none; color: var(--text-secondary, #61dafb); cursor: pointer; }
        .btn { background: var(--button-bg, #007bff); color: var(--button-text, #fff); border: none; border-radius: 6px; padding: 8px 12px; cursor: pointer; text-decoration: none; display: inline-flex; align-items: center; }
        .btn[disabled] { opacity: 0.6; cursor: not-allowed; }
        .btn-small { padding: 6px 10px; font-size: 0.9rem; }
        .table-toolbar .btn, .table-toolbar a.btn { height: 36px; }
        @media (max-width: 640px) {
          .table-toolbar { flex-direction: column; align-items: stretch; }
          .table-toolbar input { width: 100%; }
        }
      `}</style>
    </div>
  );
}
