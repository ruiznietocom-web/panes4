import React from 'react';
import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Wheat, Cookie, CircleDot, Sparkles, BookOpen } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const Navigation = () => {
  const { t } = useTranslation();

  const navItems = [
    { name: t('nav.pan_personalizado'), path: '/', icon: Wheat },
    { name: t('nav.bollitos'), path: '/bollitos', icon: Cookie },
    { name: t('nav.pulguitas'), path: '/pulguitas', icon: CircleDot },
    { name: t('nav.info'), path: '/informacion', icon: BookOpen },
  ];

  return (
    <nav className="sticky top-0 z-20 px-4 py-2.5 transition-colors duration-300">
      <div className="max-w-3xl mx-auto bg-white/85 dark:bg-stone-900/85 backdrop-blur-md rounded-2xl p-1.5 shadow-lg border border-amber-900/10 dark:border-stone-700/60 flex items-center justify-between gap-1">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `relative flex-1 flex flex-col sm:flex-row items-center justify-center gap-1.5 py-2 px-2.5 rounded-xl text-xs font-semibold transition-all duration-300 ${
                isActive
                  ? 'text-amber-950 dark:text-amber-100 font-bold'
                  : 'text-stone-600 dark:text-stone-400 hover:text-amber-800 dark:hover:text-amber-300 hover:bg-amber-50/50 dark:hover:bg-stone-800/40'
              }`
            }
          >
            {({ isActive }) => (
              <>
                {/* Píldora animada deslizante */}
                {isActive && (
                  <motion.span
                    layoutId="nav-pill"
                    className="absolute inset-0 rounded-xl bg-gradient-to-r from-amber-200 via-amber-300 to-amber-200 dark:from-amber-600/40 dark:via-amber-500/30 dark:to-amber-600/40 shadow-sm border border-amber-300 dark:border-amber-500/30"
                    transition={{ type: 'spring', stiffness: 450, damping: 35 }}
                  />
                )}
                <item.icon className="w-4 h-4 relative z-10 shrink-0" />
                <span className="relative z-10 text-[11px] sm:text-xs tracking-tight truncate text-center">
                  {item.name}
                </span>
              </>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  );
};

export default Navigation;
