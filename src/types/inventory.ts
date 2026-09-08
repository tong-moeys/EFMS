export interface RawTransaction {
  "លេខរៀង": string;
  "ឈ្មោះសញ្ញា ក្បួន ខ្នាត បរិក្ខារ ទំនិញ": string;
  "ប្រភេទ": string;
  "ឯកតាគិត": string;
  "ចំនួនតាមសក្ខីបត្រ": string;
  "ចំនួនបញ្ចូលពិតប្រាកដ": string;
  "ថ្លៃឯកតា": string;
  "សរុបទឹកប្រាក់": string;
  "លេខប័ណ្ណបញ្ចូលសម្ភារៈ ទំនិញ": string;
  "កាលបរិច្ឆេទបញ្ជីបញ្ចូលសម្ភារៈ ទំនិញ": string;
  "បានទទួលពី": string;
  "តាម(ប្រភេទសក្ខីបត្រដើម)": string;
  "លេខសក្ខីបត្រ": string;
  "កាលបរិច្ឆេទវិក្កយបត្រ": string;
  "អ្នកបញ្ចូល": string;
}

export interface InventoryItem {
  id: string;
  lineNumber: number;
  itemName: string;
  category: string;
  unit: string;
  qtyReference: number;
  qtyActual: number;
  unitPrice: number;
  totalAmount: number;
}

export interface StockInVoucher {
  voucherNumber: string; // e.g. "001"
  stockDate: string; // e.g. "11-03-2025" or "11/Mar/2025"
  receivedFrom: string;
  documentType: string; // "Invoice"
  invoiceNumber: string;
  invoiceDate: string;
  enteredBy: string;
  organization: string; // "សាលាបឋមសិក្សា រោគ"
  fiscalYear: string; // "2025"
  warehouse: string; // "សាលាបឋមសិក្សា រោគ"
  items: InventoryItem[];
  grandTotal: number;
}

export type CategoryName =
  | 'សម្ភារៈរៀន និងបង្រៀន'
  | 'កិច្ចដំណើរការរដ្ឋបាល'
  | 'ការថែទាំ និងជួសជុលផ្សេងៗ'
  | 'ការចូលរៀនដោយសមធម៌និងបង្ការសិស្សបោះបង់'
  | 'អប់រំបំណិនជីវិត កីឡា ការងារយុវជន និងកុមារ'
  | 'ការកែលម្អបរិស្ថាន និងទីធ្លាកម្សាន្ត';
