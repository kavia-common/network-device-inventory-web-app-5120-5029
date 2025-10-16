import { useEffect, useState } from "react";
import { getStatus } from "../api/devicesApi";

// PUBLIC_INTERFACE
export default function DeviceDetail({ device }) {
  /** Shows device info with online/offline status and a refresh button. */
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  async function loadStatus() {
    setLoading(true);
    setErr("");
    try {
      const s = await getStatus(device.id);
      setStatus(s?.status || "unknown");
    } catch (e) {
      setErr(e.message || "Failed to load status");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadStatus();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [device?.id]);

  return (
    <div className="device-detail">
      <h2 tabIndex={-1} aria-live="polite">{device.name}</h2>
      <div className="grid">
        <div><strong>IP:</strong> {device.ip_address}</div>
        <div><strong>MAC:</strong> {device.mac_address}</div>
        <div><strong>Location:</strong> {device.location}</div>
        <div><strong>Type:</strong> {device.type}</div>
        <div>
          <strong>Status:</strong>{" "}
          <span aria-live="polite">
            {loading ? "Checking..." : status || "unknown"}
          </span>
        </div>
      </div>
      <div style={{ marginTop: 12 }}>
        <button className="btn" onClick={loadStatus} aria-label="Refresh device status">Refresh Status</button>
      </div>
      {err && (
        <div className="error" role="alert" style={{ marginTop: 8 }}>
          {err}
        </div>
      )}
      <style>{`
        .grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 8px; }
        .device-detail h2 { margin-top: 0; }
      `}</style>
    </div>
  );
}
