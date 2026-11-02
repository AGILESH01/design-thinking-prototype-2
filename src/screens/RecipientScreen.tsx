import { useState } from 'react';
import { ArrowLeft, User, Building2, Users, Lightbulb, ShoppingBag, HeartPulse, Film, Search, QrCode } from 'lucide-react';
import type { Screen, Contact, SupportedLanguage } from '../types';
import { mockContacts } from '../data';
import { t } from '../utils/translations';
import { sound } from '../utils/sound';
import { triggerHaptic } from '../utils/deviceSensors';
import VendorQRScannerModal from '../components/VendorQRScannerModal';
import StepGuidanceCard from '../components/StepGuidanceCard';

interface RecipientScreenProps {
  navigate: (screen: Screen) => void;
  onSelect: (contact: Contact) => void;
  lang: SupportedLanguage;
  autoNarrate?: boolean;
  onToggleAutoNarrate?: (enabled: boolean) => void;
}

export default function RecipientScreen({ 
  navigate, 
  onSelect, 
  lang,
  autoNarrate,
  onToggleAutoNarrate,
}: RecipientScreenProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [isCameraScannerOpen, setIsCameraScannerOpen] = useState(false);

  const getIcon = (iconName: string) => {
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

  const filteredContacts = mockContacts.filter(c =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.upiId.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
          {t(lang, 'sendingTo')}
        </h1>
      </div>

      <div className="p-5 flex-1 overflow-y-auto">
        {/* Step 1 of 4 Senior Guidance & What Happens Next */}
        <StepGuidanceCard
          stepNumber={1}
          stepId="recipient"
          lang={lang}
          autoNarrate={autoNarrate}
          onToggleAutoNarrate={onToggleAutoNarrate}
        />

        {/* Search */}
        <div className="relative mb-4">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={22} />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search name, phone or UPI ID..."
            className="w-full pl-12 pr-4 py-3.5 bg-gray-100 border border-gray-200 rounded-2xl text-base font-medium text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Scan QR Button (Activates Hardware Camera Sensor) */}
        <button
          onClick={() => {
            sound.playKeyClick();
            triggerHaptic(30);
            setIsCameraScannerOpen(true);
          }}
          className="w-full flex items-center justify-center gap-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-2xl p-4 mb-6 font-extrabold text-base shadow-md hover:from-blue-700 hover:to-indigo-700 transition-all active:scale-[0.98]"
        >
          <QrCode size={22} />
          <span>Open Device Camera Scanner</span>
        </button>

        {/* Contacts */}
        <h2 className="text-sm font-extrabold text-gray-700 uppercase tracking-wider mb-3">
          Saved Contacts & Regular Bills
        </h2>
        <div className="space-y-3">
          {filteredContacts.map((contact) => {
            const IconComponent = getIcon(contact.iconName);
            return (
              <button
                key={contact.id}
                onClick={() => {
                  sound.playKeyClick();
                  triggerHaptic(20);
                  onSelect(contact);
                }}
                className="w-full flex items-center justify-between p-3.5 bg-white border-2 border-gray-100 rounded-2xl shadow-xs hover:border-blue-300 transition-colors text-left active:scale-[0.99]"
              >
                <div className="flex items-center gap-3.5 flex-1 min-w-0">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center border-2 border-transparent flex-shrink-0 ${contact.bg}`}>
                    <IconComponent size={24} className={contact.color} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="text-base font-bold text-gray-900 truncate">
                      {contact.name}
                    </h3>
                    <p className="text-xs font-semibold text-gray-500 truncate mt-0.5">
                      {contact.upiId}
                    </p>
                  </div>
                </div>
                <div className="text-xs font-bold text-gray-600 bg-gray-100 px-2.5 py-1 rounded-full border border-gray-200 flex-shrink-0 ml-2">
                  {contact.type}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Hardware Vendor QR Camera Scanner Modal with Voice Guidance & Safety Awareness */}
      <VendorQRScannerModal
        isOpen={isCameraScannerOpen}
        onClose={() => setIsCameraScannerOpen(false)}
        onScanSuccess={(contact) => {
          setIsCameraScannerOpen(false);
          onSelect(contact);
        }}
        lang={lang}
        autoNarrate={autoNarrate}
      />
    </div>
  );
}
