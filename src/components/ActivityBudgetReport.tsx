import React, { useState, useEffect, useMemo } from 'react';
import { Save, Printer, Loader2 } from 'lucide-react';
import { ref, get, set } from 'firebase/database';
import { rtdb } from '../firebase';

interface BudgetData {
  [key: string]: number;
}

interface AllQuarterData {
  [quarter: number]: BudgetData;
}

const ROWS = [
  { no: 'I', desc: 'ថវិការដ្ឋ', annual: 13903100, bold: true, editable: false, group: 'all' },
  { no: '១', desc: 'គាំទ្រកិច្ចដំណើរការ', annual: 3693700, bold: true, editable: false, group: 'g1' },
  { no: '១០១', desc: 'កិច្ចដំណើរការរដ្ឋបាល', annual: 2405500, bold: false, editable: true, key: 'r101' },
  { no: '១០២', desc: 'ការថែទាំ និងជួសជុលផ្សេងៗ', annual: 1288200, bold: false, editable: true, key: 'r102' },
  { no: '២', desc: 'កែលម្អគុណភាពអប់រំ', annual: 10209400, bold: true, editable: false, group: 'g2' },
  { no: '២០១', desc: 'ការចូលរៀនដោយសមធម៌ និងបង្ការសិស្សបោះបង់', annual: 1334000, bold: false, editable: true, key: 'r201' },
  { no: '២០២', desc: 'សម្ភារៈរៀន និងបង្រៀន', annual: 5840400, bold: false, editable: true, key: 'r202' },
  { no: '២០៣', desc: 'ការកែលម្អបរិស្ថាន', annual: 1613000, bold: false, editable: true, key: 'r203' },
  { no: '២០៤', desc: 'អប់រំបំណិនជីវិត កីឡា ការងារ យុវជន និងកុមារ', annual: 1422000, bold: false, editable: true, key: 'r204' },
];

const LEAF_KEYS = ['r101', 'r102', 'r201', 'r202', 'r203', 'r204'];
const G1_KEYS = ['r101', 'r102'];
const G2_KEYS = ['r201', 'r202', 'r203', 'r204'];

