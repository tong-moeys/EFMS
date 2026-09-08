import rawData from './rawTransactions.json';
import { StockInVoucher, RawTransaction, InventoryItem } from '../types/inventory';

export const parseNumber = (val: string | number): number => {
  if (typeof val === 'number') return val;
  if (!val) return 0;
  const clean = val.replace(/,/g, '').trim();
  const n = parseFloat(clean);
  return isNaN(n) ? 0 : n;
};

export const formatKHR = (amount: number): string => {
  return new Intl.NumberFormat('km-KH').format(amount) + ' ៛';
};

export const formatNumber = (val: number): string => {
  return new Intl.NumberFormat('en-US').format(val);
};

export const initialVouchers: StockInVoucher[] = (() => {
  const grouped = new Map<string, StockInVoucher>();
  const rawList = rawData as RawTransaction[];

  rawList.forEach((raw, idx) => {
    const vNum = (raw["លេខប័ណ្ណបញ្ចូលសម្ភារៈ ទំនិញ"] || "001").trim();
    if (!grouped.has(vNum)) {
      grouped.set(vNum, {
        voucherNumber: vNum,
        stockDate: raw["កាលបរិច្ឆេទបញ្ជីបញ្ចូលសម្ភារៈ ទំនិញ"] || "11-03-2025",
        receivedFrom: raw["បានទទួលពី"] || "បណ្ណាគា ភ្នំស្រុក លក់សម្ភារៈការិយាល័យ",
        documentType: raw["តាម(ប្រភេទសក្ខីបត្រដើម)"] || "Invoice",
        invoiceNumber: raw["លេខសក្ខីបត្រ"] || "",
        invoiceDate: raw["កាលបរិច្ឆេទវិក្កយបត្រ"] || "",
        enteredBy: raw["អ្នកបញ្ចូល"] || "ស្វាង មនោរម្យ",
        organization: "សាលាបឋមសិក្សា រោគ",
        fiscalYear: "2025",
        warehouse: "សាលាបឋមសិក្សា រោគ",
        items: [],
        grandTotal: 0,
      });
    }

    const voucher = grouped.get(vNum)!;
    const qtyRef = parseNumber(raw["ចំនួនតាមសក្ខីបត្រ"]);
    const qtyAct = parseNumber(raw["ចំនួនបញ្ចូលពិតប្រាកដ"]);
    const price = parseNumber(raw["ថ្លៃឯកតា"]);
    const total = parseNumber(raw["សរុបទឹកប្រាក់"]) || (qtyAct * price);

    const item: InventoryItem = {
      id: `${vNum}-${idx}-${raw["លេខរៀង"]}`,
      lineNumber: parseInt(raw["លេខរៀង"], 10) || (voucher.items.length + 1),
      itemName: raw["ឈ្មោះសញ្ញា ក្បួន ខ្នាត បរិក្ខារ ទំនិញ"] || "",
      category: raw["ប្រភេទ"] || "សម្ភារៈរៀន និងបង្រៀន",
      unit: raw["ឯកតាគិត"] || "ដប",
      qtyReference: qtyRef,
      qtyActual: qtyAct,
      unitPrice: price,
      totalAmount: total,
    };

    voucher.items.push(item);
    voucher.grandTotal += total;
  });

  return Array.from(grouped.values()).sort((a, b) => {
    return parseInt(a.voucherNumber, 10) - parseInt(b.voucherNumber, 10);
  });
})();

const STORAGE_KEY = 'tongict_inventory_vouchers_v1';

export const getSavedVouchers = (): StockInVoucher[] => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (e) {
    console.error('Failed to load saved vouchers', e);
  }
  return initialVouchers;
};

export const saveVouchers = (vouchers: StockInVoucher[]): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(vouchers));
  } catch (e) {
    console.error('Failed to save vouchers', e);
  }
};

export const resetToDefault = (): StockInVoucher[] => {
  localStorage.removeItem(STORAGE_KEY);
  return initialVouchers;
};
