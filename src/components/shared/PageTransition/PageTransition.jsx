/* Libraries */
import { motion, easeInOut } from 'framer-motion';

export default function PageTransition({ children, className }) {
    return (
        <motion.main
            initial={{ opacity: 0, transition: { duration: 0.4, ease: easeInOut } }}
            animate={{ opacity: 1, transition: { duration: 0.4, ease: easeInOut } }}
            exit={{ opacity: 0, transition: { duration: 0.4, ease: easeInOut } }}
            className={className}
        >
            {children}
        </motion.main>
    );
}
