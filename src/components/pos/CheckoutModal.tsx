import React, { useState } from 'react';
import type { PaymentMethod } from '../../types/pos';
import {
  X,
  Banknote,
  QrCode,
  CreditCard,
  CheckCircle,
  Coins,
} from 'lucide-react';

interface CheckoutModalProps {
  isOpen: boolean;
  total: number;
  onClose: () => void;
  onConfirmPayment: (
    method: PaymentMethod,
    received: number,
    change: number
  ) => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  total,
  onClose,
  onConfirmPayment,
}) => {
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('cash');
  const [cashReceived, setCashReceived] = useState<number>(total);

  if (!isOpen) return null;

  const change = Math.max(0, cashReceived - total);
  const isCashSufficient = cashReceived >= total;

  const quickAmounts = [total, 100, 500, 1000].filter(
    (amount, index, self) =>
      amount >= total && self.indexOf(amount) === index
  );

  const handleConfirm = () => {
    if (paymentMethod === 'cash' && !isCashSufficient) return;
    const finalReceived = paymentMethod === 'cash' ? cashReceived : total;
    const finalChange = paymentMethod === 'cash' ? change : 0;
    onConfirmPayment(paymentMethod, finalReceived, finalChange);
  };

  return (
    <div className="pos-modal-backdrop" onClick={onClose}>
      <div className="pos-modal-content" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div
          style={{
            padding: '16px 20px',
            borderBottom: '1px solid var(--border-color)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: 'var(--primary-50)',
          }}
        >
          <div>
            <h3 style={{ fontSize: '1.15rem', color: 'var(--primary-700)', fontWeight: 700 }}>
              ชำระเงิน
            </h3>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              เลือกช่องทางและตรวจสอบยอดเงิน
            </span>
          </div>
          <button
            onClick={onClose}
            style={{
              border: 'none',
              background: 'transparent',
              cursor: 'pointer',
              color: 'var(--text-secondary)',
              padding: 4,
            }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* Total display banner */}
          <div
            style={{
              background: 'linear-gradient(135deg, var(--primary-500) 0%, var(--primary-600) 100%)',
              color: '#ffffff',
              borderRadius: 'var(--radius-lg)',
              padding: '16px 20px',
              textAlign: 'center',
              boxShadow: '0 6px 16px rgba(14, 165, 233, 0.25)',
            }}
          >
            <div style={{ fontSize: '0.85rem', opacity: 0.9 }}>ยอดชำระทั้งสิ้น</div>
            <div style={{ fontSize: '2.25rem', fontWeight: 700, letterSpacing: '-0.5px' }}>
              ฿{total.toLocaleString()}
            </div>
          </div>

          {/* Payment Method Selector */}
          <div>
            <div
              style={{
                fontSize: '0.85rem',
                fontWeight: 600,
                color: 'var(--text-secondary)',
                marginBottom: 8,
              }}
            >
              วิธีการชำระเงิน
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
              <button
                type="button"
                className={`pos-btn ${paymentMethod === 'cash' ? 'pos-btn-primary' : 'pos-btn-secondary'}`}
                style={{
                  flexDirection: 'column',
                  padding: '12px 8px',
                  borderRadius: 'var(--radius-md)',
                  height: 'auto',
                }}
                onClick={() => setPaymentMethod('cash')}
              >
                <Banknote size={24} />
                <span style={{ fontSize: '0.82rem' }}>เงินสด</span>
              </button>

              <button
                type="button"
                className={`pos-btn ${paymentMethod === 'promptpay' ? 'pos-btn-primary' : 'pos-btn-secondary'}`}
                style={{
                  flexDirection: 'column',
                  padding: '12px 8px',
                  borderRadius: 'var(--radius-md)',
                  height: 'auto',
                }}
                onClick={() => setPaymentMethod('promptpay')}
              >
                <QrCode size={24} />
                <span style={{ fontSize: '0.82rem' }}>พร้อมเพย์</span>
              </button>

              <button
                type="button"
                className={`pos-btn ${paymentMethod === 'credit_card' ? 'pos-btn-primary' : 'pos-btn-secondary'}`}
                style={{
                  flexDirection: 'column',
                  padding: '12px 8px',
                  borderRadius: 'var(--radius-md)',
                  height: 'auto',
                }}
                onClick={() => setPaymentMethod('credit_card')}
              >
                <CreditCard size={24} />
                <span style={{ fontSize: '0.82rem' }}>บัตรเครดิต</span>
              </button>
            </div>
          </div>

          {/* Method Details */}
          {paymentMethod === 'cash' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div>
                <label
                  style={{
                    display: 'block',
                    fontSize: '0.85rem',
                    fontWeight: 600,
                    color: 'var(--text-secondary)',
                    marginBottom: 6,
                  }}
                >
                  จำนวนเงินที่รับมา (บาท)
                </label>
                <input
                  type="number"
                  min={total}
                  value={cashReceived}
                  onChange={(e) => setCashReceived(Number(e.target.value) || 0)}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    fontSize: '1.25rem',
                    fontWeight: 700,
                    borderRadius: 'var(--radius-md)',
                    border: '2px solid var(--primary-300)',
                    outline: 'none',
                    textAlign: 'right',
                    fontFamily: 'inherit',
                  }}
                />
              </div>

              {/* Quick Amount Buttons */}
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {quickAmounts.map((amount) => (
                  <button
                    key={amount}
                    type="button"
                    onClick={() => setCashReceived(amount)}
                    className="pos-btn pos-btn-secondary"
                    style={{
                      flex: 1,
                      padding: '8px 4px',
                      fontSize: '0.85rem',
                      borderRadius: 'var(--radius-sm)',
                    }}
                  >
                    {amount === total ? 'พอดี' : `฿${amount}`}
                  </button>
                ))}
              </div>

              {/* Change Display */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '12px 16px',
                  borderRadius: 'var(--radius-md)',
                  background: isCashSufficient ? 'var(--success-light)' : 'var(--danger-light)',
                  border: `1px solid ${isCashSufficient ? 'var(--success)' : 'var(--danger)'}`,
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <Coins size={20} color={isCashSufficient ? 'var(--success)' : 'var(--danger)'} />
                  <span
                    style={{
                      fontWeight: 600,
                      color: isCashSufficient ? 'var(--success)' : 'var(--danger)',
                    }}
                  >
                    {isCashSufficient ? 'เงินทอน' : 'ยอดเงินไม่เพียงพอ'}
                  </span>
                </div>
                <span
                  style={{
                    fontSize: '1.35rem',
                    fontWeight: 700,
                    color: isCashSufficient ? 'var(--success)' : 'var(--danger)',
                  }}
                >
                  ฿{change.toLocaleString()}
                </span>
              </div>
            </div>
          )}

          {paymentMethod === 'promptpay' && (
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                padding: '16px',
                background: 'var(--primary-50)',
                borderRadius: 'var(--radius-lg)',
                border: '1px solid var(--primary-200)',
                gap: 12,
              }}
            >
              <div
                style={{
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  color: 'var(--primary-700)',
                }}
              >
                Thai QR Payment / PromptPay
              </div>

              {/* QR Mockup */}
              <div
                style={{
                  width: 170,
                  height: 170,
                  background: '#ffffff',
                  padding: 10,
                  borderRadius: 12,
                  boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: '1px solid var(--border-color)',
                }}
              >
                <QrCode size={135} color="#003b64" />
                <span style={{ fontSize: '0.65rem', color: '#003b64', fontWeight: 600, marginTop: 4 }}>
                  SCAN TO PAY ฿{total.toLocaleString()}
                </span>
              </div>

              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', textAlign: 'center' }}>
                เมื่อลูกค้าโอนเรียบร้อยแล้ว กดปุ่ม "ยืนยันการชำระเงิน" ด้านล่าง
              </div>
            </div>
          )}

          {paymentMethod === 'credit_card' && (
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                padding: '24px',
                background: 'var(--bg-muted)',
                borderRadius: 'var(--radius-lg)',
                border: '1px solid var(--border-color)',
                gap: 10,
              }}
            >
              <CreditCard size={44} color="var(--primary-600)" />
              <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>
                แตะหรือเสียบบัตรที่เครื่อง EDC
              </div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                รองรับ VISA, Mastercard, PromptCard
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div
          style={{
            padding: '16px 20px',
            borderTop: '1px solid var(--border-color)',
            display: 'flex',
            gap: 10,
            background: 'var(--bg-surface)',
          }}
        >
          <button
            type="button"
            className="pos-btn pos-btn-secondary"
            style={{ flex: 1 }}
            onClick={onClose}
          >
            ยกเลิก
          </button>
          <button
            type="button"
            className="pos-btn pos-btn-primary"
            style={{ flex: 2 }}
            disabled={paymentMethod === 'cash' && !isCashSufficient}
            onClick={handleConfirm}
          >
            <CheckCircle size={18} />
            <span>ยืนยันการชำระเงิน</span>
          </button>
        </div>
      </div>
    </div>
  );
};
