import { useDevices } from "../hooks/useDevices";
import DeviceTable from "../components/DeviceTable";

// PUBLIC_INTERFACE
export default function Dashboard() {
  /** Dashboard page showing devices and bulk actions. */
  const { devices, loading, error, bulkDelete, refetch } = useDevices();

  return (
    <main className="container" aria-labelledby="dashboard-title">
      <h1 id="dashboard-title" tabIndex={-1}>Device Inventory</h1>
      {loading && <p aria-live="polite">Loading devices...</p>}
      {error && (
        <div role="alert" className="error" style={{ marginBottom: 12 }}>
          {error} <button className="btn btn-small" onClick={refetch}>Retry</button>
        </div>
      )}
      <DeviceTable devices={devices} onBulkDelete={bulkDelete} />
    </main>
  );
}
