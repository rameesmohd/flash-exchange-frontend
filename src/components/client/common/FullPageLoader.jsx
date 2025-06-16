// /components/FullPageLoader.jsx
import { Spin } from 'antd';

const FullPageLoader = () => (
  <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-white">
    <Spin size="large" />
  </div>
);

export default FullPageLoader;
