import React from 'react';
import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Wheat, Cookie, Circle, Info } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const Navigation = () => {
  const { t } = useTranslation();

  const navItems = [
    { name: t('nav.pan_personalizado'), path: '/', icon: Wheat },
    { name: t('nav.bollitos'), path: '/bollitos', icon: Cookie },
    { name: t('nav.pulguitas'), path: '/pulguitas', icon: Circle },
    { name: t('nav.info'), path: '/informacion', icon: Info },
  ];

  return (
    <nav className="bg-gradient-to-r from-orange-100 to-orange-200 dark:from-slate-800 dark:to-slate-900 shadow-md p-4 sticky top-0 z-10 transition-colors duration-300">
      <div className="max-w-4xl mx-auto flex justify-around">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `relative flex flex-col items-center p-2 rounded-lg transition-colors duration-300 ${isActive
                ? 'text-white dark:text-amber-400'
                : 'text-gray-700 dark:text-slate-400 hover:text-orange-600 dark:hover:text-amber-400'
              }`
            }
          >
            {({ isActive }) => (
              <>
                {/* Píldora animada que se desliza entre pestañas */}
                {isActive && (
                  <motion.span
                    layoutId="nav-pill"
                    className="absolute inset-0 rounded-lg bg-gradient-to-r from-orange-400 to-orange-500 dark:from-slate-700 dark:to-slate-700 shadow-lg"
                    transition={{ type: 'spring', stiffness: 400, damping: 32 }}
                  />
                )}
                <motion.div
                  className="relative z-10"
                  whileHover={{ scale: 1.15 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <item.icon className="w-6 h-6 mb-1" />
                </motion.div>
                <span className="relative z-10 text-xs font-medium">{item.name}</span>
              </>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  );
};

export default Navigation;
