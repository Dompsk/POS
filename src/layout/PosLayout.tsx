import React from 'react';
import type { ActiveView } from '../types/pos';
import { Header } from '../components/common/Header';
import { Sidebar } from '../components/common/Sidebar';

interface PosLayoutProps {
  activeView: ActiveView;
  onSelectView: (view: ActiveView) => void;
  heldOrdersCount: number;
  onOpenHeldOrders: () => void;
  children: React.ReactNode;
}

export const PosLayout: React.FC<PosLayoutProps> = ({
  activeView,
  onSelectView,
  heldOrdersCount,
  onOpenHeldOrders,
  children,
}) => {
  const viewTitles: Record<ActiveView, string> = {
    pos: 'จุดขายหน้าร้าน (Cashier Sale)',
    orders: 'รายการขายและบิล (Receipts & History)',
    inventory: 'จัดการคลังสินค้า (Stock & Inventory)',
    reports: 'รายงานยอดขาย (Analytics & Reports)',
    settings: 'การตั้งค่าระบบ (System Settings)',
  };

  return (
    <div className="pos-container">
      {/* Slim Icon Navigation Sidebar */}
      <Sidebar activeView={activeView} onSelectView={onSelectView} />

      {/* Main Area */}
      <div className="pos-main-layout">
        <Header
          heldOrdersCount={heldOrdersCount}
          onOpenHeldOrders={onOpenHeldOrders}
          activeViewTitle={viewTitles[activeView]}
        />
        {children}
      </div>
    </div>
  );
};
