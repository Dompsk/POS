import React from 'react';
import type { Order } from '../../types/pos';
import { Printer, Check, X } from 'lucide-react';

interface ReceiptModalProps {
  order: Order | null;
  isOpen: boolean;
  onClose: () => void;
}

export const ReceiptModal: React.FC<ReceiptModalProps> = ({ order, isOpen, onClose }) => {
  if (!isOpen || !order) return null;

  const handlePrint = () => {
    window.print();
  };

  const paymentLabels: Record<string, string> = {
    cash: 'เงินสด (Cash)',
    promptpay: 'สแกน QR พร้อมเพย์',
    credit_card: 'บัตรเครดิต/เดบิต',
  };

  return (
    <div className="pos-modal-backdrop" onClick={onClose}>
      <div
        className="pos-modal-content"
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: 420 }}
      >
        {/* Receipt Header Actions */}
        <div
          style={{
            padding: '12px 16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderBottom: '1px solid var(--border-color)',
            background: 'var(--primary-50)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--success)' }}>
            <Check size={18} />
            <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>ชำระเงินสำเร็จ</span>
          </div>
          <button
            onClick={onClose}
            style={{
              border: 'none',
              background: 'transparent',
              cursor: 'pointer',
              color: 'var(--text-secondary)',
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Thermal Slip Content */}
        <div
          id="printable-receipt"
          style={{
            padding: '24px',
            backgroundColor: '#ffffff',
            color: '#1e293b',
            fontFamily: "'Courier New', Courier, monospace, 'Prompt'",
            fontSize: '0.85rem',
            lineHeight: 1.4,
          }}
        >
          <div style={{ textAlign: 'center', marginBottom: 12 }}>
            <div style={{ fontSize: '1.2rem', fontWeight: 700, fontFamily: 'var(--font-family)' }}>
              SkyPOS Cafe & Bistro
            </div>
            <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
              สาขาหลัก • โทร 02-123-4567
            </div>
            <div style={{ fontSize: '0.72rem', color: '#94a3b8' }}>
              เลขประจำตัวผู้เสียภาษี: 0105566000000
            </div>
          </div>

          <div
            style={{
              borderTop: '1px dashed #cbd5e1',
              borderBottom: '1px dashed #cbd5e1',
              padding: '8px 0',
              margin: '8px 0',
              fontSize: '0.78rem',
              display: 'flex',
              flexDirection: 'column',
              gap: 2,
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>เลขที่บิล:</span>
              <span style={{ fontWeight: 700 }}>{order.orderNumber}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>เวลา:</span>
              <span>{order.createdAt}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>พนักงาน:</span>
              <span>{order.cashierName}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>ประเภท:</span>
              <span>{order.orderType === 'dine_in' ? 'ทานที่ร้าน' : 'สั่งกลับบ้าน'}</span>
            </div>
          </div>

          {/* Items list */}
          <div style={{ margin: '12px 0', display: 'flex', flexDirection: 'column', gap: 6 }}>
            {order.items.map((item, idx) => (
              <div key={idx} style={{ display: 'flex', justifyContent: 'space-between' }}>
                <div style={{ flex: 1 }}>
                  <div>{item.product.name}</div>
                  <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
                    {item.quantity} x ฿{item.product.price}
                  </div>
                </div>
                <div style={{ fontWeight: 600 }}>
                  ฿{(item.product.price * item.quantity).toLocaleString()}
                </div>
              </div>
            ))}
          </div>

          {/* Summary */}
          <div
            style={{
              borderTop: '1px dashed #cbd5e1',
              paddingTop: 8,
              marginTop: 8,
              display: 'flex',
              flexDirection: 'column',
              gap: 4,
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>ยอดรวม:</span>
              <span>฿{order.subtotal.toLocaleString()}</span>
            </div>

            {order.discount > 0 && (
              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#ef4444' }}>
                <span>ส่วนลด:</span>
                <span>-฿{order.discount.toLocaleString()}</span>
              </div>
            )}

            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.76rem', color: '#64748b' }}>
              <span>VAT 7% (รวมในยอด):</span>
              <span>฿{order.vat.toFixed(2)}</span>
            </div>

            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                fontSize: '1.05rem',
                fontWeight: 700,
                marginTop: 4,
                paddingTop: 4,
                borderTop: '1px solid #e2e8f0',
              }}
            >
              <span>ยอดสุทธิ:</span>
              <span>฿{order.total.toLocaleString()}</span>
            </div>

            {order.paymentMethod && (
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  fontSize: '0.8rem',
                  marginTop: 6,
                  color: '#475569',
                }}
              >
                <span>ชำระด้วย:</span>
                <span>{paymentLabels[order.paymentMethod] || order.paymentMethod}</span>
              </div>
            )}

            {order.paymentMethod === 'cash' && order.amountReceived !== undefined && (
              <>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem' }}>
                  <span>รับเงินมา:</span>
                  <span>฿{order.amountReceived.toLocaleString()}</span>
                </div>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    fontSize: '0.85rem',
                    fontWeight: 700,
                  }}
                >
                  <span>เงินทอน:</span>
                  <span>฿{(order.change || 0).toLocaleString()}</span>
                </div>
              </>
            )}
          </div>

          {/* Footer note */}
          <div
            style={{
              textAlign: 'center',
              marginTop: 16,
              fontSize: '0.75rem',
              color: '#94a3b8',
            }}
          >
            ขอบพระคุณที่ใช้บริการ
            <br />
            THANK YOU • PLEASE COME AGAIN
          </div>
        </div>

        {/* Modal Actions */}
        <div
          style={{
            padding: '12px 16px',
            borderTop: '1px solid var(--border-color)',
            display: 'flex',
            gap: 10,
            background: 'var(--bg-muted)',
          }}
        >
          <button
            type="button"
            className="pos-btn pos-btn-secondary"
            style={{ flex: 1 }}
            onClick={handlePrint}
          >
            <Printer size={18} />
            <span>พิมพ์ใบเสร็จ</span>
          </button>
          <button
            type="button"
            className="pos-btn pos-btn-primary"
            style={{ flex: 1 }}
            onClick={onClose}
          >
            <span>รับออเดอร์ถัดไป</span>
          </button>
        </div>
      </div>
    </div>
  );
};
