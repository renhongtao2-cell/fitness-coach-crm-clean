import type { LanguageCode } from './index';


const flattenTranslations = <T extends Record<string, unknown>>(obj: T, prefix = ""): Record<string, string> => {
  const result: Record<string, string> = {};
  for (const key in obj) {
    const fullPath = prefix ? `${prefix}.${key}` : key;
    const val = obj[key] as any;
    if (typeof val === "string") {
      result[fullPath] = val;
    } else if (typeof val === "object" && val !== null) {
      Object.assign(result, flattenTranslations(val, fullPath));
    }
  }
  return result;
};

export const enUS = {
  common: { appName: "FitCoach CRM", save: "Save", saveSettings: "Save Settings", cancel: "Cancel", delete: "Delete", edit: "Edit", close: "Close", confirm: "Confirm", apply: "Apply", copy: "Copy", copied: "Copied!", search: "Search", loading: "Loading...", noData: "No data available", yes: "Yes", no: "No" },
  viewAll: "View All",
  nav: { dashboard: "Dashboard", clients: "Clients", programs: "Programs", progress: "Progress", messages: "Messages", settings: "Settings", billing: "Billing", pricing: "Pricing" ,
  today: "Today"},
  auth: { welcomeBack: "Welcome Back", signInTitle: "Sign in to your coach account", email: "Email Address", password: "Password", forgotPassword: "Forgot Password?", signUp: "Sign In", signingIn: "Signing in...", noAccount: "Don\'t have an account?", createAccount: "Sign Up for Free", creatingAccount: "Creating account...",
  signInFailed: "Sign In Failed, please check email and password",
  passwordPlaceholder: "Your password", forgotPasswordTitle2: "Reset Password", forgotPasswordDesc2: "We will send a reset link to your email", sendResetEmail: "Send Reset Email", sendingEmail: "Sending...", resetSent: "Reset email has been sent, please check your inbox", resetFailed: "Failed to send, please try again later", backToLogin: "Back to Sign In" },
  register: { createAccountTitle: "Create Account", startManagingClients: "Start managing your clients", fullName: "Full Name", confirmPassword: "Confirm New Password", iAmA: "I am a...", fitnessCoach: "Fitness Coach", manageClients: "Manage clients", haveCode: "Already have a code? Great!", confirmPasswordInput: "Confirm New Password", roleTitle: "I am a...", fitnessCoachLabel: "Fitness Coach", viewTrainingLabel: "View Training", createAccountSubmit: "Create Account", registrationFailed: "Registration Failed", submittingRegister: "Creating...", successMessage: "Success", referralCodeLabel: "Referral Code (optional)", referralCodeHint: "Enter referral code if you have one to get extra benefits", namePlaceholder: "Your name", passwordPlaceholderReg: "At least 6 characters", confirmPasswordPlaceholder2: "Enter password again" },
dashboard: { activeCoachees: "Active Coachees", totalPrograms: "Total Programs", completionRate: "Completion Rate", todaySessions: "Today\'s Sessions", welcomeBack: "Welcome back", quickActions: "Quick Actions", weeklySummary: "This Week Training Summary", trainingCompletionRate: "Training Completion Rate", averageRPE: "Average RPE", studentSatisfaction: "Student Satisfaction", viewClientProfile: "View Client Profile", messageCoachee: "Message Coachee", aiGeneratePlan: "AI Generate Plan", viewStudentProgress: "View Student Progress",

  status: { inProgress: "In Progress", completed: "Completed", paused: "Paused", cancelled: "Cancelled" },},
  welcomeBackSub: "Welcome Back 👋",
  thisWeekComparison: "+15% vs Last Week",
  programsActive: "3 Active",
needsReply: "Needs Reply",

todayLabel: "Today",

  coachees: { title: "My Clients", addClient: "+ Add Client", noClientsYet: "You don\'t have any clients yet.",
  addClientSubmit: "Add Client", addFirstClient: "Add your first client to get started.", name: "Name", status: "Status", plan: "Plan", joinDate: "Join Date", assignProgram: "Assign Program", removeClient: "Remove Client", confirmRemove: "Are you sure you want to remove this client?", profile: "Profile Details", personalInfo: "Personal Information", bodyMeasurement: "Body Measurements", goal: "Goal", currentWeight: "Current Weight", currentBodyFat: "Current Body Fat%", targetWeight: "Target Weight", targetBodyFat: "Target Body Fat%", bodyFat: "Body Fat %", heightCm: "Height (cm)", age: "Age", gender: "Gender", male: "Male", female: "Female", other: "Other", notes: "Notes", updateCoachee: "Update Client", addCoacheeSuccess: "Client added successfully", removeCoacheeSuccess: "Client removed", updateCoacheeSuccess: "Client updated", linkSuccess: "Client linked to your account!", pleaseLogin: "Please login as a coach first." ,
  fitnessLevel: "Fitness Level"},
  programs: { title: "Programs", addProgram: "+ New Program", editProgram: "Edit Program", basicInfo: "Basic Info", programName: "Program Name", programDesc: "Description", duration: "Duration", difficultyLevel: "Difficulty",
  weeksLabel: "Weeks",
  difficultyLabel: "Level", beginner: "Beginner", intermediate: "Intermediate", advanced: "Advanced", restDay: "Rest Day", activeRecovery: "Active Recovery", highIntensity: "High Intensity", exerciseSets: "Exercises & Sets", setN: "Set", reps: "Reps", weight: "Weight (kg)", rpe: "RPE", durationMin: "Duration (min)", addExercise: "+ Add Exercise", deleteExercise: "Delete", removeExercise: "Remove this exercise?", programSaved: "Program saved!", programDeleted: "Program deleted" ,
  },
  progress: { title: "Training Logs", addLog: "+ Add Log", noLogsYet: "No training logs yet.", startDate: "Start Date", endDate: "End Date", trainingDay: "Training Day", bodyWeight: "Body Weight (kg)", bodyFatPercentage: "Body Fat %", caloriesBurned: "Calories Burned", averageRPE: "Average RPE", sessionNotes: "Session Notes", saveLog: "Save Log", logAdded: "Training log added!", logUpdated: "Training log updated!", logDeleted: "Training log deleted!" },
messages: { title: "Messages", sendMessage: "Send Message", to: "To", messageInput: "Write a message...", sent: "Sent", selectCoacheePlaceholder: "Select a client...", noCoacheeSelected: "No client selected", conversationWith: "Conversation", sending: "Sending...", messageSent: "Message sent!", messageDeleted: "Message deleted", conversations: "Conversations", typing: "Typing...", selectToStart: "Select a conversation to start messaging",

  completedToday: "Completed Today",},
  settingsTabs: { profile: "Profile", security: "Security", notifications: "Notifications", appearance: "Appearance", referral: "Referral Program" },
  profileTab: { personalDetails: "Personal Details", fullNameLabel: "Full Name", bio: "Bio", phone: "Phone Number", certifications: "Certifications", updateProfile: "Update Profile", profileUpdated: "Profile updated", nameLabel: "Full Name", labelEmail: "Email", role: "Role", coach: "Coach", client: "Client", neverLoggedIn: "Never logged in", saveFailed: "Save failed:" },
  securityTab: { changePassword: "Change Password", currentPassword: "Current Password", newPassword: "New Password", newPasswordHint: "Must be at least 6 characters", passwordsNotMatch: "Passwords do not match", passwordMinLength: "Password must be at least 6 characters", passwordUpdated: "Password updated", updateFailed: "Update failed:" },
  notificationTab: { notificationPreferences: "Notification Preferences", workoutComplete: "Workout Completion", workoutCompleteDesc: "When coachee completes a workout", receiveMessages: "Receive Messages", receiveMessagesDesc: "When a coachee sends you a message", planExpiry: "Plan Expiry Alerts", planExpiryDesc: "When a client\'s subscription is about to expire", weeklyReport: "Weekly Report Email", weeklyReportDesc: "Get a summary of your coachees\' weekly progress", marketingEmails: "Marketing Emails", marketingEmailsDesc: "Receive tips, product updates, and industry news", settingsSaved: "Notification settings saved" },
  appearanceTab: { theme: "Theme", lightMode: "Light Mode", darkMode: "Dark Mode", language: "Language", languageChanged: "Language changed!", themeChanged: "Theme changed! Refresh page to apply.", save: "Save Changes", selectLanguage: "Select Language" },
  billing: { title: "Subscription Management", planUsage: "Plan Usage", currentPlan: "Current Plan", usageStatistics: "Usage Statistics", upgradeOrCancel: "Upgrade or Cancel Your Plan", upgradePlan: "Upgrade Plan", cancelPlan: "Cancel Plan", billingHistory: "Billing History", invoiceNumber: "Invoice", date: "Date", amount: "Amount", status: "Status", paid: "Paid", unpaid: "Unpaid", download: "Download", subscriptionDetails: "Subscription Details", activeSubscriptions: "Active Subscriptions", manageYourSubscriptions: "Manage your subscriptions and billing details" },
  pricing: { choosePlan: "Choose the Perfect Plan", priceMonthly: "/month", popular: "Most Popular", mostWanted: "Most Wanted", choosePlanText: "Choose Plan", startFreeTrial: "Start Free Trial", contactSales: "Contact Sales", allPlansInclude: "All plans include", coreFeatures: "Core Features", basicFeatures: "Basic Features", professionalFeatures: "Professional Features", unlimitedData: "Unlimited Data Storage", customBranding: "Custom Branding", prioritySupport: "Priority Support", freeFor3Days: "Free for 3 days", trialNote: "Full feature access during trial period", noCreditCard: "No credit card required", getAccessTo: "Get access to all professional features", annualDiscount: "Annual billing saves 20%", comparePlans: "Compare Plans Side by Side", basicSuitableFor: "Great for new coaches getting started", proSuitableFor: "Ideal for growing coaching businesses", enterpriseSuitableFor: "Perfect for large teams and agencies", unlimitedClients: "Unlimited clients", advancedReports: "Advanced reports & analytics", customPrograms: "Custom program templates", whiteLabel: "White-label branding", apiAccess: "API access", dedicatedManager: "Dedicated account manager" },
  referral: { referralTitle: "Referral Program", referralSubtitle: "Invite friends and both get a free month!", totalReferrals: "Total Referrals", successfulReferrals: "Successful Referrals", monthsEarned: "Months Earned", shareReferralCode: "Share Referral Code", shareReferralCodeDesc: "Share your referral code via email, chat, or social media with friends.", friendSignsUp: "Friend Signs Up", friendSignsUpDesc: "They use your referral code to create their account.", bothGetFreeMonth: "Both Get 1 Month Free", bothGetFreeMonthDesc: "You and your referred friend each get 1 month free on any plan.", haveReferralCode: "I Have a Referral Code", haveReferralCodeDesc: "If you were referred by a friend, enter their code here.", howItWorks: "How It Works", enterReferralCode: "Enter referral code (e.g.: FIT-ABC123)", applyCode: "Apply", applying: "Applying...", referralApplied: "Referral code applied! Enjoy your free month!", referralLimitReached: "Referral limit reached. You cannot refer more people.", referralCodeNotFound: "Invalid referral code", loadingReferrals: "Loading...", totalReferralsNum: "Total Referrals", successfulReferralsNum: "Successful Referrals", monthsEarnedNum: "Months Earned" },
  toast: { error: "Error", success: "Success", warning: "Warning", info: "Info", copySuccess: "Referral code copied!", copyFailed: "Copy failed" },
  footer: { rightsReserved: "All rights reserved." },
  sidebar: { signedOut: "Signed out", signOutTitle: "Sign Out", coach: "Coach", client: "Client", user: "User" },
  forms: { requiredField: "This field is required", invalidEmail: "Please enter a valid email address", validationError: "Validation error", generalError: "An unexpected error occurred" },
  actions: { adding: "Adding...", saving: "Saving...", updating: "Updating...", deleting: "Deleting...", sending: "Sending...", redirecting: "Redirecting..." }
} as const;

