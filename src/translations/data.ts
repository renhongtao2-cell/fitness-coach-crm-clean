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

  status: { inProgress: "In Progress", completed: "Completed", paused: "Paused", cancelled: "Cancelled" , viewDetailsLabel: 'View Details'},},
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
  progress: { title: "Training Logs", addLog: "+ Add Log", noLogsYet: "No training logs yet.", startDate: "Start Date", endDate: "End Date", trainingDay: "Training Day", bodyWeight: "Body Weight (kg)", bodyFatPercentage: "Body Fat %", caloriesBurned: "Calories Burned", averageRPE: "Average RPE", sessionNotes: "Session Notes", saveLog: "Save Log", logAdded: "Training log added!", logUpdated: "Training log updated!", logDeleted: "Training log deleted!" , trainingSummaryLabel: 'Training Summary'},
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

export const zhCN = {
  common: { appName: 'FitCoach CRM', save: '保存', saveSettings: '保存设置', cancel: '取消', delete: '删除', edit: '编辑', close: '关闭', confirm: '确认', apply: '应用', copy: '复制', copied: '已复制!', search: '搜索', loading: '加载中...', noData: '暂无数据', yes: '是', no: '否' },
  viewAll: '查看全部',
  nav: { dashboard: '仪表盘', clients: '客户', programs: '计划', progress: '进度', messages: '消息', settings: '设置', billing: '账单', pricing: '价格' },
  today: '今天',
  auth: { welcomeBack: '欢迎回来', signInTitle: '登录您的教练账号', email: '邮箱地址', password: '密码', forgotPassword: '忘记密码?', signUp: '登录', signingIn: '登录中...', noAccount: '还没有账号?', createAccount: '免费注册', creatingAccount: '创建中...', signInFailed: '登录失败，请检查邮箱和密码', passwordPlaceholder: '您的密码', forgotPasswordTitle2: '重置密码', forgotPasswordDesc2: '我们将向您的邮箱发送重置链接', sendResetEmail: '发送重置邮件', sendingEmail: '发送中...', resetSent: '重置邮件已发送，请检查您的邮箱', resetFailed: '发送失败，请稍后重试', backToLogin: '返回登录' },
  register: { createAccountTitle: '创建账号', startManagingClients: '开始管理您的客户', fullName: '姓名', confirmPassword: '确认新密码', iAmA: '我是...', fitnessCoach: '健身教练', manageClients: '管理客户', haveCode: '已有邀请码? 太好了!', confirmPasswordInput: '确认新密码', roleTitle: '我是...', fitnessCoachLabel: '健身教练', viewTrainingLabel: '查看训练', createAccountSubmit: '创建账号', registrationFailed: '注册失败', submittingRegister: '创建中...', successMessage: '成功', referralCodeLabel: '推荐码(选填)', referralCodeHint: '输入推荐码以获取额外福利', namePlaceholder: '您的姓名', passwordPlaceholderReg: '至少6个字符', confirmPasswordPlaceholder2: '再次输入密码' },
  dashboard: { activeCoachees: '活跃客户', totalPrograms: '总计划数', completionRate: '完成率', todaySessions: '今日课程', welcomeBack: '欢迎回来', quickActions: '快捷操作', weeklySummary: '本周训练总结', trainingCompletionRate: '训练完成率', averageRPE: '平均RPE', studentSatisfaction: '学员满意度', viewClientProfile: '查看客户资料', messageCoachee: '给客户发消息', aiGeneratePlan: 'AI生成计划', viewStudentProgress: '查看学员进度', status: { inProgress: '进行中', completed: '已完成', paused: '已暂停', cancelled: '已取消' , viewDetailsLabel: '查看详细信息'}, welcomeBackSub: '欢迎回来', thisWeekComparison: '+15% 对比上周', programsActive: '3个活跃', needsReply: '需要回复' },
  coachees: { title: '我的客户', addClient: '+ 添加客户', noClientsYet: '您还没有任何客户。', addClientSubmit: '添加客户', addFirstClient: '添加第一个客户开始使用。', name: '姓名', status: '状态', plan: '计划', joinDate: '加入日期', assignProgram: '分配计划', removeClient: '移除客户', confirmRemove: '确定要移除此客户吗?', profile: '详细信息', personalInfo: '个人信息', bodyMeasurement: '身体测量', goal: '目标', currentWeight: '当前体重', currentBodyFat: '当前体脂率', targetWeight: '目标体重', targetBodyFat: '目标体脂率', bodyFat: '体脂率%', heightCm: '身高(cm)', age: '年龄', gender: '性别', male: '男', female: '女', other: '其他', notes: '备注', updateCoachee: '更新客户', addCoacheeSuccess: '客户添加成功', removeCoacheeSuccess: '客户已移除', updateCoacheeSuccess: '客户信息已更新', linkSuccess: '客户已关联到你的账号!', pleaseLogin: '请先以教练身份登录。', fitnessLevel: '健身水平' },
  programs: { title: '训练计划', addProgram: '+ 新建计划', editProgram: '编辑计划', basicInfo: '基本信息', programName: '计划名称', programDesc: '描述', duration: '持续时间', difficultyLevel: '难度', weeksLabel: '周', difficultyLabel: '级别', beginner: '初级', intermediate: '中级', advanced: '高级', restDay: '休息日', activeRecovery: '主动恢复', highIntensity: '高强度', exerciseSets: '动作与组数', setN: '第', reps: '次数', weight: '重量(kg)', rpe: 'RPE', durationMin: '时长(分钟)', addExercise: '+ 添加动作', deleteExercise: '删除', removeExercise: '移除此动作?', programSaved: '计划已保存!', programDeleted: '计划已删除' },
  progress: { title: '训练日志', addLog: '+ 添加日志', noLogsYet: '暂无训练日志。', startDate: '开始日期', endDate: '结束日期', trainingDay: '训练天数', bodyWeight: '体重(kg)', bodyFatPercentage: '体脂率%', caloriesBurned: '消耗卡路里', averageRPE: '平均RPE', sessionNotes: '课程备注', saveLog: '保存日志', logAdded: '训练日志已添加!', logUpdated: '训练日志已更新!', logDeleted: '训练日志已删除!', completedToday: '今日完成' , trainingSummaryLabel: '训练总结'},
  messages: { title: '消息', sendMessage: '发送消息', to: '发送给', messageInput: '输入消息...', sent: '已发送', selectCoacheePlaceholder: '选择客户...', noCoacheeSelected: '未选择客户', conversationWith: '对话', sending: '发送中...', messageSent: '消息已发送!', messageDeleted: '消息已删除', conversations: '会话', typing: '输入中...', selectToStart: '选择一个会话开始聊天', completedToday: '今日完成' },
  settingsTabs: { profile: '个人资料', security: '安全', notifications: '通知', appearance: '外观', referral: '推荐奖励' },
  profileTab: { personalDetails: '个人资料详情', fullNameLabel: '全名', bio: '个人简介', phone: '电话号码', certifications: '资质证书', updateProfile: '更新资料', profileUpdated: '资料已更新', nameLabel: '姓名', labelEmail: '邮箱', role: '角色', coach: '教练', client: '学员', neverLoggedIn: '从未登录', saveFailed: '保存失败:' },
  securityTab: { changePassword: '修改密码', currentPassword: '当前密码', newPassword: '新密码', newPasswordHint: '必须至少6个字符', passwordsNotMatch: '两次输入的密码不一致', passwordMinLength: '密码必须至少6个字符', passwordUpdated: '密码已更新', updateFailed: '更新失败:' },
  notificationTab: { notificationPreferences: '通知偏好设置', workoutComplete: '训练完成', workoutCompleteDesc: '当学员完成训练时', receiveMessages: '接收消息', receiveMessagesDesc: '当学员给你发消息时', planExpiry: '计划到期提醒', planExpiryDesc: '当学员订阅即将过期时', weeklyReport: '周报邮件', weeklyReportDesc: '获取学员每周进度汇总', marketingEmails: '营销邮件', marketingEmailsDesc: '接收技巧、产品更新和行业新闻', settingsSaved: '通知设置已保存' },
  appearanceTab: { theme: '主题', lightMode: '浅色模式', darkMode: '深色模式', language: '语言', languageChanged: '语言已更改!', themeChanged: '主题已更改!刷新页面以应用。', save: '保存更改', selectLanguage: '选择语言' },
  billing: { title: '订阅管理', planUsage: '套餐使用情况', currentPlan: '当前套餐', usageStatistics: '使用统计', upgradeOrCancel: '升级或取消套餐', upgradePlan: '升级套餐', cancelPlan: '取消套餐', billingHistory: '账单历史', invoiceNumber: '发票号', date: '日期', amount: '金额', status: '状态', paid: '已支付', unpaid: '未支付', download: '下载', subscriptionDetails: '订阅详情', activeSubscriptions: '活动订阅', manageYourSubscriptions: '管理你的订阅和账单详情' },
  pricing: { choosePlan: '选择合适的方案', priceMonthly: '/月', popular: '最受欢迎', mostWanted: '人气之选', choosePlanText: '选择方案', startFreeTrial: '开始免费试用', contactSales: '联系销售', allPlansInclude: '所有方案均包含', coreFeatures: '核心功能', basicFeatures: '基础功能', professionalFeatures: '专业功能', unlimitedData: '无限数据存储', customBranding: '自定义品牌', prioritySupport: '优先支持', freeFor3Days: '3天免费', trialNote: '试用期享有全部功能', noCreditCard: '无需信用卡', getAccessTo: '获取所有专业功能', annualDiscount: '年付省20%', comparePlans: '对比方案', basicSuitableFor: '适合刚开始的教练', proSuitableFor: '适合成长中的教练业务', enterpriseSuitableFor: '适合大团队和机构', unlimitedClients: '无限学员', advancedReports: '高级报告与分析', customPrograms: '自定义计划模板', whiteLabel: '白标品牌', apiAccess: 'API访问', dedicatedManager: '专属客户经理' },
  referral: { referralTitle: '推荐奖励计划', referralSubtitle: '邀请朋友，双方各获赠一个月!', totalReferrals: '总推荐数', successfulReferrals: '成功转化', monthsEarned: '已获月数', shareReferralCode: '分享推荐码', shareReferralCodeDesc: '通过邮件、聊天或社交媒体与朋友分享推荐码。', friendSignsUp: '朋友注册', friendSignsDesc: '他们使用你的推荐码创建账户。', bothGetFreeMonth: '双方各得一个月免费', bothGetFreeMonthDesc: '你和你的朋友在任何套餐上均可获得一个月免费。', haveReferralCode: '我有推荐码', haveReferralCodeDesc: '如果你被朋友推荐了，在这里输入他们的推荐码。', howItWorks: '如何运作', enterReferralCode: '输入推荐码(例如: FIT-ABC123)', applyCode: '应用', applying: '应用中...', referralApplied: '推荐码已应用!享受你的免费月吧!', referralLimitReached: '已达推荐上限，无法继续推荐。', referralCodeNotFound: '无效的推荐码', loadingReferrals: '加载中...', totalReferralsNum: '总推荐数', successfulReferralsNum: '成功转化', monthsEarnedNum: '已获月数' },
  toast: { error: '错误', success: '成功', warning: '警告', info: '提示', copySuccess: '推荐码已复制!', copyFailed: '复制失败' },
  footer: { rightsReserved: '版权所有。' },
  sidebar: { signedOut: '已退出登录', signOutTitle: '退出登录', coach: '教练', client: '学员', user: '用户' },
  forms: { requiredField: '此字段为必填项', invalidEmail: '请输入有效的邮箱地址', validationError: '验证错误', generalError: '发生意外错误' },
  actions: { adding: '添加中...', saving: '保存中...', updating: '更新中...', deleting: '删除中...', sending: '发送中...', redirecting: '重定向中...' }
};

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

