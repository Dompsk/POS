import React from 'react';
import type { Product } from '../../types/pos';
import { Plus } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onAddToCart }) => {
  return (
    <div className="pos-product-card" onClick={() => onAddToCart(product)}>
      <div className="pos-product-emoji-container">
        <span>{product.emoji || '📦'}</span>
        {product.isPopular && (
          <span className="pos-product-popular-badge">⭐ ยอดนิยม</span>
        )}
      </div>

      <h3 className="pos-product-title" title={product.name}>
        {product.name}
      </h3>
      {product.nameEn && (
        <span className="pos-product-subtitle" title={product.nameEn}>
          {product.nameEn}
        </span>
      )}

      <div className="pos-product-footer">
        <div>
          <span className="pos-product-price">฿{product.price.toLocaleString()}</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span
            className="pos-product-stock-tag"
            style={
              product.stock <= 15
                ? {
                    background: 'var(--danger-light)',
                    color: 'var(--danger)',
                    fontWeight: 600,
                    border: '1px solid #fecaca',
                  }
                : undefined
            }
          >
            เหลือ {product.stock}
          </span>
          <div
            style={{
              width: 28,
              height: 28,
              borderRadius: 'var(--radius-sm)',
              background: 'var(--primary-100)',
              color: 'var(--primary-700)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Plus size={16} />
          </div>
        </div>
      </div>
    </div>
  );
};
