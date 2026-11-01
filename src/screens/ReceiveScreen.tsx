import { useState } from 'react';
import { ArrowLeft, QrCode, Share2, Copy } from 'lucide-react';
import type { Screen, SupportedLanguage } from '../types';
import { t } from '../utils/translations';
import { sound } from '../utils/sound';

interface ReceiveScreenProps {
  navigate: (screen: Screen) => void;
  lang: SupportedLanguage;
}

export default function ReceiveScreen({ navigate, lang }: ReceiveScreenProps) {
  const [isAddingAmount, setIsAddingAmount] = useState(false);
  const [amount, setAmount] = useState('');

  const handleCopy = () => {
    sound.playKeyClick();
    window.alert('UPI ID user@okaxis copied to clipboard!');
  };

  const handleShare = () => {
    sound.playKeyClick();
    window.alert('Opening sharing options for your UPI QR...');
  };

  return (
    <div className="flex flex-col min-h-full bg-white pb-20">
      {/* Header */}
      <div className="flex items-center px-4 py-4 border-b border-gray-200 sticky top-0 bg-white z-10">
        <button
          onClick={() => navigate('home')}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          aria-label="Back"
        >
          <ArrowLeft size={28} className="text-gray-800" />
        </button>
        <h1 className="text-2xl font-bold text-gray-900 ml-4">
          {t(lang, 'receiveMoneyTitle')}
        </h1>
      </div>

      <div className="p-5 flex-1 flex flex-col items-center overflow-y-auto">
        <div className="w-full bg-blue-50 border-2 border-blue-200 rounded-3xl p-6 flex flex-col items-center shadow-xs">
          <h2 className="text-xl font-black text-gray-900 mb-0.5">Senior User</h2>
          <p className="text-xs font-semibold text-gray-500 mb-5">user@okaxis</p>

          <div className="bg-white p-4 rounded-2xl border-4 border-gray-900 shadow-md mb-5 relative">
            {amount && (
              <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-green-600 text-white font-extrabold px-3.5 py-0.5 rounded-full text-sm shadow-sm whitespace-nowrap">
                ₹ {amount}
              </div>
            )}
            <QrCode size={170} className="text-gray-900" strokeWidth={1} />
          </div>

          <p className="text-gray-700 font-semibold text-xs text-center leading-relaxed">
            {t(lang, 'scanQrPrompt')}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="w-full mt-5 space-y-3.5">
          {!isAddingAmount ? (
            <button
              onClick={() => {
                sound.playKeyClick();
                setIsAddingAmount(true);
              }}
              className="w-full py-3.5 border-2 border-blue-300 text-blue-700 rounded-2xl font-extrabold text-base hover:bg-blue-50 transition-colors"
            >
              {t(lang, 'addSpecificAmount')}
            </button>
          ) : (
            <div className="w-full bg-gray-50 border-2 border-gray-200 rounded-2xl p-4 flex flex-col gap-2.5">
              <label className="text-gray-800 font-bold text-xs">
                {t(lang, 'amountToReceive')}
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-2xl font-black text-gray-600">₹</span>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 text-2xl font-black border-2 border-gray-300 rounded-xl focus:border-blue-500 focus:outline-none"
                  placeholder="0"
                />
              </div>
              <button
                onClick={() => {
                  sound.playKeyClick();
                  if (!amount) setIsAddingAmount(false);
                }}
                className="w-full py-3 bg-blue-600 text-white rounded-xl font-bold text-base hover:bg-blue-700 transition-colors mt-1"
              >
                {amount ? t(lang, 'updateQrCode') : t(lang, 'cancel')}
              </button>
            </div>
          )}

          <div className="flex gap-3">
            <button
              onClick={handleCopy}
              className="flex-1 flex items-center justify-center gap-2 py-3.5 bg-gray-100 border border-gray-200 rounded-2xl font-bold text-sm text-gray-800 hover:bg-gray-200 transition-colors"
            >
              <Copy size={18} />
              <span>{t(lang, 'copyUpiId')}</span>
            </button>
            <button
              onClick={handleShare}
              className="flex-1 flex items-center justify-center gap-2 py-3.5 bg-gray-100 border border-gray-200 rounded-2xl font-bold text-sm text-gray-800 hover:bg-gray-200 transition-colors"
            >
              <Share2 size={18} />
              <span>{t(lang, 'shareQr')}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
