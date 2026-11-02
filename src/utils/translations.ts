import type { SupportedLanguage, ExpenseCategory, TransactionStatus } from '../types';

export interface LanguageInfo {
  code: SupportedLanguage;
  name: string;       // e.g. "Hindi"
  nativeName: string; // e.g. "हिन्दी"
  greeting: string;
}

export const SUPPORTED_LANGUAGES: LanguageInfo[] = [
  { code: 'en', name: 'English', nativeName: 'English', greeting: 'Hello' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी', greeting: 'नमस्ते' },
  { code: 'kn', name: 'Kannada', nativeName: 'ಕನ್ನಡ', greeting: 'ನಮಸ್ಕಾರ' },
  { code: 'ta', name: 'Tamil', nativeName: 'தமிழ்', greeting: 'வணக்கம்' },
];

export interface TranslationDictionary {
  // Navigation & Bottom Bar
  navHome: string;
  navPay: string;
  navHistory: string;
  navHelp: string;
  navMonthly: string;

  // Header & Profile
  helloUser: string;
  myProfile: string;
  verifiedSenior: string;
  appSettings: string;
  changeLanguage: string;
  soundEffects: string;
  soundOn: string;
  soundOff: string;
  securitySettings: string;
  bankAccounts: string;
  logout: string;

  // Balance & Biometrics
  yourBalance: string;
  viewBalance: string;
  hideBalance: string;
  balanceHidden: string;
  balanceProtectedTitle: string;
  balanceProtectedDesc: string;
  authenticateToView: string;
  useFingerprintOrFace: string;
  useDemoPin: string;
  simulatedBiometricLabel: string;
  simulatedBiometricNote: string;
  biometricSuccess: string;
  biometricFailed: string;
  tryAgain: string;
  cancel: string;
  autoHideNotice: string;

  // Action Buttons
  actionPay: string;
  actionReceive: string;
  actionHistory: string;
  actionHelp: string;
  actionMonthly: string;

  // Quick Pay & Safety Banner
  quickPay: string;
  seeAll: string;
  staySafeTitle: string;
  staySafeDesc: string;

  // Pay Screen
  enterAmountTitle: string;
  step1Of3: string;
  sendingTo: string;
  verifiedRecipient: string;
  changeRecipient: string;
  availableBalance: string;
  trustSafeBadge: string;
  paymentAmountLabel: string;
  amountInWordsLabel: string;
  quickAmountsLabel: string;
  insufficientBalanceTitle: string;
  insufficientBalanceDesc: string;
  maxLimitExceededTitle: string;
  maxLimitExceededDesc: string;
  minLimitDesc: string;
  balanceCheckPassed: string;
  remainingAfterPay: string;
  noteLabel: string;
  notePlaceholder: string;
  payFromAccount: string;
  reviewPaymentButton: string;
  cannotProceedInsufficient: string;
  cannotProceedLimit: string;

  // High Amount Warning
  highAmountWarningTitle: string;
  highAmountWarningSubtitle: string;
  highAmountWarningDesc: string;
  highAmountWarningActionReview: string;
  highAmountWarningActionContinue: string;
  unusualAlertTitle: string;
  unusualAlertDesc: string;

  // Review Screen
  reviewPaymentTitle: string;
  step2Of3: string;
  trustModeTitle: string;
  trustModeDesc: string;
  totalPaymentAmount: string;
  paymentSummary: string;
  payingFrom: string;
  currentBalance: string;
  amountDeducted: string;
  balanceAfterPayment: string;
  note: string;
  proceedToPin: string;
  backToEdit: string;

  // PIN Authorization Screen
  authorizePaymentTitle: string;
  step3Of3: string;
  paymentAuthorization: string;
  toRecipient: string;
  enterPinPrompt: string;
  showDigits: string;
  hideDigits: string;
  clearKey: string;
  fillDemoPin: string;
  demoPinBadge: string;
  pinSecurityReminder: string;
  pinAuthorizingModalTitle: string;
  pinAuthorizingModalDesc: string;
  pinVerifiedBadge: string;
  errorIncompletePin: string;
  errorIncorrectPin: string;

  // Confirmation & Receipt Screen
  paymentResultTitle: string;
  transactionCompleted: string;
  paymentSuccessful: string;
  toPerson: string;
  transactionId: string;
  paymentMethod: string;
  dateTime: string;
  viewReceipt: string;
  backToHome: string;
  soundPlayedChime: string;
  officialReceiptTitle: string;
  officialReceiptSubtitle: string;
  shareReceipt: string;
  doneButton: string;

  // Transaction History Screen
  paymentHistoryTitle: string;
  filterAll: string;
  filterSent: string;
  filterReceived: string;
  labelSent: string;
  labelReceived: string;
  noTransactionsFound: string;
  statusCompleted: string;
  statusPending: string;
  statusFailed: string;

  // Monthly Spending & Analytics
  monthlyInsightsTitle: string;
  monthlyInsightsSubtitle: string;
  selectMonth: string;
  totalSpentMonth: string;
  totalReceivedMonth: string;
  outgoingCount: string;
  incomingCount: string;
  spendingChartTitle: string;
  tapToInspect: string;
  selectedCategory: string;
  spentAmount: string;
  percentOfTotal: string;
  categoryBreakdownTitle: string;
  monthComparisonTitle: string;
  spentMoreNotice: string;
  spentLessNotice: string;
  spentEqualNotice: string;
  accessibleTableTitle: string;
  tableCategoryHeader: string;
  tableAmountHeader: string;
  tablePercentHeader: string;
  demoDataBadge: string;

  // Categories
  catFood: string;
  catTransport: string;
  catUtilities: string;
  catShopping: string;
  catHealthcare: string;
  catEntertainment: string;
  catOther: string;

  // Receive Screen
  receiveMoneyTitle: string;
  scanQrPrompt: string;
  addSpecificAmount: string;
  amountToReceive: string;
  updateQrCode: string;
  copyUpiId: string;
  shareQr: string;

  // Safety Center Screen
  safetyCenterTitle: string;
  scamWarningTitle: string;
  scamWarningDesc: string;
  tipPinTitle: string;
  tipPinDesc: string;
  tipCallTitle: string;
  tipCallDesc: string;
  tipVerifyTitle: string;
  tipVerifyDesc: string;
  tipReceiveTitle: string;
  tipReceiveDesc: string;
  reportSuspicious: string;

  // Help & Practice Screen
  helpTitle: string;
  searchHelpPlaceholder: string;
  learnPracticeTitle: string;
  learnPracticeDesc: string;
  startPracticeButton: string;
  topicPaymentGuideTitle: string;
  topicPaymentGuideDesc: string;
  topicAppBasicsTitle: string;
  topicAppBasicsDesc: string;
  topicSecurityTitle: string;
  topicSecurityDesc: string;
  topicFaqTitle: string;
  topicFaqDesc: string;
  topicSupportTitle: string;
  topicSupportDesc: string;
  practiceModeBanner: string;
  exitPractice: string;

  // Language Screen
  chooseLanguageTitle: string;
  chooseLanguageSubtitle: string;
  saveLanguage: string;

  // Step-by-Step Guidance & Voice Narration
  stepOfTotal: string;
  whatHappensNext: string;
  noDeductionGuarantee: string;
  pinDeductionGuarantee: string;
  listenGuidance: string;
  stopGuidance: string;
  speakingNow: string;
  autoNarrateToggle: string;
  autoNarrateDesc: string;
  step1Title: string;
  step1Desc: string;
  step1Next: string;
  step2Title: string;
  step2Desc: string;
  step2Next: string;
  step3Title: string;
  step3Desc: string;
  step3Next: string;
  step4Title: string;
  step4Desc: string;
  step4Next: string;
}

export const translations: Record<SupportedLanguage, TranslationDictionary> = {
  en: {
    navHome: 'Home',
    navPay: 'Pay',
    navHistory: 'History',
    navHelp: 'Help',
    navMonthly: 'Monthly',

    helloUser: 'Hello, User',
    myProfile: 'My Profile',
    verifiedSenior: 'Fully Verified Account',
    appSettings: 'Application Settings',
    changeLanguage: 'Change Language',
    soundEffects: 'Payment Chime & Sounds',
    soundOn: 'Sound: On',
    soundOff: 'Sound: Off',
    securitySettings: 'Privacy & Security',
    bankAccounts: 'Linked Bank Accounts',
    logout: 'Log Out',

    yourBalance: 'Your Balance',
    viewBalance: 'View Balance',
    hideBalance: 'Hide Balance',
    balanceHidden: '••••••',
    balanceProtectedTitle: 'Balance Privacy Protection',
    balanceProtectedDesc: 'For your security, your bank balance is kept private until you authenticate.',
    authenticateToView: 'Verify Identity to View Balance',
    useFingerprintOrFace: 'Use Fingerprint / Face ID',
    useDemoPin: 'Or enter Demo PIN (1234)',
    simulatedBiometricLabel: 'Simulated Biometric Check',
    simulatedBiometricNote: 'Touch ID / Fingerprint sensor simulation for prototype testing.',
    biometricSuccess: 'Identity verified successfully!',
    biometricFailed: 'Authentication failed. Please try again or use your PIN.',
    tryAgain: 'Try Again',
    cancel: 'Cancel',
    autoHideNotice: 'Balance auto-hides when you leave this screen.',

    actionPay: 'Pay',
    actionReceive: 'Receive',
    actionHistory: 'History',
    actionHelp: 'Help',
    actionMonthly: 'Monthly',

    quickPay: 'Quick Pay',
    seeAll: 'See all',
    staySafeTitle: 'Stay Safe!',
    staySafeDesc: 'Never share your OTP or UPI PIN with anyone.',

    enterAmountTitle: 'Enter Amount',
    step1Of3: 'Step 1 of 3: Payment Details',
    sendingTo: 'Sending To',
    verifiedRecipient: 'Verified Recipient',
    changeRecipient: 'Change',
    availableBalance: 'Available Balance',
    trustSafeBadge: 'Trust Safe',
    paymentAmountLabel: 'Payment Amount',
    amountInWordsLabel: 'Amount in Words:',
    quickAmountsLabel: 'Quick amounts:',
    insufficientBalanceTitle: 'Insufficient Balance',
    insufficientBalanceDesc: 'You entered ₹{amount}, but your account balance is only ₹{balance}. Please enter a smaller amount.',
    maxLimitExceededTitle: 'Maximum Limit Exceeded',
    maxLimitExceededDesc: 'For senior safety, single transaction limit is ₹{limit}. Please enter ₹{limit} or less.',
    minLimitDesc: 'Minimum payment amount is ₹1.',
    balanceCheckPassed: '✓ Balance Check Passed',
    remainingAfterPay: 'remaining balance',
    noteLabel: 'Add a note / message (optional)',
    notePlaceholder: 'e.g. Milk, Groceries, Rent...',
    payFromAccount: 'Pay From Account',
    reviewPaymentButton: 'Review Payment',
    cannotProceedInsufficient: 'Cannot Proceed: Insufficient Balance',
    cannotProceedLimit: 'Cannot Proceed: Limit Exceeded',

    highAmountWarningTitle: 'Please check this amount carefully',
    highAmountWarningSubtitle: 'You are about to send ₹{amount}',
    highAmountWarningDesc: 'This is a relatively large payment. Please verify the recipient and amount before continuing.',
    highAmountWarningActionReview: 'Review Payment',
    highAmountWarningActionContinue: 'Continue',
    unusualAlertTitle: 'Unusual Spending Notice',
    unusualAlertDesc: 'This payment (₹{amount}) is higher than your usual transactions (average ₹{avg}). Please double-check.',

    reviewPaymentTitle: 'Review Payment',
    step2Of3: 'Step 2 of 3: Double Check Details',
    trustModeTitle: 'Trust Mode Verification',
    trustModeDesc: 'Take your time to verify the recipient and amount. No money is deducted until you enter your UPI PIN.',
    totalPaymentAmount: 'Total Payment Amount',
    paymentSummary: 'Payment Summary',
    payingFrom: 'Paying from',
    currentBalance: 'Current Balance',
    amountDeducted: 'Amount Deducted',
    balanceAfterPayment: 'Balance After Payment',
    note: 'Note',
    proceedToPin: 'Proceed to Enter PIN',
    backToEdit: 'Back to Edit Details',

    authorizePaymentTitle: 'Authorize Payment',
    step3Of3: 'Step 3 of 3: Enter UPI PIN',
    paymentAuthorization: 'Payment Authorization',
    toRecipient: 'to {name}',
    enterPinPrompt: 'Enter 4-Digit UPI PIN',
    showDigits: 'Show Digits',
    hideDigits: 'Hide Digits',
    clearKey: 'CLEAR',
    fillDemoPin: 'Fill PIN',
    demoPinBadge: 'Demo PIN:',
    pinSecurityReminder: 'Security Reminder: UPI PIN is strictly for sending money. Never enter PIN when receiving funds.',
    pinAuthorizingModalTitle: 'Authorizing Payment',
    pinAuthorizingModalDesc: 'Connecting securely to bank... Please do not close or press back.',
    pinVerifiedBadge: 'PIN Verified Securely',
    errorIncompletePin: 'Please enter all 4 digits of your UPI PIN.',
    errorIncorrectPin: 'Incorrect PIN. Please enter the demo PIN: 1234',

    paymentResultTitle: 'Payment Result',
    transactionCompleted: 'Transaction Completed',
    paymentSuccessful: 'Payment Successful!',
    toPerson: 'to {name}',
    transactionId: 'Transaction ID',
    paymentMethod: 'Payment Method',
    dateTime: 'Date & Time',
    viewReceipt: 'View Receipt',
    backToHome: 'Back to Home',
    soundPlayedChime: 'Payment confirmation chime played',
    officialReceiptTitle: 'Payment Receipt',
    officialReceiptSubtitle: 'Official Proof of Transaction',
    shareReceipt: 'Share Receipt',
    doneButton: 'Done',

    paymentHistoryTitle: 'Payment History',
    filterAll: 'All',
    filterSent: 'Sent',
    filterReceived: 'Received',
    labelSent: 'Sent',
    labelReceived: 'Received',
    noTransactionsFound: 'No transactions found.',
    statusCompleted: 'Completed',
    statusPending: 'Pending',
    statusFailed: 'Failed',

    monthlyInsightsTitle: 'Monthly Expenses',
    monthlyInsightsSubtitle: 'Visual spending analysis & budget tracking',
    selectMonth: 'Select Month',
    totalSpentMonth: 'Total Money Spent',
    totalReceivedMonth: 'Total Money Received',
    outgoingCount: 'Payments Sent',
    incomingCount: 'Payments Received',
    spendingChartTitle: 'Spending by Category',
    tapToInspect: 'Tap any segment to inspect category details',
    selectedCategory: 'Selected Category',
    spentAmount: 'Spent',
    percentOfTotal: 'of total monthly expenses',
    categoryBreakdownTitle: 'Category Breakdown',
    monthComparisonTitle: 'Monthly Comparison',
    spentMoreNotice: 'You spent ₹{diff} more this month compared with last month ({pct}% increase).',
    spentLessNotice: 'You spent ₹{diff} less this month compared with last month ({pct}% decrease).',
    spentEqualNotice: 'Your spending was the same as last month.',
    accessibleTableTitle: 'Accessible Category Table',
    tableCategoryHeader: 'Category',
    tableAmountHeader: 'Amount (₹)',
    tablePercentHeader: 'Percentage',
    demoDataBadge: 'Demo Data',

    catFood: 'Food & Groceries',
    catTransport: 'Transportation',
    catUtilities: 'Utilities & Bills',
    catShopping: 'Shopping',
    catHealthcare: 'Healthcare',
    catEntertainment: 'Entertainment',
    catOther: 'Other Expenses',

    receiveMoneyTitle: 'Receive Money',
    scanQrPrompt: 'Scan this QR code from any app to send money.',
    addSpecificAmount: 'Add specific amount',
    amountToReceive: 'Amount to receive:',
    updateQrCode: 'Update QR Code',
    copyUpiId: 'Copy ID',
    shareQr: 'Share QR',

    safetyCenterTitle: 'Safety Center',
    scamWarningTitle: 'Stay Safe from Scams',
    scamWarningDesc: 'Your security is our top priority. Please follow these simple rules to keep your money safe.',
    tipPinTitle: 'Keep your PIN secret',
    tipPinDesc: 'Never share your UPI PIN or OTP with anyone. Bank officials will never ask for it.',
    tipCallTitle: 'Beware of unknown callers',
    tipCallDesc: 'If someone asks you to install an app or claims you won money, hang up immediately.',
    tipVerifyTitle: 'Check before paying',
    tipVerifyDesc: 'Always double-check the recipient name and amount before entering your PIN.',
    tipReceiveTitle: 'Receiving is PIN-free',
    tipReceiveDesc: 'You NEVER need to enter your UPI PIN to receive money. Only to send.',
    reportSuspicious: 'Report Suspicious Activity',

    helpTitle: 'Help & Learning',
    searchHelpPlaceholder: 'Search for help...',
    learnPracticeTitle: '1. Learn & Practice',
    learnPracticeDesc: 'Try a practice payment with virtual money. Safe & risk-free.',
    startPracticeButton: 'Start Practice Mode',
    topicPaymentGuideTitle: 'How to make a payment',
    topicPaymentGuideDesc: 'Step-by-step guide with large fonts and simple instructions.',
    topicAppBasicsTitle: 'UPI & App Basics',
    topicAppBasicsDesc: 'Learn about UPI, screen icons, and navigation buttons.',
    topicSecurityTitle: 'Security Tips',
    topicSecurityDesc: 'Stay safe from fraud, scams, and wrongful transfers.',
    topicFaqTitle: 'Common Questions',
    topicFaqDesc: 'Clear answers to frequently asked questions for seniors.',
    topicSupportTitle: 'Contact Support',
    topicSupportDesc: 'Talk to a helpful representative or visit your local branch.',
    practiceModeBanner: '🎓 Practice Mode — No real money transferred',
    exitPractice: 'Exit',

    chooseLanguageTitle: 'Choose Your Language',
    chooseLanguageSubtitle: 'Select the language you feel most comfortable reading.',
    saveLanguage: 'Apply Language',

    // Step-by-Step Guidance & Voice Narration
    stepOfTotal: 'Step {current} of {total}',
    whatHappensNext: 'What Happens Next?',
    noDeductionGuarantee: 'No money is deducted at this step. You can safely go back or cancel.',
    pinDeductionGuarantee: 'Money is transferred only after you enter your 4-digit PIN.',
    listenGuidance: 'Listen to Voice Guidance',
    stopGuidance: 'Stop Voice Guidance',
    speakingNow: 'Speaking explanation...',
    autoNarrateToggle: 'Read steps aloud automatically',
    autoNarrateDesc: 'Speaks instructions and next steps whenever you open a screen',
    step1Title: 'Choose Recipient',
    step1Desc: 'Pick a contact or scan a QR code using device camera.',
    step1Next: 'Next: You will enter the amount. No money deducted yet.',
    step2Title: 'Enter Amount',
    step2Desc: 'Type the rupees you wish to send or choose a quick amount.',
    step2Next: 'Next: You will review recipient details and safety checks.',
    step3Title: 'Review Payment',
    step3Desc: 'Check the recipient name, amount in words, and balance.',
    step3Next: 'Next: You will enter your 4-digit secret UPI PIN.',
    step4Title: 'Enter Secret PIN',
    step4Desc: 'Enter your 4-digit secret UPI PIN on the secure numeric keypad.',
    step4Next: 'Next: Bank authorizes payment and shows official receipt with audio chime.',
  },

  hi: {
    navHome: 'होम',
    navPay: 'भुगतान',
    navHistory: 'इतिहास',
    navHelp: 'मदद',
    navMonthly: 'मासिक खर्च',

    helloUser: 'नमस्ते, उपयोगकर्ता',
    myProfile: 'मेरी प्रोफाइल',
    verifiedSenior: 'सत्यापित खाता',
    appSettings: 'ऐप सेटिंग्स',
    changeLanguage: 'भाषा बदलें (Change Language)',
    soundEffects: 'भुगतान ध्वनि (Chime)',
    soundOn: 'ध्वनि: चालू',
    soundOff: 'ध्वनि: बंद',
    securitySettings: 'सुरक्षा और गोपनीयता',
    bankAccounts: 'जुड़े हुए बैंक खाते',
    logout: 'लॉग आउट',

    yourBalance: 'आपका बैलेंस',
    viewBalance: 'बैलेंस देखें',
    hideBalance: 'बैलेंस छुपाएं',
    balanceHidden: '••••••',
    balanceProtectedTitle: 'बैलेंस सुरक्षा',
    balanceProtectedDesc: 'आपकी सुरक्षा के लिए, प्रमाणीकरण के बिना बैलेंस छुपाया गया है।',
    authenticateToView: 'बैलेंस देखने के लिए पुष्टि करें',
    useFingerprintOrFace: 'फिंगरप्रिंट या फेस आईडी का उपयोग करें',
    useDemoPin: 'या डेमो पिन (1234) दर्ज करें',
    simulatedBiometricLabel: 'सिम्युलेटेड बायोमेट्रिक जांच',
    simulatedBiometricNote: 'प्रोटोटाइप परीक्षण के लिए फिंगरप्रिंट सेंसर सिमुलेशन।',
    biometricSuccess: 'पहचान सत्यापित हो गई!',
    biometricFailed: 'सत्यापन विफल रहा। कृपया पुनः प्रयास करें या पिन का उपयोग करें।',
    tryAgain: 'पुनः प्रयास करें',
    cancel: 'रद्द करें',
    autoHideNotice: 'स्क्रीन छोड़ने पर बैलेंस स्वतः छुप जाता है।',

    actionPay: 'पैसे भेजें',
    actionReceive: 'पैसे पाएं',
    actionHistory: 'इतिहास',
    actionHelp: 'मदद',
    actionMonthly: 'मासिक',

    quickPay: 'त्वरित भुगतान',
    seeAll: 'सभी देखें',
    staySafeTitle: 'सुरक्षित रहें!',
    staySafeDesc: 'अपना ओटीपी या यूपीआई पिन कभी किसी के साथ साझा न करें।',

    enterAmountTitle: 'रकम दर्ज करें',
    step1Of3: 'चरण 1/3: भुगतान विवरण',
    sendingTo: 'इन्हें भेज रहे हैं',
    verifiedRecipient: 'सत्यापित प्राप्तकर्ता',
    changeRecipient: 'बदलें',
    availableBalance: 'उपलब्ध बैलेंस',
    trustSafeBadge: 'सुरक्षित',
    paymentAmountLabel: 'भुगतान राशि',
    amountInWordsLabel: 'शब्दों में राशि:',
    quickAmountsLabel: 'त्वरित विकल्प:',
    insufficientBalanceTitle: 'अपर्याप्त बैलेंस',
    insufficientBalanceDesc: 'आपने ₹{amount} दर्ज किया है, लेकिन आपका बैलेंस केवल ₹{balance} है। कृपया कम राशि दर्ज करें।',
    maxLimitExceededTitle: 'अधिकतम सीमा पार',
    maxLimitExceededDesc: 'वरिष्ठों की सुरक्षा के लिए एकल सीमा ₹{limit} है। कृपया ₹{limit} या उससे कम दर्ज करें।',
    minLimitDesc: 'न्यूनतम भुगतान राशि ₹1 है।',
    balanceCheckPassed: '✓ बैलेंस जांच सफल',
    remainingAfterPay: 'शेष बैलेंस रहेगा',
    noteLabel: 'संदेश / नोट जोड़ें (वैकल्पिक)',
    notePlaceholder: 'उदा. दूध, राशन, किराया...',
    payFromAccount: 'इस खाते से भुगतान करें',
    reviewPaymentButton: 'भुगतान की समीक्षा करें',
    cannotProceedInsufficient: 'आगे नहीं बढ़ सकते: अपर्याप्त बैलेंस',
    cannotProceedLimit: 'आगे नहीं बढ़ सकते: सीमा पार',

    highAmountWarningTitle: 'कृपया इस राशि को ध्यान से जांचें',
    highAmountWarningSubtitle: 'आप ₹{amount} भेजने वाले हैं',
    highAmountWarningDesc: 'यह अपेक्षाकृत बड़ी रकम है। आगे बढ़ने से पहले कृपया प्राप्तकर्ता और राशि की दोबारा जांच कर लें।',
    highAmountWarningActionReview: 'भुगतान समीक्षा करें',
    highAmountWarningActionContinue: 'आगे बढ़ें',
    unusualAlertTitle: 'असामान्य खर्च की सूचना',
    unusualAlertDesc: 'यह भुगतान (₹{amount}) आपके सामान्य औसत (₹{avg}) से काफी अधिक है। कृपया पुष्टि करें।',

    reviewPaymentTitle: 'भुगतान समीक्षा',
    step2Of3: 'चरण 2/3: विवरण की दोबारा जांच',
    trustModeTitle: 'सुरक्षित सत्यापन मोड',
    trustModeDesc: 'प्राप्तकर्ता और राशि की शांति से जांच करें। जब तक आप यूपीआई पिन नहीं डालते, कोई पैसा नहीं कटेगा।',
    totalPaymentAmount: 'कुल भुगतान राशि',
    paymentSummary: 'भुगतान सारांश',
    payingFrom: 'भुगतान स्रोत',
    currentBalance: 'वर्तमान बैलेंस',
    amountDeducted: 'कटने वाली राशि',
    balanceAfterPayment: 'भुगतान के बाद बैलेंस',
    note: 'नोट',
    proceedToPin: 'पिन दर्ज करने के लिए आगे बढ़ें',
    backToEdit: 'विवरण बदलने के लिए वापस जाएं',

    authorizePaymentTitle: 'भुगतान अधिकृत करें',
    step3Of3: 'चरण 3/3: यूपीआई पिन दर्ज करें',
    paymentAuthorization: 'भुगतान प्रमाणीकरण',
    toRecipient: '{name} को',
    enterPinPrompt: '4-अंकों का यूपीआई पिन दर्ज करें',
    showDigits: 'पिन दिखाएं',
    hideDigits: 'पिन छुपाएं',
    clearKey: 'साफ़ करें',
    fillDemoPin: 'पिन भरें',
    demoPinBadge: 'डेमो पिन:',
    pinSecurityReminder: 'सुरक्षा नियम: यूपीआई पिन केवल पैसे भेजने के लिए होता है। पैसे प्राप्त करते समय कभी पिन न डालें।',
    pinAuthorizingModalTitle: 'भुगतान अधिकृत हो रहा है',
    pinAuthorizingModalDesc: 'बैंक से सुरक्षित संपर्क हो रहा है... कृपया बंद न करें।',
    pinVerifiedBadge: 'पिन सुरक्षित रूप से सत्यापित',
    errorIncompletePin: 'कृपया अपने यूपीआई पिन के सभी 4 अंक दर्ज करें।',
    errorIncorrectPin: 'गलत पिन। कृपया डेमो पिन 1234 दर्ज करें।',

    paymentResultTitle: 'भुगतान परिणाम',
    transactionCompleted: 'लेन-देन पूरा हुआ',
    paymentSuccessful: 'भुगतान सफल रहा!',
    toPerson: '{name} को सफलतापूर्वक भेजा गया',
    transactionId: 'लेन-देन आईडी (Transaction ID)',
    paymentMethod: 'भुगतान माध्यम',
    dateTime: 'तारीख और समय',
    viewReceipt: 'रसीद देखें',
    backToHome: 'होम पर वापस जाएं',
    soundPlayedChime: 'भुगतान सफलता ध्वनि बजाई गई',
    officialReceiptTitle: 'भुगतान रसीद',
    officialReceiptSubtitle: 'लेन-देन का आधिकारिक प्रमाण',
    shareReceipt: 'रसीद साझा करें',
    doneButton: 'संपन्न',

    paymentHistoryTitle: 'लेन-देन इतिहास',
    filterAll: 'सभी',
    filterSent: 'भेजे गए (Sent)',
    filterReceived: 'प्राप्त हुए (Received)',
    labelSent: 'भेजे गए',
    labelReceived: 'प्राप्त हुए',
    noTransactionsFound: 'कोई लेन-देन नहीं मिला।',
    statusCompleted: 'सफल',
    statusPending: 'लंबित',
    statusFailed: 'विफल',

    monthlyInsightsTitle: 'मासिक खर्च विश्लेषण',
    monthlyInsightsSubtitle: 'खर्च का दृश्य विश्लेषण और बजट प्रबंधन',
    selectMonth: 'महीना चुनें',
    totalSpentMonth: 'कुल खर्च किया गया धन',
    totalReceivedMonth: 'कुल प्राप्त किया गया धन',
    outgoingCount: 'भेजे गए भुगतान',
    incomingCount: 'प्राप्त हुए भुगतान',
    spendingChartTitle: 'श्रेणी के अनुसार खर्च',
    tapToInspect: 'विवरण देखने के लिए किसी भी भाग को स्पर्श करें',
    selectedCategory: 'चयनित श्रेणी',
    spentAmount: 'खर्च राशि',
    percentOfTotal: 'कुल मासिक खर्च का',
    categoryBreakdownTitle: 'श्रेणी-वार विवरण',
    monthComparisonTitle: 'मासिक तुलना',
    spentMoreNotice: 'आपने पिछले महीने की तुलना में इस महीने ₹{diff} अधिक खर्च किए ({pct}% वृद्धि)।',
    spentLessNotice: 'आपने पिछले महीने की तुलना में इस महीने ₹{diff} कम खर्च किए ({pct}% बचत)।',
    spentEqualNotice: 'आपका खर्च पिछले महीने के बराबर रहा।',
    accessibleTableTitle: 'सुलभ श्रेणी तालिका',
    tableCategoryHeader: 'श्रेणी',
    tableAmountHeader: 'राशि (₹)',
    tablePercentHeader: 'प्रतिशत',
    demoDataBadge: 'डेमो डेटा',

    catFood: 'भोजन और राशन',
    catTransport: 'यात्रा और परिवहन',
    catUtilities: 'बिल और उपयोगिताएं',
    catShopping: 'खरीदारी',
    catHealthcare: 'स्वास्थ्य और दवाएं',
    catEntertainment: 'मनोरंजन',
    catOther: 'अन्य खर्च',

    receiveMoneyTitle: 'पैसे प्राप्त करें',
    scanQrPrompt: 'पैसे भेजने के लिए किसी भी ऐप से इस क्यूआर को स्कैन करें।',
    addSpecificAmount: 'निश्चित राशि जोड़ें',
    amountToReceive: 'प्राप्त करने योग्य राशि:',
    updateQrCode: 'क्यूआर कोड अपडेट करें',
    copyUpiId: 'यूपीआई आईडी कॉपी करें',
    shareQr: 'क्यूआर साझा करें',

    safetyCenterTitle: 'सुरक्षा केंद्र',
    scamWarningTitle: 'धोखाधड़ी से सावधान रहें',
    scamWarningDesc: 'आपकी सुरक्षा हमारी सर्वोच्च प्राथमिकता है। अपने पैसे को सुरक्षित रखने के लिए इन नियमों का पालन करें।',
    tipPinTitle: 'अपना पिन गोपनीय रखें',
    tipPinDesc: 'अपना यूपीआई पिन या ओटीपी किसी के साथ साझा न करें। बैंक अधिकारी कभी यह नहीं मांगते।',
    tipCallTitle: 'अज्ञात फोन कॉल्स से सावधान',
    tipCallDesc: 'यदि कोई ऐप डाउनलोड करने या लॉटरी जीतने की बात कहे, तो तुरंत फोन काट दें।',
    tipVerifyTitle: 'पिन डालने से पहले जांचें',
    tipVerifyDesc: 'पिन डालने से पहले हमेशा प्राप्तकर्ता का नाम और राशि दो बार जांच लें।',
    tipReceiveTitle: 'पैसे प्राप्त करना पिन-मुक्त है',
    tipReceiveDesc: 'पैसे प्राप्त करने के लिए कभी भी पिन डालने की आवश्यकता नहीं होती।',
    reportSuspicious: 'संदिग्ध गतिविधि की रिपोर्ट करें',

    helpTitle: 'मदद और सीखें',
    searchHelpPlaceholder: 'मदद खोजें...',
    learnPracticeTitle: '1. सीखें और अभ्यास करें',
    learnPracticeDesc: 'नकली पैसों से अभ्यास करें। पूरी तरह सुरक्षित और जोखिम-मुक्त।',
    startPracticeButton: 'अभ्यास शुरू करें',
    topicPaymentGuideTitle: 'भुगतान कैसे करें',
    topicPaymentGuideDesc: 'सरल निर्देशों और बड़े अक्षरों के साथ चरणबद्ध मार्गदर्शिका।',
    topicAppBasicsTitle: 'यूपीआई और ऐप की मूल बातें',
    topicAppBasicsDesc: 'यूपीआई, ऐप के चिह्न और बटनों को समझें।',
    topicSecurityTitle: 'सुरक्षा सुझाव',
    topicSecurityDesc: 'धोखाधड़ी और गलत लेन-देन से बचें।',
    topicFaqTitle: 'सामान्य प्रश्न',
    topicFaqDesc: 'वरिष्ठ नागरिकों के लिए आसान शब्दों में उत्तर।',
    topicSupportTitle: 'सहायता केंद्र से संपर्क',
    topicSupportDesc: 'सहायक से बात करें या नजदीकी बैंक शाखा जाएं।',
    practiceModeBanner: '🎓 अभ्यास मोड — कोई वास्तविक पैसा नहीं कटेगा',
    exitPractice: 'बाहर निकलें',

    chooseLanguageTitle: 'अपनी भाषा चुनें',
    chooseLanguageSubtitle: 'वह भाषा चुनें जिसमें आप सबसे सहज महसूस करते हैं।',
    saveLanguage: 'भाषा लागू करें',

    // Step-by-Step Guidance & Voice Narration
    stepOfTotal: 'कदम {current} का {total}',
    whatHappensNext: 'अगला कदम क्या होगा?',
    noDeductionGuarantee: 'इस कदम पर कोई पैसा नहीं काटा जाता। आप सुरक्षित रूप से वापस जा सकते हैं।',
    pinDeductionGuarantee: 'पैसे केवल 4 अंकों का गुप्त पिन दर्ज करने के बाद ही ट्रांसफर होते हैं।',
    listenGuidance: 'आवाज में मार्गदर्शन सुनें',
    stopGuidance: 'आवाज रोकें',
    speakingNow: 'विवरण बोल रहे हैं...',
    autoNarrateToggle: 'स्क्रीन खुलते ही बोलकर समझाएं',
    autoNarrateDesc: 'हर कदम पर अगला क्या होगा, आवाज में अपने आप बताता है',
    step1Title: 'प्राप्तकर्ता चुनें',
    step1Desc: 'अपनी सूची से संपर्क चुनें या कैमरे से क्यूआर कोड स्कैन करें।',
    step1Next: 'आगे: आप राशि दर्ज करेंगे। अभी कोई पैसा नहीं कटेगा।',
    step2Title: 'राशि दर्ज करें',
    step2Desc: 'जितने रुपये आप भेजना चाहते हैं, वह राशि दर्ज करें।',
    step2Next: 'आगे: आप प्राप्तकर्ता के नाम और सुरक्षा विवरण की समीक्षा करेंगे।',
    step3Title: 'भुगतान की समीक्षा करें',
    step3Desc: 'प्राप्तकर्ता का नाम, शब्दों में राशि और शेष राशि ध्यान से देखें।',
    step3Next: 'आगे: आप अपना 4 अंकों का गुप्त यूपीआई पिन दर्ज करेंगे।',
    step4Title: 'गुप्त यूपीआई पिन दर्ज करें',
    step4Desc: 'सुरक्षित कीपैड पर अपना 4 अंकों का गुप्त पिन दर्ज करें।',
    step4Next: 'आगे: बैंक भुगतान को पूरा करेगा और ध्वनि के साथ रसीद दिखाएगा।',
  },

  kn: {
    navHome: 'ಮುಖಪುಟ',
    navPay: 'ಪಾವತಿ',
    navHistory: 'ಇತಿಹಾಸ',
    navHelp: 'ಸಹಾಯ',
    navMonthly: 'ಮಾಸಿಕ ವೆಚ್ಚ',

    helloUser: 'ನಮಸ್ಕಾರ, ಬಳಕೆದಾರರೇ',
    myProfile: 'ನನ್ನ ವಿವರ',
    verifiedSenior: 'ದೃಢೀಕೃತ ಖಾತೆ',
    appSettings: 'ಅಪ್ಲಿಕೇಶನ್ ಸೆಟ್ಟಿಂಗ್ಸ್',
    changeLanguage: 'ಭಾಷೆ ಬದಲಾಯಿಸಿ (Change Language)',
    soundEffects: 'ಪಾವತಿ ಶಬ್ದ (Sound)',
    soundOn: 'ಶಬ್ದ: ಚಾಲ್ತಿ',
    soundOff: 'ಶಬ್ದ: ನಿಷ್ಕ್ರಿಯ',
    securitySettings: 'ಭದ್ರತೆ ಮತ್ತು ಗೌಪ್ಯತೆ',
    bankAccounts: 'ಜೋಡಿಸಲಾದ ಬ್ಯಾಂಕ್ ಖಾತೆಗಳು',
    logout: 'ಲಾಗ್ ಔಟ್',

    yourBalance: 'ನಿಮ್ಮ ಬ್ಯಾಲೆನ್ಸ್',
    viewBalance: 'ಬ್ಯಾಲೆನ್ಸ್ ನೋಡಿ',
    hideBalance: 'ಬ್ಯಾಲೆನ್ಸ್ ಮರೆಮಾಡಿ',
    balanceHidden: '••••••',
    balanceProtectedTitle: 'ಬ್ಯಾಲೆನ್ಸ್ ಭದ್ರತಾ ರಕ್ಷಣೆ',
    balanceProtectedDesc: 'ನಿಮ್ಮ ಭದ್ರತೆಗಾಗಿ, ನಿಮ್ಮ ಖಾತೆಯ ಬ್ಯಾಲೆನ್ಸ್ ಅನ್ನು ರಹಸ್ಯವಾಗಿಡಲಾಗಿದೆ.',
    authenticateToView: 'ಬ್ಯಾಲೆನ್ಸ್ ನೋಡಲು ದೃಢೀಕರಿಸಿ',
    useFingerprintOrFace: 'ಬೆರಳಚ್ಚು ಅಥವಾ ಫೇಸ್ ಐಡಿ ಬಳಸಿ',
    useDemoPin: 'ಅಥವಾ ಡೆಮೊ ಪಿನ್ (1234) ನಮೂದಿಸಿ',
    simulatedBiometricLabel: 'ಅನುಕರಣೀಯ ಬಯೋಮೆಟ್ರಿಕ್ ಪರಿಶೀಲನೆ',
    simulatedBiometricNote: 'ಮಾದರಿ ಪರೀಕ್ಷೆಗಾಗಿ ಬೆರಳಚ್ಚು ಸಂವೇದಕ ಸಿಮ್ಯುಲೇಶನ್.',
    biometricSuccess: 'ಗುರುತು ಯಶಸ್ವಿಯಾಗಿ ಪರಿಶೀಲಿಸಲಾಗಿದೆ!',
    biometricFailed: 'ಪರಿಶೀಲನೆ ವಿಫಲವಾಗಿದೆ. ದಯವಿಟ್ಟು ಪುನಃ ಪ್ರಯತ್ನಿಸಿ ಅಥವಾ ಪಿನ್ ಬಳಸಿ.',
    tryAgain: 'ಮತ್ತೆ ಪ್ರಯತ್ನಿಸಿ',
    cancel: 'ರದ್ದುಮಾಡಿ',
    autoHideNotice: 'ನೀವು ಬೇರೆ ಪರದೆಗೆ ಹೋದಾಗ ಬ್ಯಾಲೆನ್ಸ್ ತಾನಾಗಿಯೇ ಮರೆಯಾಗುತ್ತದೆ.',

    actionPay: 'ಹಣ ಕಳುಹಿಸಿ',
    actionReceive: 'ಹಣ ಪಡೆಯಿರಿ',
    actionHistory: 'ಇತಿಹಾಸ',
    actionHelp: 'ಸಹಾಯ',
    actionMonthly: 'ಮಾಸಿಕ',

    quickPay: 'ತ್ವರಿತ ಪಾವತಿ',
    seeAll: 'ಎಲ್ಲವನ್ನೂ ನೋಡಿ',
    staySafeTitle: 'ಸುರಕ್ಷಿತವಾಗಿರಿ!',
    staySafeDesc: 'ನಿಮ್ಮ ಒಟಿಪಿ ಅಥವಾ ಯುಪಿಐ ಪಿನ್ ಅನ್ನು ಯಾರೊಂದಿಗೂ ಹಂಚಿಕೊಳ್ಳಬೇಡಿ.',

    enterAmountTitle: 'ಮೊತ್ತ ನಮೂದಿಸಿ',
    step1Of3: 'ಹಂತ 1/3: ಪಾವತಿ ವಿವರಗಳು',
    sendingTo: 'ಇವರಿಗೆ ಕಳುಹಿಸಲಾಗುತ್ತಿದೆ',
    verifiedRecipient: 'ದೃಢೀಕೃತ ಸ್ವೀಕೃತದಾರರು',
    changeRecipient: 'ಬದಲಾಯಿಸಿ',
    availableBalance: 'ಲಭ್ಯವಿರುವ ಬ್ಯಾಲೆನ್ಸ್',
    trustSafeBadge: 'ಸುರಕ್ಷಿತ',
    paymentAmountLabel: 'ಪಾವತಿ ಮೊತ್ತ',
    amountInWordsLabel: 'ಅಕ್ಷರಗಳಲ್ಲಿ ಮೊತ್ತ:',
    quickAmountsLabel: 'ತ್ವರಿತ ಆಯ್ಕೆಗಳು:',
    insufficientBalanceTitle: 'ಸಾಕಾಗದ ಬ್ಯಾಲೆನ್ಸ್',
    insufficientBalanceDesc: 'ನೀವು ₹{amount} ನಮೂದಿಸಿದ್ದೀರಿ, ಆದರೆ ನಿಮ್ಮ ಬ್ಯಾಲೆನ್ಸ್ ಕೇವಲ ₹{balance} ಇದೆ. ದಯವಿಟ್ಟು ಕಡಿಮೆ ಮೊತ್ತ ನಮೂದಿಸಿ.',
    maxLimitExceededTitle: 'ಗರಿಷ್ಠ ಮಿತಿ ಮೀರಿದೆ',
    maxLimitExceededDesc: 'ಹಿರಿಯ ನಾಗರಿಕರ ರಕ್ಷಣೆಗಾಗಿ ಗರಿಷ್ಠ ಮಿತಿ ₹{limit} ಆಗಿದೆ. ದಯವಿಟ್ಟು ₹{limit} ಅಥವಾ ಕಡಿಮೆ ಮೊತ್ತ ನಮೂದಿಸಿ.',
    minLimitDesc: 'ಕನಿಷ್ಠ ಪಾವತಿ ಮೊತ್ತ ₹1.',
    balanceCheckPassed: '✓ ಬ್ಯಾಲೆನ್ಸ್ ಪರಿಶೀಲನೆ ಯಶಸ್ವಿ',
    remainingAfterPay: 'ಉಳಿಯುವ ಬ್ಯಾಲೆನ್ಸ್',
    noteLabel: 'ಟಿಪ್ಪಣಿ / ಸಂದೇಶ ಸೇರಿಸಿ (ಐಚ್ಛಿಕ)',
    notePlaceholder: 'ಉದಾ: ಹಾಲು, ದಿನಸಿ, ಬಾಡಿಗೆ...',
    payFromAccount: 'ಈ ಖಾತೆಯಿಂದ ಪಾವತಿಸಿ',
    reviewPaymentButton: 'ಪಾವತಿ ಪರಿಶೀಲಿಸಿ',
    cannotProceedInsufficient: 'ಮುಂದುವರಿಯಲು ಸಾಧ್ಯವಿಲ್ಲ: ಸಾಕಾಗದ ಬ್ಯಾಲೆನ್ಸ್',
    cannotProceedLimit: 'ಮುಂದುವರಿಯಲು ಸಾಧ್ಯವಿಲ್ಲ: ಮಿತಿ ಮೀರಿದೆ',

    highAmountWarningTitle: 'ದಯವಿಟ್ಟು ಈ ಮೊತ್ತವನ್ನು ಎಚ್ಚರಿಕೆಯಿಂದ ಪರಿಶೀಲಿಸಿ',
    highAmountWarningSubtitle: 'ನೀವು ₹{amount} ಕಳುಹಿಸಲು ಹೊರಟಿದ್ದೀರಿ',
    highAmountWarningDesc: 'ಇದು ತುಲನಾತ್ಮಕವಾಗಿ ದೊಡ್ಡ ಮೊತ್ತವಾಗಿದೆ. ಮುಂದುವರಿಯುವ ಮೊದಲು ಸ್ವೀಕೃತದಾರರು ಮತ್ತು ಮೊತ್ತವನ್ನು ದಯವಿಟ್ಟು ಖಚಿತಪಡಿಸಿಕೊಳ್ಳಿ.',
    highAmountWarningActionReview: 'ಪಾವತಿ ಪರಿಶೀಲಿಸಿ',
    highAmountWarningActionContinue: 'ಮುಂದುವರಿಯಿರಿ',
    unusualAlertTitle: 'ಅಸಾಮಾನ್ಯ ವೆಚ್ಚದ ಎಚ್ಚರಿಕೆ',
    unusualAlertDesc: 'ಈ ಪಾವತಿ (₹{amount}) ನಿಮ್ಮ ಸಾಮಾನ್ಯ ಸರಾಸರಿಗಿಂತ (₹{avg}) ಹೆಚ್ಚಾಗಿದೆ. ದಯವಿಟ್ಟು ಪರಿಶೀಲಿಸಿ.',

    reviewPaymentTitle: 'ಪಾವತಿ ಪರಿಶೀಲನೆ',
    step2Of3: 'ಹಂತ 2/3: ವಿವರಗಳನ್ನು ಮರುಪರಿಶೀಲಿಸಿ',
    trustModeTitle: 'ಸುರಕ್ಷಿತ ಪರಿಶೀಲನಾ ಕ್ರಮ',
    trustModeDesc: 'ಸ್ವೀಕೃತದಾರರು ಮತ್ತು ಮೊತ್ತವನ್ನು ಸಾವಧಾನವಾಗಿ ಪರಿಶೀಲಿಸಿ. ಯುಪಿಐ ಪಿನ್ ನಮೂದಿಸುವವರೆಗೆ ಹಣ ಕಡಿತವಾಗುವುದಿಲ್ಲ.',
    totalPaymentAmount: 'ಒಟ್ಟು ಪಾವತಿ ಮೊತ್ತ',
    paymentSummary: 'ಪಾವತಿ ಸಾರಾಂಶ',
    payingFrom: 'ಪಾವತಿಸುವ ಖಾತೆ',
    currentBalance: 'ಪ್ರಸ್ತುತ ಬ್ಯಾಲೆನ್ಸ್',
    amountDeducted: 'ಕಡಿತವಾಗುವ ಮೊತ್ತ',
    balanceAfterPayment: 'ಪಾವತಿಯ ನಂತರದ ಬ್ಯಾಲೆನ್ಸ್',
    note: 'ಟಿಪ್ಪಣಿ',
    proceedToPin: 'ಪಿನ್ ನಮೂದಿಸಲು ಮುಂದುವರಿಯಿರಿ',
    backToEdit: 'ವಿವರ ಬದಲಾಯಿಸಲು ಹಿಂದಕ್ಕೆ ಹೋಗಿ',

    authorizePaymentTitle: 'ಪಾವತಿ ದೃಢೀಕರಿಸಿ',
    step3Of3: 'ಹಂತ 3/3: ಯುಪಿಐ ಪಿನ್ ನಮೂದಿಸಿ',
    paymentAuthorization: 'ಪಾವತಿ ದೃಢೀಕರಣ',
    toRecipient: '{name} ಅವರಿಗೆ',
    enterPinPrompt: '4-ಅಂಕಿಯ ಯುಪಿಐ ಪಿನ್ ನಮೂದಿಸಿ',
    showDigits: 'ಪಿನ್ ತೋರಿಸಿ',
    hideDigits: 'ಪಿನ್ ಮರೆಮಾಡಿ',
    clearKey: 'ಅಳಿಸಿ',
    fillDemoPin: 'ಪಿನ್ ಭರ್ತಿಮಾಡಿ',
    demoPinBadge: 'ಡೆಮೊ ಪಿನ್:',
    pinSecurityReminder: 'ಸುರಕ್ಷತಾ ನಿಯಮ: ಯುಪಿಐ ಪಿನ್ ಕೇವಲ ಹಣ ಕಳುಹಿಸಲು ಮಾತ್ರ. ಹಣ ಪಡೆಯುವಾಗ ಎಂದಿಗೂ ಪಿನ್ ಹಾಕಬೇಡಿ.',
    pinAuthorizingModalTitle: 'ಪಾವತಿ ಪ್ರಕ್ರಿಯೆಯಲ್ಲಿದೆ',
    pinAuthorizingModalDesc: 'ಬ್ಯಾಂಕಿನೊಂದಿಗೆ ಸುರಕ್ಷಿತ ಸಂಪರ್ಕ ಕಲ್ಪಿಸಲಾಗುತ್ತಿದೆ... ದಯವಿಟ್ಟು ಕಾಯಿರಿ.',
    pinVerifiedBadge: 'ಪಿನ್ ಸುರಕ್ಷಿತವಾಗಿ ದೃಢೀಕರಿಸಲಾಗಿದೆ',
    errorIncompletePin: 'ದಯವಿಟ್ಟು ನಿಮ್ಮ ಯುಪಿಐ ಪಿನ್‌ನ ಎಲ್ಲಾ 4 ಅಂಕಿಗಳನ್ನು ನಮೂದಿಸಿ.',
    errorIncorrectPin: 'ತಪ್ಪು ಪಿನ್. ದಯವಿಟ್ಟು ಡೆಮೊ ಪಿನ್ 1234 ನಮೂದಿಸಿ.',

    paymentResultTitle: 'ಪಾವತಿ ಫಲಿತಾಂಶ',
    transactionCompleted: 'ವಹಿವಾಟು ಪೂರ್ಣಗೊಂಡಿದೆ',
    paymentSuccessful: 'ಪಾವತಿ ಯಶಸ್ವಿಯಾಗಿದೆ!',
    toPerson: '{name} ಅವರಿಗೆ ಯಶಸ್ವಿಯಾಗಿ ಕಳುಹಿಸಲಾಗಿದೆ',
    transactionId: 'ವಹಿವಾಟು ಸಂಖ್ಯೆ (Transaction ID)',
    paymentMethod: 'ಪಾವತಿ ವಿಧಾನ',
    dateTime: 'ದಿನಾಂಕ ಮತ್ತು ಸಮಯ',
    viewReceipt: 'ರಸೀದಿ ನೋಡಿ',
    backToHome: 'ಮುಖಪುಟಕ್ಕೆ ಹಿಂತಿರುಗಿ',
    soundPlayedChime: 'ಪಾವತಿ ಯಶಸ್ಸಿನ ಧ್ವನಿ ನುಡಿಸಲಾಗಿದೆ',
    officialReceiptTitle: 'ಪಾವತಿ ರಸೀದಿ',
    officialReceiptSubtitle: 'ವಹಿವಾಟಿನ ಅಧಿಕೃತ ಪುರಾವೆ',
    shareReceipt: 'ರಸೀದಿ ಹಂಚಿಕೊಳ್ಳಿ',
    doneButton: 'ಮುಗಿಯಿತು',

    paymentHistoryTitle: 'ವಹಿವಾಟು ಇತಿಹಾಸ',
    filterAll: 'ಎಲ್ಲವೂ',
    filterSent: 'ಕಳುಹಿಸಿದವು (Sent)',
    filterReceived: 'ಸ್ವೀಕರಿಸಿದವು (Received)',
    labelSent: 'ಕಳುಹಿಸಲಾಗಿದೆ',
    labelReceived: 'ಸ್ವೀಕರಿಸಲಾಗಿದೆ',
    noTransactionsFound: 'ಯಾವುದೇ ವಹಿವಾಟು ಕಂಡುಬಂದಿಲ್ಲ.',
    statusCompleted: 'ಯಶಸ್ವಿ',
    statusPending: 'ಬಾಕಿ ಇದೆ',
    statusFailed: 'ವಿಫಲ',

    monthlyInsightsTitle: 'ಮಾಸಿಕ ವೆಚ್ಚ ವಿಶ್ಲೇಷಣೆ',
    monthlyInsightsSubtitle: 'ವೆಚ್ಚದ ವಿವರ ಮತ್ತು ಬಜೆಟ್ ನಿರ್ವಹಣೆ',
    selectMonth: 'ತಿಂಗಳು ಆಯ್ಕೆಮಾಡಿ',
    totalSpentMonth: 'ಒಟ್ಟು ಖರ್ಚು ಮಾಡಿದ ಹಣ',
    totalReceivedMonth: 'ಒಟ್ಟು ಸ್ವೀಕರಿಸಿದ ಹಣ',
    outgoingCount: 'ಕಳುಹಿಸಿದ ಪಾವತಿಗಳು',
    incomingCount: 'ಸ್ವೀಕರಿಸಿದ ಪಾವತಿಗಳು',
    spendingChartTitle: 'ವರ್ಗವಾರು ವೆಚ್ಚಗಳು',
    tapToInspect: 'ವಿವರ ನೋಡಲು ಯಾವುದೇ ಭಾಗವನ್ನು ಸ್ಪರ್ಶಿಸಿ',
    selectedCategory: 'ಆಯ್ಕೆಮಾಡಿದ ವರ್ಗ',
    spentAmount: 'ಖರ್ಚಾದ ಮೊತ್ತ',
    percentOfTotal: 'ಒಟ್ಟು ಮಾಸಿಕ ವೆಚ್ಚದಲ್ಲಿ',
    categoryBreakdownTitle: 'ವರ್ಗವಾರು ವಿವರಣೆ',
    monthComparisonTitle: 'ಮಾಸಿಕ ಹೋಲಿಕೆ',
    spentMoreNotice: 'ಕಳೆದ ತಿಂಗಳಿಗಿಂತ ಈ ತಿಂಗಳು ನೀವು ₹{diff} ಹೆಚ್ಚು ಖರ್ಚು ಮಾಡಿದ್ದೀರಿ ({pct}% ಹೆಚ್ಚಳ).',
    spentLessNotice: 'ಕಳೆದ ತಿಂಗಳಿಗಿಂತ ಈ ತಿಂಗಳು ನೀವು ₹{diff} ಕಡಿಮೆ ಖರ್ಚು ಮಾಡಿದ್ದೀರಿ ({pct}% ಉಳಿತಾಯ).',
    spentEqualNotice: 'ನಿಮ್ಮ ವೆಚ್ಚ ಕಳೆದ ತಿಂಗಳಷ್ಟೇ ಇದೆ.',
    accessibleTableTitle: 'ವರ್ಗವಾರು ಪಟ್ಟಿ ಕೋಷ್ಟಕ',
    tableCategoryHeader: 'ವರ್ಗ',
    tableAmountHeader: 'ಮೊತ್ತ (₹)',
    tablePercentHeader: 'ಶೇಕಡಾವಾರು',
    demoDataBadge: 'ಮಾದರಿ ಮಾಹಿತಿ',

    catFood: 'ಆಹಾರ ಮತ್ತು ದಿನಸಿ',
    catTransport: 'ಸಾರಿಗೆ ಮತ್ತು ಪ್ರಯಾಣ',
    catUtilities: 'ಬಿಲ್ಲುಗಳು ಮತ್ತು ಸೇವೆಗಳು',
    catShopping: 'ಶಾಪಿಂಗ್',
    catHealthcare: 'ಆರೋಗ್ಯ ಮತ್ತು ಔಷಧಿ',
    catEntertainment: 'ಮನರಂಜನೆ',
    catOther: 'ಇತರ ಖರ್ಚುಗಳು',

    receiveMoneyTitle: 'ಹಣ ಸ್ವೀಕರಿಸಿ',
    scanQrPrompt: 'ಹಣ ಕಳುಹಿಸಲು ಯಾವುದೇ ಅಪ್ಲಿಕೇಶನ್‌ನಿಂದ ಈ ಕ್ಯೂಆರ್ ಕೋಡ್ ಸ್ಕ್ಯಾನ್ ಮಾಡಿ.',
    addSpecificAmount: 'ನಿರ್ದಿಷ್ಟ ಮೊತ್ತ ಸೇರಿಸಿ',
    amountToReceive: 'ಸ್ವೀಕರಿಸಬೇಕಾದ ಮೊತ್ತ:',
    updateQrCode: 'ಕ್ಯೂಆರ್ ಅಪ್‌ಡೇಟ್ ಮಾಡಿ',
    copyUpiId: 'ಯುಪಿಐ ಐಡಿ ನಕಲಿಸಿ',
    shareQr: 'ಕ್ಯೂಆರ್ ಹಂಚಿಕೊಳ್ಳಿ',

    safetyCenterTitle: 'ಸುರಕ್ಷತಾ ಕೇಂದ್ರ',
    scamWarningTitle: 'ವಂಚನೆಗಳಿಂದ ಎಚ್ಚರವಾಗಿರಿ',
    scamWarningDesc: 'ನಿಮ್ಮ ಭದ್ರತೆಯೇ ನಮ್ಮ ಪ್ರಮುಖ ಆದ್ಯತೆ. ನಿಮ್ಮ ಹಣವನ್ನು ಸುರಕ್ಷಿತವಾಗಿಡಲು ಈ ಸರಳ ನಿಯಮಗಳನ್ನು ಪಾಲಿಸಿ.',
    tipPinTitle: 'ಪಿನ್ ರಹಸ್ಯವಾಗಿಡಿ',
    tipPinDesc: 'ನಿಮ್ಮ ಯುಪಿಐ ಪಿನ್ ಅಥವಾ ಒಟಿಪಿಯನ್ನು ಯಾರೊಂದಿಗೂ ಹಂಚಿಕೊಳ್ಳಬೇಡಿ. ಬ್ಯಾಂಕ್ ಅಧಿಕಾರಿಗಳು ಎಂದಿಗೂ ಇದನ್ನು ಕೇಳುವುದಿಲ್ಲ.',
    tipCallTitle: 'ಅಪರಿಚಿತ ಕರೆಗಳ ಬಗ್ಗೆ ಎಚ್ಚರವಿರಲಿ',
    tipCallDesc: 'ಯಾರಾದರೂ ಆ್ಯಪ್ ಇನ್‌ಸ್ಟಾಲ್ ಮಾಡಲು ಹೇಳಿದರೆ ತಕ್ಷಣ ಕರೆ ಕಡಿತಗೊಳಿಸಿ.',
    tipVerifyTitle: 'ಪಾವತಿಸುವ ಮುನ್ನ ಪರಿಶೀಲಿಸಿ',
    tipVerifyDesc: 'ಪಿನ್ ಹಾಕುವ ಮೊದಲು ಸ್ವೀಕೃತದಾರರ ಹೆಸರು ಮತ್ತು ಮೊತ್ತವನ್ನು ಯಾವಾಗಲೂ ಎರಡು ಬಾರಿ ಪರಿಶೀಲಿಸಿ.',
    tipReceiveTitle: 'ಹಣ ಪಡೆಯಲು ಪಿನ್ ಅಗತ್ಯವಿಲ್ಲ',
    tipReceiveDesc: 'ಹಣ ಸ್ವೀಕರಿಸಲು ಯುಪಿಐ ಪಿನ್ ನಮೂದಿಸುವ ಅಗತ್ಯ ಎಂದಿಗೂ ಇರುವುದಿಲ್ಲ.',
    reportSuspicious: 'ಅನುಮಾನಾಸ್ಪದ ಚಟುವಟಿಕೆ ವರದಿ ಮಾಡಿ',

    helpTitle: 'ಸಹಾಯ ಮತ್ತು ಕಲಿಕೆ',
    searchHelpPlaceholder: 'ಸಹಾಯಕ್ಕಾಗಿ ಹುಡುಕಿ...',
    learnPracticeTitle: '1. ಕಲಿಯಿರಿ ಮತ್ತು ಅಭ್ಯಾಸ ಮಾಡಿ',
    learnPracticeDesc: 'ಮಾದರಿ ಹಣದೊಂದಿಗೆ ಪಾವತಿ ಅಭ್ಯಾಸ ಮಾಡಿ. ಸಂಪೂರ್ಣ ಸುರಕ್ಷಿತ.',
    startPracticeButton: 'ಅಭ್ಯಾಸ ಆರಂಭಿಸಿ',
    topicPaymentGuideTitle: 'ಪಾವತಿ ಮಾಡುವುದು ಹೇಗೆ',
    topicPaymentGuideDesc: 'ದೊಡ್ಡ ಅಕ್ಷರಗಳು ಮತ್ತು ಸರಳ ಹಂತಗಳೊಂದಿಗೆ ಮಾರ್ಗದರ್ಶಿ.',
    topicAppBasicsTitle: 'ಯುಪಿಐ ಮತ್ತು ಅಪ್ಲಿಕೇಶನ್ ಮೂಲಾಂಶಗಳು',
    topicAppBasicsDesc: 'ಚಿಹ್ನೆಗಳು ಮತ್ತು ಗುಂಡಿಗಳ ಬಗ್ಗೆ ತಿಳಿದುಕೊಳ್ಳಿ.',
    topicSecurityTitle: 'ಸುರಕ್ಷತಾ ಸಲಹೆಗಳು',
    topicSecurityDesc: 'ವಂಚನೆ ಮತ್ತು ತಪ್ಪು ವರ್ಗಾವಣೆಗಳಿಂದ ಪಾರಾಗಿ.',
    topicFaqTitle: 'ಸಾಮಾನ್ಯ ಪ್ರಶ್ನೆಗಳು',
    topicFaqDesc: 'ಹಿರಿಯರಿಗಾಗಿ ಸರಳ ಪ್ರಶ್ನೋತ್ತರಗಳು.',
    topicSupportTitle: 'ಸಹಾಯವಾಣಿ ಸಂಪರ್ಕ',
    topicSupportDesc: 'ಸಹಾಯಕರೊಂದಿಗೆ ಮಾತನಾಡಿ ಅಥವಾ ಶಾಖೆಗೆ ಭೇಟಿ ನೀಡಿ.',
    practiceModeBanner: '🎓 ಅಭ್ಯಾಸ ಮೋಡ್ — ಯಾವುದೇ ನೈಜ ಹಣ ವರ್ಗಾವಣೆಯಾಗುವುದಿಲ್ಲ',
    exitPractice: 'ನಿರ್ಗಮಿಸಿ',

    chooseLanguageTitle: 'ನಿಮ್ಮ ಭಾಷೆಯನ್ನು ಆಯ್ಕೆಮಾಡಿ',
    chooseLanguageSubtitle: 'ನಿಮಗೆ ಓದಲು ಅತ್ಯಂತ ಸುಲಭವಾದ ಭಾಷೆಯನ್ನು ಆರಿಸಿಕೊಳ್ಳಿ.',
    saveLanguage: 'ಭಾಷೆ ಅನ್ವಯಿಸಿ',

    // Step-by-Step Guidance & Voice Narration
    stepOfTotal: 'ಹಂತ {current} ರ {total}',
    whatHappensNext: 'ಮುಂದಿನ ಹಂತವೇನು?',
    noDeductionGuarantee: 'ಈ ಹಂತದಲ್ಲಿ ಯಾವುದೇ ಹಣ ಕಡಿತವಾಗುವುದಿಲ್ಲ. ನೀವು ಸುರಕ್ಷಿತವಾಗಿ ಹಿಂತಿರುಗಬಹುದು.',
    pinDeductionGuarantee: 'ನಿಮ್ಮ 4-ಅಂಕಿಯ ರಹಸ್ಯ ಪಿನ್ ನಮೂದಿಸಿದ ನಂತರವೇ ಹಣ ವರ್ಗಾವಣೆಯಾಗುತ್ತದೆ.',
    listenGuidance: 'ಧ್ವನಿ ಮಾರ್ಗದರ್ಶನ ಆಲಿಸಿ',
    stopGuidance: 'ಧ್ವನಿ ನಿಲ್ಲಿಸಿ',
    speakingNow: 'ವಿವರಣೆಯನ್ನು ಹೇಳಲಾಗುತ್ತಿದೆ...',
    autoNarrateToggle: 'ಪರದೆಯನ್ನು ತೆರೆದಾಗ ಸ್ವಯಂಚಾಲಿತವಾಗಿ ಓದಿ',
    autoNarrateDesc: 'ಪ್ರತಿ ಹಂತದಲ್ಲೂ ಏನು ಮಾಡಬೇಕು ಮತ್ತು ಮುಂದೇನು ಎಂಬುದನ್ನು ಧ್ವನಿಯಲ್ಲಿ ತಿಳಿಸುತ್ತದೆ',
    step1Title: 'ಸ್ವೀಕರಿಸುವವರನ್ನು ಆಯ್ಕೆಮಾಡಿ',
    step1Desc: 'ಸಂಪರ್ಕವನ್ನು ಆರಿಸಿ ಅಥವಾ ಕ್ಯಾಮೆರಾದಿಂದ ಕ್ಯೂಆರ್ ಕೋಡ್ ಸ್ಕ್ಯಾನ್ ಮಾಡಿ.',
    step1Next: 'ಮುಂದೆ: ನೀವು ಮೊತ್ತವನ್ನು ನಮೂದಿಸುವಿರಿ. ಇನ್ನೂ ಯಾವುದೇ ಹಣ ಕಡಿತವಾಗುವುದಿಲ್ಲ.',
    step2Title: 'ಮೊತ್ತವನ್ನು ನಮೂದಿಸಿ',
    step2Desc: 'ನೀವು ಕಳುಹಿಸಲು ಬಯಸುವ ರೂಪಾಯಿ ಮೊತ್ತವನ್ನು ನಮೂದಿಸಿ.',
    step2Next: 'ಮುಂದೆ: ನೀವು ಸ್ವೀಕರಿಸುವವರ ವಿವರಗಳು ಮತ್ತು ಸುರಕ್ಷತೆಯನ್ನು ಪರಿಶೀಲಿಸುವಿರಿ.',
    step3Title: 'ಪಾವತಿಯನ್ನು ಪರಿಶೀಲಿಸಿ',
    step3Desc: 'ಸ್ವೀಕರಿಸುವವರ ಹೆಸರು, ಪದಗಳಲ್ಲಿನ ಮೊತ್ತ ಮತ್ತು ಉಳಿದ ಬ್ಯಾಲೆನ್ಸ್ ಪರಿಶೀಲಿಸಿ.',
    step3Next: 'ಮುಂದೆ: ನೀವು ನಿಮ್ಮ 4-ಅಂಕಿಯ ರಹಸ್ಯ ಯುಪಿಐ ಪಿನ್ ನಮೂದಿಸುವಿರಿ.',
    step4Title: 'ರಹಸ್ಯ ಯುಪಿಐ ಪಿನ್ ನಮೂದಿಸಿ',
    step4Desc: 'ಸುರಕ್ಷಿತ ಕೀಪ್ಯಾಡ್‌ನಲ್ಲಿ ನಿಮ್ಮ 4-ಅಂಕಿಯ ರಹಸ್ಯ ಪಿನ್ ನಮೂದಿಸಿ.',
    step4Next: 'ಮುಂದೆ: ಬ್ಯಾಂಕ್ ಪಾವತಿಯನ್ನು ಪೂರ್ಣಗೊಳಿಸುತ್ತದೆ ಮತ್ತು ಧ್ವನಿ ಸಹಿತ ರಶೀದಿಯನ್ನು ತೋರಿಸುತ್ತದೆ.',
  },

  ta: {
    navHome: 'முகப்பு',
    navPay: 'பணம் செலுத்த',
    navHistory: 'வரலாறு',
    navHelp: 'உதவி',
    navMonthly: 'மாதச் செலவு',

    helloUser: 'வணக்கம், பயனர்',
    myProfile: 'எனது சுயவிவரம்',
    verifiedSenior: 'சரிபார்க்கப்பட்ட கணக்கு',
    appSettings: 'செயலி அமைப்புகள்',
    changeLanguage: 'மொழியை மாற்றுக (Change Language)',
    soundEffects: 'செலுத்தல் ஒலி (Chime)',
    soundOn: 'ஒலி: இயக்கத்தில்',
    soundOff: 'ஒலி: முடக்கப்பட்டது',
    securitySettings: 'பாதுகாப்பு & தனியுரிமை',
    bankAccounts: 'இணைக்கப்பட்ட வங்கிக் கணக்குகள்',
    logout: 'வெளியேறு',

    yourBalance: 'உங்கள் இருப்பு (Balance)',
    viewBalance: 'இருப்பைக் காட்டு',
    hideBalance: 'இருப்பை மறை',
    balanceHidden: '••••••',
    balanceProtectedTitle: 'இருப்பு பாதுகாப்பு',
    balanceProtectedDesc: 'உங்கள் பாதுகாப்பிற்காக, அங்கீகரிக்கும் வரை உங்கள் இருப்பு மறைக்கப்பட்டுள்ளது.',
    authenticateToView: 'இருப்பைக் காண சரிபார்க்கவும்',
    useFingerprintOrFace: 'கைரேகை அல்லது Face ID பயன்படுத்தவும்',
    useDemoPin: 'அல்லது மாதிரி பின் (1234) உள்ளிடவும்',
    simulatedBiometricLabel: 'மாதிரி பயோமெட்ரிக் சோதனை',
    simulatedBiometricNote: 'மாதிரி பயிற்சிக்கான கைரேகை சோதனை முறை.',
    biometricSuccess: 'அடையாளம் வெற்றிகரமாக சரிபார்க்கப்பட்டது!',
    biometricFailed: 'சரிபார்ப்பு தோல்வியடைந்தது. மீண்டும் முயற்சிக்கவும் அல்லது பின்னைப் பயன்படுத்தவும்.',
    tryAgain: 'மீண்டும் முயற்சி செய்க',
    cancel: 'ரத்து செய்',
    autoHideNotice: 'நீங்கள் திரையை விட்டு வெளியேறும்போது இருப்பு தானாகவே மறையும்.',

    actionPay: 'பணம் அனுப்பு',
    actionReceive: 'பணம் பெறு',
    actionHistory: 'வரலாறு',
    actionHelp: 'உதவி',
    actionMonthly: 'மாதச் செலவு',

    quickPay: 'விரைவுப் பணம்',
    seeAll: 'அனைத்தும் காண்க',
    staySafeTitle: 'பாதுகாப்பாக இருங்கள்!',
    staySafeDesc: 'உங்கள் OTP அல்லது UPI பின்னை யாரிடமும் பகிராதீர்கள்.',

    enterAmountTitle: 'தொகையை உள்ளிடவும்',
    step1Of3: 'படி 1/3: பணம் செலுத்தும் விவரங்கள்',
    sendingTo: 'பெறுபவர்',
    verifiedRecipient: 'சரிபார்க்கப்பட்ட பெறுநர்',
    changeRecipient: 'மாற்று',
    availableBalance: 'உள்ள இருப்பு',
    trustSafeBadge: 'பாதுகாப்பானது',
    paymentAmountLabel: 'செலுத்தும் தொகை',
    amountInWordsLabel: 'எழுத்துகளில் தொகை:',
    quickAmountsLabel: 'விரைவுத் தேர்வுகள்:',
    insufficientBalanceTitle: 'இருப்பு போதாது',
    insufficientBalanceDesc: 'நீங்கள் ₹{amount} உள்ளிட்டுள்ளீர்கள், ஆனால் உங்கள் கணக்கில் ₹{balance} மட்டுமே உள்ளது. தயவுசெய்து குறைந்த தொகையை உள்ளிடவும்.',
    maxLimitExceededTitle: 'அதிகபட்ச வரம்பு மீறப்பட்டது',
    maxLimitExceededDesc: 'முதியோர் பாதுகாப்பிற்காக ஒரு பரிவர்த்தனை வரம்பு ₹{limit} ஆகும். ₹{limit} அல்லது அதற்கும் குறைவாக உள்ளிடவும்.',
    minLimitDesc: 'குறைந்தபட்ச தொகை ₹1.',
    balanceCheckPassed: '✓ இருப்பு சரிபார்ப்பு முடிந்தது',
    remainingAfterPay: 'மீதமிருக்கும் இருப்பு',
    noteLabel: 'குறிப்பு / செய்தி (விருப்பமானது)',
    notePlaceholder: 'எ.கா: பால், மளிகை, வாடகை...',
    payFromAccount: 'இந்தக் கணக்கிலிருந்து செலுத்து',
    reviewPaymentButton: 'பரிசீலிக்கவும் (Review)',
    cannotProceedInsufficient: 'தொடர முடியாது: போதிய இருப்பில்லை',
    cannotProceedLimit: 'தொடர முடியாது: வரம்பு மீறியது',

    highAmountWarningTitle: 'தயவுசெய்து இந்தத் தொகையை கவனமாகச் சரிபார்க்கவும்',
    highAmountWarningSubtitle: 'நீங்கள் ₹{amount} அனுப்ப உள்ளீர்கள்',
    highAmountWarningDesc: 'இது பெரிய தொகையாகும். தொடர்வதற்கு முன் பெறுநர் மற்றும் தொகையை மீண்டும் உறுதிப்படுத்தவும்.',
    highAmountWarningActionReview: 'மீண்டும் சரிபார்',
    highAmountWarningActionContinue: 'தொடரவும்',
    unusualAlertTitle: 'வழக்கத்திற்கு மாறான செலவு எச்சரிக்கை',
    unusualAlertDesc: 'இந்தத் தொகை (₹{amount}) உங்கள் வழக்கமான சராசரியை (₹{avg}) விட அதிகம். தயவுசெய்து உறுதிப்படுத்தவும்.',

    reviewPaymentTitle: 'பரிசீலனை செய்க',
    step2Of3: 'படி 2/3: விவரங்களை உறுதி செய்க',
    trustModeTitle: 'நம்பகமான சரிபார்ப்பு முறை',
    trustModeDesc: 'பெறுநரையும் தொகையையும் நிதானமாகச் சரிபார்க்கவும். UPI பின்னை உள்ளிடும் வரை பணம் கழிக்கப்படாது.',
    totalPaymentAmount: 'மொத்த செலுத்தும் தொகை',
    paymentSummary: 'பரிவர்த்தனை சுருக்கம்',
    payingFrom: 'செலுத்தும் கணக்கு',
    currentBalance: 'தற்போதைய இருப்பு',
    amountDeducted: 'கழிக்கப்படும் தொகை',
    balanceAfterPayment: 'செலுத்திய பின் மீதமிருக்கும் இருப்பு',
    note: 'குறிப்பு',
    proceedToPin: 'பின் உள்ளிட தொடரவும்',
    backToEdit: 'திருத்த பின்செல்க',

    authorizePaymentTitle: 'பணம் செலுத்த அங்கீகரிக்கவும்',
    step3Of3: 'படி 3/3: UPI பின் உள்ளிடவும்',
    paymentAuthorization: 'பரிவர்த்தனை அங்கீகாரம்',
    toRecipient: '{name} என்பவருக்கு',
    enterPinPrompt: '4-இலக்க UPI பின்னை உள்ளிடவும்',
    showDigits: 'காட்டு',
    hideDigits: 'மறை',
    clearKey: 'அழி',
    fillDemoPin: 'பின்னை நிரப்பு',
    demoPinBadge: 'டெமோ பின்:',
    pinSecurityReminder: 'பாதுகாப்பு விதி: UPI பின் பணம் அனுப்புவதற்கு மட்டுமே. பணம் பெறும்போது எப்போதும் பின் உள்ளிடாதீர்கள்.',
    pinAuthorizingModalTitle: 'பரிவர்த்தனை உறுதியாகிறது',
    pinAuthorizingModalDesc: 'வங்கியுடன் பாதுகாப்பாக இணைக்கப்படுகிறது... தயவுசெய்து காத்திருக்கவும்.',
    pinVerifiedBadge: 'பின் சரிபார்க்கப்பட்டது',
    errorIncompletePin: 'தயவுசெய்து உங்கள் UPI பின்னிலுள்ள 4 இலக்கங்களையும் உள்ளிடவும்.',
    errorIncorrectPin: 'தவறான பின். மாதிரி பின் 1234 ஐ உள்ளிடவும்.',

    paymentResultTitle: 'பரிவர்த்தனை முடிவு',
    transactionCompleted: 'பரிவர்த்தனை முடிந்தது',
    paymentSuccessful: 'பணம் வெற்றிகரமாக செலுத்தப்பட்டது!',
    toPerson: '{name} என்பவருக்கு அனுப்பப்பட்டது',
    transactionId: 'பரிவர்த்தனை எண் (Transaction ID)',
    paymentMethod: 'செலுத்திய முறை',
    dateTime: 'தேதி & நேரம்',
    viewReceipt: 'ரசீது காண்க',
    backToHome: 'முகப்புக்குச் செல்க',
    soundPlayedChime: 'வெற்றி ஒலி இசைக்கப்பட்டது',
    officialReceiptTitle: 'பரிவர்த்தனை ரசீது',
    officialReceiptSubtitle: 'அதிகாரப்பூர்வ சான்று',
    shareReceipt: 'ரசீதை பகிர்க',
    doneButton: 'முடிந்தது',

    paymentHistoryTitle: 'பரிவர்த்தனை வரலாறு',
    filterAll: 'அனைத்தும்',
    filterSent: 'அனுப்பியவை (Sent)',
    filterReceived: 'பெற்றவை (Received)',
    labelSent: 'அனுப்பப்பட்டது',
    labelReceived: 'பெறப்பட்டது',
    noTransactionsFound: 'எந்தப் பரிவர்த்தனையும் இல்லை.',
    statusCompleted: 'வெற்றி',
    statusPending: 'நிலுவையில்',
    statusFailed: 'தோல்வி',

    monthlyInsightsTitle: 'மாதச் செலவு விவரங்கள்',
    monthlyInsightsSubtitle: 'காட்சிச் செலவு பகுப்பாய்வு & பட்ஜெட்',
    selectMonth: 'மாதத்தைத் தேர்ந்தெடுக்கவும்',
    totalSpentMonth: 'செலவிடப்பட்ட மொத்தப் பணம்',
    totalReceivedMonth: 'பெறப்பட்ட மொத்தப் பணம்',
    outgoingCount: 'செலுத்திய பரிவர்த்தனைகள்',
    incomingCount: 'பெற்ற பரிவர்த்தனைகள்',
    spendingChartTitle: 'வகை வாரியான செலவுகள்',
    tapToInspect: 'விவரங்களைக் காண வட்ட வரைபடத்தைத் தொடவும்',
    selectedCategory: 'தேர்ந்தெடுக்கப்பட்ட வகை',
    spentAmount: 'செலவுத் தொகை',
    percentOfTotal: 'மொத்த மாதச் செலவில்',
    categoryBreakdownTitle: 'வகை வாரியான பட்டியல்',
    monthComparisonTitle: 'மாதாந்திர ஒப்பீடு',
    spentMoreNotice: 'கடந்த மாதத்தை விட இந்த மாதம் நீங்கள் ₹{diff} அதிகமாகச் செலவு செய்துள்ளீர்கள் ({pct}% அதிகம்).',
    spentLessNotice: 'கடந்த மாதத்தை விட இந்த மாதம் நீங்கள் ₹{diff} குறைவாகச் செலவு செய்துள்ளீர்கள் ({pct}% சேமிப்பு).',
    spentEqualNotice: 'உங்கள் செலவு கடந்த மாதத்தைப் போலவே உள்ளது.',
    accessibleTableTitle: 'அணுகக்கூடிய அட்டவணை',
    tableCategoryHeader: 'வகை',
    tableAmountHeader: 'தொகை (₹)',
    tablePercentHeader: 'சதவீதம்',
    demoDataBadge: 'மாதிரித் தரவு',

    catFood: 'உணவு & மளிகை',
    catTransport: 'பயணம் & போக்குவரத்து',
    catUtilities: 'பில் & பயன்பாடுகள்',
    catShopping: 'ஷாப்பிங் & பொருட்கள்',
    catHealthcare: 'மருத்துவம் & ஆரோக்கியம்',
    catEntertainment: 'பொழுதுபோக்கு',
    catOther: 'இதர செலவுகள்',

    receiveMoneyTitle: 'பணம் பெறுக',
    scanQrPrompt: 'பணம் அனுப்ப எந்த செயலியிலிருந்தும் இந்த QR குறியீட்டை ஸ்கேன் செய்யவும்.',
    addSpecificAmount: 'குறிப்பிட்ட தொகையைச் சேர்',
    amountToReceive: 'பெறவேண்டிய தொகை:',
    updateQrCode: 'QR குறியீட்டைப் புதுப்பி',
    copyUpiId: 'UPI ஐடியை நகலெடு',
    shareQr: 'QR குறியீட்டைப் பகிர்',

    safetyCenterTitle: 'பாதுகாப்பு மையம்',
    scamWarningTitle: 'மோசடிகளிலிருந்து விழிப்புடன் இருங்கள்',
    scamWarningDesc: 'உங்கள் பாதுகாப்பே எங்களின் முதன்மை நோக்கம். பணத்தைப் பாதுகாக்க இந்த எளிய விதிகளைப் பின்பற்றுங்கள்.',
    tipPinTitle: 'பின்னை ரகசியமாக வைக்கவும்',
    tipPinDesc: 'உங்கள் UPI பின் அல்லது OTP-யை யாரிடமும் பகிராதீர்கள். வங்கி அதிகாரிகள் கேட்க மாட்டார்கள்.',
    tipCallTitle: 'தெரியாத அழைப்புகள் வேண்டாம்',
    tipCallDesc: 'யாராவது ஆப் நிறுவச் சொன்னாலோ பரிசு விழுந்ததாகக் கூறினாலோ உடனடியாக அழைப்பைத் துண்டிக்கவும்.',
    tipVerifyTitle: 'செலுத்தும் முன் சரிபார்க்கவும்',
    tipVerifyDesc: 'பின்னை உள்ளிடும் முன் பெறுநர் பெயர் மற்றும் தொகையை எப்போதும் இருமுறை சரிபார்க்கவும்.',
    tipReceiveTitle: 'பணம் பெற பின் தேவையில்லை',
    tipReceiveDesc: 'பணம் பெறும்போது ஒருபோதும் UPI பின்னை உள்ளிடக் கூடாது.',
    reportSuspicious: 'சந்தேகத்திற்கிடமான செயலைப் புகாரளி',

    helpTitle: 'உதவி & கற்றல்',
    searchHelpPlaceholder: 'உதவியைத் தேடுக...',
    learnPracticeTitle: '1. கற்றுப் பயிற்சி செய்க',
    learnPracticeDesc: 'மெய்நிகர் பணத்துடன் பணம் செலுத்திப் பழகவும். முற்றிலும் பாதுகாப்பானது.',
    startPracticeButton: 'பயிற்சியைத் தொடங்கு',
    topicPaymentGuideTitle: 'பணம் செலுத்துவது எப்படி',
    topicPaymentGuideDesc: 'பெரிய எழுத்துகள் மற்றும் எளிய வழிமுறைகளுடன் வழிகாட்டி.',
    topicAppBasicsTitle: 'UPI & செயலி அடிப்படைகள்',
    topicAppBasicsDesc: 'செயலியின் குறியீடுகள் மற்றும் பொத்தான்கள் பற்றி அறிக.',
    topicSecurityTitle: 'பாதுகாப்புக் குறிப்புகள்',
    topicSecurityDesc: 'மோசடிகள் மற்றும் தவறான பணப் பரிமாற்றங்களைத் தவிருங்கள்.',
    topicFaqTitle: 'அடிக்கடி கேட்கப்படும் கேள்விகள்',
    topicFaqDesc: 'முதியோர்களுக்கான எளிய விடைகள்.',
    topicSupportTitle: 'உதவி மையத் தொடர்பு',
    topicSupportDesc: 'உதவியாளரிடம் பேசவும் அல்லது வங்கிக் கிளைக்குச் செல்லவும்.',
    practiceModeBanner: '🎓 பயிற்சி முறை — உண்மையான பணம் கழிக்கப்படாது',
    exitPractice: 'வெளியேறு',

    chooseLanguageTitle: 'உங்கள் மொழியைத் தேர்ந்தெடுக்கவும்',
    chooseLanguageSubtitle: 'நீங்கள் வாசிக்க எளிதாக உணரும் மொழியைத் தேர்ந்தெடுக்கவும்.',
    saveLanguage: 'மொழியைப் பயன்படுத்து',

    // Step-by-Step Guidance & Voice Narration
    stepOfTotal: 'படி {current} இன் {total}',
    whatHappensNext: 'அடுத்த படி என்ன?',
    noDeductionGuarantee: 'இந்த படியில் பணம் எதுவும் கழிக்கப்படாது. நீங்கள் எப்போது வேண்டுமானாலும் பாதுகாப்பாக ரத்து செய்யலாம்.',
    pinDeductionGuarantee: 'உங்கள் 4 இலக்க ரகசிய பின்னை உள்ளிட்ட பின்னரே பணம் மாற்றப்படும்.',
    listenGuidance: 'குரல் வழிகாட்டலைக் கேளுங்கள்',
    stopGuidance: 'குரலை நிறுத்து',
    speakingNow: 'விளக்கம் பேசப்படுகிறது...',
    autoNarrateToggle: 'திரை திறந்ததும் தானாக பேசவும்',
    autoNarrateDesc: 'ஒவ்வொரு படியிலும் அடுத்தது என்ன என்பதை குரலில் விளக்குகிறது',
    step1Title: 'பெறுநரைத் தேர்ந்தெடுக்கவும்',
    step1Desc: 'தொடர்பைத் தேர்ந்தெடுக்கவும் அல்லது கேமரா மூலம் QR குறியீட்டை ஸ்கேன் செய்யவும்.',
    step1Next: 'அடுத்து: நீங்கள் தொகையை உள்ளிடுவீர்கள். இப்போது பணம் எதுவும் கழிக்கப்படாது.',
    step2Title: 'தொகையை உள்ளிடவும்',
    step2Desc: 'நீங்கள் அனுப்ப விரும்பும் ரூபாய் தொகையை உள்ளிடவும்.',
    step2Next: 'அடுத்து: பெறுநரின் விவரங்களையும் பாதுகாப்பு எச்சரிக்கைகளையும் மதிப்பாய்வு செய்வீர்கள்.',
    step3Title: 'கட்டணத்தை மதிப்பாய்வு செய்யவும்',
    step3Desc: 'பெறுநரின் பெயர், எழுத்துகளில் உள்ள தொகை மற்றும் மீதமுள்ள இருப்பை சரிபார்க்கவும்.',
    step3Next: 'அடுத்து: உங்கள் 4 இலக்க ரகசிய யுபிஐ பின்னை உள்ளிடுவீர்கள்.',
    step4Title: 'ரகசிய யுபிஐ பின்னை உள்ளிடவும்',
    step4Desc: 'பாதுகாப்பான விசைப்பலகையில் உங்கள் 4 இலக்க ரகசிய பின்னை உள்ளிடவும்.',
    step4Next: 'அடுத்து: வங்கி கட்டணத்தை அங்கீகரித்து ஒலி சமிக்ஞையுடன் ரசீதை காண்பிக்கும்.',
  }
};

/**
 * Helper to interpolate dynamic variables like {amount}, {balance}, {limit}, etc.
 */
export function t(
  lang: SupportedLanguage,
  key: keyof TranslationDictionary,
  params?: Record<string, string | number>
): string {
  const dict = translations[lang] || translations.en;
  let text = dict[key] || translations.en[key] || String(key);
  if (params) {
    Object.entries(params).forEach(([paramKey, val]) => {
      text = text.replace(new RegExp(`\\{${paramKey}\\}`, 'g'), String(val));
    });
  }
  return text;
}

export function getCategoryTranslation(lang: SupportedLanguage, cat: ExpenseCategory): string {
  const dict = translations[lang] || translations.en;
  switch (cat) {
    case 'Food and Groceries': return dict.catFood;
    case 'Transportation': return dict.catTransport;
    case 'Utilities and Bills': return dict.catUtilities;
    case 'Shopping': return dict.catShopping;
    case 'Healthcare': return dict.catHealthcare;
    case 'Entertainment': return dict.catEntertainment;
    case 'Other Expenses': return dict.catOther;
    default: return cat;
  }
}

export function getStatusTranslation(lang: SupportedLanguage, status: TransactionStatus): string {
  const dict = translations[lang] || translations.en;
  switch (status) {
    case 'Completed': return dict.statusCompleted;
    case 'Pending': return dict.statusPending;
    case 'Failed': return dict.statusFailed;
    default: return status;
  }
}
