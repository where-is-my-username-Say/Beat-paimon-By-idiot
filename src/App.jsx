import { useState, useEffect, useRef } from 'react'
import { Button } from '@/components/ui/button.jsx'
import './App.css'
import newBackgroundMusic from './assets/new_background_music.mp3'
import hitSound from './assets/hit_sound.mp3'
import xpSound from './assets/xp_sound.mp3'
import duckNormal from './assets/paimon_normal.png'
import duckHit from './assets/paimon_hit.jpg'
const duckDead = 'https://files.manuscdn.com/user_upload_by_module/session_file/310519663178840581/LGKfuXatEFTNswMW.png'
import backgroundVideo from './assets/new_background.mp4'
const bossMutated = 'https://files.manuscdn.com/user_upload_by_module/session_file/310519663178840581/bSJnURVNExTZZjYD.jpg'
const bossWater = 'https://files.manuscdn.com/user_upload_by_module/session_file/310519663178840581/VFGFkfgQsmwjcbJy.jpg'
const bossGhost = 'https://files.manuscdn.com/user_upload_by_module/session_file/310519663178840581/TmEQFVsJYgQaNGoT.jpg'

// Translations
const translations = {
  en: {
    title: "⭐ Paimon Clicker - Ultimate Edition",
    saveGame: "💾 Save",
    loadGame: "📂 Load",
    mute: "🔊 Mute",
    unmute: "🔇 Unmute",
    money: "💰 Money",
    damage: "⚔️ Damage",
    kills: "🏆 Kills",
    combo: "🔥 Combo",
    duckHealth: "Paimon Health",
    bossHealth: "BOSS Health",
    upgrades: "⚡ Upgrades",
    events: "🎉 Events",
    achievements: "🏅 Achievements",
    missions: "📋 Missions",
    upgradeDamage: "⬆️ Upgrade Damage",
    upgradeCritChance: "⬆️ Upgrade Crit",
    buyAutoClicker: "🤖 Buy Auto-Clicker",
    spinWheel: "🎰 Spin Wheel",
    bossWarning: "⚠️ BOSS INCOMING!",
    eventActive: "Event Active:",
    comboMultiplier: "Combo x",
    languageButton: "العربية",
    leaderboard: "🏆 Leaderboard",
    viewLeaderboard: "View Leaderboard",
    submitScore: "Submit Score",
    enterName: "Enter your name",
    rank: "Rank",
    player: "Player",
    score: "Score",
    closeLeaderboard: "Close"
  },
  ar: {
    title: "⭐ لعبة Paimon Clicker - النسخة النهائية",
    saveGame: "💾 حفظ",
    loadGame: "📂 تحميل",
    mute: "🔊 كتم",
    unmute: "🔇 إلغاء الكتم",
    money: "💰 المال",
    damage: "⚔️ الضرر",
    kills: "🏆 القتلى",
    combo: "🔥 السلسلة",
    duckHealth: "صحة Paimon",
    bossHealth: "صحة الزعيم",
    upgrades: "⚡ الترقيات",
    events: "🎉 الأحداث",
    achievements: "🏅 الإنجازات",
    missions: "📋 المهام",
    upgradeDamage: "⬆️ ترقية الضرر",
    upgradeCritChance: "⬆️ ترقية الضربة الحرجة",
    buyAutoClicker: "🤖 شراء النقر التلقائي",
    spinWheel: "🎰 تدوير العجلة",
    bossWarning: "⚠️ زعيم قادم!",
    eventActive: "حدث نشط:",
    comboMultiplier: "سلسلة x",
    languageButton: "English",
    leaderboard: "🏆 لوحة المتصدرين",
    viewLeaderboard: "عرض لوحة المتصدرين",
    submitScore: "إرسال النتيجة",
    enterName: "أدخل اسمك",
    rank: "الترتيب",
    player: "اللاعب",
    score: "النتيجة",
    closeLeaderboard: "إغلاق"
  }
}

