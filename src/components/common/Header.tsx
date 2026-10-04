import React, { useState, useEffect } from 'react';
import { Store, Clock, User, Wifi, Maximize2, PauseCircle } from 'lucide-react';

interface HeaderProps {
  heldOrdersCount: number;
  onOpenHeldOrders: () => void;
  activeViewTitle: string;
}

export const Header: React.FC<HeaderProps> = ({
  heldOrdersCount,
  onOpenHeldOrders,
  activeViewTitle,
}) => {
  const [time, setTime] = useState<string>('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTime(
        now.toLocaleTimeString('th-TH', {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
        })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const toggleFullScreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen().catch(() => {});
    }
  };

  return (
    <header className="pos-header">
      <div className="pos-header-left">
        <div className="pos-brand">
          <div
            style={{
              width: 38,
              height: 38,
              borderRadius: 10,
              background: 'linear-gradient(135deg, #38bdf8 0%, #0284c7 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ffffff',
              boxShadow: '0 4px 10px rgba(14, 165, 233, 0.3)',
            }}
          >
            <Store size={22} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span>SkyPOS</span>
              <span className="pos-brand-badge">สาขาหลัก</span>
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 400 }}>
              {activeViewTitle}
            </div>
          </div>
        </div>
      </div>

      <div className="pos-header-right">
        {/* Held Orders Quick Access */}
        {heldOrdersCount > 0 && (
          <button
            onClick={onOpenHeldOrders}
            className="pos-btn pos-btn-secondary"
            style={{
              padding: '6px 14px',
              fontSize: '0.82rem',
              borderRadius: 'var(--radius-full)',
              background: 'var(--warning-light)',
              color: '#b45309',
              borderColor: '#fde68a',
            }}
          >
            <PauseCircle size={16} />
            พักบิลไว้ ({heldOrdersCount})
          </button>
        )}

        {/* Live Clock */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            fontSize: '0.88rem',
            color: 'var(--text-secondary)',
            background: 'var(--primary-50)',
            padding: '6px 12px',
            borderRadius: 'var(--radius-full)',
            border: '1px solid var(--primary-200)',
          }}
        >
          <Clock size={16} color="var(--primary-600)" />
          <span style={{ fontWeight: 600, color: 'var(--primary-700)' }}>{time}</span>
        </div>

        {/* Cashier Info */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            padding: '4px 12px',
            background: 'var(--bg-muted)',
            borderRadius: 'var(--radius-full)',
            border: '1px solid var(--border-color)',
          }}
        >
          <div
            style={{
              width: 26,
              height: 26,
              borderRadius: '50%',
              background: 'var(--primary-200)',
              color: 'var(--primary-700)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <User size={15} />
          </div>
          <span style={{ fontSize: '0.82rem', fontWeight: 500 }}>คุณสมชาย (POS 01)</span>
        </div>

        {/* Online Status */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            fontSize: '0.78rem',
            color: 'var(--success)',
            background: 'var(--success-light)',
            padding: '4px 10px',
            borderRadius: 'var(--radius-full)',
          }}
        >
          <Wifi size={14} />
          <span style={{ fontWeight: 600 }}>ออนไลน์</span>
        </div>

        {/* Fullscreen Button */}
        <button
          onClick={toggleFullScreen}
          style={{
            border: 'none',
            background: 'transparent',
            cursor: 'pointer',
            color: 'var(--text-secondary)',
            padding: 6,
            borderRadius: 'var(--radius-sm)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
          title="เต็มจอ"
        >
          <Maximize2 size={18} />
        </button>
      </div>
    </header>
  );
};
