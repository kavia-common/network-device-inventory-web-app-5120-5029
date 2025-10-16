import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import DeviceForm from "../components/DeviceForm";
import DeviceDetail from "../components/DeviceDetail";
import { createDevice, getDevice, updateDevice, deleteDevice } from "../api/devicesApi";

// PUBLIC_INTERFACE
export default function DevicePage() {
  /**
   * Page handling routes:
   * - /devices/new
   * - /devices/:id
   * - /devices/:id/edit
   */
  const { id } = useParams();
  const navigate = useNavigate();
  const [device, setDevice] = useState(null);
  const [loading, setLoading] = useState(!!id);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const headerRef = useRef(null);

  const mode = useMemo(() => {
    const path = window.location.pathname;
    if (path.endsWith("/edit")) return "edit";
    if (path.endsWith("/new")) return "new";
    return "detail";
  }, []);

  useEffect(() => {
    headerRef.current?.focus();
  }, [mode, id]);

  useEffect(() => {
    async function load() {
      if (!id || mode === "new") return;
      setLoading(true);
      setError("");
      try {
        const d = await getDevice(id);
        setDevice(d);
      } catch (e) {
        setError(e.message || "Failed to load device");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id, mode]);

  async function handleCreate(values) {
    setSubmitting(true);
    try {
      const created = await createDevice(values);
      navigate(`/devices/${encodeURIComponent(created.id)}`);
    } catch (e) {
      setError(e.message || "Failed to create device");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleUpdate(values) {
    setSubmitting(true);
    try {
      const updated = await updateDevice(id, values);
      setDevice(updated);
      navigate(`/devices/${encodeURIComponent(id)}`);
    } catch (e) {
      setError(e.message || "Failed to update device");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete() {
    if (!device) return;
    if (window.confirm(`Delete device "${device.name}"?`)) {
      try {
        await deleteDevice(device.id);
        navigate("/");
      } catch (e) {
        setError(e.message || "Failed to delete device");
      }
    }
  }

  return (
    <main className="container" aria-labelledby="device-title">
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8, flexWrap: "wrap" }}>
        <h1 id="device-title" ref={headerRef} tabIndex={-1}>
          {mode === "new" ? "Add Device" : mode === "edit" ? "Edit Device" : "Device Details"}
        </h1>
        <Link to="/" className="btn btn-small" aria-label="Back to dashboard">Back</Link>
      </div>

      {error && (
        <div role="alert" className="error" style={{ marginBottom: 12 }}>
          {error}
        </div>
      )}

      {mode === "new" && (
        <DeviceForm onSubmit={handleCreate} submitting={submitting} />
      )}

      {mode === "edit" && (
        <>
          {loading ? (
            <p aria-live="polite">Loading...</p>
          ) : device ? (
            <DeviceForm initialValues={device} onSubmit={handleUpdate} submitting={submitting} />
          ) : (
            <p>Device not found.</p>
          )}
        </>
      )}

      {mode === "detail" && (
        <>
          {loading ? (
            <p aria-live="polite">Loading...</p>
          ) : device ? (
            <>
              <DeviceDetail device={device} />
              <div style={{ marginTop: 12, display: "flex", gap: 8, flexWrap: "wrap" }}>
                <Link to={`/devices/${encodeURIComponent(id)}/edit`} className="btn" aria-label="Edit device">Edit</Link>
                <button className="btn" onClick={handleDelete} aria-label="Delete device">Delete</button>
              </div>
            </>
          ) : (
            <p>Device not found.</p>
          )}
        </>
      )}
    </main>
  );
}
