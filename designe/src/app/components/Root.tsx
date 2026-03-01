import { Outlet, useLocation } from 'react-router';
import { motion, AnimatePresence } from 'motion/react';
import { Navbar } from './Navbar';
import { Footer } from './Footer';

const hideFooterRoutes = ['/login', '/register', '/checkout'];

export function Root() {
  const location = useLocation();
  const showFooter = !hideFooterRoutes.includes(location.pathname);

  return (
    <div className="bg-zinc-950">
      <Navbar />
      <AnimatePresence mode="wait">
        <motion.main
          key={location.pathname}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
        >
          <Outlet />
        </motion.main>
      </AnimatePresence>
      {showFooter && <Footer />}
    </div>
  );
}
