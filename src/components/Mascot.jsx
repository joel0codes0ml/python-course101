import { motion } from "framer-motion";

export default function Mascot() {
  return (
    <motion.div
      animate={{ rotate: 360 }}
      transition={{ repeat: Infinity, duration: 8, ease: "linear" }}
      className="w-6 h-6 rounded-full bg-red-600 shadow-[0_0_20px_red]"
    />
  );
}

