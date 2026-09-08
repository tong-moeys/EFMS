import React, { useState } from 'react';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Info } from 'lucide-react';
import { getKhmerDateString } from '../utils/khmerDate';
import { startOfMonth, endOfMonth, startOfWeek, endOfWeek, eachDayOfInterval, format, isSameMonth, isToday, addMonths, subMonths } from 'date-fns';

// 2025/2026 Sample Cambodian Holidays
const HOLIDAYS: Record<string, string> = {
  '2026-01-01': 'ចូលឆ្នាំសកល (International New Year)',
  '2026-01-07': 'ទិវាជ័យជម្នះលើរបបប្រល័យពូជសាសន៍ (Victory Day)',
  '2026-03-08': 'ទិវានារីអន្តរជាតិ (International Women\'s Day)',
  '2026-04-14': 'ពិធីបុណ្យចូលឆ្នាំថ្មីប្រពៃណីជាតិ (Khmer New Year)',
  '2026-04-15': 'ពិធីបុណ្យចូលឆ្នាំថ្មីប្រពៃណីជាតិ (Khmer New Year)',
  '2026-04-16': 'ពិធីបុណ្យចូលឆ្នាំថ្មីប្រពៃណីជាតិ (Khmer New Year)',
  '2026-05-01': 'ទិវាពលកម្មអន្តរជាតិ (International Labor Day)',
  '2026-05-14': 'ព្រះរាជពិធីបុណ្យចម្រើនព្រះជន្មព្រះមហាក្សត្រ (King\'s Birthday)',
  '2026-09-24': 'ពិធីបុណ្យភ្ជុំបិណ្ឌ (Pchum Ben - Day 1)',
  '2026-09-25': 'ពិធីបុណ្យភ្ជុំបិណ្ឌ (Pchum Ben - Day 2)',
  '2026-09-26': 'ពិធីបុណ្យភ្ជុំបិណ្ឌ (Pchum Ben - Day 3)',
  '2026-10-15': 'ព្រះរាជពិធីគោរពព្រះវិញ្ញាណក្ខន្ធ ព្រះបរមរតនកោដ្ឋ (Commemoration of King Father)',
  '2026-10-29': 'ព្រះរាជពិធីគ្រងព្រះបរមសម្បត្តិ (Coronation Day)',
  '2026-11-09': 'បុណ្យឯករាជ្យជាតិ (Independence Day)',
  '2026-11-23': 'ព្រះរាជពិធីបុណ្យអុំទូក (Water Festival - Day 1)',
  '2026-11-24': 'ព្រះរាជពិធីបុណ្យអុំទូក (Water Festival - Day 2)',
  '2026-11-25': 'ព្រះរាជពិធីបុណ្យអុំទូក (Water Festival - Day 3)',
  // 2025
  '2025-01-01': 'ចូលឆ្នាំសកល (International New Year)',
  '2025-01-07': 'ទិវាជ័យជម្នះលើរបបប្រល័យពូជសាសន៍ (Victory Day)',
  '2025-03-08': 'ទិវានារីអន្តរជាតិ (International Women\'s Day)',
  '2025-04-14': 'ពិធីបុណ្យចូលឆ្នាំថ្មីប្រពៃណីជាតិ (Khmer New Year)',
  '2025-04-15': 'ពិធីបុណ្យចូលឆ្នាំថ្មីប្រពៃណីជាតិ (Khmer New Year)',
  '2025-04-16': 'ពិធីបុណ្យចូលឆ្នាំថ្មីប្រពៃណីជាតិ (Khmer New Year)',
  '2025-05-01': 'ទិវាពលកម្មអន្តរជាតិ (International Labor Day)',
  '2025-05-14': 'ព្រះរាជពិធីបុណ្យចម្រើនព្រះជន្មព្រះមហាក្សត្រ (King\'s Birthday)',
};

