import { useState } from 'react';
import type { ActiveView, Product, CartItem, OrderType, Order } from './types/pos';
import { CATEGORIES, INITIAL_PRODUCTS, INITIAL_ORDERS } from './data/mockData';
import { PosLayout } from './layout/PosLayout';
import { PosSaleView } from './views/PosSaleView';
import { OrdersView } from './views/OrdersView';
import { InventoryView } from './views/InventoryView';
import { ReportsView } from './views/ReportsView';
import { SettingsView } from './views/SettingsView';
import './App.css';

export function App() {
  const [activeView, setActiveView] = useState<ActiveView>('pos');
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [orderType, setOrderType] = useState<OrderType>('dine_in');
  const [orders, setOrders] = useState<Order[]>(INITIAL_ORDERS);
  const [heldOrders, setHeldOrders] = useState<Order[]>([]);

  // Add product to cart
  const handleAddToCart = (product: Product) => {
    setCartItems((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { product, quantity: 1 }];
    });
  };

  // Update item quantity
  const handleUpdateQuantity = (productId: string, delta: number) => {
    setCartItems((prev) =>
      prev
        .map((item) => {
          if (item.product.id === productId) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter((item): item is CartItem => item !== null)
    );
  };

  // Remove single item
  const handleRemoveItem = (productId: string) => {
    setCartItems((prev) => prev.filter((item) => item.product.id !== productId));
  };

  // Clear all items in cart
  const handleClearCart = () => {
    if (cartItems.length === 0) return;
    if (window.confirm('คุณต้องการล้างรายการทั้งหมดในตะกร้าหรือไม่?')) {
      setCartItems([]);
    }
  };

  // Hold current order
  const handleHoldOrder = () => {
    if (cartItems.length === 0) return;
    const subtotal = cartItems.reduce(
      (sum, item) => sum + item.product.price * item.quantity,
      0
    );
    const orderNum = `#H-${Math.floor(100 + Math.random() * 900)}`;

    const heldOrder: Order = {
      id: `held-${Date.now()}`,
      orderNumber: orderNum,
      items: [...cartItems],
      subtotal,
      discount: 0,
      vat: Math.round(subtotal * 0.07 * 100) / 100,
      total: subtotal,
      orderType,
      status: 'held',
      createdAt: new Date().toLocaleTimeString('th-TH', {
        hour: '2-digit',
        minute: '2-digit',
      }),
      cashierName: 'คุณสมชาย (POS 01)',
    };

    setHeldOrders((prev) => [heldOrder, ...prev]);
    setCartItems([]);
  };

  // Resume held order back into cart
  const handleResumeHeldOrder = (order: Order) => {
    setCartItems(order.items);
    setOrderType(order.orderType);
    setHeldOrders((prev) => prev.filter((o) => o.id !== order.id));
    setActiveView('pos');
  };

  // Complete checkout
  const handleCompleteOrder = (newOrder: Order) => {
    // Add to completed orders
    setOrders((prev) => [newOrder, ...prev]);

    // Decrease stock for each purchased item
    setProducts((prev) =>
      prev.map((prod) => {
        const cartMatch = newOrder.items.find((i) => i.product.id === prod.id);
        if (cartMatch) {
          return { ...prod, stock: Math.max(0, prod.stock - cartMatch.quantity) };
        }
        return prod;
      })
    );

    // Reset cart
    setCartItems([]);
  };

  // Update inventory stock
  const handleUpdateStock = (productId: string, newStock: number) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === productId ? { ...p, stock: newStock } : p))
    );
  };

  // Add new product
  const handleAddProduct = (newProduct: Product) => {
    setProducts((prev) => [newProduct, ...prev]);
  };

  return (
    <PosLayout
      activeView={activeView}
      onSelectView={setActiveView}
      heldOrdersCount={heldOrders.length}
      onOpenHeldOrders={() => setActiveView('orders')}
    >
      {activeView === 'pos' && (
        <PosSaleView
          products={products}
          categories={CATEGORIES}
          cartItems={cartItems}
          orderType={orderType}
          onSetOrderType={setOrderType}
          onAddToCart={handleAddToCart}
          onUpdateQuantity={handleUpdateQuantity}
          onRemoveItem={handleRemoveItem}
          onClearCart={handleClearCart}
          onHoldOrder={handleHoldOrder}
          onCompleteOrder={handleCompleteOrder}
        />
      )}

      {activeView === 'orders' && (
        <OrdersView
          orders={orders}
          heldOrders={heldOrders}
          onResumeHeldOrder={handleResumeHeldOrder}
        />
      )}

      {activeView === 'inventory' && (
        <InventoryView
          products={products}
          categories={CATEGORIES}
          onUpdateStock={handleUpdateStock}
          onAddProduct={handleAddProduct}
        />
      )}

      {activeView === 'reports' && <ReportsView orders={orders} />}

      {activeView === 'settings' && <SettingsView />}
    </PosLayout>
  );
}

export default App;
