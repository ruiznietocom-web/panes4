import React from 'react';
import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Wheat, Cookie, Croissant, Info } from 'lucide-react';

const Navigation = () => {
  const navItems = [
    { name: 'Pan Personalizado', path: '/', icon: Wheat },
    { name: 'Bollitos', path: '/bollitos', icon: Cookie },
    { name: 'Pulguitas', path: '/pulguitas', icon: Croissant },
    { name: '+ INFORMACIÓN', path: '/informacion', icon: Info },
  ];

  return (
    <nav className="bg-white shadow-md p-4 sticky top-0 z-10">
      <div className="max-w-4xl mx-auto flex justify-around">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex flex-col items-center p-2 rounded-lg transition-all duration-300 ${
                isActive
                  ? 'text-amber-600 bg-amber-50 shadow-sm'
                  : 'text-gray-600 hover:text-amber-500 hover:bg-gray-100'
              }`
            }
          >
            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
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
