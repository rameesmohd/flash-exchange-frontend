// components/client/PageWrapper.jsx
import { motion } from "framer-motion";

const slideVariants = {
  initial: { x: "100%", opacity: 0 },
  animate: { x: 0, opacity: 1, transition: { duration: 0.2 } },
  exit: { x: "-100%", opacity: 0, transition: { duration: 0.2 } },
};

const PageWrapper = ({ children }) => {
  return (
    <motion.div
      variants={slideVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className="absolute w-full h-full top-0 left-0"
    >
      {children}
    </motion.div>
  );
};

export default PageWrapper;
