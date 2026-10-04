import React, { useState } from 'react';
import type { Product, Category } from '../types/pos';
import {
  Package,
  Search,
  Plus,
  Minus,
  AlertCircle,
  TrendingUp,
  SlidersHorizontal,
  X,
  Check,
  History,
  RotateCcw,
  Sparkles,
} from 'lucide-react';

interface StockLog {
  id: string;
  productName: string;
  type: 'in' | 'out' | 'set';
  changeAmount: number;
  newStock: number;
  reason: string;
  timestamp: string;
}

interface InventoryViewProps {
  products: Product[];
  categories: Category[];
  onUpdateStock: (productId: string, newStock: number) => void;
  onAddProduct: (product: Product) => void;
}

type StockFilter = 'all' | 'low' | 'out' | 'normal';
type AdjustMode = 'in' | 'out' | 'set';

export const InventoryView: React.FC<InventoryViewProps> = ({
  products,
  categories,
  onUpdateStock,
  onAddProduct,
}) => {
  const [search, setSearch] = useState('');
  const [selectedCat, setSelectedCat] = useState('all');
  const [stockFilter, setStockFilter] = useState<StockFilter>('all');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [showLogModal, setShowLogModal] = useState(false);

  // Stock Adjustment Modal state
  const [adjustingProduct, setAdjustingProduct] = useState<Product | null>(null);
  const [adjustMode, setAdjustMode] = useState<AdjustMode>('in');
  const [adjustAmount, setAdjustAmount] = useState<number>(10);
  const [exactStockInput, setExactStockInput] = useState<number>(0);
  const [adjustReason, setAdjustReason] = useState<string>('สั่งซื้อสินค้าเข้าร้าน');

  // Stock Audit History Log
  const [stockLogs, setStockLogs] = useState<StockLog[]>([
    {
      id: 'log-1',
      productName: 'เอสเพรสโซ่เย็น',
      type: 'in',
      changeAmount: 20,
      newStock: 45,
      reason: 'รับสินค้าจากซัพพลายเออร์',
      timestamp: '11:20 น.',
    },
    {
      id: 'log-2',
      productName: 'ครัวซองต์เนยฝรั่งเศส',
      type: 'out',
      changeAmount: -3,
      newStock: 15,
      reason: 'หมดอายุ / ชำรุด',
      timestamp: '13:45 น.',
    },
  ]);

  // New product form state
  const [newProductName, setNewProductName] = useState('');
  const [newProductCategory, setNewProductCategory] = useState(categories[1]?.id || 'coffee');
  const [newProductPrice, setNewProductPrice] = useState(60);
  const [newProductStock, setNewProductStock] = useState(50);
  const [newProductEmoji, setNewProductEmoji] = useState('☕');
  const [newProductIsPopular, setNewProductIsPopular] = useState(false);

  // Filter products by Category, Search, and Stock Level
  const filtered = products
    .filter((p) => {
      const matchCat = selectedCat === 'all' || p.category === selectedCat;
      const matchSearch =
        search === '' ||
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.barcode.includes(search);

      let matchStock = true;
      if (stockFilter === 'low') matchStock = p.stock > 0 && p.stock <= 15;
      else if (stockFilter === 'out') matchStock = p.stock === 0;
      else if (stockFilter === 'normal') matchStock = p.stock > 15;

      return matchCat && matchSearch && matchStock;
    })
    .sort((a, b) => a.stock - b.stock); // เรียงสต็อกเหลือน้อยขึ้นก่อนเสมอ

  const lowStockCount = products.filter((p) => p.stock > 0 && p.stock <= 15).length;
  const outOfStockCount = products.filter((p) => p.stock === 0).length;
  const totalStock = products.reduce((sum, p) => sum + p.stock, 0);
  const totalValue = products.reduce((sum, p) => sum + p.price * p.stock, 0);

  // Quick adjust from table buttons
  const handleQuickAdjust = (product: Product, delta: number) => {
    const newStock = Math.max(0, product.stock + delta);
    onUpdateStock(product.id, newStock);

    const log: StockLog = {
      id: `log-${Date.now()}`,
      productName: product.name,
      type: delta > 0 ? 'in' : 'out',
      changeAmount: delta,
      newStock,
      reason: delta > 0 ? 'ปรับด่วน (+)' : 'ปรับด่วน (-)',
      timestamp: new Date().toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' }),
    };
    setStockLogs((prev) => [log, ...prev]);
  };

  // Open modal for detailed adjustment
  const openAdjustModal = (product: Product) => {
    setAdjustingProduct(product);
    setAdjustMode('in');
    setAdjustAmount(10);
    setExactStockInput(product.stock);
    setAdjustReason('สั่งซื้อสินค้าเข้าร้าน');
  };

  // Confirm Detailed Stock Adjustment
  const handleConfirmAdjustment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!adjustingProduct) return;

    let newStock = adjustingProduct.stock;
    let changeAmount = 0;

    if (adjustMode === 'in') {
      changeAmount = Math.max(1, adjustAmount);
      newStock = adjustingProduct.stock + changeAmount;
    } else if (adjustMode === 'out') {
      changeAmount = -Math.min(adjustingProduct.stock, Math.max(1, adjustAmount));
      newStock = Math.max(0, adjustingProduct.stock + changeAmount);
    } else if (adjustMode === 'set') {
      newStock = Math.max(0, exactStockInput);
      changeAmount = newStock - adjustingProduct.stock;
    }

    onUpdateStock(adjustingProduct.id, newStock);

    const log: StockLog = {
      id: `log-${Date.now()}`,
      productName: adjustingProduct.name,
      type: adjustMode,
      changeAmount,
      newStock,
      reason: adjustReason || 'ปรับปรุงสต็อก',
      timestamp: new Date().toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' }),
    };
    setStockLogs((prev) => [log, ...prev]);

    setAdjustingProduct(null);
  };

  // Preset reasons depending on mode
  const getPresetReasons = () => {
    if (adjustMode === 'in') {
      return ['สั่งซื้อสินค้าเข้าร้าน', 'รับสินค้าจากซัพพลายเออร์', 'ลูกค้าคืนสินค้า', 'ผลิต/ทำเพิ่ม'];
    }
    if (adjustMode === 'out') {
      return ['หมดอายุ / เสื่อมสภาพ', 'ชำรุด / เสียหาย', 'ใช้ชิม / กิจกรรมร้าน', 'สินค้าสูญหาย'];
    }
    return ['ตรวจนับประจำวัน', 'ตรวจนับสิ้นเดือน', 'แก้ไขข้อผิดพลาดบันทึก'];
  };

  const handleCreateProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProductName.trim()) return;

    const newProd: Product = {
      id: `p-${Date.now()}`,
      name: newProductName.trim(),
      category: newProductCategory,
      price: Number(newProductPrice) || 0,
      stock: Number(newProductStock) || 0,
      barcode: `885${Math.floor(1000 + Math.random() * 9000)}`,
      emoji: newProductEmoji || '📦',
      isPopular: newProductIsPopular,
    };

    onAddProduct(newProd);
    setNewProductName('');
    setIsAddModalOpen(false);
  };

  return (
    <div style={{ flex: 1, padding: '24px', overflowY: 'auto' }}>
      {/* Top Header */}
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
            คลังสินค้า & จัดการสต็อก
          </h2>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            ปรับสต็อกได้หลากหลายรูปแบบ ทั้งปุ่มด่วน รับเข้า ตัดจำหน่าย หรือตรวจนับสต็อกจริง
          </p>
        </div>

        <div style={{ display: 'flex', gap: 10 }}>
          <button
            onClick={() => setShowLogModal(true)}
            className="pos-btn pos-btn-secondary"
            style={{ padding: '10px 14px' }}
          >
            <History size={17} />
            <span>ประวัติปรับสต็อก ({stockLogs.length})</span>
          </button>

          <button
            onClick={() => setIsAddModalOpen(true)}
            className="pos-btn pos-btn-primary"
            style={{ padding: '10px 18px' }}
          >
            <Plus size={18} />
            <span>เพิ่มสินค้าใหม่</span>
          </button>
        </div>
      </div>

      {/* Metric Cards */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: 16,
          marginBottom: 24,
        }}
      >
        <div
          onClick={() => setStockFilter('all')}
          style={{
            background: 'var(--bg-surface)',
            padding: '16px 20px',
            borderRadius: 'var(--radius-lg)',
            border: `1.5px solid ${stockFilter === 'all' ? 'var(--primary-500)' : 'var(--border-color)'}`,
            display: 'flex',
            alignItems: 'center',
            gap: 14,
            cursor: 'pointer',
            boxShadow: 'var(--shadow-xs)',
          }}
        >
          <div
            style={{
              width: 44,
              height: 44,
              borderRadius: 'var(--radius-md)',
              background: 'var(--primary-100)',
              color: 'var(--primary-700)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Package size={24} />
          </div>
          <div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>สินค้าทั้งหมด</div>
            <div style={{ fontSize: '1.35rem', fontWeight: 700, color: 'var(--text-primary)' }}>
              {products.length} รายการ
            </div>
            <div style={{ fontSize: '0.74rem', color: 'var(--text-secondary)' }}>
              รวม {totalStock} ชิ้น
            </div>
          </div>
        </div>

        <div
          onClick={() => setStockFilter('low')}
          style={{
            background: 'var(--bg-surface)',
            padding: '16px 20px',
            borderRadius: 'var(--radius-lg)',
            border: `1.5px solid ${stockFilter === 'low' ? 'var(--warning)' : 'var(--border-color)'}`,
            display: 'flex',
            alignItems: 'center',
            gap: 14,
            cursor: 'pointer',
            boxShadow: 'var(--shadow-xs)',
          }}
        >
          <div
            style={{
              width: 44,
              height: 44,
              borderRadius: 'var(--radius-md)',
              background: 'var(--warning-light)',
              color: '#d97706',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <AlertCircle size={24} />
          </div>
          <div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>สต็อกใกล้หมด (≤ 15 ชิ้น)</div>
            <div style={{ fontSize: '1.35rem', fontWeight: 700, color: '#d97706' }}>
              {lowStockCount} รายการ
            </div>
            <div style={{ fontSize: '0.74rem', color: '#d97706' }}>คลิกเพื่อดูเฉพาะกลุ่มนี้</div>
          </div>
        </div>

        <div
          onClick={() => setStockFilter('out')}
          style={{
            background: 'var(--bg-surface)',
            padding: '16px 20px',
            borderRadius: 'var(--radius-lg)',
            border: `1.5px solid ${stockFilter === 'out' ? 'var(--danger)' : 'var(--border-color)'}`,
            display: 'flex',
            alignItems: 'center',
            gap: 14,
            cursor: 'pointer',
            boxShadow: 'var(--shadow-xs)',
          }}
        >
          <div
            style={{
              width: 44,
              height: 44,
              borderRadius: 'var(--radius-md)',
              background: 'var(--danger-light)',
              color: 'var(--danger)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <RotateCcw size={24} />
          </div>
          <div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>สินค้าหมดสต็อก (0 ชิ้น)</div>
            <div style={{ fontSize: '1.35rem', fontWeight: 700, color: 'var(--danger)' }}>
              {outOfStockCount} รายการ
            </div>
            <div style={{ fontSize: '0.74rem', color: 'var(--danger)' }}>ต้องสั่งเติมด่วน</div>
          </div>
        </div>

        <div
          style={{
            background: 'var(--bg-surface)',
            padding: '16px 20px',
            borderRadius: 'var(--radius-lg)',
            border: '1.5px solid var(--border-color)',
            display: 'flex',
            alignItems: 'center',
            gap: 14,
            boxShadow: 'var(--shadow-xs)',
          }}
        >
          <div
            style={{
              width: 44,
              height: 44,
              borderRadius: 'var(--radius-md)',
              background: 'var(--primary-50)',
              color: 'var(--primary-600)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <TrendingUp size={24} />
          </div>
          <div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>มูลค่าสต็อกรวม</div>
            <div style={{ fontSize: '1.35rem', fontWeight: 700, color: 'var(--primary-700)' }}>
              ฿{totalValue.toLocaleString()}
            </div>
            <div style={{ fontSize: '0.74rem', color: 'var(--text-secondary)' }}>ประเมินจากราคาขาย</div>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div
        style={{
          display: 'flex',
          gap: 12,
          marginBottom: 16,
          background: 'var(--bg-surface)',
          padding: 12,
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--border-color)',
          alignItems: 'center',
          flexWrap: 'wrap',
        }}
      >
        <div className="pos-search-bar" style={{ flex: 1, minWidth: 260, boxShadow: 'none' }}>
          <Search size={18} color="var(--primary-500)" />
          <input
            type="text"
            className="pos-search-input"
            placeholder="ค้นหาชื่อสินค้า หรือ รหัสบาร์โค้ด..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <select
          value={selectedCat}
          onChange={(e) => setSelectedCat(e.target.value)}
          style={{
            padding: '8px 16px',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border-color)',
            fontFamily: 'inherit',
            fontSize: '0.88rem',
            outline: 'none',
            color: 'var(--text-secondary)',
          }}
        >
          <option value="all">หมวดหมู่ทั้งหมด</option>
          {categories
            .filter((c) => c.id !== 'all' && c.id !== 'popular')
            .map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
        </select>

        {/* Stock Level Filter Pills */}
        <div style={{ display: 'flex', gap: 6 }}>
          <button
            onClick={() => setStockFilter('all')}
            className={`pos-btn ${stockFilter === 'all' ? 'pos-btn-primary' : 'pos-btn-secondary'}`}
            style={{ padding: '6px 12px', fontSize: '0.8rem', borderRadius: 'var(--radius-full)' }}
          >
            ทั้งหมด
          </button>
          <button
            onClick={() => setStockFilter('low')}
            className={`pos-btn ${stockFilter === 'low' ? 'pos-btn-primary' : 'pos-btn-secondary'}`}
            style={{
              padding: '6px 12px',
              fontSize: '0.8rem',
              borderRadius: 'var(--radius-full)',
              color: stockFilter === 'low' ? '#fff' : '#d97706',
            }}
          >
            ⚠️ ใกล้หมด
          </button>
          <button
            onClick={() => setStockFilter('out')}
            className={`pos-btn ${stockFilter === 'out' ? 'pos-btn-primary' : 'pos-btn-secondary'}`}
            style={{
              padding: '6px 12px',
              fontSize: '0.8rem',
              borderRadius: 'var(--radius-full)',
              color: stockFilter === 'out' ? '#fff' : 'var(--danger)',
            }}
          >
            🚨 หมดสต็อก
          </button>
          <button
            onClick={() => setStockFilter('normal')}
            className={`pos-btn ${stockFilter === 'normal' ? 'pos-btn-primary' : 'pos-btn-secondary'}`}
            style={{ padding: '6px 12px', fontSize: '0.8rem', borderRadius: 'var(--radius-full)' }}
          >
            ✅ มีเพียงพอ
          </button>
        </div>
      </div>

      {/* Inventory Table */}
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
              <th style={{ padding: '12px 16px' }}>สินค้า</th>
              <th style={{ padding: '12px 16px' }}>หมวดหมู่</th>
              <th style={{ padding: '12px 16px' }}>บาร์โค้ด</th>
              <th style={{ padding: '12px 16px', textAlign: 'right' }}>ราคาขาย</th>
              <th style={{ padding: '12px 16px', textAlign: 'center' }}>สต็อกคงเหลือ</th>
              <th style={{ padding: '12px 16px', textAlign: 'center' }}>ปรับสต็อกด่วน</th>
              <th style={{ padding: '12px 16px', textAlign: 'center', whiteSpace: 'nowrap' }}>
                การจัดการรายละเอียด
              </th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={7} style={{ textAlign: 'center', padding: '36px', color: 'var(--text-muted)' }}>
                  ไม่พบสินค้าตามเงื่อนไขที่เลือก
                </td>
              </tr>
            ) : (
              filtered.map((prod) => {
                const isOut = prod.stock === 0;
                const isLow = prod.stock > 0 && prod.stock <= 15;
                const catName = categories.find((c) => c.id === prod.category)?.name || prod.category;

                return (
                  <tr
                    key={prod.id}
                    style={{
                      borderBottom: '1px solid var(--border-light)',
                      fontSize: '0.88rem',
                      background: isOut ? '#fff5f5' : undefined,
                    }}
                  >
                    <td style={{ padding: '12px 16px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <span style={{ fontSize: '1.4rem' }}>{prod.emoji || '📦'}</span>
                        <div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                            <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>
                              {prod.name}
                            </span>
                            {prod.isPopular && (
                              <span
                                style={{
                                  fontSize: '0.68rem',
                                  padding: '1px 5px',
                                  borderRadius: 4,
                                  background: '#fef3c7',
                                  color: '#b45309',
                                  fontWeight: 600,
                                }}
                              >
                                ยอดนิยม
                              </span>
                            )}
                          </div>
                          {prod.nameEn && (
                            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                              {prod.nameEn}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>

                    <td style={{ padding: '12px 16px', color: 'var(--text-secondary)' }}>
                      <span
                        style={{
                          padding: '3px 8px',
                          borderRadius: 'var(--radius-sm)',
                          background: 'var(--primary-50)',
                          color: 'var(--primary-700)',
                          fontSize: '0.78rem',
                          border: '1px solid var(--primary-200)',
                        }}
                      >
                        {catName}
                      </span>
                    </td>

                    <td style={{ padding: '12px 16px', color: 'var(--text-muted)', fontFamily: 'monospace' }}>
                      {prod.barcode}
                    </td>

                    <td
                      style={{
                        padding: '12px 16px',
                        textAlign: 'right',
                        fontWeight: 700,
                        color: 'var(--primary-700)',
                      }}
                    >
                      ฿{prod.price.toLocaleString()}
                    </td>

                    {/* Stock level badge */}
                    <td style={{ padding: '12px 16px', textAlign: 'center' }}>
                      <span
                        onClick={() => openAdjustModal(prod)}
                        title="คลิกเพื่อปรับสต็อก"
                        style={{
                          padding: '4px 12px',
                          borderRadius: 'var(--radius-full)',
                          fontSize: '0.82rem',
                          fontWeight: 700,
                          cursor: 'pointer',
                          display: 'inline-block',
                          background: isOut
                            ? 'var(--danger-light)'
                            : isLow
                            ? '#fffbeb'
                            : 'var(--success-light)',
                          color: isOut
                            ? 'var(--danger)'
                            : isLow
                            ? '#d97706'
                            : 'var(--success)',
                          border: `1px solid ${
                            isOut ? '#fecaca' : isLow ? '#fde68a' : '#a7f3d0'
                          }`,
                        }}
                      >
                        {isOut ? 'หมดสต็อก (0)' : `${prod.stock} ชิ้น`}
                      </span>
                    </td>

                    {/* Quick In-line adjustments */}
                    <td style={{ padding: '12px 16px', textAlign: 'center' }}>
                      <div style={{ display: 'inline-flex', gap: 4, alignItems: 'center' }}>
                        <button
                          onClick={() => handleQuickAdjust(prod, -5)}
                          disabled={prod.stock === 0}
                          className="pos-btn pos-btn-secondary"
                          style={{ padding: '4px 6px', fontSize: '0.72rem', minWidth: 30 }}
                          title="ตัดออก -5"
                        >
                          -5
                        </button>
                        <button
                          onClick={() => handleQuickAdjust(prod, -1)}
                          disabled={prod.stock === 0}
                          className="pos-btn pos-btn-secondary"
                          style={{ padding: '4px 6px', fontSize: '0.72rem', minWidth: 26 }}
                          title="ตัดออก -1"
                        >
                          -1
                        </button>
                        <button
                          onClick={() => handleQuickAdjust(prod, 1)}
                          className="pos-btn pos-btn-secondary"
                          style={{ padding: '4px 6px', fontSize: '0.72rem', minWidth: 26 }}
                          title="เติมสต็อก +1"
                        >
                          +1
                        </button>
                        <button
                          onClick={() => handleQuickAdjust(prod, 10)}
                          className="pos-btn pos-btn-secondary"
                          style={{ padding: '4px 6px', fontSize: '0.72rem', minWidth: 32 }}
                          title="เติมสต็อก +10"
                        >
                          +10
                        </button>
                        <button
                          onClick={() => handleQuickAdjust(prod, 50)}
                          className="pos-btn pos-btn-secondary"
                          style={{ padding: '4px 6px', fontSize: '0.72rem', minWidth: 32 }}
                          title="เติมสต็อกชุดใหญ่ +50"
                        >
                          +50
                        </button>
                      </div>
                    </td>

                    {/* Advanced Adjust Modal Trigger */}
                    <td style={{ padding: '12px 16px', textAlign: 'center', verticalAlign: 'middle' }}>
                      <button
                        onClick={() => openAdjustModal(prod)}
                        className="pos-btn pos-btn-primary"
                        style={{
                          padding: '6px 14px',
                          fontSize: '0.8rem',
                          borderRadius: 'var(--radius-md)',
                          display: 'inline-flex',
                          margin: '0 auto',
                        }}
                      >
                        <SlidersHorizontal size={14} />
                        <span>ปรับสต็อก</span>
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Advanced Stock Adjustment Modal */}
      {adjustingProduct && (
        <div className="pos-modal-backdrop" onClick={() => setAdjustingProduct(null)}>
          <div className="pos-modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 520 }}>
            <form onSubmit={handleConfirmAdjustment}>
              {/* Modal Header */}
              <div
                style={{
                  padding: '16px 20px',
                  borderBottom: '1px solid var(--border-color)',
                  background: 'var(--primary-50)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <div>
                  <h3 style={{ fontSize: '1.15rem', color: 'var(--primary-700)', fontWeight: 700 }}>
                    ปรับปรุงสต็อกสินค้า
                  </h3>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    {adjustingProduct.emoji} {adjustingProduct.name} (ปัจจุบันคงเหลือ {adjustingProduct.stock} ชิ้น)
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setAdjustingProduct(null)}
                  style={{ border: 'none', background: 'transparent', cursor: 'pointer' }}
                >
                  <X size={20} color="var(--text-secondary)" />
                </button>
              </div>

              {/* Adjustment Modes Switcher */}
              <div style={{ padding: '20px 20px 0 20px' }}>
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(3, 1fr)',
                    gap: 8,
                    background: 'var(--bg-muted)',
                    padding: 4,
                    borderRadius: 'var(--radius-md)',
                  }}
                >
                  <button
                    type="button"
                    onClick={() => {
                      setAdjustMode('in');
                      setAdjustReason('สั่งซื้อสินค้าเข้าร้าน');
                    }}
                    className={`pos-btn ${adjustMode === 'in' ? 'pos-btn-primary' : 'pos-btn-secondary'}`}
                    style={{
                      padding: '8px 4px',
                      fontSize: '0.85rem',
                      background: adjustMode === 'in' ? 'var(--success)' : 'transparent',
                      color: adjustMode === 'in' ? '#fff' : 'var(--text-secondary)',
                      boxShadow: 'none',
                    }}
                  >
                    <Plus size={16} />
                    <span>รับเข้า (+)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setAdjustMode('out');
                      setAdjustReason('หมดอายุ / เสื่อมสภาพ');
                    }}
                    className={`pos-btn ${adjustMode === 'out' ? 'pos-btn-primary' : 'pos-btn-secondary'}`}
                    style={{
                      padding: '8px 4px',
                      fontSize: '0.85rem',
                      background: adjustMode === 'out' ? 'var(--danger)' : 'transparent',
                      color: adjustMode === 'out' ? '#fff' : 'var(--text-secondary)',
                      boxShadow: 'none',
                    }}
                  >
                    <Minus size={16} />
                    <span>ตัดออก (-)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setAdjustMode('set');
                      setExactStockInput(adjustingProduct.stock);
                      setAdjustReason('ตรวจนับประจำวัน');
                    }}
                    className={`pos-btn ${adjustMode === 'set' ? 'pos-btn-primary' : 'pos-btn-secondary'}`}
                    style={{
                      padding: '8px 4px',
                      fontSize: '0.85rem',
                      background: adjustMode === 'set' ? 'var(--primary-600)' : 'transparent',
                      color: adjustMode === 'set' ? '#fff' : 'var(--text-secondary)',
                      boxShadow: 'none',
                    }}
                  >
                    <SlidersHorizontal size={15} />
                    <span>นับจริง (=)</span>
                  </button>
                </div>
              </div>

              {/* Mode-specific Input Form */}
              <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: 16 }}>
                {adjustMode !== 'set' ? (
                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: 6 }}>
                      จำนวนที่ต้องการ{adjustMode === 'in' ? 'รับเข้า' : 'ตัดจำหน่าย'} (ชิ้น)
                    </label>
                    <input
                      type="number"
                      min={1}
                      max={adjustMode === 'out' ? adjustingProduct.stock : 9999}
                      value={adjustAmount}
                      onChange={(e) => setAdjustAmount(Number(e.target.value) || 1)}
                      style={{
                        width: '100%',
                        padding: '12px 16px',
                        fontSize: '1.3rem',
                        fontWeight: 700,
                        borderRadius: 'var(--radius-md)',
                        border: '2px solid var(--primary-300)',
                        textAlign: 'center',
                        outline: 'none',
                      }}
                    />

                    {/* Quick Amount presets */}
                    <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
                      {[5, 10, 20, 50, 100].map((amt) => (
                        <button
                          key={amt}
                          type="button"
                          onClick={() => setAdjustAmount(amt)}
                          className="pos-btn pos-btn-secondary"
                          style={{ flex: 1, padding: '6px 2px', fontSize: '0.8rem' }}
                        >
                          {adjustMode === 'in' ? `+${amt}` : `-${amt}`}
                        </button>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: 6 }}>
                      ยอดสต็อกที่ตรวจนับได้จริง (ชิ้น)
                    </label>
                    <input
                      type="number"
                      min={0}
                      value={exactStockInput}
                      onChange={(e) => setExactStockInput(Number(e.target.value) || 0)}
                      style={{
                        width: '100%',
                        padding: '12px 16px',
                        fontSize: '1.3rem',
                        fontWeight: 700,
                        borderRadius: 'var(--radius-md)',
                        border: '2px solid var(--primary-300)',
                        textAlign: 'center',
                        outline: 'none',
                      }}
                    />
                    <div
                      style={{
                        textAlign: 'center',
                        fontSize: '0.82rem',
                        marginTop: 6,
                        color:
                          exactStockInput - adjustingProduct.stock >= 0
                            ? 'var(--success)'
                            : 'var(--danger)',
                        fontWeight: 600,
                      }}
                    >
                      ผลต่างจากการตรวจนับ:{' '}
                      {exactStockInput - adjustingProduct.stock > 0
                        ? `+${exactStockInput - adjustingProduct.stock}`
                        : exactStockInput - adjustingProduct.stock}{' '}
                      ชิ้น
                    </div>
                  </div>
                )}

                {/* Reasons Selection */}
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: 6 }}>
                    เหตุผลในการปรับปรุง
                  </label>
                  <input
                    type="text"
                    value={adjustReason}
                    onChange={(e) => setAdjustReason(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      borderRadius: 'var(--radius-md)',
                      border: '1px solid var(--border-color)',
                      marginBottom: 8,
                      outline: 'none',
                    }}
                  />
                  <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                    {getPresetReasons().map((reason) => (
                      <button
                        key={reason}
                        type="button"
                        onClick={() => setAdjustReason(reason)}
                        style={{
                          border: '1px solid var(--border-color)',
                          background: adjustReason === reason ? 'var(--primary-100)' : 'var(--bg-muted)',
                          color: adjustReason === reason ? 'var(--primary-700)' : 'var(--text-secondary)',
                          padding: '4px 10px',
                          borderRadius: 'var(--radius-full)',
                          fontSize: '0.76rem',
                          cursor: 'pointer',
                        }}
                      >
                        {reason}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Calculation Preview */}
                <div
                  style={{
                    background: 'var(--primary-50)',
                    padding: '12px 16px',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--primary-200)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                    ยอดสต็อกคงเหลือใหม่:
                  </span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)', textDecoration: 'line-through' }}>
                      {adjustingProduct.stock}
                    </span>
                    ➜
                    <span style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--primary-700)' }}>
                      {adjustMode === 'in'
                        ? adjustingProduct.stock + adjustAmount
                        : adjustMode === 'out'
                        ? Math.max(0, adjustingProduct.stock - adjustAmount)
                        : exactStockInput}{' '}
                      ชิ้น
                    </span>
                  </div>
                </div>
              </div>

              {/* Modal Footer */}
              <div
                style={{
                  padding: '16px 20px',
                  borderTop: '1px solid var(--border-color)',
                  display: 'flex',
                  gap: 10,
                  justifyContent: 'flex-end',
                }}
              >
                <button
                  type="button"
                  className="pos-btn pos-btn-secondary"
                  onClick={() => setAdjustingProduct(null)}
                >
                  ยกเลิก
                </button>
                <button type="submit" className="pos-btn pos-btn-primary">
                  <Check size={18} />
                  <span>บันทึกการปรับสต็อก</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Stock History Log Modal */}
      {showLogModal && (
        <div className="pos-modal-backdrop" onClick={() => setShowLogModal(false)}>
          <div className="pos-modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 580 }}>
            <div
              style={{
                padding: '16px 20px',
                borderBottom: '1px solid var(--border-color)',
                background: 'var(--primary-50)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <History size={20} color="var(--primary-700)" />
                <h3 style={{ fontSize: '1.15rem', color: 'var(--primary-700)', fontWeight: 700 }}>
                  ประวัติการปรับปรุงสต็อกล่าสุด
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowLogModal(false)}
                style={{ border: 'none', background: 'transparent', cursor: 'pointer' }}
              >
                <X size={20} color="var(--text-secondary)" />
              </button>
            </div>

            <div style={{ padding: '16px', maxHeight: 420, overflowY: 'auto' }}>
              {stockLogs.length === 0 ? (
                <div style={{ textAlign: 'center', padding: 24, color: 'var(--text-muted)' }}>
                  ยังไม่มีประวัติการปรับสต็อก
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {stockLogs.map((log) => (
                    <div
                      key={log.id}
                      style={{
                        padding: '12px 14px',
                        borderRadius: 'var(--radius-md)',
                        background: 'var(--bg-muted)',
                        border: '1px solid var(--border-light)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                      }}
                    >
                      <div>
                        <div style={{ fontWeight: 600, color: 'var(--text-primary)', fontSize: '0.9rem' }}>
                          {log.productName}
                        </div>
                        <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: 2 }}>
                          {log.reason} • {log.timestamp}
                        </div>
                      </div>

                      <div style={{ textAlign: 'right' }}>
                        <span
                          style={{
                            fontWeight: 700,
                            fontSize: '0.95rem',
                            color:
                              log.changeAmount > 0
                                ? 'var(--success)'
                                : log.changeAmount < 0
                                ? 'var(--danger)'
                                : 'var(--text-secondary)',
                          }}
                        >
                          {log.changeAmount > 0 ? `+${log.changeAmount}` : log.changeAmount} ชิ้น
                        </span>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                          คงเหลือ {log.newStock} ชิ้น
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div
              style={{
                padding: '12px 16px',
                borderTop: '1px solid var(--border-color)',
                textAlign: 'right',
                background: 'var(--bg-surface)',
              }}
            >
              <button
                type="button"
                className="pos-btn pos-btn-secondary"
                onClick={() => setShowLogModal(false)}
              >
                ปิดหน้าต่าง
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Product Modal */}
      {isAddModalOpen && (
        <div className="pos-modal-backdrop" onClick={() => setIsAddModalOpen(false)}>
          <div className="pos-modal-content" onClick={(e) => e.stopPropagation()}>
            <form onSubmit={handleCreateProduct}>
              <div
                style={{
                  padding: '16px 20px',
                  borderBottom: '1px solid var(--border-color)',
                  background: 'var(--primary-50)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <h3 style={{ fontSize: '1.15rem', color: 'var(--primary-700)', fontWeight: 700 }}>
                  เพิ่มสินค้าใหม่
                </h3>
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  style={{ border: 'none', background: 'transparent', cursor: 'pointer' }}
                >
                  <X size={20} color="var(--text-secondary)" />
                </button>
              </div>

              <div style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 12 }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, marginBottom: 4 }}>
                    ชื่อสินค้า
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="เช่น ชาเขียวมะนาวเย็น"
                    value={newProductName}
                    onChange={(e) => setNewProductName(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      borderRadius: 'var(--radius-md)',
                      border: '1px solid var(--border-color)',
                      outline: 'none',
                      fontFamily: 'inherit',
                    }}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, marginBottom: 4 }}>
                      หมวดหมู่
                    </label>
                    <select
                      value={newProductCategory}
                      onChange={(e) => setNewProductCategory(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '10px 12px',
                        borderRadius: 'var(--radius-md)',
                        border: '1px solid var(--border-color)',
                        fontFamily: 'inherit',
                      }}
                    >
                      {categories
                        .filter((c) => c.id !== 'all' && c.id !== 'popular')
                        .map((cat) => (
                          <option key={cat.id} value={cat.id}>
                            {cat.name}
                          </option>
                        ))}
                    </select>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, marginBottom: 4 }}>
                      ไอคอนอีโมจิ
                    </label>
                    <input
                      type="text"
                      value={newProductEmoji}
                      onChange={(e) => setNewProductEmoji(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '10px 12px',
                        borderRadius: 'var(--radius-md)',
                        border: '1px solid var(--border-color)',
                        textAlign: 'center',
                      }}
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, marginBottom: 4 }}>
                      ราคาขาย (บาท)
                    </label>
                    <input
                      type="number"
                      required
                      min={0}
                      value={newProductPrice}
                      onChange={(e) => setNewProductPrice(Number(e.target.value))}
                      style={{
                        width: '100%',
                        padding: '10px 12px',
                        borderRadius: 'var(--radius-md)',
                        border: '1px solid var(--border-color)',
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, marginBottom: 4 }}>
                      จำนวนสต็อกเริ่มต้น
                    </label>
                    <input
                      type="number"
                      required
                      min={0}
                      value={newProductStock}
                      onChange={(e) => setNewProductStock(Number(e.target.value))}
                      style={{
                        width: '100%',
                        padding: '10px 12px',
                        borderRadius: 'var(--radius-md)',
                        border: '1px solid var(--border-color)',
                      }}
                    />
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 4 }}>
                  <input
                    type="checkbox"
                    id="popular-check"
                    checked={newProductIsPopular}
                    onChange={(e) => setNewProductIsPopular(e.target.checked)}
                    style={{ width: 16, height: 16 }}
                  />
                  <label htmlFor="popular-check" style={{ fontSize: '0.85rem', cursor: 'pointer' }}>
                    <Sparkles size={14} color="#f59e0b" style={{ verticalAlign: 'middle', marginRight: 4 }} />
                    กำหนดเป็นสินค้ายอดนิยม (แสดงขึ้นก่อน)
                  </label>
                </div>
              </div>

              <div
                style={{
                  padding: '16px 20px',
                  borderTop: '1px solid var(--border-color)',
                  display: 'flex',
                  gap: 10,
                  justifyContent: 'flex-end',
                }}
              >
                <button
                  type="button"
                  className="pos-btn pos-btn-secondary"
                  onClick={() => setIsAddModalOpen(false)}
                >
                  ยกเลิก
                </button>
                <button type="submit" className="pos-btn pos-btn-primary">
                  บันทึกสินค้า
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
