import { useState, useEffect, useRef } from 'react'
import { Button } from '@/components/ui/button.jsx'
import './App.css'
import newBackgroundMusic from './assets/new_background_music.mp3'
import hitSound from './assets/hit_sound.mp3'
import xpSound from './assets/xp_sound.mp3'
import duckNormal from './assets/fish.jpg'
import duckHit from './assets/being_attacked.jpg'
import duckDead from './assets/dead.jpg'
import backgroundVideo from './assets/background_video.mp4'

// Translations
const translations = {
  en: {
    title: "🦆 Duck Clicker Game",
    saveGame: "💾 Save Game",
    loadGame: "📂 Load Game",
    mute: "🔊 Mute",
    unmute: "🔇 Unmute",
    money: "💰 Money",
    damage: "⚔️ Damage",
    kills: "🏆 Kills",
    level: "📊 Level",
    duckHealth: "Duck Health",
    clickInstruction: "Click the duck to attack! Each click deals",
    damageText: "damage.",
    critInfo: "Crit Chance,",
    critDamage: "Crit Damage",
    upgrades: "⚡ Upgrades",
    damageLabel: "Damage:",
    cost: "Cost:",
    upgradeDamage: "⬆️ Upgrade Damage",
    notEnoughMoney: "🔒 Not Enough Money",
    critChanceLabel: "Crit Chance:",
    upgradeCritChance: "⬆️ Upgrade Crit Chance",
    maxCritChance: "✅ Max Crit Chance",
    critDamageLabel: "Crit Damage:",
    upgradeCritDamage: "⬆️ Upgrade Crit Damage",
    autoClickerLabel: "Auto-Clicker:",
    off: "Off",
    dmg: "DMG:",
    speed: "Speed:",
    dmgCost: "DMG Cost:",
    speedCost: "Speed Cost:",
    buyAutoClicker: "🤖 Buy Auto-Clicker",
    upgradeACDamage: "⬆️ Upgrade AC Damage",
    upgradeACSpeed: "⬆️ Upgrade AC Speed",
    maxACSpeed: "✅ Max AC Speed",
    footer: "Kill ducks to earn money and upgrade your damage!",
    gameSaved: "Game Saved!",
    gameLoaded: "Game Loaded!",
    noSavedGame: "No saved game found!",
    languageButton: "العربية"
  },
  ar: {
    title: "🦆 لعبة قتل البطة",
    saveGame: "💾 حفظ اللعبة",
    loadGame: "📂 تحميل اللعبة",
    mute: "🔊 كتم الصوت",
    unmute: "🔇 إلغاء الكتم",
    money: "💰 المال",
    damage: "⚔️ الضرر",
    kills: "🏆 القتلى",
    level: "📊 المستوى",
    duckHealth: "صحة البطة",
    clickInstruction: "انقر على البطة لمهاجمتها! كل نقرة تسبب",
    damageText: "ضرر.",
    critInfo: "فرصة الضربة الحرجة,",
    critDamage: "ضرر الضربة الحرجة",
    upgrades: "⚡ الترقيات",
    damageLabel: "الضرر:",
    cost: "التكلفة:",
    upgradeDamage: "⬆️ ترقية الضرر",
    notEnoughMoney: "🔒 لا يوجد مال كافٍ",
    critChanceLabel: "فرصة الضربة الحرجة:",
    upgradeCritChance: "⬆️ ترقية فرصة الضربة الحرجة",
    maxCritChance: "✅ أقصى فرصة للضربة الحرجة",
    critDamageLabel: "ضرر الضربة الحرجة:",
    upgradeCritDamage: "⬆️ ترقية ضرر الضربة الحرجة",
    autoClickerLabel: "النقر التلقائي:",
    off: "متوقف",
    dmg: "الضرر:",
    speed: "السرعة:",
    dmgCost: "تكلفة الضرر:",
    speedCost: "تكلفة السرعة:",
    buyAutoClicker: "🤖 شراء النقر التلقائي",
    upgradeACDamage: "⬆️ ترقية ضرر النقر التلقائي",
    upgradeACSpeed: "⬆️ ترقية سرعة النقر التلقائي",
    maxACSpeed: "✅ أقصى سرعة للنقر التلقائي",
    footer: "اقتل البط لكسب المال وترقية ضررك!",
    gameSaved: "تم حفظ اللعبة!",
    gameLoaded: "تم تحميل اللعبة!",
    noSavedGame: "لا يوجد لعبة محفوظة!",
    languageButton: "English"
  }
}

