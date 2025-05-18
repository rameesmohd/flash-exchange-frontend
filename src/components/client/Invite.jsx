import { motion, AnimatePresence } from "framer-motion";
import { message, Typography, Table } from "antd";
import { GoCopy } from "react-icons/go";
import { useSelector } from "react-redux";
import { useEffect, useLayoutEffect } from "react";

const { Text } = Typography;

const columns = [
  {
    title: 'Subordinate',
    dataIndex: 'level',
    render: (text, _, index) => (
      <a className="flex">
        <div className="mr-1 bg-slate-300 rounded-full w-4 h-4 flex justify-center items-center p-3">
          {index + 1}
        </div>
        {text}
      </a>
    ),
  },
  {
    title: 'Commision rate',
    dataIndex: 'commission',
    render: text => <div className="text-center">{text}</div>,
  },
];

const data = [
  {
    key: '1',
    level: 'Level Subordinate',
    commission: `0.1%`,
  },
  {
    key: '2',
    level: 'Level Subordinate',
    commission: `0.03%`,
  },
];

const Invite = ({ open, onClose }) => {
  const userData = useSelector((state) => state.User.userData);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(userData.inviteCode).then(() => {
      message.success('Copied to clipboard!');
    }).catch(() => {
      message.error('Failed to copy to clipboard.');
    });
  };

  return (
    <AnimatePresence>
      {open && (
        <div className="absolute inset-0 z-50"> {/* Parent container must be relative */}
          {/* Overlay */}
          <motion.div
            getContainer={false}
            className="absolute inset-0 bg-black/50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Bottom Modal */}
          <motion.div
            getContainer={false}
            className="fixed bottom-0 left-0 right-0 z-[1101] bg-white rounded-t-3xl p-6 overflow-y-auto"
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
          >
            <div className="w-12 h-1 bg-gray-300 rounded-full mx-auto mb-4"></div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Invite friends</h3>

            <Table
              className="custom-table text-end"
              pagination={false}
              columns={columns}
              dataSource={data}
            />

            <p className="text-sm my-2 text-gray-500">
              Each exchange order of your subordinates will
              get you corresponding rewards
            </p>

            <div className="flex justify-center">
              <button
                className="w-72 flex justify-between px-3 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-lg font-semibold shadow-lg hover:brightness-105 transition-all"
                onClick={copyToClipboard}
              >
                <p>Invite code</p>
                <p className="flex items-center">
                  {userData.inviteCode || ''} <GoCopy className="mx-1" />
                </p>
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default Invite;
