import React from 'react';
import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Wheat, Cookie, Circle, Info } from 'lucide-react';

const Navigation = () => {
  const navItems = [
    { name: 'Pan Personalizado', path: '/', icon: Wheat },
    { name: 'Bollitos', path: '/bollitos', icon: Cookie },
    { name: 'Pulguitas', path: '/pulguitas', icon: Circle },
    { name: '+ INFO', path: '/informacion', icon: Info },
  ];

  return (
    <nav className="bg-gradient-to-r from-orange-100 to-orange-200 shadow-md p-4 sticky top-0 z-10">
      <div className="max-w-4xl mx-auto flex justify-around">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex flex-col items-center p-2 rounded-lg transition-all duration-300 ${
                isActive
                  ? 'text-white bg-gradient-to-r from-orange-400 to-orange-500 shadow-lg'
                  : 'text-gray-700 hover:text-white hover:bg-gradient-to-r hover:from-orange-200 hover:to-orange-300'
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