export const zhCN = enUS;

export const jaJP = enUS;

export const koKR = enUS;

export const esES = enUS;

export const frFR = enUS;

export const deDE = enUS;

export const ptBR = enUS;

export const arSA = enUS;

export const hiIN = enUS;

// Build flat translations lookup for all languages
const buildFlatMap = (obj: Record<string, unknown>, prefix = ""): Record<string, string> => {
  const result: Record<string, string> = {};
  for (const key in obj) {
    const fullPath = prefix ? `${prefix}.${key}` : key;
    const val = obj[key] as any;
    if (typeof val === "string") {
      result[fullPath] = val;
    } else if (typeof val === "object" && val !== null && !Array.isArray(val)) {
      Object.assign(result, buildFlatMap(val, fullPath));
    }
  }
  return result;
};


// Build flat translations lookup for all languages


export const fullEnUS = buildFlatMap(enUS);
export const fullZhCN = buildFlatMap(zhCN);
export const fullJaJP = buildFlatMap(jaJP);
export const fullKoKR = buildFlatMap(koKR);
export const fullEsES = buildFlatMap(esES);
export const fullFrFR = buildFlatMap(frFR);
export const fullDeDE = buildFlatMap(deDE);
export const fullPtBR = buildFlatMap(ptBR);
export const fullArSA = buildFlatMap(arSA);
export const fullHiIN = buildFlatMap(hiIN);

export const allTranslations: Record<string, Record<string, string>> = {
  'en-US': fullEnUS,
  'zh-CN': fullZhCN,
  'ja-JP': fullJaJP,
  'ko-KR': fullKoKR,
  'es-ES': fullEsES,
  'fr-FR': fullFrFR,
  'de-DE': fullDeDE,
  'pt-BR': fullPtBR,
  'ar-SA': fullArSA,
  'hi-IN': fullHiIN,
};

export const supportedLanguages: LanguageCode[] = [
  'en-US', 'zh-CN', 'ja-JP', 'ko-KR',
  'es-ES', 'fr-FR', 'de-DE', 'pt-BR', 'ar-SA', 'hi-IN'
];

export const fallbackLanguage: LanguageCode = 'en-US';