export const ActivityBudgetReport: React.FC = () => {
  const [currentQ, setCurrentQ] = useState(1);
  const [allData, setAllData] = useState<AllQuarterData>({ 1: {}, 2: {}, 3: {}, 4: {} });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState({ msg: '', type: '' });

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setStatus({ msg: '⏳ កំពុងទាញទិន្នន័យ...', type: 'info' });
      try {
        const newData: AllQuarterData = { 1: {}, 2: {}, 3: {}, 4: {} };
        for (let q = 1; q <= 4; q++) {
          const snapshot = await get(ref(rtdb, `budget/rauk_primary_school/q${q}`));
          if (snapshot.exists()) {
            newData[q] = snapshot.val();
          }
        }
        setAllData(newData);
        setStatus({ msg: '✅ ទាញទិន្នន័យបានជោគជ័យ', type: 'success' });
        setTimeout(() => setStatus({ msg: '', type: '' }), 2200);
      } catch (err: any) {
        setStatus({ msg: '❌ ភ្ជាប់ Firebase មិនបាន: ' + err.message, type: 'error' });
      }
      setLoading(false);
    };

    fetchData();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    setStatus({ msg: '⏳ កំពុងរក្សាទុក...', type: 'info' });
    try {
      await set(ref(rtdb, `budget/rauk_primary_school/q${currentQ}`), allData[currentQ] || {});
      setStatus({ msg: '✅ រក្សាទុកជោគជ័យ', type: 'success' });
      setTimeout(() => setStatus({ msg: '', type: '' }), 2200);
    } catch (err: any) {
      setStatus({ msg: '❌ មានបញ្ហា: ' + err.message, type: 'error' });
    }
    setSaving(false);
  };

  const handleInputChange = (key: string, value: string) => {
    const num = parseFloat(value) || 0;
    setAllData(prev => ({
      ...prev,
      [currentQ]: {
        ...prev[currentQ],
        [key]: num
      }
    }));
  };

  const formatNumber = (n: number) => Number(n || 0).toLocaleString('en-US');
  const formatPct = (tot: number, adj: number) => adj > 0 ? ((tot / adj) * 100).toFixed(2) + '%' : '-';

  const getPrevTotal = (key: string) => {
    let s = 0;
    for (let q = 1; q < currentQ; q++) {
      s += Number(allData[q]?.[key] || 0);
    }
    return s;
  };

  const getCurVal = (key: string) => Number(allData[currentQ]?.[key] || 0);

  const calculations = useMemo(() => {
    const calc = (annual: number, prev: number, cur: number) => {
      const tot = prev + cur;
      return { adj: annual, prev, cur, tot, pc: formatPct(tot, annual), rem: annual - tot };
    };

    const getLeafCalc = (annual: number, key: string) => calc(annual, getPrevTotal(key), getCurVal(key));
    
    const getGroupCalc = (keys: string[], annual: number) => {
      let prev = 0, cur = 0;
      keys.forEach(k => { prev += getPrevTotal(k); cur += getCurVal(k); });
      return calc(annual, prev, cur);
    };

    const results = ROWS.map(r => {
      if (r.editable) return getLeafCalc(r.annual, r.key as string);
      if (r.group === 'g1') return getGroupCalc(G1_KEYS, r.annual);
      if (r.group === 'g2') return getGroupCalc(G2_KEYS, r.annual);
      return getGroupCalc(LEAF_KEYS, r.annual);
    });

    return results;
  }, [allData, currentQ]);

  const summary = calculations[0]; // First row is always 'all' (Total)

  return (
    <div className="space-y-6">
      {/* Header Info */}
      <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200 no-print flex flex-col lg:flex-row items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold font-moul text-slate-900">របាយការណ៍ចំណាយថវិកាតាមសកម្មភាព</h2>
          <p className="text-slate-500 text-sm mt-1">ការិយាល័យអប់រំ យុវជន និងកីឡា ស្រុកភ្នំស្រុក — សាលាបឋមសិក្សា រោគ</p>
        </div>
        <div className="flex gap-4">
           <div className="bg-slate-50 px-4 py-2 rounded-xl border border-slate-200 text-center">
            <p className="text-xs text-slate-500">លេខកូដភូមិសាស្រ្ត</p>
            <p className="text-sm font-bold text-slate-700">០១០៣០៤</p>
          </div>
          <div className="bg-slate-50 px-4 py-2 rounded-xl border border-slate-200 text-center">
            <p className="text-xs text-slate-500">ឯកតា</p>
            <p className="text-sm font-bold text-slate-700">រៀល</p>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4 no-print">
        <div className="flex items-center gap-2">
          <span className="text-sm font-bold text-slate-700">ត្រីមាស:</span>
          <div className="flex gap-2">
            {[1, 2, 3, 4].map(q => (
              <button
                key={q}
                onClick={() => setCurrentQ(q)}
                className={`px-4 py-2 rounded-xl text-sm font-semibold transition-colors border ${
                  currentQ === q 
                    ? 'bg-blue-900 text-white border-blue-900' 
                    : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
                }`}
              >
                ត្រីមាស {q}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className={`text-sm font-medium ${
            status.type === 'error' ? 'text-rose-600' : 
            status.type === 'success' ? 'text-emerald-600' : 
            'text-blue-600'
          }`}>
            {status.msg}
          </span>
          <button
            onClick={handleSave}
            disabled={saving || loading}
            className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-xl text-sm font-semibold transition-all"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            រក្សាទុក
          </button>
          <button
            onClick={() => window.print()}
            className="flex items-center gap-2 px-5 py-2.5 border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 rounded-xl text-sm font-semibold transition-all"
          >
            <Printer className="w-4 h-4" />
            បោះពុម្ព
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 print-area">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
          <p className="text-xs font-bold text-slate-500 uppercase">ថវិកាប្រចាំឆ្នាំ</p>
          <p className="text-xl font-bold text-slate-900 mt-1 font-mono">{formatNumber(summary.adj)}</p>
        </div>
        <div className="bg-amber-50 p-4 rounded-2xl border border-amber-200 shadow-sm">
          <p className="text-xs font-bold text-amber-600 uppercase">ចំណាយបណ្តាត្រីមាសមុន</p>
          <p className="text-xl font-bold text-amber-700 mt-1 font-mono">{formatNumber(summary.prev)}</p>
        </div>
        <div className="bg-blue-50 p-4 rounded-2xl border border-blue-200 shadow-sm">
          <p className="text-xs font-bold text-blue-600 uppercase">ចំណាយត្រីមាសនេះ</p>
          <p className="text-xl font-bold text-blue-700 mt-1 font-mono">{formatNumber(summary.cur)}</p>
        </div>
        <div className="bg-emerald-50 p-4 rounded-2xl border border-emerald-200 shadow-sm">
          <p className="text-xs font-bold text-emerald-600 uppercase">បូកយោង</p>
          <p className="text-xl font-bold text-emerald-700 mt-1 font-mono">{formatNumber(summary.tot)}</p>
        </div>
        <div className="bg-purple-50 p-4 rounded-2xl border border-purple-200 shadow-sm">
          <p className="text-xs font-bold text-purple-600 uppercase">ឥណទាននៅសល់</p>
          <p className="text-xl font-bold text-purple-700 mt-1 font-mono">{formatNumber(summary.rem)}</p>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden print-area">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-900 text-white">
              <tr>
                <th className="px-4 py-3 text-center font-semibold border-r border-slate-800">ល.រ</th>
                <th className="px-4 py-3 font-semibold border-r border-slate-800">បរិយាយ</th>
                <th className="px-4 py-3 text-right font-semibold border-r border-slate-800">
                  ថវិកាប្រចាំឆ្នាំ<br/><span className="text-xs text-slate-400 font-normal">1</span>
                </th>
                <th className="px-4 py-3 text-right font-semibold border-r border-slate-800">
                  ឥណទានកែតម្រូវ<br/><span className="text-xs text-slate-400 font-normal">4 = 1+2-3</span>
                </th>
                <th className="px-4 py-3 text-right font-semibold border-r border-slate-800">
                  បណ្តាត្រីមាសមុន<br/><span className="text-xs text-slate-400 font-normal">5</span>
                </th>
                <th className="px-4 py-3 text-right font-semibold text-amber-300 border-r border-slate-800">
                  ក្នុងត្រីមាស<br/><span className="text-xs text-amber-300/80 font-normal">6</span>
                </th>
                <th className="px-4 py-3 text-right font-semibold border-r border-slate-800">
                  បូកយោង<br/><span className="text-xs text-slate-400 font-normal">7 = 5+6</span>
                </th>
                <th className="px-4 py-3 text-right font-semibold border-r border-slate-800">
                  % ចំណាយ<br/><span className="text-xs text-slate-400 font-normal">8 = 7/4</span>
                </th>
                <th className="px-4 py-3 text-right font-semibold">
                  ឥណទាននៅសល់<br/><span className="text-xs text-slate-400 font-normal">9 = 4-7</span>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {ROWS.map((row, idx) => {
                const c = calculations[idx];
                return (
                  <tr key={idx} className={`${row.bold ? 'bg-slate-50 font-bold' : 'hover:bg-blue-50/50'}`}>
                    <td className="px-4 py-3 text-center text-slate-600 border-r border-slate-100">{row.no}</td>
                    <td className="px-4 py-3 text-slate-900 border-r border-slate-100">{row.desc}</td>
                    <td className="px-4 py-3 text-right font-mono border-r border-slate-100">{formatNumber(row.annual)}</td>
                    <td className="px-4 py-3 text-right font-mono border-r border-slate-100">{formatNumber(c.adj)}</td>
                    <td className="px-4 py-3 text-right font-mono text-slate-600 border-r border-slate-100">{formatNumber(c.prev)}</td>
                    <td className="px-3 py-2 border-r border-slate-100">
                      {row.editable ? (
                        <input
                          type="number"
                          value={allData[currentQ]?.[row.key as string] || ''}
                          onChange={(e) => handleInputChange(row.key as string, e.target.value)}
                          className="w-full min-w-[100px] text-right font-mono font-bold bg-white border border-blue-200 rounded-lg px-3 py-1.5 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
                          placeholder="0"
                        />
                      ) : (
                        <div className="text-right font-mono font-bold text-blue-700 px-3 py-1.5">{formatNumber(c.cur)}</div>
                      )}
                    </td>
                    <td className="px-4 py-3 text-right font-mono text-slate-900 border-r border-slate-100">{formatNumber(c.tot)}</td>
                    <td className="px-4 py-3 text-right font-mono text-emerald-600 border-r border-slate-100">{c.pc}</td>
                    <td className="px-4 py-3 text-right font-mono text-slate-900">{formatNumber(c.rem)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
