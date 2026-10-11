import React, { useRef, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { getActionById } from '../data/actions';
import { useImpact } from '../context/ImpactContext';
import AppNavbar from '../components/AppNavbar';
import Background from '../components/Background';
import type { InputField } from '../types';

export default function ActionInput() {
  const { actionId } = useParams<{ actionId: string }>();
  const navigate = useNavigate();
  const {
    setSelectedActionId,
    setQuantity,
    setActionMetadata,
    handleFileUpload,
    calculateAndPreview,
    scanResult,
    uploadedImage
  } = useImpact();

  const action = getActionById(actionId || 'recycle-material');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  // Local form state — built from action.inputSchema
  const [formValues, setFormValues] = useState<Record<string, string | number | boolean>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showImageSection, setShowImageSection] = useState(false);
  const [uploading, setUploading] = useState(false);

  const getFieldValue = (fieldId: string): string | number | boolean => {
    return formValues[fieldId] ?? '';
  };

  const setFieldValue = (fieldId: string, value: string | number | boolean) => {
    setFormValues((prev) => ({ ...prev, [fieldId]: value }));
    if (errors[fieldId]) {
      setErrors((prev) => { const next = { ...prev }; delete next[fieldId]; return next; });
    }
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    for (const field of action.inputSchema) {
      if (field.optional) continue;
      const val = formValues[field.id];
      if (val === undefined || val === '' || val === null) {
        newErrors[field.id] = `${field.label} is required`;
      } else if (field.type === 'number') {
        const num = Number(val);
        if (isNaN(num) || num <= 0) {
          newErrors[field.id] = `Please enter a valid ${field.unit || 'amount'}`;
        }
        if (field.min !== undefined && num < field.min) {
          newErrors[field.id] = `Minimum is ${field.min} ${field.unit || ''}`;
        }
        if (field.max !== undefined && num > field.max) {
          newErrors[field.id] = `Maximum is ${field.max.toLocaleString()} ${field.unit || ''}`;
        }
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleContinue = () => {
    if (!validate()) return;

    setSelectedActionId(action.id);

    // Extract quantity (primary measurement field)
    const primaryField = action.inputSchema.find((f) => f.id === 'quantity');
    const qty = primaryField ? Number(formValues['quantity'] ?? 0) : 1;
    setQuantity(qty);

    // Set metadata (all other fields)
    const meta: Record<string, string | number | boolean> = {};
    for (const field of action.inputSchema) {
      if (field.id !== 'quantity' && formValues[field.id] !== undefined) {
        meta[field.id] = formValues[field.id];
      }
    }
    setActionMetadata(meta);

    // Compute preview
    calculateAndPreview(qty, meta, action.id);

    // Navigate to image capture / verification
    navigate(`/actions/${action.id}/capture`);
  };

  const handleFileSelected = async (file?: File) => {
    if (!file) return;
    setUploading(true);
    await handleFileUpload(file, action.id);
    setUploading(false);
    setShowImageSection(true);
  };

  const renderField = (field: InputField) => {
    const val = getFieldValue(field.id);
    const error = errors[field.id];

    switch (field.type) {
      case 'radio':
        return (
          <div key={field.id} className="input-field-group">
            <label className="label">{field.label.toUpperCase()}</label>
            <div className="radio-option-grid">
              {field.options?.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  className={`radio-option-btn ${val === opt.value ? 'selected' : ''}`}
                  onClick={() => setFieldValue(field.id, opt.value)}
                >
                  {opt.icon && <span className="opt-icon">{opt.icon}</span>}
                  <span>{opt.label}</span>
                </button>
              ))}
            </div>
            {error && <span className="field-error">{error}</span>}
          </div>
        );

      case 'select':
        return (
          <div key={field.id} className="input-field-group">
            <label className="label">
              {field.label.toUpperCase()}
              {field.optional && <span className="optional-tag"> (optional)</span>}
            </label>
            <select
              className="input-select"
              value={String(val)}
              onChange={(e) => setFieldValue(field.id, e.target.value)}
            >
              <option value="">Select…</option>
              {field.options?.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
            {error && <span className="field-error">{error}</span>}
          </div>
        );

      case 'number':
        return (
          <div key={field.id} className="input-field-group">
            <label className="label">{field.label.toUpperCase()}</label>
            {field.helpText && (
              <small className="input-hint">{field.helpText}</small>
            )}
            <div className="number-input-row">
              <input
                type="number"
                className={`input-number ${error ? 'error' : ''}`}
                placeholder="0"
                min={field.min}
                max={field.max}
                step={field.step || 1}
                value={val === '' ? '' : String(val)}
                onChange={(e) => {
                  const v = e.target.value === '' ? '' : parseFloat(e.target.value);
                  setFieldValue(field.id, v);
                }}
              />
              {field.unit && (
                <span className="input-unit">{field.unit}</span>
              )}
            </div>
            {error && <span className="field-error">{error}</span>}
          </div>
        );

      case 'toggle':
        return (
          <div key={field.id} className="input-field-group">
            <label className="label">
              {field.label.toUpperCase()}
              {field.optional && <span className="optional-tag"> (optional)</span>}
            </label>
            <div className="toggle-btn-row">
              {field.options?.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  className={`toggle-btn ${val === opt.value ? 'selected' : ''}`}
                  onClick={() => setFieldValue(field.id, opt.value)}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="app-layout">
      <Background />
      <AppNavbar />

      <main className="app-content wrap">
        <motion.div
          className="action-input-card"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Header */}
          <div className="action-details-header">
            <span className="action-large-icon">{action.icon}</span>
            <div>
              <span className="label">{action.category.toUpperCase()} ACTION</span>
              <h1>{action.name.toUpperCase()}</h1>
              <p className="lead">{action.blurb}</p>
            </div>
          </div>

          <hr className="divider" style={{ margin: '24px 0' }} />

          {/* Dynamic Form */}
          <div className="action-form-section">
            <div className="label" style={{ marginBottom: 16 }}>YOUR CONTRIBUTION</div>

            <form
              onSubmit={(e) => { e.preventDefault(); handleContinue(); }}
              className="action-input-form"
            >
              {action.inputSchema.map((field) => renderField(field))}

              {/* Image Evidence Section */}
              <div className="input-field-group">
                <label className="label">PHOTO EVIDENCE <span className="optional-tag">(optional but recommended)</span></label>
                <small className="input-hint">
                  AI will verify your action and identify materials automatically.
                </small>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  hidden
                  onChange={(e) => handleFileSelected(e.target.files?.[0])}
                />
                <input
                  ref={cameraInputRef}
                  type="file"
                  accept="image/*"
                  capture="environment"
                  hidden
                  onChange={(e) => handleFileSelected(e.target.files?.[0])}
                />

                <div className="image-upload-row">
                  <button
                    type="button"
                    className="btn btn-ghost btn-sm"
                    onClick={() => cameraInputRef.current?.click()}
                    disabled={uploading}
                  >
                    📸 Take Photo
                  </button>
                  <button
                    type="button"
                    className="btn btn-ghost btn-sm"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploading}
                  >
                    📁 Upload Photo
                  </button>
                </div>

                {uploadedImage && (
                  <AnimatePresence>
                    <motion.div
                      className="upload-preview-thumb"
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                    >
                      <img src={uploadedImage} alt="Uploaded" />
                      <span className="upload-preview-label">📷 Photo ready for AI verification</span>
                    </motion.div>
                  </AnimatePresence>
                )}
              </div>

              {/* Submit */}
              <div className="action-form-footer">
                <button type="submit" className="btn btn-primary">
                  {uploadedImage ? 'Verify with AI & Calculate Impact →' : 'Calculate My Impact →'}
                </button>
                <Link to="/actions" className="btn btn-ghost">
                  ← Choose another action
                </Link>
              </div>
            </form>
          </div>

          {/* Research note */}
          <div className="research-note-bar">
            <span>🔬</span>
            <small>
              Impact will be calculated using documented research factors
              (<strong>EPA WARM v16</strong>, <strong>CEA India Grid</strong>, <strong>NITI Aayog</strong>).
              {' '}<Link to="/sources" className="link" style={{ fontSize: 'inherit' }}>
                View methodology →
              </Link>
            </small>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
