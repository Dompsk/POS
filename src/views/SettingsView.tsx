import React, { useState } from 'react';
import { Store, Printer, Percent, ShieldCheck, Check } from 'lucide-react';

export const SettingsView: React.FC = () => {
  const [storeName, setStoreName] = useState('SkyPOS Cafe & Bistro');
  const [branch, setBranch] = useState('สาขาหลัก (Main Branch)');
  const [phone, setPhone] = useState('02-123-4567');
  const [taxId, setTaxId] = useState('0105566000000');
  const [vatRate, setVatRate] = useState(7);
  const [printerPaper, setPrinterPaper] = useState('80mm');
  const [isSaved, setIsSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2500);
  };

  return (
    <div style={{ flex: 1, padding: '24px', overflowY: 'auto' }}>
      <div style={{ marginBottom: 20 }}>
        <h2 style={{ fontSize: '1.4rem', fontWeight: 700, color: 'var(--text-primary)' }}>
          ตั้งค่าระบบ POS
        </h2>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
          กำหนดค่าข้อมูลร้านค้า การพิมพ์ใบเสร็จ และอัตราภาษี
        </p>
      </div>

      <form onSubmit={handleSave} style={{ maxWidth: 680, display: 'flex', flexDirection: 'column', gap: 20 }}>
        {/* Store Info */}
        <div
          style={{
            background: 'var(--bg-surface)',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid var(--border-color)',
            padding: 20,
            boxShadow: 'var(--shadow-xs)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
            <Store size={20} color="var(--primary-600)" />
            <h3 style={{ fontSize: '1.05rem', fontWeight: 700 }}>ข้อมูลร้านค้า</h3>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, marginBottom: 4 }}>
                ชื่อร้านค้า
              </label>
              <input
                type="text"
                value={storeName}
                onChange={(e) => setStoreName(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-color)',
                  outline: 'none',
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, marginBottom: 4 }}>
                ชื่อสาขา
              </label>
              <input
                type="text"
                value={branch}
                onChange={(e) => setBranch(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-color)',
                  outline: 'none',
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, marginBottom: 4 }}>
                เบอร์โทรศัพท์
              </label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-color)',
                  outline: 'none',
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, marginBottom: 4 }}>
                เลขประจำตัวผู้เสียภาษี
              </label>
              <input
                type="text"
                value={taxId}
                onChange={(e) => setTaxId(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-color)',
                  outline: 'none',
                }}
              />
            </div>
          </div>
        </div>

        {/* Printer & Receipt */}
        <div
          style={{
            background: 'var(--bg-surface)',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid var(--border-color)',
            padding: 20,
            boxShadow: 'var(--shadow-xs)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
            <Printer size={20} color="var(--primary-600)" />
            <h3 style={{ fontSize: '1.05rem', fontWeight: 700 }}>เครื่องพิมพ์ใบเสร็จ</h3>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, marginBottom: 4 }}>
                ขนาดกระดาษความร้อน
              </label>
              <select
                value={printerPaper}
                onChange={(e) => setPrinterPaper(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-color)',
                }}
              >
                <option value="80mm">80 มิลลิเมตร (Standard Thermal 80mm)</option>
                <option value="58mm">58 มิลลิเมตร (Mini Thermal 58mm)</option>
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, marginBottom: 4 }}>
                เปิดลิ้นชักเก็บเงินอัตโนมัติ
              </label>
              <select
                defaultValue="yes"
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-color)',
                }}
              >
                <option value="yes">เปิดอัตโนมัติเมื่อชำระเงินสด</option>
                <option value="no">ปิดการใช้งาน</option>
              </select>
            </div>
          </div>
        </div>

        {/* Tax & Discount */}
        <div
          style={{
            background: 'var(--bg-surface)',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid var(--border-color)',
            padding: 20,
            boxShadow: 'var(--shadow-xs)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
            <Percent size={20} color="var(--primary-600)" />
            <h3 style={{ fontSize: '1.05rem', fontWeight: 700 }}>ภาษีและราคา</h3>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, marginBottom: 4 }}>
                อัตราภาษีมูลค่าเพิ่ม VAT (%)
              </label>
              <input
                type="number"
                value={vatRate}
                onChange={(e) => setVatRate(Number(e.target.value))}
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
                การรวมภาษีในราคาสินค้า
              </label>
              <select
                defaultValue="inclusive"
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-color)',
                }}
              >
                <option value="inclusive">ราคารวม VAT แล้ว (Inclusive)</option>
                <option value="exclusive">ราคาไม่รวม VAT (Exclusive)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Theme Preview */}
        <div
          style={{
            background: 'var(--primary-50)',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid var(--primary-200)',
            padding: 16,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <ShieldCheck size={24} color="var(--primary-600)" />
            <div>
              <div style={{ fontWeight: 600, color: 'var(--primary-700)', fontSize: '0.9rem' }}>
                ธีมสีหลัก: สีฟ้าอ่อน Sky Blue Theme
              </div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                ตั้งค่าสีธีมพาสเทลฟ้าอ่อน สะบายตา เหมาะสำหรับจอสัมผัสหน้าร้าน
              </div>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 6 }}>
            <div style={{ width: 24, height: 24, borderRadius: '50%', background: '#bae6fd' }} />
            <div style={{ width: 24, height: 24, borderRadius: '50%', background: '#38bdf8' }} />
            <div style={{ width: 24, height: 24, borderRadius: '50%', background: '#0284c7' }} />
          </div>
        </div>

        {/* Save button */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <button type="submit" className="pos-btn pos-btn-primary" style={{ padding: '12px 28px' }}>
            {isSaved ? (
              <>
                <Check size={18} />
                <span>บันทึกสำเร็จ!</span>
              </>
            ) : (
              <span>บันทึกการตั้งค่า</span>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
