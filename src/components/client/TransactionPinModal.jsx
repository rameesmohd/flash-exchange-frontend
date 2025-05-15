import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Spin } from "antd";
import { LoadingOutlined } from '@ant-design/icons';

const PIN_LENGTH = 6;

const TransactionPinModal = ({ open, onClose, onSubmit,loading }) => {
  const [pin, setPin] = useState(Array(PIN_LENGTH).fill(""));
  const inputsRef = useRef([]);

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

  const submitRef = useRef(onSubmit);

  useEffect(() => {
    submitRef.current = onSubmit;
  }, [onSubmit]);

  const handleSubmit = () => {
    const joined = pin.join("");
    if (joined.length === PIN_LENGTH) {
      console.log("handleSubmit triggered", joined);
      submitRef.current(joined); // use the ref instead
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Overlay */}
          <motion.div
            className="fixed inset-0 bg-black/50 z-[1100]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Bottom Modal */}
          <motion.div
            className="fixed bottom-0 left-0 right-0 z-[1101] bg-white rounded-t-3xl p-6"
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
          >
            <div className="w-12 h-1 bg-gray-300 rounded-full mx-auto mb-4" />

            <div className="text-center mb-6">
              <h3 className="text-lg font-semibold text-gray-800">Enter Transaction PIN</h3>
              <p className="text-sm text-gray-500">This confirms your transaction securely</p>
            </div>

            {/* OTP Inputs */}
            <div className="flex justify-center gap-2 mb-6">
              {pin.map((digit, idx) => (
                <input
                  key={idx}
                  ref={(el) => (inputsRef.current[idx] = el)}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleChange(e.target.value, idx)}
                  onKeyDown={(e) => handleKeyDown(e, idx)}
                  className="w-12 h-14 text-center text-2xl border rounded-xl border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              ))}
            </div>

            <button
              onClick={handleSubmit}
              disabled={pin.includes("")}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-lg font-semibold shadow-lg hover:brightness-105 transition-all"
            >
              {
                loading ? 
                <Spin indicator={<LoadingOutlined className="text-white" spin />} size=""/>
                : 'Confirm'
              }
            </button>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default TransactionPinModal;