export const HolidayCalendar: React.FC = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const startDate = startOfWeek(monthStart, { weekStartsOn: 1 }); // Start on Monday
  const endDate = endOfWeek(monthEnd, { weekStartsOn: 1 });

  const dateFormat = "yyyy-MM-dd";
  const days = eachDayOfInterval({ start: startDate, end: endDate });

  const weekDays = ['ច', 'អ', 'ព', 'ព្រ', 'សុ', 'ស', 'អា'];

  const nextMonth = () => setCurrentDate(addMonths(currentDate, 1));
  const prevMonth = () => setCurrentDate(subMonths(currentDate, 1));

  // Get holidays for current month to show in list below
  const currentMonthHolidays = days.filter(day => {
    return isSameMonth(day, monthStart) && HOLIDAYS[format(day, dateFormat)];
  });

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 flex flex-col md:flex-row gap-8">
      {/* Calendar Grid */}
      <div className="flex-1">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold font-moul text-slate-900 flex items-center gap-2">
            <CalendarIcon className="w-5 h-5 text-blue-600" />
            ប្រតិទិនការងារ និងថ្ងៃឈប់សម្រាក
          </h2>
          <div className="flex items-center gap-4">
            <button onClick={prevMonth} className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
              <ChevronLeft className="w-5 h-5" />
            </button>
            <span className="font-semibold font-mono text-lg min-w-[120px] text-center">
              {format(currentDate, 'MMMM yyyy')}
            </span>
            <button onClick={nextMonth} className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-7 gap-2 mb-2">
          {weekDays.map(day => (
            <div key={day} className="text-center font-bold text-slate-500 text-sm py-2">
              {day}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-2">
          {days.map((day) => {
            const dateKey = format(day, dateFormat);
            const isHoliday = HOLIDAYS[dateKey];
            const isCurrentMonth = isSameMonth(day, monthStart);
            const isTodayDate = isToday(day);

            return (
              <div 
                key={day.toString()} 
                className={`
                  min-h-[80px] p-2 rounded-xl border relative transition-all
                  ${!isCurrentMonth ? 'bg-slate-50 border-slate-100 opacity-50' : 'bg-white border-slate-200'}
                  ${isTodayDate ? 'ring-2 ring-blue-500 ring-offset-2' : ''}
                  ${isHoliday ? 'bg-rose-50 border-rose-200' : 'hover:border-blue-300'}
                `}
                title={isHoliday ? HOLIDAYS[dateKey] : ''}
              >
                <span className={`
                  text-sm font-bold inline-block
                  ${isHoliday ? 'text-rose-600' : isCurrentMonth ? 'text-slate-700' : 'text-slate-400'}
                `}>
                  {format(day, 'd')}
                </span>
                {isHoliday && (
                  <div className="mt-1 text-[10px] leading-tight text-rose-600 font-semibold line-clamp-2">
                    {HOLIDAYS[dateKey].split(' (')[0]}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Info Sidebar */}
      <div className="w-full md:w-80 space-y-6">
        <div className="bg-blue-50 border border-blue-100 rounded-xl p-4">
          <h3 className="font-bold text-blue-900 flex items-center gap-2 mb-2">
            <Info className="w-4 h-4" />
            កាលបរិច្ឆេទខ្មែរថ្ងៃនេះ
          </h3>
          <p className="text-sm font-semibold text-blue-800 font-hanuman">
            {getKhmerDateString(new Date())}
          </p>
        </div>

        <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex-1">
          <h3 className="font-bold text-slate-900 mb-4 pb-2 border-b border-slate-200">
            ថ្ងៃបុណ្យសម្រាកប្រចាំខែនេះ
          </h3>
          {currentMonthHolidays.length > 0 ? (
            <ul className="space-y-3">
              {currentMonthHolidays.map(day => {
                const key = format(day, dateFormat);
                return (
                  <li key={key} className="flex gap-3 items-start text-sm">
                    <span className="font-mono font-bold text-rose-600 bg-rose-100 px-2 py-0.5 rounded text-xs">
                      {format(day, 'dd MMM')}
                    </span>
                    <span className="text-slate-700 font-semibold">{HOLIDAYS[key]}</span>
                  </li>
                );
              })}
            </ul>
          ) : (
            <p className="text-sm text-slate-500 italic">មិនមានថ្ងៃឈប់សម្រាកបុណ្យជាតិទេក្នុងខែនេះ។</p>
          )}
        </div>
      </div>
    </div>
  );
};
