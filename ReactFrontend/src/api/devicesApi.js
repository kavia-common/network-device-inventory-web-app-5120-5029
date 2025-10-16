import client from "./client";

// Map between frontend model and backend payload if needed
function toPayload(device) {
  return {
    id: device.id,
    name: device.name,
    ip_address: device.ip_address,
    mac_address: device.mac_address,
    location: device.location,
    type: device.type,
  };
}

function fromPayload(payload) {
  return {
    id: payload.id || payload._id || payload.id, // support either id or _id
    name: payload.name,
    ip_address: payload.ip_address,
    mac_address: payload.mac_address,
    location: payload.location,
    type: payload.type || payload.device_type || "other",
  };
}

// PUBLIC_INTERFACE
export async function listDevices() {
  /** Fetch list of all devices. Returns array of device objects. */
  const res = await client.get("/devices");
  return (res.data || []).map(fromPayload);
}

// PUBLIC_INTERFACE
export async function createDevice(device) {
  /** Create a new device and return created device. */
  const res = await client.post("/devices", toPayload(device));
  return fromPayload(res.data);
}

// PUBLIC_INTERFACE
export async function getDevice(id) {
  /** Get a single device by id. */
  const res = await client.get(`/devices/${encodeURIComponent(id)}`);
  return fromPayload(res.data);
}

// PUBLIC_INTERFACE
export async function updateDevice(id, device) {
  /** Update an existing device by id. Returns updated device. */
  const res = await client.put(`/devices/${encodeURIComponent(id)}`, toPayload(device));
  return fromPayload(res.data);
}

// PUBLIC_INTERFACE
export async function deleteDevice(id) {
  /** Delete a device by id. Returns true if success. */
  await client.delete(`/devices/${encodeURIComponent(id)}`);
  return true;
}

// PUBLIC_INTERFACE
export async function getStatus(id) {
  /** Get current online/offline status for a device. */
  const res = await client.get(`/devices/${encodeURIComponent(id)}/status`);
  return res.data; // { id, status }
}
