import React from 'react';
import { ShoppingBag, Receipt, Package, BarChart3, Settings } from 'lucide-react';
import type { ActiveView } from '../../types/pos';

interface SidebarProps {
  activeView: ActiveView;
  onSelectView: (view: ActiveView) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeView, onSelectView }) => {
  const menuItems: { id: ActiveView; label: string; icon: React.ReactNode }[] = [
    { id: 'pos', label: 'ขาย', icon: <ShoppingBag size={22} /> },
    { id: 'orders', label: 'บิล', icon: <Receipt size={22} /> },
    { id: 'inventory', label: 'สินค้า', icon: <Package size={22} /> },
    { id: 'reports', label: 'รายงาน', icon: <BarChart3 size={22} /> },
    { id: 'settings', label: 'ตั้งค่า', icon: <Settings size={22} /> },
  ];

  return (
    <aside className="pos-sidebar">
      {menuItems.map((item) => {
        const isActive = activeView === item.id;
        return (
          <button
            key={item.id}
            className={`pos-nav-item ${isActive ? 'active' : ''}`}
            onClick={() => onSelectView(item.id)}
            title={item.label}
          >
            {item.icon}
            <span>{item.label}</span>
          </button>
        );
      })}
    </aside>
  );
};
