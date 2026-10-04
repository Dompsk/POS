import React from 'react';
import type { Order } from '../types/pos';
import {
  DollarSign,
  ShoppingBag,
  TrendingUp,
  CreditCard,
  Banknote,
  QrCode,
  PieChart,
} from 'lucide-react';

interface ReportsViewProps {
  orders: Order[];
}

export const ReportsView: React.FC<ReportsViewProps> = ({ orders }) => {
  const totalRevenue = orders.reduce((sum, o) => sum + o.total, 0);
  const totalBills = orders.length;
  const avgTicket = totalBills > 0 ? Math.round(totalRevenue / totalBills) : 0;

  // Breakdown by payment
  const cashTotal = orders
    .filter((o) => o.paymentMethod === 'cash')
    .reduce((sum, o) => sum + o.total, 0);
  const promptpayTotal = orders
    .filter((o) => o.paymentMethod === 'promptpay')
    .reduce((sum, o) => sum + o.total, 0);
  const cardTotal = orders
    .filter((o) => o.paymentMethod === 'credit_card')
    .reduce((sum, o) => sum + o.total, 0);

  // Top products sold
  const productSalesMap: Record<string, { name: string; qty: number; revenue: number }> = {};
  orders.forEach((order) => {
    order.items.forEach((item) => {
      if (!productSalesMap[item.product.id]) {
        productSalesMap[item.product.id] = {
          name: item.product.name,
          qty: 0,
          revenue: 0,
        };
      }
      productSalesMap[item.product.id].qty += item.quantity;
      productSalesMap[item.product.id].revenue += item.quantity * item.product.price;
    });
  });

  const topProducts = Object.values(productSalesMap).sort((a, b) => b.qty - a.qty);

  return (
    <div style={{ flex: 1, padding: '24px', overflowY: 'auto' }}>
      <div style={{ marginBottom: 20 }}>
        <h2 style={{ fontSize: '1.4rem', fontWeight: 700, color: 'var(--text-primary)' }}>
          รายงานสรุปยอดขายประจำวัน
        </h2>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
          สถิติยอดขาย การชำระเงิน และรายการสินค้าขายดีแบบเรียลไทม์
        </p>
      </div>

      {/* KPI Cards */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: 16,
          marginBottom: 24,
        }}
      >
        <div
          style={{
            background: 'var(--bg-surface)',
            padding: '16px 20px',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid var(--border-color)',
            boxShadow: 'var(--shadow-xs)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>ยอดขายรวม</span>
            <div
              style={{
                width: 32,
                height: 32,
                borderRadius: '50%',
                background: 'var(--primary-100)',
                color: 'var(--primary-700)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <DollarSign size={18} />
            </div>
          </div>
          <div style={{ fontSize: '1.6rem', fontWeight: 700, color: 'var(--primary-700)', marginTop: 8 }}>
            ฿{totalRevenue.toLocaleString()}
          </div>
        </div>

        <div
          style={{
            background: 'var(--bg-surface)',
            padding: '16px 20px',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid var(--border-color)',
            boxShadow: 'var(--shadow-xs)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>จำนวนบิลทั้งหมด</span>
            <div
              style={{
                width: 32,
                height: 32,
                borderRadius: '50%',
                background: 'var(--primary-100)',
                color: 'var(--primary-700)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <ShoppingBag size={18} />
            </div>
          </div>
          <div style={{ fontSize: '1.6rem', fontWeight: 700, color: 'var(--text-primary)', marginTop: 8 }}>
            {totalBills} บิล
          </div>
        </div>

        <div
          style={{
            background: 'var(--bg-surface)',
            padding: '16px 20px',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid var(--border-color)',
            boxShadow: 'var(--shadow-xs)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>ยอดเฉลี่ยต่อบิล</span>
            <div
              style={{
                width: 32,
                height: 32,
                borderRadius: '50%',
                background: 'var(--primary-100)',
                color: 'var(--primary-700)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <TrendingUp size={18} />
            </div>
          </div>
          <div style={{ fontSize: '1.6rem', fontWeight: 700, color: 'var(--text-primary)', marginTop: 8 }}>
            ฿{avgTicket.toLocaleString()}
          </div>
        </div>

        <div
          style={{
            background: 'var(--bg-surface)',
            padding: '16px 20px',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid var(--border-color)',
            boxShadow: 'var(--shadow-xs)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>ภาษี VAT 7% สะสม</span>
            <div
              style={{
                width: 32,
                height: 32,
                borderRadius: '50%',
                background: 'var(--primary-100)',
                color: 'var(--primary-700)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <PieChart size={18} />
            </div>
          </div>
          <div style={{ fontSize: '1.6rem', fontWeight: 700, color: 'var(--text-primary)', marginTop: 8 }}>
            ฿{(totalRevenue * 0.07).toFixed(2)}
          </div>
        </div>
      </div>

      {/* Two columns: Payment split & Top Selling */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
        {/* Payment Channels */}
        <div
          style={{
            background: 'var(--bg-surface)',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid var(--border-color)',
            padding: 20,
            boxShadow: 'var(--shadow-xs)',
          }}
        >
          <h3 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: 16 }}>
            ช่องทางการรับชำระ
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {/* PromptPay */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.88rem' }}>
                  <QrCode size={16} color="var(--primary-600)" /> พร้อมเพย์ (PromptPay)
                </span>
                <span style={{ fontWeight: 700, color: 'var(--primary-700)' }}>
                  ฿{promptpayTotal.toLocaleString()}
                </span>
              </div>
              <div style={{ height: 8, background: 'var(--bg-muted)', borderRadius: 4, overflow: 'hidden' }}>
                <div
                  style={{
                    height: '100%',
                    background: 'var(--primary-500)',
                    width: totalRevenue > 0 ? `${(promptpayTotal / totalRevenue) * 100}%` : '0%',
                  }}
                />
              </div>
            </div>

            {/* Cash */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.88rem' }}>
                  <Banknote size={16} color="var(--success)" /> เงินสด (Cash)
                </span>
                <span style={{ fontWeight: 700, color: 'var(--success)' }}>
                  ฿{cashTotal.toLocaleString()}
                </span>
              </div>
              <div style={{ height: 8, background: 'var(--bg-muted)', borderRadius: 4, overflow: 'hidden' }}>
                <div
                  style={{
                    height: '100%',
                    background: 'var(--success)',
                    width: totalRevenue > 0 ? `${(cashTotal / totalRevenue) * 100}%` : '0%',
                  }}
                />
              </div>
            </div>

            {/* Credit Card */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.88rem' }}>
                  <CreditCard size={16} color="var(--primary-400)" /> บัตรเครดิต/เดบิต
                </span>
                <span style={{ fontWeight: 700, color: 'var(--primary-600)' }}>
                  ฿{cardTotal.toLocaleString()}
                </span>
              </div>
              <div style={{ height: 8, background: 'var(--bg-muted)', borderRadius: 4, overflow: 'hidden' }}>
                <div
                  style={{
                    height: '100%',
                    background: 'var(--primary-300)',
                    width: totalRevenue > 0 ? `${(cardTotal / totalRevenue) * 100}%` : '0%',
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Top Selling Products */}
        <div
          style={{
            background: 'var(--bg-surface)',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid var(--border-color)',
            padding: 20,
            boxShadow: 'var(--shadow-xs)',
          }}
        >
          <h3 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: 16 }}>
            อันดับสินค้าขายดี
          </h3>

          {topProducts.length === 0 ? (
            <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>ยังไม่มีข้อมูลการขาย</div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {topProducts.slice(0, 5).map((item, idx) => (
                <div
                  key={idx}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '8px 12px',
                    borderRadius: 'var(--radius-md)',
                    background: 'var(--bg-muted)',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <span
                      style={{
                        width: 22,
                        height: 22,
                        borderRadius: '50%',
                        background: idx === 0 ? 'var(--primary-500)' : 'var(--primary-100)',
                        color: idx === 0 ? '#fff' : 'var(--primary-700)',
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      {idx + 1}
                    </span>
                    <span style={{ fontWeight: 600, fontSize: '0.88rem' }}>{item.name}</span>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontWeight: 700, color: 'var(--primary-700)', fontSize: '0.88rem' }}>
                      {item.qty} ชิ้น
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      ฿{item.revenue.toLocaleString()}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
