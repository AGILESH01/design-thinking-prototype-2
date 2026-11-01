import { useState } from 'react';
import type { Screen, Transaction, Contact, PaymentDetails, SupportedLanguage, AppConfig } from './types';
import { mockContacts, initialTransactions } from './data';
import { DEFAULT_HIGH_AMOUNT_THRESHOLD, DEFAULT_MAX_TRANSACTION_LIMIT } from './utils/formatters';
import { t } from './utils/translations';

import HomeScreen from './screens/HomeScreen';
import PayScreen from './screens/PayScreen';
import RecipientScreen from './screens/RecipientScreen';
import ReviewScreen from './screens/ReviewScreen';
import PinScreen from './screens/PinScreen';
import ConfirmScreen from './screens/ConfirmScreen';
import HistoryScreen from './screens/HistoryScreen';
import HelpScreen from './screens/HelpScreen';
import ProfileScreen from './screens/ProfileScreen';
import ReceiveScreen from './screens/ReceiveScreen';
import SafetyScreen from './screens/SafetyScreen';
import ReceiptScreen from './screens/ReceiptScreen';
import MonthlyExpenseScreen from './screens/MonthlyExpenseScreen';
import LanguageScreen from './screens/LanguageScreen';
import BottomNav from './components/BottomNav';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('home');
  const [isPracticeMode, setIsPracticeMode] = useState(false);

  // Feature 2: Language Preference (Persisted in localStorage)
  const [lang, setLang] = useState<SupportedLanguage>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('upi_proto_lang') as SupportedLanguage;
      if (saved && ['en', 'hi', 'kn', 'ta'].includes(saved)) {
        return saved;
      }
    }
    return 'en';
  });

  // Feature 4: Protected Balance (Hidden by default)
  const [isBalanceVisible, setIsBalanceVisible] = useState(false);
  const [balance, setBalance] = useState(2560);

  // App Configurations (Configurable Limits & Audio Preference)
  const [config, setConfig] = useState<AppConfig>({
    highAmountThreshold: DEFAULT_HIGH_AMOUNT_THRESHOLD,
    maxTransactionLimit: DEFAULT_MAX_TRANSACTION_LIMIT,
    soundEnabled: true,
  });

  // All Transactions (Synchronized with History & Monthly Infographics)
  const [transactions, setTransactions] = useState<Transaction[]>(initialTransactions);
  const [selectedContact, setSelectedContact] = useState<Contact>(mockContacts[0]);

  // Payment Draft State
  const [draftAmount, setDraftAmount] = useState<number>(500);
  const [draftMessage, setDraftMessage] = useState<string>('For family support');
  const [draftMethod, setDraftMethod] = useState<string>('upi');

  // Completed Payment Details for Result & Receipt
  const [lastPayment, setLastPayment] = useState<PaymentDetails | null>(null);

  // Feature 4: Automatic Privacy Protection
  // Whenever the user navigates away from the balance/home screen, hide the balance
  const navigate = (screen: Screen) => {
    if (screen !== 'home') {
      setIsBalanceVisible(false);
    }
    setCurrentScreen(screen);
  };

  const handleLanguageChange = (newLang: SupportedLanguage) => {
    setLang(newLang);
    if (typeof window !== 'undefined') {
      localStorage.setItem('upi_proto_lang', newLang);
    }
  };

  const handleSelectContact = (contact: Contact) => {
    setSelectedContact(contact);
    navigate('pay');
  };

  const handleProceedToReview = (amount: number, message: string, method: string) => {
    setDraftAmount(amount);
    setDraftMessage(message);
    setDraftMethod(method);
    navigate('review');
  };

  const handleProceedToPin = () => {
    navigate('pin');
  };

  // Payment Authorization Completion
  const handleAuthorizeSuccess = () => {
    const nextBalance = isPracticeMode ? balance : balance - draftAmount;

    if (!isPracticeMode) {
      // Decrease balance exactly once
      setBalance(nextBalance);

      const contactCategory = selectedContact.category || 'Other Expenses';
      const now = new Date();
      const dateStr = 'Today, ' + now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

      // Add to transaction history
      const newTx: Transaction = {
        id: 'tx-' + Date.now(),
        name: selectedContact.name,
        type: 'UPI Payment',
        date: dateStr,
        timestamp: now.getTime(),
        amount: draftAmount,
        isReceived: false,
        status: 'Completed',
        category: contactCategory,
        iconName: selectedContact.iconName,
        color: selectedContact.color,
        bg: selectedContact.bg,
      };

      setTransactions((prev) => [newTx, ...prev]);
    }

    const txId = 'T' + Math.floor(100000000 + Math.random() * 900000000);
    const dateStr = 'Today, ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    setLastPayment({
      name: selectedContact.name,
      upiId: selectedContact.upiId,
      amount: draftAmount,
      message: draftMessage,
      method: draftMethod,
      date: dateStr,
      transactionId: txId,
      remainingBalance: nextBalance,
      category: selectedContact.category || 'Other Expenses',
    });

    navigate('confirm');
  };

  // Show BottomNav on primary root tabs
  const showBottomNav =
    currentScreen === 'home' ||
    currentScreen === 'history' ||
    currentScreen === 'help' ||
    currentScreen === 'recipient' ||
    currentScreen === 'monthly';

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-200">
      {/* Mobile Frame Container */}
      <div className="w-full max-w-[420px] h-[100dvh] sm:h-[820px] sm:rounded-[40px] bg-white overflow-hidden shadow-2xl relative flex flex-col border-[8px] border-gray-900">
        
        {/* Practice Mode Banner */}
        {isPracticeMode && (
          <div className="bg-purple-100 text-purple-950 text-center text-xs font-bold py-2 px-4 shadow-sm z-30 border-b border-purple-200 flex justify-between items-center">
            <span>{t(lang, 'practiceModeBanner')}</span>
            <button
              onClick={() => setIsPracticeMode(false)}
              className="text-purple-700 font-black underline text-xs ml-2 cursor-pointer hover:text-purple-900"
            >
              {t(lang, 'exitPractice')}
            </button>
          </div>
        )}

        {/* Screen Routing */}
        <div className={`flex-1 overflow-y-auto overflow-x-hidden relative ${showBottomNav ? 'pb-16' : ''}`}>
          {currentScreen === 'home' && (
            <HomeScreen
              navigate={navigate}
              balance={balance}
              transactions={transactions}
              lang={lang}
              onQuickPay={handleSelectContact}
              isBalanceVisible={isBalanceVisible}
              setIsBalanceVisible={setIsBalanceVisible}
              soundEnabled={config.soundEnabled}
              setSoundEnabled={(enabled) => setConfig((prev) => ({ ...prev, soundEnabled: enabled }))}
            />
          )}

          {currentScreen === 'recipient' && (
            <RecipientScreen
              navigate={navigate}
              onSelect={handleSelectContact}
              lang={lang}
            />
          )}

          {currentScreen === 'pay' && (
            <PayScreen
              navigate={navigate}
              contact={selectedContact}
              balance={balance}
              lang={lang}
              maxLimit={config.maxTransactionLimit}
              initialAmount={draftAmount.toString()}
              initialMessage={draftMessage}
              initialMethod={draftMethod}
              onProceedToReview={handleProceedToReview}
            />
          )}

          {currentScreen === 'review' && (
            <ReviewScreen
              navigate={navigate}
              contact={selectedContact}
              amount={draftAmount}
              message={draftMessage}
              method={draftMethod}
              balance={balance}
              lang={lang}
              highAmountThreshold={config.highAmountThreshold}
              transactions={transactions}
              onProceedToPin={handleProceedToPin}
            />
          )}

          {currentScreen === 'pin' && (
            <PinScreen
              navigate={navigate}
              contact={selectedContact}
              amount={draftAmount}
              message={draftMessage}
              method={draftMethod}
              lang={lang}
              onAuthorize={handleAuthorizeSuccess}
            />
          )}

          {currentScreen === 'confirm' && (
            <ConfirmScreen
              navigate={navigate}
              paymentDetails={lastPayment}
              contact={selectedContact}
              lang={lang}
            />
          )}

          {currentScreen === 'receipt' && (
            <ReceiptScreen
              navigate={navigate}
              paymentDetails={lastPayment}
              contact={selectedContact}
              lang={lang}
            />
          )}

          {currentScreen === 'history' && (
            <HistoryScreen
              navigate={navigate}
              transactions={transactions}
              lang={lang}
            />
          )}

          {currentScreen === 'monthly' && (
            <MonthlyExpenseScreen
              navigate={navigate}
              transactions={transactions}
              lang={lang}
            />
          )}

          {currentScreen === 'language' && (
            <LanguageScreen
              navigate={navigate}
              currentLang={lang}
              onSelectLanguage={handleLanguageChange}
            />
          )}

          {currentScreen === 'profile' && (
            <ProfileScreen
              navigate={navigate}
              lang={lang}
              config={config}
              setConfig={setConfig}
            />
          )}

          {currentScreen === 'receive' && (
            <ReceiveScreen
              navigate={navigate}
              lang={lang}
            />
          )}

          {currentScreen === 'safety' && (
            <SafetyScreen
              navigate={navigate}
              lang={lang}
            />
          )}

          {currentScreen === 'help' && (
            <HelpScreen
              navigate={navigate}
              lang={lang}
              onStartPractice={() => {
                setIsPracticeMode(true);
                navigate('home');
              }}
            />
          )}
        </div>

        {/* Global Bottom Navigation */}
        {showBottomNav && (
          <div className="absolute bottom-0 w-full z-20">
            <BottomNav current={currentScreen} navigate={navigate} lang={lang} />
          </div>
        )}
      </div>
    </div>
  );
}
