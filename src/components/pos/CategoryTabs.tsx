import React from 'react';
import type { Category } from '../../types/pos';
import {
  LayoutGrid,
  Coffee,
  CupSoda,
  Cake,
  Utensils,
  Cookie,
  Sparkles,
} from 'lucide-react';

interface CategoryTabsProps {
  categories: Category[];
  selectedCategoryId: string;
  onSelectCategory: (id: string) => void;
  productCounts?: Record<string, number>;
}

export const CategoryTabs: React.FC<CategoryTabsProps> = ({
  categories,
  selectedCategoryId,
  onSelectCategory,
  productCounts = {},
}) => {
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Sparkles':
        return <Sparkles size={18} color="#f59e0b" />;
      case 'Coffee':
        return <Coffee size={18} />;
      case 'CupSoda':
        return <CupSoda size={18} />;
      case 'Cake':
        return <Cake size={18} />;
      case 'Utensils':
        return <Utensils size={18} />;
      case 'Cookie':
        return <Cookie size={18} />;
      default:
        return <LayoutGrid size={18} />;
    }
  };

  return (
    <div className="pos-category-container">
      {categories.map((cat) => {
        const isSelected = selectedCategoryId === cat.id;
        const count = productCounts[cat.id];

        return (
          <button
            key={cat.id}
            className={`pos-category-pill ${isSelected ? 'active' : ''}`}
            onClick={() => onSelectCategory(cat.id)}
          >
            {getIcon(cat.iconName)}
            <span>{cat.name}</span>
            {count !== undefined && (
              <span
                style={{
                  fontSize: '0.75rem',
                  padding: '1px 6px',
                  borderRadius: '999px',
                  background: isSelected ? 'rgba(255, 255, 255, 0.25)' : 'var(--primary-100)',
                  color: isSelected ? '#ffffff' : 'var(--primary-700)',
                  fontWeight: 600,
                }}
              >
                {count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
};
