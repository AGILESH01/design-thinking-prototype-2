import { useState, useMemo } from 'react';
import { ArrowLeft, ChevronLeft, ChevronRight, TrendingUp, TrendingDown, Minus, Info, ShoppingBag, HeartPulse, Lightbulb, Building2, Film, User, Tag } from 'lucide-react';
import type { Screen, Transaction, SupportedLanguage, ExpenseCategory } from '../types';
import { t, getCategoryTranslation } from '../utils/translations';
import { sound } from '../utils/sound';

interface MonthlyExpenseScreenProps {
  navigate: (screen: Screen) => void;
  transactions: Transaction[];
  lang: SupportedLanguage;
}

interface CategoryData {
  category: ExpenseCategory;
  name: string;
  amount: number;
  percentage: number;
  count: number;
  color: string;
  bgColor: string;
}

const CATEGORY_COLORS: Record<ExpenseCategory, { hex: string; bg: string; icon: typeof User }> = {
  'Food and Groceries': { hex: '#10B981', bg: 'bg-emerald-100 text-emerald-700', icon: ShoppingBag },
  'Transportation': { hex: '#0EA5E9', bg: 'bg-cyan-100 text-cyan-700', icon: Building2 },
  'Utilities and Bills': { hex: '#F59E0B', bg: 'bg-amber-100 text-amber-700', icon: Lightbulb },
  'Shopping': { hex: '#8B5CF6', bg: 'bg-purple-100 text-purple-700', icon: ShoppingBag },
  'Healthcare': { hex: '#EF4444', bg: 'bg-rose-100 text-rose-700', icon: HeartPulse },
  'Entertainment': { hex: '#EC4899', bg: 'bg-pink-100 text-pink-700', icon: Film },
  'Other Expenses': { hex: '#64748B', bg: 'bg-slate-100 text-slate-700', icon: Tag },
};

