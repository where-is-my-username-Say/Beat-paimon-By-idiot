if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/service-worker.js')
      .then(reg => console.log('Service Worker registered'))
      .catch(err => console.log('Registration failed:', err));
  });
}

// Game State Variables
let initialHP = 50;
let photoHP = initialHP;
let clickDamage = 2;
let gold = 0;
let hpIncrement = 25;
let upgradeCount = 0;
let photoDefeated = false;
let totalClicks = 0;
let totalDamage = 0;
let totalGoldEarned = 0;
let critChance = 0.1;
let critMultiplier = 2;
let critHits = 0;
let autoClickerActive = false;
let autoClickerInterval;
let autoClickerDamage = 0;
let autoClickerCost = 50;
let autoClickerSpeed = 1000;
let autoClickerLevel = 0;
let autoClickerSpeedCost = 30;
let autoClickerDamageCost = 25;
let critChanceCost = 10;
let critDamageCost = 10;
let musicMuted = false;
let soundMuted = false;
let currentLanguage = 'en';
let gameVersion = '1.3';

// Game Translations
const translations = {
  en: {
    welcome: "Welcome to Minecraft Duck Hunt!",
    damage: "Damage:",
    gold: "Gold:",
    critChance: "Crit Chance:",
    critMultiplier: "Crit Multiplier:",
    upgrade: "Upgrade",
    critChanceUpgrade: "Crit Chance",
    critDamageUpgrade: "Crit Damage",
    autoClicker: "Auto-Clicker",
    acDamage: "AC Damage",
    acSpeed: "AC Speed",
    fullscreen: "Fullscreen",
    toggleMusic: "Toggle Music",
    toggleSound: "Toggle Sound",
    restart: "Restart",
    donate: "Donate",
    language: "العربية",
    save: "Save Game",
    saved: "Game Saved Successfully!",
    load: "Game Loaded!",
    noSave: "No saved game found",
    saveError: "Save failed (storage full or not supported)",
    loadError: "Corrupted save data",
    confirmLoad: "Load saved game?",
    confirmReset: "Reset all progress?",
    storageError: "LocalStorage not supported in your browser!"
  },
  ar: {
    welcome: "اهلا يا متخلف!",
    damage: "الدمج:",
    gold: "قطع ذهبية:",
    critChance: "كريت ريت:",
    critMultiplier: "كريت دمج:",
    upgrade: "ط��ر",
    critChanceUpgrade: "كريت ريت",
    critDamageUpgrade: "كريت دمج",
    autoClicker: "اوتو كليكر للضعفاء",
    acDamage: "قوة الاوتو كليكر",
    acSpeed: "سرعة الاوتو كليكر",
    fullscreen: "تكبير الشاشة",
    toggleMusic: "تشغيل/إيقاف الموسيقى",
    toggleSound: "تشغيل/إيقاف الصوت",
    restart: "إعادة تشغيل",
    donate: "تبرع للمسكين",
    language: "English",
    save: "حفظ اللعبة",
    saved: "تم الحفظ بنجاح!",
    load: "تم تحميل اللعبة!",
    noSave: "لا يوجد حفظ سابق",
    saveError: "خطأ في الحفظ (قد يكون التخزين ممتلئاً أو غير مدعوم)",
    loadError: "بيانات الحفظ تالفة",
    confirmLoad: "تحميل اللعبة المحفوظة؟",
    confirmReset: "إعادة تعيين كل التقدم؟",
    storageError: "المتصفح لا يدعم خاصية الحفظ المحلي!"
  }
};

// DOM Elements
const elements = {
