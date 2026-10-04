import React, { useState } from 'react';
import type { Order } from '../types/pos';
import { ReceiptModal } from '../components/pos/ReceiptModal';
import {
  Receipt,
  PlayCircle,
  Eye,
  CheckCircle2,
  Clock,
  Utensils,
  ShoppingBag,
} from 'lucide-react';

interface OrdersViewProps {
  orders: Order[];
  heldOrders: Order[];
  onResumeHeldOrder: (order: Order) => void;
}

export const OrdersView: React.FC<OrdersViewProps> = ({
  orders,
  heldOrders,
  onResumeHeldOrder,
}) => {
  const [activeTab, setActiveTab] = useState<'completed' | 'held'>('completed');
  const [selectedOrderForReceipt, setSelectedOrderForReceipt] = useState<Order | null>(null);

  const displayOrders = activeTab === 'completed' ? orders : heldOrders;

  return (
    <div style={{ flex: 1, padding: '24px', overflowY: 'auto' }}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '20px',
        }}
      >
        <div>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 700, color: 'var(--text-primary)' }}>
            ประวัติการขายและบิล
          </h2>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            ตรวจสอบรายการคำสั่งซื้อ บิลที่พักไว้ และพิมพ์ใบเสร็จย้อนหลัง
          </p>
        </div>

        {/* Tab Switcher */}
        <div
          style={{
            display: 'flex',
            background: 'var(--bg-surface)',
            border: '1px solid var(--border-color)',
            padding: 4,
            borderRadius: 'var(--radius-md)',
            boxShadow: 'var(--shadow-xs)',
          }}
        >
          <button
            onClick={() => setActiveTab('completed')}
            className={`pos-btn ${activeTab === 'completed' ? 'pos-btn-primary' : 'pos-btn-secondary'}`}
            style={{ padding: '8px 16px', fontSize: '0.85rem' }}
          >
            <CheckCircle2 size={16} />
            <span>สำเร็จแล้ว ({orders.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('held')}
            className={`pos-btn ${activeTab === 'held' ? 'pos-btn-primary' : 'pos-btn-secondary'}`}
            style={{ padding: '8px 16px', fontSize: '0.85rem' }}
          >
            <Clock size={16} />
            <span>พักบิลไว้ ({heldOrders.length})</span>
          </button>
        </div>
      </div>

      {/* Orders Table */}
      {displayOrders.length === 0 ? (
        <div
          style={{
            padding: '60px 20px',
            textAlign: 'center',
            background: 'var(--bg-surface)',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid var(--border-color)',
            color: 'var(--text-muted)',
          }}
        >
          <Receipt size={48} color="var(--primary-300)" style={{ margin: '0 auto 12px' }} />
          <div style={{ fontWeight: 600, fontSize: '1rem', color: 'var(--text-secondary)' }}>
            ไม่มีรายการ{activeTab === 'completed' ? 'คำสั่งซื้อที่เสร็จสิ้น' : 'บิลที่พักไว้'}
          </div>
        </div>
      ) : (
        <div
          style={{
            background: 'var(--bg-surface)',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid var(--border-color)',
            overflow: 'hidden',
            boxShadow: 'var(--shadow-xs)',
          }}
        >
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr
                style={{
                  background: 'var(--primary-50)',
                  borderBottom: '1px solid var(--primary-200)',
                  fontSize: '0.85rem',
                  color: 'var(--primary-800)',
                }}
              >
                <th style={{ padding: '12px 16px' }}>เลขที่บิล</th>
                <th style={{ padding: '12px 16px' }}>เวลา</th>
                <th style={{ padding: '12px 16px' }}>ประเภท</th>
                <th style={{ padding: '12px 16px' }}>รายการสินค้า</th>
                <th style={{ padding: '12px 16px' }}>การชำระ</th>
                <th style={{ padding: '12px 16px', textAlign: 'right' }}>ยอดรวม</th>
                <th style={{ padding: '12px 16px', textAlign: 'center' }}>การกระทำ</th>
              </tr>
            </thead>
            <tbody>
              {displayOrders.map((ord) => (
                <tr
                  key={ord.id}
                  style={{
                    borderBottom: '1px solid var(--border-light)',
                    fontSize: '0.88rem',
                  }}
                >
                  <td style={{ padding: '14px 16px', fontWeight: 700, color: 'var(--primary-700)' }}>
                    {ord.orderNumber}
                  </td>
                  <td style={{ padding: '14px 16px', color: 'var(--text-secondary)' }}>
                    {ord.createdAt}
                  </td>
                  <td style={{ padding: '14px 16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      {ord.orderType === 'dine_in' ? (
                        <>
                          <Utensils size={14} color="var(--primary-600)" />
                          <span>ทานที่ร้าน</span>
                        </>
                      ) : (
                        <>
                          <ShoppingBag size={14} color="var(--primary-600)" />
                          <span>กลับบ้าน</span>
                        </>
                      )}
                    </div>
                  </td>
                  <td style={{ padding: '14px 16px', color: 'var(--text-secondary)' }}>
                    {ord.items.map((i) => `${i.product.name} (x${i.quantity})`).join(', ')}
                  </td>
                  <td style={{ padding: '14px 16px' }}>
                    <span
                      style={{
                        padding: '3px 8px',
                        borderRadius: 'var(--radius-sm)',
                        background: ord.paymentMethod ? 'var(--primary-100)' : 'var(--warning-light)',
                        color: ord.paymentMethod ? 'var(--primary-700)' : '#b45309',
                        fontSize: '0.78rem',
                        fontWeight: 600,
                      }}
                    >
                      {ord.paymentMethod ? ord.paymentMethod.toUpperCase() : 'ยังไม่ชำระ'}
                    </span>
                  </td>
                  <td
                    style={{
                      padding: '14px 16px',
                      textAlign: 'right',
                      fontWeight: 700,
                      color: 'var(--text-primary)',
                    }}
                  >
                    ฿{ord.total.toLocaleString()}
                  </td>
                  <td style={{ padding: '14px 16px', textAlign: 'center' }}>
                    {activeTab === 'held' ? (
                      <button
                        onClick={() => onResumeHeldOrder(ord)}
                        className="pos-btn pos-btn-primary"
                        style={{ padding: '6px 12px', fontSize: '0.8rem', margin: '0 auto' }}
                      >
                        <PlayCircle size={15} />
                        <span>ดึงบิลมาขายต่อ</span>
                      </button>
                    ) : (
                      <button
                        onClick={() => setSelectedOrderForReceipt(ord)}
                        className="pos-btn pos-btn-secondary"
                        style={{ padding: '6px 12px', fontSize: '0.8rem', margin: '0 auto' }}
                      >
                        <Eye size={15} />
                        <span>ดูใบเสร็จ</span>
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* View Receipt Modal */}
      <ReceiptModal
        order={selectedOrderForReceipt}
        isOpen={Boolean(selectedOrderForReceipt)}
        onClose={() => setSelectedOrderForReceipt(null)}
      />
    </div>
  );
};