// Events configuration
const EVENTS = [
  { id: 'storm', name: '🌧️ Storm', effect: 'autoClickerSpeed', multiplier: 2, duration: 15000 },
  { id: 'goldRush', name: '💰 Gold Rush', effect: 'moneyMultiplier', multiplier: 3, duration: 20000 },
  { id: 'powerSurge', name: '⚡ Power Surge', effect: 'damageMultiplier', multiplier: 2.5, duration: 12000 },
  { id: 'critBoost', name: '🎯 Crit Boost', effect: 'critChance', multiplier: 2, duration: 15000 },
]

// Boss configuration
const BOSSES = [
  { id: 'mutated', name: 'Mutated Duck', image: bossMutated, healthMultiplier: 10, reward: 100 },
  { id: 'water', name: 'Water Beast', image: bossWater, healthMultiplier: 15, reward: 200 },
  { id: 'ghost', name: 'Ghost Duck', image: bossGhost, healthMultiplier: 20, reward: 300 },
]

function App() {
  // Core game state
  const [duckHealth, setDuckHealth] = useState(100)
  const [maxHealth, setMaxHealth] = useState(100)
  const [money, setMoney] = useState(0)
  const [damage, setDamage] = useState(1)
  const [totalKills, setTotalKills] = useState(0)
  const [isHit, setIsHit] = useState(false)
  const [isDead, setIsDead] = useState(false)
  
  // Upgrade levels
  const [damageLevel, setDamageLevel] = useState(1)
  const [critChance, setCritChance] = useState(0.1)
  const [critDamageMultiplier, setCritDamageMultiplier] = useState(2)
  const [autoClickerDamage, setAutoClickerDamage] = useState(0)
  const [autoClickerSpeed, setAutoClickerSpeed] = useState(1000)
  
  // New features
  const [combo, setCombo] = useState(0)
  const [lastClickTime, setLastClickTime] = useState(Date.now())
  const [activeEvent, setActiveEvent] = useState(null)
  const [eventEndTime, setEventEndTime] = useState(0)
  const [isBoss, setIsBoss] = useState(false)
  const [currentBoss, setCurrentBoss] = useState(null)
  const [particles, setParticles] = useState([])
  const [achievements, setAchievements] = useState([])
  const [wheelSpinAvailable, setWheelSpinAvailable] = useState(true)
  
  // UI state
  const [isMuted, setIsMuted] = useState(false)
  const [language, setLanguage] = useState('en')
  const [showBossWarning, setShowBossWarning] = useState(false)
  const [showLeaderboard, setShowLeaderboard] = useState(false)
  const [leaderboardData, setLeaderboardData] = useState([])
  const [playerName, setPlayerName] = useState('')
  
  // Audio refs
  const backgroundMusicRef = useRef(null)
  const hitSoundRef = useRef(null)
  const xpSoundRef = useRef(null)
  
  // Get current translation
  const t = translations[language]
  
  // Calculate costs
  const damageUpgradeCost = Math.floor(10 * Math.pow(1.5, damageLevel - 1))
  const critUpgradeCost = Math.floor(50 * Math.pow(2, Math.floor(critChance * 10) - 1))
  const autoClickerCost = autoClickerDamage === 0 ? 100 : Math.floor(50 * Math.pow(1.8, autoClickerDamage))
  
  // Auto-play music
  useEffect(() => {
    if (backgroundMusicRef.current) {
      backgroundMusicRef.current.muted = isMuted; // Set muted state based on isMuted
      backgroundMusicRef.current.play().catch(e => console.log("Auto-play prevented:", e));
    }
  }, [isMuted]);
  
  // Toggle mute
  const toggleMute = () => {
    if (backgroundMusicRef.current) {
      const newMutedState = !isMuted;
      backgroundMusicRef.current.muted = newMutedState;
      setIsMuted(newMutedState);
    }
  }
  
  // Toggle language
  const toggleLanguage = () => {
    setLanguage(prev => prev === 'en' ? 'ar' : 'en')
  }
  
  // Create particles
  const createParticles = (x, y, isCrit = false, isCombo = false) => {
    const newParticles = []
    const particleCount = isCrit ? 40 : isCombo ? 30 : 25
    const size = isCrit ? 20 : isCombo ? 18 : 15
    
    for (let i = 0; i < particleCount; i++) {
      newParticles.push({
        id: Date.now() + i + Math.random(),
        x,
        y,
        vx: (Math.random() - 0.5) * 20,
        vy: (Math.random() - 0.5) * 20,
        color: isCrit ? '#ff0000' : isCombo ? '#00ff00' : '#ffaa00',
        size,
      })
    }
    setParticles(prev => [...prev, ...newParticles])
    setTimeout(() => {
      setParticles(prev => prev.filter(p => !newParticles.find(np => np.id === p.id)))
    }, 1200)
  }
  
  // Combo system
  useEffect(() => {
    const comboTimeout = setTimeout(() => {
      if (Date.now() - lastClickTime > 2000) {
        setCombo(0)
      }, 2100)
    return () => clearTimeout(comboTimeout)
  }, [lastClickTime])
  
  // Random events
  useEffect(() => {
    const eventInterval = setInterval(() => {
      if (!activeEvent && Math.random() < 0.3) {
        const randomEvent = EVENTS[Math.floor(Math.random() * EVENTS.length)]
        setActiveEvent(randomEvent)
        setEventEndTime(Date.now() + randomEvent.duration)
      }, 30000) // Check every 30 seconds
    
    return () => clearInterval(eventInterval)
  }, [activeEvent])
  
  // Clear expired events
  useEffect(() => {
    if (activeEvent && eventEndTime > 0 && Date.now() > eventEndTime) {
      setActiveEvent(null)
    }
  }, [activeEvent, eventEndTime])
  
  // Boss system
  useEffect(() => {
    if (totalKills > 0 && totalKills % 10 === 0 && !isBoss && !isDead) {
      setShowBossWarning(true)
      setTimeout(() => {
        setShowBossWarning(false)
        const bossIndex = Math.floor(totalKills / 10) % BOSSES.length
        const boss = BOSSES[bossIndex]
        setCurrentBoss(boss)
        setIsBoss(true)
        const bossHealth = maxHealth * boss.healthMultiplier
        setMaxHealth(bossHealth)
        setDuckHealth(bossHealth)
      }, 3000)
    }
  }, [totalKills])
  
  // Handle duck click
  const handleDuckClick = (event, source = 'player') => {
    let actualDamage = damage
    let isCritical = false
    
    // Apply event multipliers
    if (activeEvent && activeEvent.effect === 'damageMultiplier') {
      actualDamage *= activeEvent.multiplier
    }
    
    // Apply combo multiplier
    const comboMultiplier = 1 + (combo * 0.1)
    actualDamage *= comboMultiplier
    
    // Check for critical hit
    let effectiveCritChance = critChance
    if (activeEvent && activeEvent.effect === 'critChance') {
      effectiveCritChance *= activeEvent.multiplier
    }
    
    if (Math.random() < effectiveCritChance) {
      actualDamage *= critDamageMultiplier
      isCritical = true
    }
    
    const newHealth = Math.max(0, duckHealth - actualDamage)
    setDuckHealth(newHealth)
    setIsHit(true)
    setTimeout(() => setIsHit(false), 200)
    
    // Update combo
    if (source === 'player') {
      setLastClickTime(Date.now())
      setCombo(prev => prev + 1)
    }
    
    // Play hit sound
    if (hitSoundRef.current) {
      hitSoundRef.current.currentTime = 0
      hitSoundRef.current.play()
    }
    
    // Create particles
    if (event && source === 'player') {
      const rect = event.target.getBoundingClientRect()
      const x = event.clientX - rect.left
      const y = event.clientY - rect.top
      createParticles(x, y, isCritical, combo > 5)
    }
    
    // Check if duck/boss is killed
    if (newHealth === 0) {
      setIsDead(true)
      setCombo(0)
      
      // Play XP sound
      if (xpSoundRef.current) {
        xpSoundRef.current.currentTime = 0
        xpSoundRef.current.play()
      }
      
      setTimeout(() => {
        setIsDead(false)
        
        // Calculate reward
        let reward = 5 + Math.floor(totalKills / 5)
        if (isBoss && currentBoss) {
          reward += currentBoss.reward
        }
        
        // Apply event multiplier
        if (activeEvent && activeEvent.effect === 'moneyMultiplier') {
          reward *= activeEvent.multiplier
        }
        
        setMoney(prev => prev + reward)
        setTotalKills(prev => prev + 1)
        
        // Reset duck
        if (isBoss) {
          setIsBoss(false)
          setCurrentBoss(null)
        }
        
        const newMaxHealth = 100 + Math.floor(totalKills * 10)
        setMaxHealth(newMaxHealth)
        setDuckHealth(newMaxHealth)
      }, 1500)
    }
  }
  
  // Auto-clicker
  useEffect(() => {
    if (autoClickerDamage > 0 && !isDead) {
      let effectiveSpeed = autoClickerSpeed
      if (activeEvent && activeEvent.effect === 'autoClickerSpeed') {
        effectiveSpeed /= activeEvent.multiplier
      }
      
      const interval = setInterval(() => {
        handleDuckClick(null, 'auto')
      }, effectiveSpeed)
      return () => clearInterval(interval)
    }
  }, [autoClickerDamage, autoClickerSpeed, duckHealth, damage, critChance, critDamageMultiplier, totalKills, money, isDead, activeEvent, combo])
  
  // Upgrades
  const handleDamageUpgrade = () => {
    if (money >= damageUpgradeCost) {
      setMoney(prev => prev - damageUpgradeCost)
      setDamage(prev => prev + 1)
      setDamageLevel(prev => prev + 1)
    }
  }
  
  const handleCritUpgrade = () => {
    if (money >= critUpgradeCost && critChance < 0.9) {
      setMoney(prev => prev - critUpgradeCost)
      setCritChance(prev => Math.min(0.9, prev + 0.05))
    }
  }
  
  const handleAutoClickerPurchase = () => {
    if (money >= autoClickerCost) {
      setMoney(prev => prev - autoClickerCost)
      if (autoClickerDamage === 0) {
        setAutoClickerDamage(1)
      } else {
        setAutoClickerDamage(prev => prev + 1)
      }
  }
  
  // Wheel spin
  const handleWheelSpin = () => {
    if (!wheelSpinAvailable) return
    
    const rewards = [
      { type: 'money', amount: 100 },
      { type: 'money', amount: 500 },
      { type: 'damage', amount: 5 },
      { type: 'event', event: EVENTS[Math.floor(Math.random() * EVENTS.length)] },
    ]
    
    const reward = rewards[Math.floor(Math.random() * rewards.length)]
    
    if (reward.type === 'money') {
      setMoney(prev => prev + reward.amount)
      alert(`🎰 You won ${reward.amount} money!`)
    } else if (reward.type === 'damage') {
      setDamage(prev => prev + reward.amount)
      alert(`🎰 You won +${reward.amount} damage!`)
    } else if (reward.type === 'event') {
      setActiveEvent(reward.event)
      setEventEndTime(Date.now() + reward.event.duration)
      alert(`🎰 You activated ${reward.event.name}!`)
    }
    
    setWheelSpinAvailable(false)
    setTimeout(() => setWheelSpinAvailable(true), 60000) // 1 minute cooldown
  }
  
  // Save/Load
  const saveGame = () => {
    const gameState = {
      duckHealth, maxHealth, money, damage, totalKills, damageLevel,
      critChance, critDamageMultiplier, autoClickerDamage, autoClickerSpeed,
      combo, achievements, language
    }
    localStorage.setItem("duckClickerEnhanced", JSON.stringify(gameState))
    alert(t.saveGame + " ✓")
  }
  
  const loadGame = () => {
    const saved = localStorage.getItem("duckClickerEnhanced")
    if (saved) {
      const state = JSON.parse(saved)
      setDuckHealth(state.duckHealth || 100)
      setMaxHealth(state.maxHealth || 100)
      setMoney(state.money || 0)
      setDamage(state.damage || 1)
      setTotalKills(state.totalKills || 0)
      setDamageLevel(state.damageLevel || 1)
      setCritChance(state.critChance || 0.1)
      setCritDamageMultiplier(state.critDamageMultiplier || 2)
      setAutoClickerDamage(state.autoClickerDamage || 0)
      setAutoClickerSpeed(state.autoClickerSpeed || 1000)
      setCombo(state.combo || 0)
      setAchievements(state.achievements || [])
      if (state.language) setLanguage(state.language)
      alert(t.loadGame + " ✓")
    } else {
      alert("No saved game!")
    }
  }
  
  // Calculate health percentage
  const healthPercentage = (duckHealth / maxHealth) * 100
  
  // Determine duck image
  const getDuckImage = () => {
    if (isBoss && currentBoss) return currentBoss.image
    if (isDead) return duckDead
    if (isHit) return duckHit
    return duckNormal
  }

  // Leaderboard functions
  const loadLeaderboard = () => {
    const saved = localStorage.getItem("duckClickerLeaderboard")
    if (saved) {
      setLeaderboardData(JSON.parse(saved))
    }
  }
  
  const submitToLeaderboard = () => {
    if (!playerName.trim()) {
      alert(t.enterName)
      return
    }
    
    const newEntry = {
      name: playerName.trim(),
      score: Math.floor(money),
      kills: totalKills,
      timestamp: Date.now()
    }
    
    const currentLeaderboard = [...leaderboardData, newEntry]
    currentLeaderboard.sort((a, b) => b.score - a.score)
    const topTen = currentLeaderboard.slice(0, 10)
    
    setLeaderboardData(topTen)
    localStorage.setItem("duckClickerLeaderboard", JSON.stringify(topTen))
    alert("Score submitted!")
  }
  
  useEffect(() => {
    loadLeaderboard()
  }, [])
  
  return (
    <div className="min-h-screen relative overflow-hidden" dir={language === 'ar' ? 'rtl' : 'ltr'}>
      {/* Background Video */}
      <video
        autoPlay
        loop
        muted
        className="absolute top-0 left-0 w-full h-full object-cover"
        style={{ zIndex: -1 }}
      >
        <source src={backgroundVideo} type="video/mp4" />
      </video>
      
      {/* Audio */}
      <audio ref={backgroundMusicRef} src={newBackgroundMusic} loop />
      <audio ref={hitSoundRef} src={hitSound} />
      <audio ref={xpSoundRef} src={xpSound} />
      
      {/* Boss Warning */}
      {showBossWarning && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 animate-pulse">
          <div className="text-6xl font-bold text-red-500 animate-bounce">
            {t.bossWarning}
          </div>
        </div>
      )}
      
      {/* Particles */}
      {particles.map(particle => (
        <div
          key={particle.id}
          className="fixed pointer-events-none animate-particle"
          style={{
            left: particle.x,
            top: particle.y,
            width: particle.size,
            height: particle.size,
            backgroundColor: particle.color,
            borderRadius: '50%',
            transform: `translate(${particle.vx * 10}px, ${particle.vy * 10}px)`,
            opacity: 0,
            transition: 'all 1s ease-out',
          }}
        />
      ))}
      
      <div className="relative z-10 flex items-center justify-center min-h-screen p-4">
        <div className="w-full max-w-6xl">
          {/* Title */}
          <h1 className="text-5xl font-bold text-white text-center mb-6 drop-shadow-2xl animate-pulse">
            {t.title}
          </h1>
          
          {/* Controls */}
          <div className="flex justify-center gap-3 mb-4 flex-wrap">
            <Button onClick={saveGame} className="bg-blue-600 hover:bg-blue-700 transition-all hover:scale-110">{t.saveGame}</Button>
            <Button onClick={loadGame} className="bg-green-600 hover:bg-green-700 transition-all hover:scale-110">{t.loadGame}</Button>
            <Button onClick={toggleMute} className="bg-purple-600 hover:bg-purple-700 transition-all hover:scale-110">
              {isMuted ? t.unmute : t.mute}
            </Button>
            <Button onClick={toggleLanguage} className="bg-orange-600 hover:bg-orange-700 transition-all hover:scale-110">
              {t.languageButton}
            </Button>
            <Button 
              onClick={handleWheelSpin} 
              disabled={!wheelSpinAvailable}
              className="bg-pink-600 hover:bg-pink-700 transition-all hover:scale-110 disabled:opacity-50"
            >
              {t.spinWheel}
            </Button>
            <Button 
              onClick={() => setShowLeaderboard(true)}
              className="bg-yellow-500 hover:bg-yellow-600 transition-all hover:scale-110"
            >
              {t.leaderboard}
            </Button>
          </div>
          
          {/* Active Event Banner */}
          {activeEvent && (
            <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-center py-3 rounded-xl mb-4 font-bold text-lg animate-pulse shadow-2xl">
              {t.eventActive} {activeEvent.name} ({eventEndTime > Date.now() ? Math.floor((eventEndTime - Date.now()) / 1000) + 's' : ''})
            </div>
          )}
          
          {/* Stats */}
          <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl p-6 mb-4">
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-center">
              <div className="bg-gradient-to-br from-green-500 to-green-700 rounded-xl p-4 shadow-lg transform hover:scale-105 transition-all">
                <div className="text-white text-sm font-semibold">{t.money}</div>
                <div className="text-white text-2xl font-bold">{Math.floor(money)}</div>
              </div>
              <div className="bg-gradient-to-br from-red-500 to-red-700 rounded-xl p-4 shadow-lg transform hover:scale-105 transition-all">
                <div className="text-white text-sm font-semibold">{t.damage}</div>
                <div className="text-white text-2xl font-bold">{damage}</div>
              </div>
              <div className="bg-gradient-to-br from-purple-500 to-purple-700 rounded-xl p-4 shadow-lg transform hover:scale-105 transition-all">
                <div className="text-white text-sm font-semibold">{t.kills}</div>
                <div className="text-white text-2xl font-bold">{totalKills}</div>
              </div>
              <div className="bg-gradient-to-br from-orange-500 to-orange-700 rounded-xl p-4 shadow-lg transform hover:scale-105 transition-all">
                <div className="text-white text-sm font-semibold">{t.combo}</div>
                <div className="text-white text-2xl font-bold">{combo}</div>
              </div>
              <div className="bg-gradient-to-br from-blue-500 to-blue-700 rounded-xl p-4 shadow-lg transform hover:scale-105 transition-all">
                <div className="text-white text-sm font-semibold">Crit</div>
                <div className="text-white text-2xl font-bold">{Math.floor(critChance * 100)}%</div>
              </div>
            </div>
          </div>
          
          {/* Main Game */}
          <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl p-8">
            {/* Health Bar */}
            <div className="mb-6">
              <div className="flex justify-between mb-2">
                <span className="font-bold text-gray-800">{isBoss ? t.bossHealth : t.duckHealth}</span>
                <span className="font-bold text-gray-800">{Math.floor(duckHealth)} / {maxHealth}</span>
              </div>
              <div className="w-full bg-gray-300 rounded-full h-8 overflow-hidden shadow-inner">
                <div
                  className={`h-full transition-all duration-300 ${isBoss ? 'bg-gradient-to-r from-red-600 to-purple-600' : 'bg-gradient-to-r from-green-400 to-green-600'}`}
                  style={{ width: `${healthPercentage}%` }}
                />
              </div>
            </div>
            
            {/* Duck/Boss */}
            <div className="flex justify-center mb-6">
              <img
                src={getDuckImage()}
                alt="Paimon"
                onClick={handleDuckClick}
                className={`cursor-pointer rounded-2xl shadow-2xl transition-all duration-200 ${
                  isHit ? 'scale-95' : 'scale-100 hover:scale-105'
                } ${isBoss ? 'w-96 h-96 border-8 border-red-600 animate-pulse' : 'w-80 h-80'}`}
                style={{ objectFit: 'cover' }}
              />
            </div>
            
            {/* Combo Multiplier */}
            {combo > 3 && (
              <div className="text-center mb-4">
                <span className="text-3xl font-bold text-orange-600 animate-bounce">
                  {t.comboMultiplier}{combo} (x{(1 + combo * 0.1).toFixed(1)})
                </span>
              </div>
            )}
            
            {/* Upgrades */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button
                onClick={handleDamageUpgrade}
                disabled={money < damageUpgradeCost}
                className="bg-red-600 hover:bg-red-700 text-white font-bold py-4 rounded-xl transition-all hover:scale-105 disabled:opacity-50"
              >
                {t.upgradeDamage}<br/>
                💰 {damageUpgradeCost}
              </Button>
              
              <Button
                onClick={handleCritUpgrade}
                disabled={money < critUpgradeCost || critChance >= 0.9}
                className="bg-yellow-600 hover:bg-yellow-700 text-white font-bold py-4 rounded-xl transition-all hover:scale-105 disabled:opacity-50"
              >
                {t.upgradeCritChance}<br/>
                💰 {critUpgradeCost}
              </Button>
              
              <Button
                onClick={handleAutoClickerPurchase}
                disabled={money < autoClickerCost}
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl transition-all hover:scale-105 disabled:opacity-50"
              >
                {autoClickerDamage === 0 ? t.buyAutoClicker : `⬆️ AC (${autoClickerDamage})`}<br/>
                💰 {autoClickerCost}
              </Button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Leaderboard Modal */}
      {showLeaderboard && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto">
            <h2 className="text-4xl font-bold text-center mb-6 text-purple-600">{t.leaderboard}</h2>
            
            {/* Submit Score Section */}
            <div className="mb-6 p-4 bg-gradient-to-r from-blue-100 to-purple-100 rounded-xl">
              <h3 className="text-xl font-bold mb-3">{t.submitScore}</h3>
              <div className="flex gap-3">
                <input
                  type="text"
                  placeholder={t.enterName}
                  value={playerName}
                  onChange={(e) => setPlayerName(e.target.value)}
                  className="flex-1 px-4 py-2 border-2 border-purple-300 rounded-lg focus:outline-none focus:border-purple-500"
                  maxLength={20}
                />
                <Button 
                  onClick={submitToLeaderboard}
                  className="bg-purple-600 hover:bg-purple-700 text-white font-bold px-6"
                >
                  {t.submitScore}
                </Button>
              </div>
              <div className="mt-2 text-sm text-gray-600">
                {t.score}: {Math.floor(money)} | {t.kills}: {totalKills}
              </div>
            </div>
            
            {/* Leaderboard Table */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gradient-to-r from-purple-600 to-blue-600 text-white">
                    <th className="px-4 py-3 text-left rounded-tl-lg">{t.rank}</th>
                    <th className="px-4 py-3 text-left">{t.player}</th>
                    <th className="px-4 py-3 text-right">{t.score}</th>
                    <th className="px-4 py-3 text-right rounded-tr-lg">{t.kills}</th>
                  </tr>
                </thead>
                <tbody>
                  {leaderboardData.length === 0 ? (
                    <tr>
                      <td colSpan="4" className="text-center py-8 text-gray-500">
                        No scores yet. Be the first!
                      </td>
                    </tr>
                  ) : (
                    leaderboardData.map((entry, index) => (
                      <tr 
                        key={index} 
                        className={`border-b ${index % 2 === 0 ? 'bg-gray-50' : 'bg-white'} hover:bg-purple-50 transition-colors`}
                      >
                        <td className="px-4 py-3 font-bold">
                          {index === 0 && '🥇'}
                          {index === 1 && '🥈'}
                          {index === 2 && '🥉'}
                          {index > 2 && `#${index + 1}`}
                        </td>
                        <td className="px-4 py-3 font-semibold">{entry.name}</td>
                        <td className="px-4 py-3 text-right font-bold text-green-600">{entry.score}</td>
                        <td className="px-4 py-3 text-right text-purple-600">{entry.kills}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
            
            {/* Close Button */}
            <div className="mt-6 text-center">
              <Button 
                onClick={() => setShowLeaderboard(false)}
                className="bg-red-600 hover:bg-red-700 text-white font-bold px-8 py-3"
              >
                {t.closeLeaderboard}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default App


