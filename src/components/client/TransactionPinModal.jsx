import React, { useState, useRef, useEffect } from "react";
import ReactDOM from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Spin } from "antd";
import { LoadingOutlined } from "@ant-design/icons";

const PIN_LENGTH = 6;

const TransactionPinModal = ({ open, onClose, onSubmit, loading }) => {
  const [pin, setPin] = useState(Array(PIN_LENGTH).fill(""));
  const inputsRef = useRef([]);
  const submitRef = useRef(onSubmit);

  useEffect(() => { submitRef.current = onSubmit; }, [onSubmit]);

  useEffect(() => {
    if (open) {
      setPin(Array(PIN_LENGTH).fill(""));
      setTimeout(() => inputsRef.current[0]?.focus(), 100);
    }
  }, [open]);

  const handleChange = (value, index) => {
    if (!/^\d?$/.test(value)) return;
    const newPin = [...pin];
    newPin[index] = value;
    setPin(newPin);
    if (value && index < PIN_LENGTH - 1) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !pin[index] && index > 0) {
      const newPin = [...pin];
      newPin[index - 1] = "";
      setPin(newPin);
      inputsRef.current[index - 1]?.focus();
    }
  };

  const handleSubmit = () => {
    const joined = pin.join("");
    if (joined.length === PIN_LENGTH) {
      submitRef.current(joined);
    }
  };

  /* ── Portal target — renders directly into document.body,
     completely outside the layout's overflow:hidden / stacking context.
     This is why position:fixed works correctly on iPhone. ── */
  const modal = (
    <AnimatePresence>
      {open && (
        <>
          {/* backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            style={{
              position: "fixed", inset: 0,
              background: "rgba(0,0,0,0.5)",
              zIndex: 9998,
            }}
          />

          {/* sheet */}
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            style={{
              position: "fixed",
              bottom: 0, left: 0, right: 0,
              zIndex: 9999,
              background: "#fff",
              borderRadius: "24px 24px 0 0",
              padding: "24px 24px calc(24px + env(safe-area-inset-bottom, 0px))",
              boxShadow: "0 -4px 30px rgba(0,0,0,0.12)",
            }}
          >
            {/* drag handle */}
            <div style={{ width: 40, height: 4, background: "#e5e7eb", borderRadius: 99, margin: "0 auto 20px" }} />

            {/* title */}
            <div style={{ textAlign: "center", marginBottom: 28 }}>
              <div style={{ fontSize: 17, fontWeight: 700, color: "#0f172a", marginBottom: 5 }}>
                Enter Transaction PIN
              </div>
              <div style={{ fontSize: 13, color: "#94a3b8" }}>
                This confirms your transaction securely
              </div>
            </div>

            {/* PIN inputs */}
            <div style={{ display: "flex", justifyContent: "center", gap: 10, marginBottom: 28 }}>
              {pin.map((digit, idx) => (
                <input
                  key={idx}
                  ref={el => (inputsRef.current[idx] = el)}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={e => handleChange(e.target.value, idx)}
                  onKeyDown={e => handleKeyDown(e, idx)}
                  style={{
                    width: 46, height: 54,
                    textAlign: "center",
                    fontSize: 22, fontWeight: 700,
                    color: "#0f172a",
                    border: digit ? "2px solid #0d1f3c" : "1.5px solid #e2e8f0",
                    borderRadius: 12,
                    background: digit ? "#f0f4ff" : "#fff",
                    outline: "none",
                    transition: "border .15s, background .15s",
                    WebkitAppearance: "none",
                  }}
                />
              ))}
            </div>

            {/* confirm button */}
            <button
              onClick={handleSubmit}
              disabled={pin.includes("") || loading}
              style={{
                width: "100%", padding: "14px",
                borderRadius: 14, border: "none",
                background: pin.includes("") ? "#e2e8f0" : "#0d1f3c",
                color: pin.includes("") ? "#94a3b8" : "#fff",
                fontSize: 15, fontWeight: 700,
                cursor: pin.includes("") ? "not-allowed" : "pointer",
                transition: "background .18s, color .18s",
                display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
              }}
            >
              {loading
                ? <Spin indicator={<LoadingOutlined style={{ color: "#fff" }} spin />} />
                : "Confirm"
              }
            </button>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );

  /* Render into document.body — escapes all stacking contexts */
  return ReactDOM.createPortal(modal, document.body);
};

export default TransactionPinModal;