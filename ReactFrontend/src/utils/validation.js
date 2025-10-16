const ipv4Regex =
  /^(25[0-5]|2[0-4]\d|1?\d?\d)(\.(25[0-5]|2[0-4]\d|1?\d?\d)){3}$/i;

const macRegex =
  /^([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})$/;

// PUBLIC_INTERFACE
export function isValidIPv4(value) {
  /** Returns true if value is a valid IPv4 address. */
  return ipv4Regex.test(String(value || "").trim());
}

// PUBLIC_INTERFACE
export function isValidMac(value) {
  /** Returns true if value is a valid MAC address (colon or hyphen separated). */
  return macRegex.test(String(value || "").trim());
}

// PUBLIC_INTERFACE
export function validateDevice(values) {
  /** Validate a device object. Returns { valid: boolean, errors: {field: msg} } */
  const errors = {};
  if (!values.name || !values.name.trim()) errors.name = "Device name is required.";
  if (!values.ip_address || !isValidIPv4(values.ip_address))
    errors.ip_address = "A valid IPv4 address is required.";
  if (!values.mac_address || !isValidMac(values.mac_address))
    errors.mac_address = "A valid MAC address is required (e.g., AA:BB:CC:DD:EE:FF).";
  if (!values.location || !values.location.trim())
    errors.location = "Location is required.";
  if (!values.type || !values.type.trim())
    errors.type = "Device type is required.";

  return { valid: Object.keys(errors).length === 0, errors };
}
