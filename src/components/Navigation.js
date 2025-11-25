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
              `flex flex-col items-center p-2 rounded-lg transition-all duration-300 ${isActive
                ? 'text-white bg-gradient-to-r from-orange-400 to-orange-500 dark:bg-slate-700 dark:text-amber-400 shadow-lg'
                : 'text-gray-700 dark:text-slate-400 hover:text-white dark:hover:text-amber-400 hover:bg-gradient-to-r hover:from-orange-200 hover:to-orange-300 dark:hover:bg-slate-800'
              }`
            }
          >
            <motion.div
              whileHover={{ scale: 1.15 }}
              whileTap={{ scale: 0.95 }}
              animate={{
                scale: [1, 1.05, 1],
                rotate: [0, 5, -5, 0],
              }}
              transition={{
                duration: 1.2,
                repeat: Infinity,
                repeatDelay: 2,
              }}
            >
              <item.icon className="w-6 h-6 mb-1" />
            </motion.div>
            <span className="text-xs font-medium">{item.name}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  );
};

export default Navigation;