function App() {
  // Game state
  const [duckHealth, setDuckHealth] = useState(100)
  const [maxHealth, setMaxHealth] = useState(100)
  const [money, setMoney] = useState(0)
  const [damage, setDamage] = useState(1)
  const [damageLevel, setDamageLevel] = useState(1)
  const [totalKills, setTotalKills] = useState(0)
  const [isHit, setIsHit] = useState(false)
  const [critChance, setCritChance] = useState(0.1) // 10% critical hit chance
  const [critDamageMultiplier, setCritDamageMultiplier] = useState(2) // 2x critical damage
  const [autoClickerDamage, setAutoClickerDamage] = useState(0)
  const [autoClickerSpeed, setAutoClickerSpeed] = useState(1000) // 1000ms = 1 click per second
  const [critChanceLevel, setCritChanceLevel] = useState(1)
  const [critDamageLevel, setCritDamageLevel] = useState(1)
  const [autoClickerLevel, setAutoClickerLevel] = useState(0)
  const [autoClickerDamageLevel, setAutoClickerDamageLevel] = useState(0)
  const [autoClickerSpeedLevel, setAutoClickerSpeedLevel] = useState(0)
  const [particles, setParticles] = useState([])
  const [isDead, setIsDead] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [language, setLanguage] = useState('en')

  // Audio refs
  const backgroundMusicRef = useRef(null)
  const hitSoundRef = useRef(null)
  const xpSoundRef = useRef(null)

  // Get current translation
  const t = translations[language]

  // Calculate upgrade costs
  const damageUpgradeCost = Math.floor(10 * Math.pow(1.5, damageLevel - 1))
  const critChanceUpgradeCost = Math.floor(50 * Math.pow(2, critChanceLevel - 1))
  const critDamageUpgradeCost = Math.floor(75 * Math.pow(2, critDamageLevel - 1))
  const autoClickerUpgradeCost = Math.floor(100 * Math.pow(2.5, autoClickerLevel))
  const autoClickerDamageUpgradeCost = Math.floor(50 * Math.pow(1.8, autoClickerDamageLevel))
  const autoClickerSpeedUpgradeCost = Math.floor(60 * Math.pow(1.7, autoClickerSpeedLevel))

  // Auto-play background music on mount
  useEffect(() => {
    if (backgroundMusicRef.current) {
      backgroundMusicRef.current.play().catch(error => {
        console.log("Auto-play prevented by browser:", error)
      })
    }
  }, [])

  // Toggle mute/unmute
  const toggleMute = () => {
    if (backgroundMusicRef.current) {
      backgroundMusicRef.current.muted = !isMuted
      setIsMuted(!isMuted)
    }
  }

  // Toggle language
  const toggleLanguage = () => {
    setLanguage(prev => prev === 'en' ? 'ar' : 'en')
  }

  // Create particles
  const createParticles = (x, y, isCrit = false) => {
    const newParticles = []
    const particleCount = isCrit ? 30 : 20
    for (let i = 0; i < particleCount; i++) {
      newParticles.push({
        id: Date.now() + i,
        x,
        y,
        vx: (Math.random() - 0.5) * 15,
        vy: (Math.random() - 0.5) * 15,
        color: isCrit ? '#ff0000' : '#ffaa00',
        size: isCrit ? 16 : 12,
      })
    }
    setParticles(prev => [...prev, ...newParticles])
    setTimeout(() => {
      setParticles(prev => prev.filter(p => !newParticles.find(np => np.id === p.id)))
    }, 1000)
  }

  // Save Game
  const saveGame = () => {
    const gameState = {
      duckHealth,
      maxHealth,
      money,
      damage,
      damageLevel,
      totalKills,
      critChance,
      critDamageMultiplier,
      autoClickerDamage,
      autoClickerSpeed,
      critChanceLevel,
      critDamageLevel,
      autoClickerLevel,
      autoClickerDamageLevel,
      autoClickerSpeedLevel,
      language,
    }
    localStorage.setItem("duckClickerGame", JSON.stringify(gameState))
    alert(t.gameSaved)
  }

  // Load Game
  const loadGame = () => {
    const savedGame = localStorage.getItem("duckClickerGame")
    if (savedGame) {
      const gameState = JSON.parse(savedGame)
      setDuckHealth(gameState.duckHealth)
      setMaxHealth(gameState.maxHealth)
      setMoney(gameState.money)
      setDamage(gameState.damage)
      setDamageLevel(gameState.damageLevel)
      setTotalKills(gameState.totalKills)
      setCritChance(gameState.critChance)
      setCritDamageMultiplier(gameState.critDamageMultiplier)
      setAutoClickerDamage(gameState.autoClickerDamage)
      setAutoClickerSpeed(gameState.autoClickerSpeed)
      setCritChanceLevel(gameState.critChanceLevel)
      setCritDamageLevel(gameState.critDamageLevel)
      setAutoClickerLevel(gameState.autoClickerLevel)
      setAutoClickerDamageLevel(gameState.autoClickerDamageLevel)
      setAutoClickerSpeedLevel(gameState.autoClickerSpeedLevel)
      if (gameState.language) setLanguage(gameState.language)
      alert(t.gameLoaded)
    } else {
      alert(t.noSavedGame)
    }
  }

  // Load game on component mount
  useEffect(() => {
    const savedGame = localStorage.getItem("duckClickerGame")
    if (savedGame) {
      try {
        const gameState = JSON.parse(savedGame)
        setDuckHealth(gameState.duckHealth || 100)
        setMaxHealth(gameState.maxHealth || 100)
        setMoney(gameState.money || 0)
        setDamage(gameState.damage || 1)
        setDamageLevel(gameState.damageLevel || 1)
        setTotalKills(gameState.totalKills || 0)
        setCritChance(gameState.critChance || 0.1)
        setCritDamageMultiplier(gameState.critDamageMultiplier || 2)
        setAutoClickerDamage(gameState.autoClickerDamage || 0)
        setAutoClickerSpeed(gameState.autoClickerSpeed || 1000)
        setCritChanceLevel(gameState.critChanceLevel || 1)
        setCritDamageLevel(gameState.critDamageLevel || 1)
        setAutoClickerLevel(gameState.autoClickerLevel || 0)
        setAutoClickerDamageLevel(gameState.autoClickerDamageLevel || 0)
        setAutoClickerSpeedLevel(gameState.autoClickerSpeedLevel || 0)
        if (gameState.language) setLanguage(gameState.language)
      } catch (e) {
        console.error("Failed to load game:", e)
      }
    }
  }, [])

  // Handle duck click
  const handleDuckClick = (event, source = 'player') => {
    let actualDamage = damage
    let isCritical = false

    if (Math.random() < critChance) {
      actualDamage *= critDamageMultiplier
      isCritical = true
    }

    const newHealth = Math.max(0, duckHealth - actualDamage)
    setDuckHealth(newHealth)
    setIsHit(true)
    setTimeout(() => setIsHit(false), 200)

    // Play hit sound
    if (hitSoundRef.current) {
      hitSoundRef.current.currentTime = 0
      hitSoundRef.current.play()
    }

    // Create particles at click position
    if (event && source === 'player') {
      const rect = event.target.getBoundingClientRect()
      const x = event.clientX - rect.left
      const y = event.clientY - rect.top
      createParticles(x, y, isCritical)
    }

    // Check if duck is killed
    if (newHealth === 0) {
      setIsDead(true)
      
      // Play XP sound
      if (xpSoundRef.current) {
        xpSoundRef.current.currentTime = 0
        xpSoundRef.current.play()
      }

      setTimeout(() => {
        setIsDead(false)
        
        // Award money
        const reward = 5 + Math.floor(totalKills / 5)
        setMoney(money + reward)
        setTotalKills(totalKills + 1)
        
        // Reset duck with increased health
        const newMaxHealth = 100 + Math.floor(totalKills * 10)
        setMaxHealth(newMaxHealth)
        setDuckHealth(newMaxHealth)
      }, 1500)
    }
  }

  // Auto-Clicker effect
  useEffect(() => {
    if (autoClickerDamage > 0 && !isDead) {
      const interval = setInterval(() => {
        handleDuckClick(null, 'auto')
      }, autoClickerSpeed)
      return () => clearInterval(interval)
    }
  }, [autoClickerDamage, autoClickerSpeed, duckHealth, damage, critChance, critDamageMultiplier, totalKills, money, isDead])

  // Handle damage upgrade
  const handleDamageUpgrade = () => {
    if (money >= damageUpgradeCost) {
      setMoney(money - damageUpgradeCost)
      setDamage(damage + 1)
      setDamageLevel(damageLevel + 1)
    }
  }

  // Handle crit chance upgrade
  const handleCritChanceUpgrade = () => {
    if (money >= critChanceUpgradeCost && critChance < 0.9) {
      setMoney(money - critChanceUpgradeCost)
      setCritChance(prev => Math.min(0.9, prev + 0.05))
      setCritChanceLevel(critChanceLevel + 1)
    }
  }

  // Handle crit damage upgrade
  const handleCritDamageUpgrade = () => {
    if (money >= critDamageUpgradeCost) {
      setMoney(money - critDamageUpgradeCost)
      setCritDamageMultiplier(prev => prev + 0.5)
      setCritDamageLevel(critDamageLevel + 1)
    }
  }

  // Handle auto-clicker purchase
  const handleAutoClickerPurchase = () => {
    if (money >= autoClickerUpgradeCost && autoClickerLevel === 0) {
      setMoney(money - autoClickerUpgradeCost)
      setAutoClickerDamage(1)
      setAutoClickerLevel(1)
    }
  }

  // Handle auto-clicker damage upgrade
  const handleAutoClickerDamageUpgrade = () => {
    if (money >= autoClickerDamageUpgradeCost && autoClickerLevel > 0) {
      setMoney(money - autoClickerDamageUpgradeCost)
      setAutoClickerDamage(prev => prev + 1)
      setAutoClickerDamageLevel(autoClickerDamageLevel + 1)
    }
  }

  // Handle auto-clicker speed upgrade
  const handleAutoClickerSpeedUpgrade = () => {
    if (money >= autoClickerSpeedUpgradeCost && autoClickerLevel > 0 && autoClickerSpeed > 100) {
      setMoney(money - autoClickerSpeedUpgradeCost)
      setAutoClickerSpeed(prev => Math.max(100, prev - 100))
      setAutoClickerSpeedLevel(autoClickerSpeedLevel + 1)
    }
  }

  // Calculate health percentage
  const healthPercentage = (duckHealth / maxHealth) * 100

  // Determine duck image based on state
  const getDuckImage = () => {
    if (isDead) return duckDead
    if (isHit) return duckHit
    return duckNormal
  }

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

      {/* Audio elements */}
      <audio ref={backgroundMusicRef} src={newBackgroundMusic} loop />
      <audio ref={hitSoundRef} src={hitSound} />
      <audio ref={xpSoundRef} src={xpSound} />

      <div className="relative z-10 flex items-center justify-center min-h-screen p-4">
        <div className="w-full max-w-4xl">
          {/* Game Title */}
          <h1 className="text-5xl font-bold text-white text-center mb-8 drop-shadow-lg">
            {t.title}
          </h1>

          {/* Save/Load/Mute/Language Buttons */}
          <div className="flex justify-center gap-4 mb-6 flex-wrap">
            <Button onClick={saveGame} className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg shadow-lg">{t.saveGame}</Button>
            <Button onClick={loadGame} className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-lg shadow-lg">{t.loadGame}</Button>
            <Button onClick={toggleMute} className="bg-purple-500 hover:bg-purple-600 text-white font-bold py-2 px-4 rounded-lg shadow-lg">
              {isMuted ? t.unmute : t.mute}
            </Button>
            <Button onClick={toggleLanguage} className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-2 px-4 rounded-lg shadow-lg">
              {t.languageButton}
            </Button>
          </div>

          {/* Stats Panel */}
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-2xl p-6 mb-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div className="bg-gradient-to-br from-green-400 to-green-600 rounded-xl p-4 shadow-lg">
                <div className="text-white text-sm font-semibold mb-1">{t.money}</div>
                <div className="text-white text-2xl font-bold">{money}</div>
              </div>
              <div className="bg-gradient-to-br from-red-400 to-red-600 rounded-xl p-4 shadow-lg">
                <div className="text-white text-sm font-semibold mb-1">{t.damage}</div>
                <div className="text-white text-2xl font-bold">{damage}</div>
              </div>
              <div className="bg-gradient-to-br from-purple-400 to-purple-600 rounded-xl p-4 shadow-lg">
                <div className="text-white text-sm font-semibold mb-1">{t.kills}</div>
                <div className="text-white text-2xl font-bold">{totalKills}</div>
              </div>
              <div className="bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-xl p-4 shadow-lg">
                <div className="text-white text-sm font-semibold mb-1">{t.level}</div>
                <div className="text-white text-2xl font-bold">{damageLevel}</div>
              </div>
            </div>
          </div>

          {/* Main Game Area */}
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-2xl p-8">
            {/* Health Bar */}
            <div className="mb-8">
              <div className="flex justify-between items-center mb-2">
                <span className="text-gray-700 font-semibold">{t.duckHealth}</span>
                <span className="text-gray-700 font-bold">{duckHealth} / {maxHealth}</span>
              </div>
              <div className="w-full h-8 bg-gray-200 rounded-full overflow-hidden shadow-inner">
                <div 
                  className="h-full bg-gradient-to-r from-green-400 via-green-500 to-green-600 transition-all duration-300 ease-out flex items-center justify-end pr-3"
                  style={{ width: `${healthPercentage}%` }}
                >
                  {healthPercentage > 10 && (
                    <span className="text-white text-sm font-bold drop-shadow">
                      {Math.round(healthPercentage)}%
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Duck Display */}
            <div className="flex justify-center mb-8 relative">
              <button
                onClick={handleDuckClick}
                className="cursor-pointer transition-all duration-200 hover:scale-110 active:scale-95 relative"
                disabled={isDead}
              >
                <img
                  src={getDuckImage()}
                  alt="Duck"
                  className="w-64 h-64 object-contain rounded-lg shadow-lg"
                  style={{
                    filter: isHit ? 'brightness(0.7)' : 'none',
                  }}
                />
                {/* Particles */}
                {particles.map(particle => (
                  <div
                    key={particle.id}
                    className="absolute pointer-events-none"
                    style={{
                      left: `${particle.x}px`,
                      top: `${particle.y}px`,
                      width: `${particle.size}px`,
                      height: `${particle.size}px`,
                      backgroundColor: particle.color,
                      borderRadius: '50%',
                      animation: 'particle-fade 1s ease-out forwards',
                      transform: `translate(${particle.vx * 10}px, ${particle.vy * 10}px)`,
                    }}
                  />
                ))}
              </button>
            </div>

            {/* Click Instruction */}
            <p className="text-center text-gray-600 mb-6 font-medium">
              {t.clickInstruction} {damage} {t.damageText}
              {critChance > 0 && ` (${(critChance * 100).toFixed(0)}% ${t.critInfo} ${critDamageMultiplier}x ${t.critDamage})`}
            </p>

            {/* Upgrade Section */}
            <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl p-6 border-2 border-amber-200">
              <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">
                {t.upgrades}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Damage Upgrade */}
                <div className="flex flex-col items-center justify-between gap-2 p-4 bg-white rounded-lg shadow">
                  <p className="text-gray-700 font-medium">{t.damageLabel} <span className="text-red-600 font-bold">{damage}</span></p>
                  <p className="text-gray-600 text-sm">{t.cost} <span className="font-bold">{damageUpgradeCost}</span> 💰</p>
                  <Button
                    onClick={handleDamageUpgrade}
                    disabled={money < damageUpgradeCost}
                    className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-bold py-2 px-4 rounded-lg text-sm transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {money >= damageUpgradeCost ? t.upgradeDamage : t.notEnoughMoney}
                  </Button>
                </div>

                {/* Crit Chance Upgrade */}
                <div className="flex flex-col items-center justify-between gap-2 p-4 bg-white rounded-lg shadow">
                  <p className="text-gray-700 font-medium">{t.critChanceLabel} <span className="text-blue-600 font-bold">{(critChance * 100).toFixed(0)}%</span></p>
                  <p className="text-gray-600 text-sm">{t.cost} <span className="font-bold">{critChanceUpgradeCost}</span> 💰</p>
                  <Button
                    onClick={handleCritChanceUpgrade}
                    disabled={money < critChanceUpgradeCost || critChance >= 0.9}
                    className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-bold py-2 px-4 rounded-lg text-sm transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {money >= critChanceUpgradeCost && critChance < 0.9 ? t.upgradeCritChance : (critChance >= 0.9 ? t.maxCritChance : t.notEnoughMoney)}
                  </Button>
                </div>

                {/* Crit Damage Upgrade */}
                <div className="flex flex-col items-center justify-between gap-2 p-4 bg-white rounded-lg shadow">
                  <p className="text-gray-700 font-medium">{t.critDamageLabel} <span className="text-purple-600 font-bold">{critDamageMultiplier}x</span></p>
                  <p className="text-gray-600 text-sm">{t.cost} <span className="font-bold">{critDamageUpgradeCost}</span> 💰</p>
                  <Button
                    onClick={handleCritDamageUpgrade}
                    disabled={money < critDamageUpgradeCost}
                    className="w-full bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white font-bold py-2 px-4 rounded-lg text-sm transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {money >= critDamageUpgradeCost ? t.upgradeCritDamage : t.notEnoughMoney}
                  </Button>
                </div>

                {/* Auto-Clicker Purchase/Upgrade */}
                <div className="flex flex-col items-center justify-between gap-2 p-4 bg-white rounded-lg shadow">
                  <p className="text-gray-700 font-medium">{t.autoClickerLabel} <span className="text-orange-600 font-bold">{autoClickerLevel > 0 ? `${t.dmg} ${autoClickerDamage}, ${t.speed} ${(1000 / autoClickerSpeed).toFixed(1)}/s` : t.off}</span></p>
                  {autoClickerLevel === 0 ? (
                    <p className="text-gray-600 text-sm">{t.cost} <span className="font-bold">{autoClickerUpgradeCost}</span> 💰</p>
                  ) : (
                    <div className="flex flex-col w-full gap-2">
                      <p className="text-gray-600 text-sm">{t.dmgCost} <span className="font-bold">{autoClickerDamageUpgradeCost}</span> 💰</p>
                      <p className="text-gray-600 text-sm">{t.speedCost} <span className="font-bold">{autoClickerSpeedUpgradeCost}</span> 💰</p>
                    </div>
                  )}
                  
                  {autoClickerLevel === 0 ? (
                    <Button
                      onClick={handleAutoClickerPurchase}
                      disabled={money < autoClickerUpgradeCost}
                      className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-bold py-2 px-4 rounded-lg text-sm transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {money >= autoClickerUpgradeCost ? t.buyAutoClicker : t.notEnoughMoney}
                    </Button>
                  ) : (
                    <div className="flex flex-col w-full gap-2">
                      <Button
                        onClick={handleAutoClickerDamageUpgrade}
                        disabled={money < autoClickerDamageUpgradeCost}
                        className="w-full bg-gradient-to-r from-orange-400 to-orange-500 hover:from-orange-500 hover:to-orange-600 text-white font-bold py-2 px-4 rounded-lg text-sm transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {money >= autoClickerDamageUpgradeCost ? t.upgradeACDamage : t.notEnoughMoney}
                      </Button>
                      <Button
                        onClick={handleAutoClickerSpeedUpgrade}
                        disabled={money < autoClickerSpeedUpgradeCost || autoClickerSpeed <= 100}
                        className="w-full bg-gradient-to-r from-orange-400 to-orange-500 hover:from-orange-500 hover:to-orange-600 text-white font-bold py-2 px-4 rounded-lg text-sm transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {money >= autoClickerSpeedUpgradeCost && autoClickerSpeed > 100 ? t.upgradeACSpeed : (autoClickerSpeed <= 100 ? t.maxACSpeed : t.notEnoughMoney)}
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <p className="text-white text-center mt-6 text-sm opacity-80">
            {t.footer}
          </p>
        </div>
      </div>
    </div>
  )
}

export default App