export default function MonthlyExpenseScreen({
  navigate,
  transactions,
  lang,
}: MonthlyExpenseScreenProps) {
  // Available demo months
  const availableMonths = useMemo(() => [
    { key: '2026-11', label: 'November 2026', shortLabel: 'Nov 2026', year: 2026, month: 10 },
    { key: '2026-10', label: 'October 2026', shortLabel: 'Oct 2026', year: 2026, month: 9 },
    { key: '2026-09', label: 'September 2026', shortLabel: 'Sep 2026', year: 2026, month: 8 },
  ], []);

  const [selectedMonthKey, setSelectedMonthKey] = useState<string>('2026-11');
  const [selectedCategoryKey, setSelectedCategoryKey] = useState<ExpenseCategory | null>(null);

  const currentMonthIdx = availableMonths.findIndex(m => m.key === selectedMonthKey);

  const handlePrevMonth = () => {
    if (currentMonthIdx < availableMonths.length - 1) {
      sound.playKeyClick();
      setSelectedMonthKey(availableMonths[currentMonthIdx + 1].key);
      setSelectedCategoryKey(null);
    }
  };

  const handleNextMonth = () => {
    if (currentMonthIdx > 0) {
      sound.playKeyClick();
      setSelectedMonthKey(availableMonths[currentMonthIdx - 1].key);
      setSelectedCategoryKey(null);
    }
  };

  // Filter transactions for the selected month
  const monthTransactions = useMemo(() => {
    return transactions.filter(tx => {
      const d = new Date(tx.timestamp);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
      return key === selectedMonthKey;
    });
  }, [transactions, selectedMonthKey]);

  // Aggregate monthly figures according to strict requirements:
  // ONLY successful outgoing payments count toward expenses!
  // Incoming payments are calculated separately and excluded from expenses.
  // Pending and failed payments are excluded from completed expenses.
  const {
    totalSpent,
    totalReceived,
    outgoingCount,
    incomingCount,
    categoryBreakdown,
  } = useMemo(() => {
    let spent = 0;
    let received = 0;
    let outCount = 0;
    let inCount = 0;
    const catMap = new Map<ExpenseCategory, { amount: number; count: number }>();

    monthTransactions.forEach(tx => {
      if (tx.status === 'Completed') {
        if (tx.isReceived) {
          received += tx.amount;
          inCount++;
        } else {
          spent += tx.amount;
          outCount++;
          const current = catMap.get(tx.category) || { amount: 0, count: 0 };
          catMap.set(tx.category, {
            amount: current.amount + tx.amount,
            count: current.count + 1,
          });
        }
      }
    });

    const categories: CategoryData[] = Array.from(catMap.entries()).map(([cat, data]) => {
      const pct = spent > 0 ? Math.round((data.amount / spent) * 100) : 0;
      return {
        category: cat,
        name: getCategoryTranslation(lang, cat),
        amount: data.amount,
        percentage: pct,
        count: data.count,
        color: CATEGORY_COLORS[cat]?.hex || '#64748B',
        bgColor: CATEGORY_COLORS[cat]?.bg || 'bg-gray-100 text-gray-700',
      };
    }).sort((a, b) => b.amount - a.amount);

    return {
      totalSpent: spent,
      totalReceived: received,
      outgoingCount: outCount,
      incomingCount: inCount,
      categoryBreakdown: categories,
    };
  }, [monthTransactions, lang]);

  // Previous month comparison
  const previousMonthSpent = useMemo(() => {
    if (currentMonthIdx >= availableMonths.length - 1) return null;
    const prevKey = availableMonths[currentMonthIdx + 1].key;
    const prevTxs = transactions.filter(tx => {
      const d = new Date(tx.timestamp);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
      return key === prevKey && tx.status === 'Completed' && !tx.isReceived;
    });
    return prevTxs.reduce((sum, tx) => sum + tx.amount, 0);
  }, [transactions, currentMonthIdx, availableMonths]);

  // Comparison metrics
  const comparison = useMemo(() => {
    if (previousMonthSpent === null) return null;
    const diff = totalSpent - previousMonthSpent;
    const pctChange = previousMonthSpent > 0 ? Math.abs(Math.round((diff / previousMonthSpent) * 100)) : 0;
    return {
      diff: Math.abs(diff),
      isMore: diff > 0,
      isLess: diff < 0,
      isEqual: diff === 0,
      pctChange,
      previousSpent: previousMonthSpent,
    };
  }, [totalSpent, previousMonthSpent]);

  // SVG Doughnut Chart Calculation
  const radius = 68;
  const strokeWidth = 26;
  const circumference = 2 * Math.PI * radius; // ~427.25

  const chartSegments = useMemo(() => {
    let sum = 0;
    const segments: Array<CategoryData & { strokeDasharray: string; strokeDashoffset: number }> = [];
    for (let i = 0; i < categoryBreakdown.length; i++) {
      const cat = categoryBreakdown[i];
      const strokeDasharray = `${(cat.percentage / 100) * circumference} ${circumference}`;
      const strokeDashoffset = -((sum / 100) * circumference);
      sum += cat.percentage;
      segments.push({
        ...cat,
        strokeDasharray,
        strokeDashoffset,
      });
    }
    return segments;
  }, [categoryBreakdown, circumference]);

  const activeCategory = selectedCategoryKey
    ? categoryBreakdown.find(c => c.category === selectedCategoryKey)
    : null;

  return (
    <div className="flex flex-col min-h-full bg-gray-50 pb-20">
      {/* Header */}
      <div className="flex items-center px-4 py-4 bg-white border-b border-gray-200 sticky top-0 z-10">
        <button
          onClick={() => navigate('home')}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          aria-label="Back to home"
        >
          <ArrowLeft size={28} className="text-gray-800" />
        </button>
        <div className="ml-3">
          <h1 className="text-2xl font-bold text-gray-900 leading-tight">
            {t(lang, 'monthlyInsightsTitle')}
          </h1>
          <p className="text-xs font-semibold text-gray-500">
            {t(lang, 'monthlyInsightsSubtitle')}
          </p>
        </div>
      </div>

      <div className="p-5 flex-1 overflow-y-auto space-y-5">
        
        {/* Month Selector Bar */}
        <div className="bg-white border-2 border-gray-200 rounded-2xl p-2.5 flex items-center justify-between shadow-xs">
          <button
            onClick={handlePrevMonth}
            disabled={currentMonthIdx >= availableMonths.length - 1}
            className="p-2.5 rounded-xl hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed text-gray-700 transition-colors"
            aria-label="Previous Month"
          >
            <ChevronLeft size={24} />
          </button>

          <div className="text-center">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-700 block">
              {t(lang, 'selectMonth')}
            </span>
            <span className="text-lg font-extrabold text-gray-900">
              {availableMonths[currentMonthIdx]?.label}
            </span>
          </div>

          <button
            onClick={handleNextMonth}
            disabled={currentMonthIdx <= 0}
            className="p-2.5 rounded-xl hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed text-gray-700 transition-colors"
            aria-label="Next Month"
          >
            <ChevronRight size={24} />
          </button>
        </div>

        {/* Monthly Summary Cards (Primary visual metric = Total Expenses) */}
        <div className="bg-white border-2 border-gray-200 rounded-3xl p-5 shadow-sm">
          <div className="text-center mb-4">
            <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">
              {t(lang, 'totalSpentMonth')}
            </p>
            <div className="text-4xl font-extrabold text-red-600 mt-1 tracking-tight">
              ₹ {totalSpent.toLocaleString('en-IN')}
            </div>
            <p className="text-xs font-bold text-gray-400 mt-1">
              {outgoingCount} {t(lang, 'outgoingCount')}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-3 border-t border-gray-100">
            <div className="bg-green-50 border border-green-200 rounded-2xl p-3 text-center">
              <span className="text-[11px] font-bold text-green-800 uppercase block">
                {t(lang, 'totalReceivedMonth')}
              </span>
              <span className="text-xl font-extrabold text-green-700 block mt-0.5">
                +₹{totalReceived.toLocaleString('en-IN')}
              </span>
              <span className="text-[10px] font-bold text-green-600">
                {incomingCount} {t(lang, 'incomingCount')}
              </span>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-2xl p-3 text-center">
              <span className="text-[11px] font-bold text-blue-800 uppercase block">
                Net Cash Flow
              </span>
              <span className={`text-xl font-extrabold block mt-0.5 ${
                totalReceived - totalSpent >= 0 ? 'text-blue-700' : 'text-orange-600'
              }`}>
                {totalReceived - totalSpent >= 0 ? '+' : '-'}₹{Math.abs(totalReceived - totalSpent).toLocaleString('en-IN')}
              </span>
              <span className="text-[10px] font-bold text-blue-600">
                {totalReceived >= totalSpent ? 'Surplus' : 'Deficit'}
              </span>
            </div>
          </div>
        </div>

        {/* Interactive Doughnut Chart Card */}
        <div className="bg-white border-2 border-gray-200 rounded-3xl p-5 shadow-sm flex flex-col items-center">
          <h2 className="text-base font-bold text-gray-900 mb-1">
            {t(lang, 'spendingChartTitle')}
          </h2>
          <p className="text-xs font-medium text-gray-500 mb-4 text-center">
            {t(lang, 'tapToInspect')}
          </p>

          {/* SVG Doughnut */}
          <div className="relative w-56 h-56 flex items-center justify-center my-2">
            <svg className="w-full h-full -rotate-90 transform" viewBox="0 0 180 180">
              {/* Background circle */}
              <circle
                cx="90"
                cy="90"
                r={radius}
                fill="transparent"
                stroke="#E2E8F0"
                strokeWidth={strokeWidth}
              />
              {/* Category segments */}
              {chartSegments.map((segment) => (
                <circle
                  key={segment.category}
                  cx="90"
                  cy="90"
                  r={radius}
                  fill="transparent"
                  stroke={segment.color}
                  strokeWidth={selectedCategoryKey === segment.category ? strokeWidth + 4 : strokeWidth}
                  strokeDasharray={segment.strokeDasharray}
                  strokeDashoffset={segment.strokeDashoffset}
                  strokeLinecap="round"
                  className="cursor-pointer transition-all duration-300 hover:opacity-80"
                  onClick={() => {
                    sound.playKeyClick();
                    setSelectedCategoryKey(
                      selectedCategoryKey === segment.category ? null : segment.category
                    );
                  }}
                />
              ))}
            </svg>

            {/* Doughnut Center Display */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none p-4 text-center">
              {activeCategory ? (
                <>
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                    {t(lang, 'selectedCategory')}
                  </span>
                  <span className="text-xs font-extrabold text-gray-800 line-clamp-1">
                    {activeCategory.name}
                  </span>
                  <span className="text-lg font-black text-gray-900 mt-0.5">
                    ₹{activeCategory.amount.toLocaleString('en-IN')}
                  </span>
                  <span className="text-[11px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full mt-1">
                    {activeCategory.percentage}%
                  </span>
                </>
              ) : (
                <>
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                    Total Spent
                  </span>
                  <span className="text-2xl font-black text-gray-900 tracking-tight">
                    ₹{totalSpent.toLocaleString('en-IN')}
                  </span>
                  <span className="text-[10px] font-bold text-gray-500 mt-0.5">
                    100%
                  </span>
                </>
              )}
            </div>
          </div>

          {/* Quick Active Category Inspection Banner */}
          {activeCategory && (
            <div className="w-full mt-3 p-3 bg-blue-50 border-2 border-blue-200 rounded-2xl flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-blue-900 block">{activeCategory.name}</span>
                <span className="text-xs font-medium text-blue-700">
                  {activeCategory.count} {activeCategory.count === 1 ? 'transaction' : 'transactions'}
                </span>
              </div>
              <div className="text-right">
                <span className="text-base font-extrabold text-blue-950 block">
                  ₹{activeCategory.amount.toLocaleString('en-IN')}
                </span>
                <span className="text-xs font-bold text-blue-600">
                  {activeCategory.percentage}% of expenses
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Monthly Comparison Card */}
        {comparison && (
          <div className="bg-white border-2 border-gray-200 rounded-3xl p-5 shadow-sm">
            <h3 className="text-sm font-bold text-gray-900 mb-2 flex items-center gap-2">
              <Info size={18} className="text-blue-600" />
              <span>{t(lang, 'monthComparisonTitle')}</span>
            </h3>

            <div className={`p-4 rounded-2xl border-2 flex items-start gap-3.5 ${
              comparison.isMore 
                ? 'bg-amber-50 border-amber-300 text-amber-950'
                : comparison.isLess 
                ? 'bg-green-50 border-green-300 text-green-950'
                : 'bg-gray-50 border-gray-200 text-gray-900'
            }`}>
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5 ${
                comparison.isMore ? 'bg-amber-200 text-amber-900' : 'bg-green-200 text-green-900'
              }`}>
                {comparison.isMore ? <TrendingUp size={22} /> : comparison.isLess ? <TrendingDown size={22} /> : <Minus size={22} />}
              </div>
              <div className="flex-1 text-sm font-semibold leading-snug">
                {comparison.isMore && t(lang, 'spentMoreNotice', {
                  diff: comparison.diff.toLocaleString('en-IN'),
                  pct: comparison.pctChange,
                })}
                {comparison.isLess && t(lang, 'spentLessNotice', {
                  diff: comparison.diff.toLocaleString('en-IN'),
                  pct: comparison.pctChange,
                })}
                {comparison.isEqual && t(lang, 'spentEqualNotice')}
                <p className="text-xs font-normal opacity-80 mt-1">
                  Previous month spending was ₹{comparison.previousSpent.toLocaleString('en-IN')}.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Category-Wise Breakdown List / Legend */}
        <div className="bg-white border-2 border-gray-200 rounded-3xl p-5 shadow-sm space-y-3">
          <h3 className="text-base font-bold text-gray-900 mb-1">
            {t(lang, 'categoryBreakdownTitle')}
          </h3>

          <div className="space-y-2.5">
            {categoryBreakdown.map((cat) => {
              const IconComp = CATEGORY_COLORS[cat.category]?.icon || Tag;
              const isSelected = selectedCategoryKey === cat.category;

              return (
                <button
                  key={cat.category}
                  onClick={() => {
                    sound.playKeyClick();
                    setSelectedCategoryKey(isSelected ? null : cat.category);
                  }}
                  className={`w-full flex items-center justify-between p-3.5 rounded-2xl border-2 transition-all text-left ${
                    isSelected
                      ? 'border-blue-500 bg-blue-50/70 shadow-xs ring-2 ring-blue-100'
                      : 'border-gray-100 bg-white hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                      style={{ backgroundColor: `${cat.color}20`, color: cat.color }}
                    >
                      <IconComp size={20} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-bold text-gray-900 truncate">
                        {cat.name}
                      </p>
                      <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden mt-1.5 max-w-[120px]">
                        <div
                          className="h-full rounded-full"
                          style={{ width: `${cat.percentage}%`, backgroundColor: cat.color }}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="text-right ml-3">
                    <span className="text-base font-extrabold text-gray-900 block">
                      ₹{cat.amount.toLocaleString('en-IN')}
                    </span>
                    <span className="text-xs font-bold text-gray-500">
                      {cat.percentage}%
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Accessible Table for Screen Readers and Senior Readability */}
        <div className="bg-white border-2 border-gray-200 rounded-3xl p-5 shadow-sm">
          <h3 className="text-sm font-bold text-gray-900 mb-3 flex items-center justify-between">
            <span>{t(lang, 'accessibleTableTitle')}</span>
            <span className="text-[11px] font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded-full border border-purple-200">
              {t(lang, 'demoDataBadge')}
            </span>
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm" aria-label="Monthly Expenses Breakdown Table">
              <thead>
                <tr className="border-b border-gray-200 text-xs font-bold text-gray-500 uppercase">
                  <th className="py-2">{t(lang, 'tableCategoryHeader')}</th>
                  <th className="py-2 text-right">{t(lang, 'tableAmountHeader')}</th>
                  <th className="py-2 text-right">{t(lang, 'tablePercentHeader')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {categoryBreakdown.map(cat => (
                  <tr key={cat.category} className="hover:bg-gray-50">
                    <td className="py-2.5 font-bold text-gray-800">{cat.name}</td>
                    <td className="py-2.5 text-right font-extrabold text-gray-900">
                      ₹{cat.amount.toLocaleString('en-IN')}
                    </td>
                    <td className="py-2.5 text-right font-bold text-blue-600">
                      {cat.percentage}%
                    </td>
                  </tr>
                ))}
                <tr className="border-t-2 border-gray-300 font-extrabold text-gray-950 bg-gray-50">
                  <td className="py-2.5">{t(lang, 'totalSpentMonth')}</td>
                  <td className="py-2.5 text-right text-red-600 font-black">
                    ₹{totalSpent.toLocaleString('en-IN')}
                  </td>
                  <td className="py-2.5 text-right font-black">100%</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
