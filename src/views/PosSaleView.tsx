import React, { useState, useMemo } from 'react';
import type { Product, Category, CartItem, OrderType, PaymentMethod, Order } from '../types/pos';
import { CategoryTabs } from '../components/pos/CategoryTabs';
import { ProductCard } from '../components/pos/ProductCard';
import { CartPanel } from '../components/pos/CartPanel';
import { CheckoutModal } from '../components/pos/CheckoutModal';
import { ReceiptModal } from '../components/pos/ReceiptModal';
import { Search, Barcode, Inbox, ArrowUpDown } from 'lucide-react';

interface PosSaleViewProps {
  products: Product[];
  categories: Category[];
  cartItems: CartItem[];
  orderType: OrderType;
  onSetOrderType: (type: OrderType) => void;
  onAddToCart: (product: Product) => void;
  onUpdateQuantity: (productId: string, delta: number) => void;
  onRemoveItem: (productId: string) => void;
  onClearCart: () => void;
  onHoldOrder: () => void;
  onCompleteOrder: (order: Order) => void;
}

export const PosSaleView: React.FC<PosSaleViewProps> = ({
  products,
  categories,
  cartItems,
  orderType,
  onSetOrderType,
  onAddToCart,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  onHoldOrder,
  onCompleteOrder,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [barcodeInput, setBarcodeInput] = useState<string>('');
  const [isCheckoutOpen, setIsCheckoutOpen] = useState<boolean>(false);
  const [lastCompletedOrder, setLastCompletedOrder] = useState<Order | null>(null);
  const [isReceiptOpen, setIsReceiptOpen] = useState<boolean>(false);
  const [discount] = useState<number>(0);
  const [sortBy, setSortBy] = useState<
    'popular_low_stock' | 'low_stock' | 'price_asc' | 'price_desc'
  >('popular_low_stock');

  // Category counts
  const productCounts = useMemo(() => {
    const counts: Record<string, number> = {
      all: products.length,
      popular: products.filter((p) => p.isPopular).length,
    };
    categories.forEach((cat) => {
      if (cat.id !== 'all' && cat.id !== 'popular') {
        counts[cat.id] = products.filter((p) => p.category === cat.id).length;
      }
    });
    return counts;
  }, [products, categories]);

  // Filter products by category and search, prioritizing popular items (isPopular first)
  const filteredProducts = useMemo(() => {
    return products
      .filter((p) => {
        let matchCat = false;
        if (selectedCategory === 'all') {
          matchCat = true;
        } else if (selectedCategory === 'popular') {
          matchCat = Boolean(p.isPopular);
        } else {
          matchCat = p.category === selectedCategory;
        }

        const matchSearch =
          searchQuery.trim() === '' ||
          p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (p.nameEn && p.nameEn.toLowerCase().includes(searchQuery.toLowerCase())) ||
          p.barcode.includes(searchQuery);

        return matchCat && matchSearch;
      })
      .sort((a, b) => {
        if (sortBy === 'low_stock') {
          // สต็อกเหลือน้อยสุดขึ้นก่อน
          return a.stock - b.stock;
        }
        if (sortBy === 'price_asc') {
          return a.price - b.price;
        }
        if (sortBy === 'price_desc') {
          return b.price - a.price;
        }
        // 'popular_low_stock' (ค่าเริ่มต้น): ยอดนิยมขึ้นก่อน + สินค้าที่เหลือน้อยขึ้นก่อน
        if (a.isPopular && !b.isPopular) return -1;
        if (!a.isPopular && b.isPopular) return 1;
        return a.stock - b.stock;
      });
  }, [products, selectedCategory, searchQuery, sortBy]);

  // Handle barcode quick scan submit
  const handleBarcodeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!barcodeInput.trim()) return;
    const found = products.find((p) => p.barcode === barcodeInput.trim());
    if (found) {
      onAddToCart(found);
      setBarcodeInput('');
    } else {
      alert(`ไม่พบสินค้าสำหรับบาร์โค้ด: ${barcodeInput}`);
    }
  };

  // Cart total calculations
  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );
  const total = Math.max(0, subtotal - discount);

  const handleConfirmPayment = (
    method: PaymentMethod,
    received: number,
    change: number
  ) => {
    const vat = Math.round(total * 0.07 * 100) / 100;
    const orderNum = `#${Math.floor(1000 + Math.random() * 9000)}`;

    const newOrder: Order = {
      id: `ord-${Date.now()}`,
      orderNumber: orderNum,
      items: [...cartItems],
      subtotal,
      discount,
      vat,
      total,
      orderType,
      paymentMethod: method,
      amountReceived: received,
      change,
      status: 'completed',
      createdAt: new Date().toLocaleTimeString('th-TH', {
        hour: '2-digit',
        minute: '2-digit',
      }),
      cashierName: 'คุณสมชาย (POS 01)',
    };

    setIsCheckoutOpen(false);
    onCompleteOrder(newOrder);
    setLastCompletedOrder(newOrder);
    setIsReceiptOpen(true);
  };

  return (
    <div className="pos-content-area">
      {/* Left: Catalog & Product Grid */}
      <section className="pos-catalog-section">
        {/* Search Bar, Sort & Barcode input */}
        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          <div className="pos-search-bar" style={{ flex: 1 }}>
            <Search size={18} color="var(--primary-500)" />
            <input
              type="text"
              className="pos-search-input"
              placeholder="ค้นหาชื่อสินค้า, เมนู, รหัสบาร์โค้ด..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                style={{
                  border: 'none',
                  background: 'transparent',
                  color: 'var(--text-muted)',
                  cursor: 'pointer',
                  fontSize: '0.85rem',
                }}
              >
                ล้าง
              </button>
            )}
          </div>

          {/* Sort Selector */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              background: 'var(--bg-surface)',
              border: '1px solid var(--border-color)',
              borderRadius: 'var(--radius-lg)',
              padding: '6px 12px',
              gap: 6,
              boxShadow: 'var(--shadow-xs)',
            }}
          >
            <ArrowUpDown size={16} color="var(--primary-600)" />
            <select
              value={sortBy}
              onChange={(e) =>
                setSortBy(
                  e.target.value as
                    | 'popular_low_stock'
                    | 'low_stock'
                    | 'price_asc'
                    | 'price_desc'
                )
              }
              style={{
                border: 'none',
                outline: 'none',
                background: 'transparent',
                fontFamily: 'inherit',
                fontSize: '0.82rem',
                fontWeight: 500,
                color: 'var(--text-secondary)',
                cursor: 'pointer',
              }}
            >
              <option value="popular_low_stock">ยอดนิยม & สต็อกเหลือน้อย</option>
              <option value="low_stock">สต็อกเหลือน้อยสุดขึ้นก่อน</option>
              <option value="price_asc">ราคา: ต่ำ ➜ สูง</option>
              <option value="price_desc">ราคา: สูง ➜ ต่ำ</option>
            </select>
          </div>

          {/* Quick Barcode Scanner Form */}
          <form
            onSubmit={handleBarcodeSubmit}
            style={{
              display: 'flex',
              alignItems: 'center',
              background: 'var(--bg-surface)',
              border: '1px solid var(--border-color)',
              borderRadius: 'var(--radius-lg)',
              padding: '4px 12px',
              gap: 8,
              boxShadow: 'var(--shadow-xs)',
            }}
          >
            <Barcode size={20} color="var(--primary-600)" />
            <input
              type="text"
              placeholder="สแกนบาร์โค้ด..."
              value={barcodeInput}
              onChange={(e) => setBarcodeInput(e.target.value)}
              style={{
                border: 'none',
                outline: 'none',
                fontFamily: 'inherit',
                fontSize: '0.88rem',
                width: 130,
                color: 'var(--text-primary)',
              }}
            />
          </form>
        </div>

        {/* Category Tabs */}
        <CategoryTabs
          categories={categories}
          selectedCategoryId={selectedCategory}
          onSelectCategory={setSelectedCategory}
          productCounts={productCounts}
        />

        {/* Product Grid */}
        {filteredProducts.length === 0 ? (
          <div
            style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--text-muted)',
              gap: 12,
            }}
          >
            <Inbox size={48} color="var(--primary-300)" />
            <div>ไม่พบสินค้าที่ตรงกับการค้นหา</div>
          </div>
        ) : (
          <div className="pos-products-grid">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onAddToCart={onAddToCart}
              />
            ))}
          </div>
        )}
      </section>

      {/* Right: Cart Summary Panel */}
      <CartPanel
        items={cartItems}
        orderType={orderType}
        onSetOrderType={onSetOrderType}
        onUpdateQuantity={onUpdateQuantity}
        onRemoveItem={onRemoveItem}
        onClearCart={onClearCart}
        onHoldOrder={onHoldOrder}
        onCheckout={() => setIsCheckoutOpen(true)}
        discount={discount}
      />

      {/* Modals */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        total={total}
        onClose={() => setIsCheckoutOpen(false)}
        onConfirmPayment={handleConfirmPayment}
      />

      <ReceiptModal
        order={lastCompletedOrder}
        isOpen={isReceiptOpen}
        onClose={() => setIsReceiptOpen(false)}
      />
    </div>
  );
};
