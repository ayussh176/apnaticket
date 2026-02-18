import { motion } from 'framer-motion';

export default function Spinner({ size = 24, color = 'border-white' }: { size?: number, color?: string }) {
    return (
        <motion.div
            style={{ width: size, height: size }}
            className={`border-2 border-t-transparent rounded-full ${color}`}
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
        />
    );
}
