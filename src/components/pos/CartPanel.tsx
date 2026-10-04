import React from 'react';
import type { CartItem, OrderType } from '../../types/pos';
import {
  Trash2,
  Plus,
  Minus,
  ShoppingBag,
  CreditCard,
  PauseCircle,
  RotateCcw,
  Utensils,
  ShoppingBag as BagIcon,
} from 'lucide-react';

interface CartPanelProps {
  items: CartItem[];
  orderType: OrderType;
  onSetOrderType: (type: OrderType) => void;
  onUpdateQuantity: (productId: string, delta: number) => void;
  onRemoveItem: (productId: string) => void;
  onClearCart: () => void;
  onHoldOrder: () => void;
  onCheckout: () => void;
  discount: number;
}

export const CartPanel: React.FC<CartPanelProps> = ({
  items,
  orderType,
  onSetOrderType,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  onHoldOrder,
  onCheckout,
  discount,
}) => {
  const subtotal = items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );
  const afterDiscount = Math.max(0, subtotal - discount);
  const vat = Math.round(afterDiscount * 0.07 * 100) / 100;
  const total = afterDiscount;
  const totalItemsCount = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <aside className="pos-cart-panel">
      {/* Header */}
      <div className="pos-cart-header">
        <div>
          <div style={{ fontWeight: 700, fontSize: '1.05rem', color: 'var(--text-primary)' }}>
            รายการออเดอร์
          </div>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
            {totalItemsCount > 0 ? `${totalItemsCount} รายการในตะกร้า` : 'ยังไม่มีรายการ'}
          </div>
        </div>

        {/* Order Type switch */}
        <div className="pos-order-type-switch">
          <button
            className={`pos-order-type-btn ${orderType === 'dine_in' ? 'active' : ''}`}
            onClick={() => onSetOrderType('dine_in')}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <Utensils size={14} />
              <span>ทานที่ร้าน</span>
            </div>
          </button>
          <button
            className={`pos-order-type-btn ${orderType === 'takeaway' ? 'active' : ''}`}
            onClick={() => onSetOrderType('takeaway')}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <BagIcon size={14} />
              <span>กลับบ้าน</span>
            </div>
          </button>
        </div>
      </div>

      {/* Cart Items List */}
      <div className="pos-cart-items-container">
        {items.length === 0 ? (
          <div className="pos-cart-empty">
            <div
              style={{
                width: 64,
                height: 64,
                borderRadius: '50%',
                background: 'var(--primary-50)',
                color: 'var(--primary-400)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <ShoppingBag size={32} />
            </div>
            <div>
              <div style={{ fontWeight: 600, color: 'var(--text-secondary)' }}>
                ไม่มีสินค้าในตะกร้า
              </div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: 4 }}>
                คลิกเลือกสินค้าจากเมนูด้านซ้ายเพื่อเริ่มสั่งซื้อ
              </div>
            </div>
          </div>
        ) : (
          items.map((item) => {
            const itemTotal = item.product.price * item.quantity;
            return (
              <div key={item.product.id} className="pos-cart-item">
                <div style={{ fontSize: '1.5rem', marginRight: 4 }}>
                  {item.product.emoji || '📦'}
                </div>

                <div className="pos-cart-item-info">
                  <div className="pos-cart-item-name">{item.product.name}</div>
                  <div className="pos-cart-item-unit-price">
                    ฿{item.product.price.toLocaleString()} / ชิ้น
                  </div>
                </div>

                <div className="pos-cart-qty-control">
                  <button
                    className="pos-qty-btn"
                    onClick={() => {
                      if (item.quantity <= 1) {
                        onRemoveItem(item.product.id);
                      } else {
                        onUpdateQuantity(item.product.id, -1);
                      }
                    }}
                    title={item.quantity <= 1 ? 'ลบรายการ' : 'ลดจำนวน'}
                  >
                    {item.quantity <= 1 ? (
                      <Trash2 size={13} color="var(--danger)" />
                    ) : (
                      <Minus size={13} />
                    )}
                  </button>

                  <span className="pos-qty-display">{item.quantity}</span>

                  <button
                    className="pos-qty-btn"
                    onClick={() => onUpdateQuantity(item.product.id, 1)}
                    title="เพิ่มจำนวน"
                  >
                    <Plus size={13} />
                  </button>
                </div>

                <div className="pos-cart-item-subtotal">
                  ฿{itemTotal.toLocaleString()}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Cart Summary & Checkout */}
      <div className="pos-cart-summary">
        <div className="pos-summary-row">
          <span>ยอดรวมสินค้า</span>
          <span>฿{subtotal.toLocaleString()}</span>
        </div>

        {discount > 0 && (
          <div className="pos-summary-row" style={{ color: 'var(--danger)' }}>
            <span>ส่วนลด</span>
            <span>-฿{discount.toLocaleString()}</span>
          </div>
        )}

        <div className="pos-summary-row">
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            ภาษีมูลค่าเพิ่ม (VAT 7% รวมแล้ว)
          </span>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            ฿{vat.toFixed(2)}
          </span>
        </div>

        <div className="pos-summary-row total-row">
          <span>ยอดชำระทั้งสิ้น</span>
          <span>฿{total.toLocaleString()}</span>
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
          <button
            className="pos-btn pos-btn-secondary"
            style={{ flex: 1, padding: '10px 8px', fontSize: '0.84rem' }}
            disabled={items.length === 0}
            onClick={onHoldOrder}
            title="พักบิลนี้ไว้ชั่วคราวเพื่อทำรายการถัดไป"
          >
            <PauseCircle size={16} />
            <span>พักบิล</span>
          </button>

          <button
            className="pos-btn pos-btn-secondary"
            style={{
              padding: '10px 12px',
              color: 'var(--danger)',
              borderColor: 'var(--border-color)',
            }}
            disabled={items.length === 0}
            onClick={onClearCart}
            title="ล้างรายการทั้งหมด"
          >
            <RotateCcw size={16} />
          </button>
        </div>

        <button
          className="pos-btn pos-btn-primary"
          style={{ width: '100%', padding: '14px', fontSize: '1.05rem', marginTop: 4 }}
          disabled={items.length === 0}
          onClick={onCheckout}
        >
          <CreditCard size={20} />
          <span>ชำระเงิน • ฿{total.toLocaleString()}</span>
        </button>
      </div>
    </aside>
  );
};
