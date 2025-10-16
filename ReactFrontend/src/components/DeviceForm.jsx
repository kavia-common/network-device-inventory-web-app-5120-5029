import { useEffect, useRef, useState } from "react";
import { validateDevice } from "../utils/validation";

// PUBLIC_INTERFACE
export default function DeviceForm({ initialValues, onSubmit, submitting = false }) {
  /**
   * Form for creating or editing a device.
   * Validates IPv4 and MAC and provides inline errors with ARIA association.
   */
  const [values, setValues] = useState(
    initialValues || {
      name: "",
      ip_address: "",
      mac_address: "",
      location: "",
      type: "router",
    }
  );
  const [errors, setErrors] = useState({});
  const firstFieldRef = useRef(null);
  const errorSummaryRef = useRef(null);

  useEffect(() => {
    firstFieldRef.current?.focus();
  }, []);

  useEffect(() => {
    if (initialValues) setValues(initialValues);
  }, [initialValues]);

  function handleChange(e) {
    const { name, value } = e.target;
    setValues((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const result = validateDevice(values);
    setErrors(result.errors);
    if (!result.valid) {
      errorSummaryRef.current?.focus();
      return;
    }
    await onSubmit(values);
  }

  const field = (name, label, props = {}) => {
    const id = `field_${name}`;
    const err = errors[name];
    const describedBy = err ? `${id}_error` : undefined;
    return (
      <div className="field">
        <label htmlFor={id}>{label}</label>
        <input
          ref={name === "name" ? firstFieldRef : undefined}
          id={id}
          name={name}
          value={values[name] || ""}
          onChange={handleChange}
          aria-invalid={!!err}
          aria-describedby={describedBy}
          {...props}
        />
        {err && (
          <div id={`${id}_error`} className="error" role="alert">
            {err}
          </div>
        )}
      </div>
    );
  };

  return (
    <form onSubmit={handleSubmit} noValidate>
      {Object.keys(errors).length > 0 && (
        <div
          tabIndex={-1}
          ref={errorSummaryRef}
          className="error-summary"
          role="alert"
          aria-live="assertive"
        >
          Please fix the errors below.
        </div>
      )}
      {field("name", "Device Name", { placeholder: "e.g., Core Router 1" })}
      {field("ip_address", "IPv4 Address", { placeholder: "e.g., 192.168.1.10", inputMode: "numeric" })}
      {field("mac_address", "MAC Address", { placeholder: "e.g., AA:BB:CC:DD:EE:FF" })}
      {field("location", "Location", { placeholder: "e.g., Data Center A" })}
      <div className="field">
        <label htmlFor="field_type">Device Type</label>
        <select
          id="field_type"
          name="type"
          value={values.type || "router"}
          onChange={handleChange}
        >
          <option value="router">Router</option>
          <option value="switch">Switch</option>
          <option value="server">Server</option>
          <option value="firewall">Firewall</option>
          <option value="other">Other</option>
        </select>
        {errors.type && (
          <div id="field_type_error" className="error" role="alert">
            {errors.type}
          </div>
        )}
      </div>
      <div style={{ display: "flex", gap: 8, marginTop: 12, flexWrap: "wrap" }}>
        <button className="btn" type="submit" disabled={submitting} aria-label="Save device">
          {submitting ? "Saving..." : "Save"}
        </button>
      </div>
      <style>{`
        form { max-width: 640px; }
        .field { display: flex; flex-direction: column; margin-bottom: 12px; }
        label { margin-bottom: 4px; font-weight: 600; }
        input, select { padding: 10px; border: 1px solid var(--border-color, #e9ecef); border-radius: 6px; }
        .error { color: #b00020; margin-top: 6px; }
        .error-summary { background: #ffe6e6; border-left: 4px solid #b00020; padding: 8px 12px; margin-bottom: 12px; }
        @media (max-width: 640px) { form { padding: 0 8px; } }
      `}</style>
    </form>
  );
}
