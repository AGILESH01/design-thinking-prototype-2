import { useState } from 'react';
import { 
  ArrowLeft, 
  ArrowUpRight, 
  ArrowDownLeft, 
  User, 
  Building2, 
  Users, 
  Lightbulb, 
  ShoppingBag, 
  HeartPulse, 
  Film,
  Clock, 
  AlertCircle, 
  CheckCircle2 
} from 'lucide-react';
import type { Screen, Transaction, SupportedLanguage } from '../types';
import { t, getStatusTranslation } from '../utils/translations';
import { sound } from '../utils/sound';

interface HistoryScreenProps {
  navigate: (screen: Screen) => void;
  transactions: Transaction[];
  lang: SupportedLanguage;
}

type Filter = 'All' | 'Sent' | 'Received';

export default function HistoryScreen({ navigate, transactions, lang }: HistoryScreenProps) {
  const [filter, setFilter] = useState<Filter>('All');

  const getContactIcon = (iconName: string) => {
    switch (iconName) {
      case 'Building2': return Building2;
      case 'Users': return Users;
      case 'Lightbulb': return Lightbulb;
      case 'ShoppingBag': return ShoppingBag;
      case 'HeartPulse': return HeartPulse;
      case 'Film': return Film;
      default: return User;
    }
  };

  const filteredTransactions = transactions.filter(tx => {
    if (filter === 'All') return true;
    if (filter === 'Received') return tx.isReceived;
    if (filter === 'Sent') return !tx.isReceived;
    return true;
  });

  const getStatusBadge = (status: Transaction['status']) => {
    switch (status) {
      case 'Pending':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-extrabold text-amber-900 bg-amber-100 border border-amber-300 px-2 py-0.5 rounded-md">
            <Clock size={12} />
            {getStatusTranslation(lang, 'Pending')}
          </span>
        );
      case 'Failed':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-extrabold text-red-900 bg-red-100 border border-red-300 px-2 py-0.5 rounded-md">
            <AlertCircle size={12} />
            {getStatusTranslation(lang, 'Failed')}
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-extrabold text-green-900 bg-green-100 border border-green-300 px-2 py-0.5 rounded-md">
            <CheckCircle2 size={12} />
            {getStatusTranslation(lang, 'Completed')}
          </span>
        );
    }
  };

  return (
    <div className="flex flex-col min-h-full bg-white pb-20">
      {/* Header */}
      <div className="flex items-center px-4 py-4 border-b border-gray-200 sticky top-0 bg-white z-10">
        <button
          onClick={() => navigate('home')}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          aria-label="Back to home"
        >
          <ArrowLeft size={28} className="text-gray-800" />
        </button>
        <h1 className="text-2xl font-bold text-gray-900 ml-4">
          {t(lang, 'paymentHistoryTitle')}
        </h1>
      </div>

      {/* Filter Tabs (All, Sent, Received) */}
      <div className="flex gap-2.5 px-5 py-3 border-b border-gray-200 bg-gray-50 sticky top-[73px] z-10">
        {(['All', 'Sent', 'Received'] as Filter[]).map((f) => {
          const isActive = filter === f;
          const label = f === 'All'
            ? t(lang, 'filterAll')
            : f === 'Sent'
            ? t(lang, 'filterSent')
            : t(lang, 'filterReceived');

          return (
            <button
              key={f}
              onClick={() => {
                sound.playKeyClick();
                setFilter(f);
              }}
              className={`flex-1 py-2 px-3 rounded-full font-extrabold text-sm shadow-xs transition-all flex items-center justify-center gap-1.5 ${
                isActive
                  ? 'bg-blue-600 text-white ring-2 ring-blue-300'
                  : 'bg-white border-2 border-gray-300 text-gray-700 hover:bg-gray-100'
              }`}
            >
              {f === 'Sent' && <ArrowUpRight size={16} className={isActive ? 'text-white' : 'text-red-600'} />}
              {f === 'Received' && <ArrowDownLeft size={16} className={isActive ? 'text-white' : 'text-green-600'} />}
              <span>{label}</span>
            </button>
          );
        })}
      </div>

      {/* Transactions List */}
      <div className="flex-1 overflow-y-auto px-5 py-4 space-y-3.5">
        {filteredTransactions.length === 0 ? (
          <div className="text-center text-gray-500 py-12 font-semibold">
            {t(lang, 'noTransactionsFound')}
          </div>
        ) : (
          filteredTransactions.map((tx) => {
            const IconComponent = getContactIcon(tx.iconName);
            const isSent = !tx.isReceived;

            return (
              <div
                key={tx.id}
                className={`p-4 bg-white border-2 rounded-2xl shadow-xs transition-all hover:border-gray-400 ${
                  isSent
                    ? 'border-red-100 hover:border-red-300'
                    : 'border-green-100 hover:border-green-300'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  {/* Left: Contact Avatar & Details */}
                  <div className="flex items-center gap-3.5 flex-1 min-w-0">
                    {/* Visual direction indicator icon (never relies on color alone) */}
                    <div className="relative">
                      <div className={`w-13 h-13 rounded-full flex items-center justify-center border-2 border-gray-200 ${tx.bg}`}>
                        <IconComponent size={24} className={tx.color} />
                      </div>
                      <div className={`absolute -bottom-1 -right-1 w-6 h-6 rounded-full flex items-center justify-center text-white shadow-xs border-2 border-white ${
                        isSent ? 'bg-red-600' : 'bg-green-600'
                      }`}>
                        {isSent ? <ArrowUpRight size={14} strokeWidth={3} /> : <ArrowDownLeft size={14} strokeWidth={3} />}
                      </div>
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h3 className="text-base font-bold text-gray-900 truncate">
                          {tx.name}
                        </h3>
                        {/* Direction Badge */}
                        <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full uppercase tracking-wider border ${
                          isSent
                            ? 'bg-red-50 text-red-700 border-red-200'
                            : 'bg-green-50 text-green-700 border-green-200'
                        }`}>
                          {isSent ? t(lang, 'labelSent') : t(lang, 'labelReceived')}
                        </span>
                      </div>

                      <p className="text-xs font-semibold text-gray-500 mt-0.5">
                        {tx.type} • {tx.category}
                      </p>
                      <p className="text-[11px] font-medium text-gray-400 mt-0.5">
                        {tx.date}
                      </p>
                    </div>
                  </div>

                  {/* Right: Amount & Status Badge */}
                  <div className="flex flex-col items-end flex-shrink-0">
                    {/* Colour Differentiated Amount with +/- sign */}
                    <span
                      className={`text-xl font-extrabold tracking-tight ${
                        isSent ? 'text-red-600' : 'text-green-600'
                      }`}
                    >
                      {isSent ? '-' : '+'}₹{tx.amount.toLocaleString('en-IN')}
                    </span>
                    <div className="mt-1.5">
                      {getStatusBadge(tx.status)}
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
