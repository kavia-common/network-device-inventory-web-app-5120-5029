import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  listDevices,
  createDevice as apiCreate,
  updateDevice as apiUpdate,
  deleteDevice as apiDelete,
} from "../api/devicesApi";

// PUBLIC_INTERFACE
export function useDevices() {
  /**
   * React hook to manage device list state with fetch, create, update, delete.
   * Provides loading and error states and uses optimistic updates for create/delete.
   */
  const [devices, setDevices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const mounted = useRef(true);

  useEffect(() => {
    return () => {
      mounted.current = false;
    };
  }, []);

  const fetchDevices = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await listDevices();
      if (mounted.current) setDevices(data);
    } catch (e) {
      if (mounted.current) setError(e.message || "Failed to load devices");
    } finally {
      if (mounted.current) setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDevices();
  }, [fetchDevices]);

  const createDevice = useCallback(async (payload) => {
    setError(null);
    // optimistic: add a temp device
    const tempId = `temp-${Date.now()}`;
    const optimistic = { ...payload, id: tempId };
    setDevices((prev) => [optimistic, ...prev]);
    try {
      const created = await apiCreate(payload);
      setDevices((prev) =>
        prev.map((d) => (d.id === tempId ? created : d))
      );
      return created;
    } catch (e) {
      // rollback
      setDevices((prev) => prev.filter((d) => d.id !== tempId));
      setError(e.message || "Failed to create device");
      throw e;
    }
  }, []);

  const updateDevice = useCallback(async (id, payload) => {
    setError(null);
    // conservative: no optimistic update to avoid heavy merge conflicts
    try {
      const updated = await apiUpdate(id, payload);
      setDevices((prev) => prev.map((d) => (d.id === id ? updated : d)));
      return updated;
    } catch (e) {
      setError(e.message || "Failed to update device");
      throw e;
    }
  }, []);

  const deleteDevice = useCallback(async (id) => {
    setError(null);
    // optimistic remove
    const snapshot = devices;
    setDevices((prev) => prev.filter((d) => d.id !== id));
    try {
      await apiDelete(id);
      return true;
    } catch (e) {
      // rollback
      setDevices(snapshot);
      setError(e.message || "Failed to delete device");
      throw e;
    }
  }, [devices]);

  const bulkDelete = useCallback(
    async (ids) => {
      const snapshot = devices;
      setDevices((prev) => prev.filter((d) => !ids.includes(d.id)));
      try {
        await Promise.all(ids.map((id) => apiDelete(id)));
        return true;
      } catch (e) {
        setDevices(snapshot);
        setError(e.message || "Failed to delete selected devices");
        throw e;
      }
    },
    [devices]
  );

  const state = useMemo(
    () => ({ devices, loading, error }),
    [devices, loading, error]
  );

  return {
    ...state,
    refetch: fetchDevices,
    createDevice,
    updateDevice,
    deleteDevice,
    bulkDelete,
  };
}
