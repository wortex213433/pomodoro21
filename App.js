import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  Dimensions,
  Vibration,
  TextInput,
} from 'react-native';
import { Svg, Circle } from 'react-native-svg';

const { width } = Dimensions.get('window');

export default function App() {
  const [mode, setMode] = useState('Focus');
  const [isRunning, setIsRunning] = useState(false);
  // Customizable durations (seconds)
  const [focusDurationSec, setFocusDurationSec] = useState(25 * 60);
  const [shortBreakDurationSec, setShortBreakDurationSec] = useState(5 * 60);
  const [longBreakDurationSec, setLongBreakDurationSec] = useState(15 * 60);
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [completedSessions, setCompletedSessions] = useState(0);
  const [todayMinutes, setTodayMinutes] = useState(0);
  
  const intervalRef = useRef(null);
  const [hasStarted, setHasStarted] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [showStats, setShowStats] = useState(false);
  const [showAbout, setShowAbout] = useState(false);
  const [weeklyStats, setWeeklyStats] = useState([]);
  const [sessionNotes, setSessionNotes] = useState('');
  const [showNotes, setShowNotes] = useState(false);
  const [dailyGoal, setDailyGoal] = useState(4);
  const [alarmType, setAlarmType] = useState('standard');
  const [currentStreak, setCurrentStreak] = useState(0);
  const [maxStreak, setMaxStreak] = useState(0);
  const [totalSessions, setTotalSessions] = useState(0);
  const [totalMinutes, setTotalMinutes] = useState(0);
  const [showCustomTimer, setShowCustomTimer] = useState(false);
  const [customMinutes, setCustomMinutes] = useState(25);
  const [showSettings, setShowSettings] = useState(false);
  const [currentTheme, setCurrentTheme] = useState('white');
  const [achievements, setAchievements] = useState([]);
  const [showAchievement, setShowAchievement] = useState(false);
  const [achievementText, setAchievementText] = useState('');
  const [motivationalQuotes] = useState([
    "Great work! Keep the momentum! 🚀",
    "You're crushing it! 💪",
    "Productivity level: MAXIMUM! ⚡",
    "Focus mode: ACTIVATED! 🎯",
    "You're unstoppable today! 🔥",
    "Another victory! Well done! 🏆"
  ]);
  const [productivityScore, setProductivityScore] = useState(0);
  const [showTasks, setShowTasks] = useState(false);
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState('');
  const [notesList, setNotesList] = useState([]);
  const [noteCategory, setNoteCategory] = useState('work');
  const [showVolumeControl, setShowVolumeControl] = useState(false);
  const [autoBreak, setAutoBreak] = useState(true);
  const [soundEffects, setSoundEffects] = useState(true);
  const [notifications, setNotifications] = useState(true);
  const [focusMode, setFocusMode] = useState(false);
  const [showExport, setShowExport] = useState(false);
  const [selectedSettingsMenu, setSelectedSettingsMenu] = useState('theme');
  const [projects, setProjects] = useState([]);
  const [currentProject, setCurrentProject] = useState('Default');
  const [sessionHistory, setSessionHistory] = useState([]);
  const [workRestRatio, setWorkRestRatio] = useState(5); // Pomodoro/Break ratio
  const [currentTab, setCurrentTab] = useState('timer'); // 'timer', 'profile', 'achievements', or 'shop'
  const [purchasedThemes, setPurchasedThemes] = useState([]); // List of purchased theme IDs

  const modes = {
    Focus: { icon: '🎯' },
    'Short Break': { icon: '☕' },
    'Long Break': { icon: '🎧' },
  };

  const getModeDuration = (modeName) => {
    if (modeName === 'Focus') return focusDurationSec;
    if (modeName === 'Short Break') return shortBreakDurationSec;
    return longBreakDurationSec;
  };

  const themes = {
    white: { 
      bg: '#ffffff', 
      primary: '#000000', 
      secondary: '#f5f5f5', 
      border: '#e0e0e0',
      accent: '#000000',
      name: 'White',
      premium: false
    },
    pink: { 
      bg: '#ffe3f2', 
      primary: '#880e4f', 
      secondary: '#fff0f6', 
      border: '#fce4ec',
      accent: '#c2185b',
      name: 'Pink',
      premium: false
    },
    purple: { 
      bg: '#f3e5f5', 
      primary: '#4a148c', 
      secondary: '#f5e5f7', 
      border: '#e1bee7',
      accent: '#7b1fa2',
      name: 'Purple',
      premium: false
    },
    green: { 
      bg: '#e8f5e9', 
      primary: '#1b5e20', 
      secondary: '#f1f8e9', 
      border: '#c8e6c9',
      accent: '#2e7d32',
      name: 'Green',
      premium: false
    },
    black: { 
      bg: '#1a1a1a', 
      primary: '#ffffff', 
      secondary: '#2a2a2a', 
      border: '#404040',
      accent: '#ffffff',
      name: 'Dark',
      premium: false
    },
    blue: { 
      bg: '#e3f2fd', 
      primary: '#0d47a1', 
      secondary: '#e1f5fe', 
      border: '#b3e5fc',
      accent: '#1976d2',
      name: 'Blue',
      premium: false
    },
    // Premium Themes
    gold: {
      bg: '#fff8e1',
      primary: '#f57f17',
      secondary: '#ffecb3',
      border: '#ffd54f',
      accent: '#ffa000',
      name: 'Gold',
      premium: true,
      price: 100
    },
    sunset: {
      bg: '#fff3e0',
      primary: '#e65100',
      secondary: '#ffe0b2',
      border: '#ffb74d',
      accent: '#ff6f00',
      name: 'Sunset',
      premium: true,
      price: 150
    },
    ocean: {
      bg: '#e0f7fa',
      primary: '#006064',
      secondary: '#b2ebf2',
      border: '#4dd0e1',
      accent: '#00acc1',
      name: 'Ocean',
      premium: true,
      price: 200
    },
    forest: {
      bg: '#f1f8e9',
      primary: '#33691e',
      secondary: '#dcedc8',
      border: '#aed581',
      accent: '#689f38',
      name: 'Forest',
      premium: true,
      price: 180
    },
    neon: {
      bg: '#1a0033',
      primary: '#00ff88',
      secondary: '#2a0044',
      border: '#00cc66',
      accent: '#00ff88',
      name: 'Neon',
      premium: true,
      price: 250
    },
    cherry: {
      bg: '#fce4ec',
      primary: '#880e4f',
      secondary: '#f8bbd0',
      border: '#f48fb1',
      accent: '#e91e63',
      name: 'Cherry',
      premium: true,
      price: 120
    },
  };

  const currentThemeColors = themes[currentTheme];

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            handleTimerComplete();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isRunning]);

  const handleTimerComplete = () => {
    setIsRunning(false);
    
    // Alarm türüne göre titreşim
    if (alarmType === 'strong') {
      Vibration.vibrate([200, 100, 200, 100, 200]);
    } else if (alarmType === 'gentle') {
      Vibration.vibrate([100, 50, 100]);
    } else {
      Vibration.vibrate([100, 50, 100, 50, 100]);
    }
    
    if (mode === 'Focus') {
      setCompletedSessions((prev) => prev + 1);
      setTodayMinutes((prev) => prev + Math.round(focusDurationSec / 60));
      setTotalSessions((prev) => prev + 1);
      setTotalMinutes((prev) => prev + Math.round(focusDurationSec / 60));
      
      // Productivity Score hesapla
      setProductivityScore((prev) => {
        const newScore = prev + Math.round(focusDurationSec / 60) * 25 / 25;
        return newScore;
      });
      
      setCurrentStreak((prev) => {
        const newStreak = prev + 1;
        setMaxStreak((currentMax) => newStreak > currentMax ? newStreak : currentMax);
        return newStreak;
      });
      
      // Haftalık istatistik ekle
      const today = new Date().toISOString().split('T')[0];
      setWeeklyStats((prev) => {
        const found = prev.findIndex(s => s.date === today);
        if (found >= 0) {
          const newStats = [...prev];
          newStats[found].minutes += Math.round(focusDurationSec / 60);
          newStats[found].sessions += 1;
          return newStats;
        }
        return [...prev, { date: today, minutes: Math.round(focusDurationSec / 60), sessions: 1 }];
      });

      // Achievements kontrolü
      const newSessions = completedSessions + 1;
      checkAchievements(newSessions);
    }

    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    
    setTimeout(() => {
      setTimeLeft(getModeDuration(mode));
      setHasStarted(false);
    }, 2000);
  };

  const toggleTimer = () => {
    if (!hasStarted) {
      setHasStarted(true);
    }
    setIsRunning(!isRunning);
  };

  const resetTimer = () => {
    setIsRunning(false);
    setHasStarted(false);
    setTimeLeft(getModeDuration(mode));
  };

  const skipTimer = () => {
    // Skip should NOT count as a completed pomodoro.
    setIsRunning(false);
    setHasStarted(false);
    if (mode === 'Focus') {
      setMode('Short Break');
      setTimeLeft(getModeDuration('Short Break'));
    } else if (mode === 'Short Break' || mode === 'Long Break') {
      setMode('Focus');
      setTimeLeft(getModeDuration('Focus'));
    }
  };

  const nextTimer = () => {
    setIsRunning(false);
    setHasStarted(false);
    
    if (mode === 'Focus') {
      setMode('Short Break');
      setTimeLeft(getModeDuration('Short Break'));
    } else if (mode === 'Short Break') {
      setMode('Focus');
      setTimeLeft(getModeDuration('Focus'));
    } else if (mode === 'Long Break') {
      setMode('Focus');
      setTimeLeft(getModeDuration('Focus'));
    }
  };

  const changeMode = (newMode) => {
    if (mode !== newMode) {
      setIsRunning(false);
      setHasStarted(false);
      setMode(newMode);
      setTimeLeft(getModeDuration(newMode));
    }
  };

  const quickSet = (minutes) => {
    setIsRunning(false);
    setHasStarted(false);
    setTimeLeft(minutes * 60);
    setMode('Focus');
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const calculatePercentage = () => {
    const total = getModeDuration(mode);
    return Math.round(((total - timeLeft) / total) * 100);
  };

  const checkAchievements = (sessions) => {
    const newAchievements = [];
    
    if (sessions >= 1 && !achievements.includes('first')) {
      newAchievements.push('first');
      setAchievementText('First Pomodoro Complete! 🎉');
      setShowAchievement(true);
      setTimeout(() => setShowAchievement(false), 3000);
    }
    if (sessions >= 5 && !achievements.includes('five')) {
      newAchievements.push('five');
      setAchievementText('5 Pomodoros! Getting stronger! 💪');
      setShowAchievement(true);
      setTimeout(() => setShowAchievement(false), 3000);
    }
    if (sessions >= 10 && !achievements.includes('ten')) {
      newAchievements.push('ten');
      setAchievementText('10 Pomodoros! You\'re a machine! 🔥');
      setShowAchievement(true);
      setTimeout(() => setShowAchievement(false), 3000);
    }
    if (currentStreak >= 7 && !achievements.includes('streak7')) {
      newAchievements.push('streak7');
      setAchievementText('7 Day Streak! Unstoppable! 🏆');
      setShowAchievement(true);
      setTimeout(() => setShowAchievement(false), 3000);
    }
    
    if (newAchievements.length > 0) {
      setAchievements((prev) => [...prev, ...newAchievements]);
    }
  };

  const addTask = () => {
    if (newTask.trim()) {
      setTasks([...tasks, { id: Date.now(), text: newTask, completed: false }]);
      setNewTask('');
    }
  };

  const saveNote = () => {
    if (sessionNotes.trim()) {
      const newNote = {
        id: Date.now(),
        text: sessionNotes,
        category: noteCategory,
        date: new Date().toLocaleDateString(),
        time: new Date().toLocaleTimeString()
      };
      setNotesList([newNote, ...notesList]);
      setSessionNotes('');
      setShowNotes(false);
    }
  };

  const deleteNote = (id) => {
    setNotesList(notesList.filter(note => note.id !== id));
  };

  const toggleTask = (id) => {
    setTasks(tasks.map(task => 
      task.id === id ? { ...task, completed: !task.completed } : task
    ));
  };

  const deleteTask = (id) => {
    setTasks(tasks.filter(task => task.id !== id));
  };

  const purchaseTheme = (themeKey, price) => {
    if (productivityScore >= price && !purchasedThemes.includes(themeKey)) {
      setProductivityScore(prev => prev - price);
      setPurchasedThemes(prev => [...prev, themeKey]);
    }
  };

  const renderShopPage = () => {
    const premiumThemes = Object.keys(themes).filter(key => themes[key].premium);
    
    return (
      <ScrollView contentContainerStyle={styles.profileScrollContent} showsVerticalScrollIndicator={false}>
        {/* Shop Header */}
        <View style={styles.profileHeader}>
          <View style={styles.shopHeaderIcon}>
            <Text style={styles.shopHeaderIconText}>🛍️</Text>
          </View>
          <Text style={styles.profileName}>Theme Shop</Text>
          <Text style={styles.profileSubtitle}>Unlock exclusive themes with your productivity score!</Text>
          
          {/* Productivity Score Display */}
          <View style={styles.shopScoreCard}>
            <Text style={styles.shopScoreLabel}>Your Score</Text>
            <Text style={styles.shopScoreValue}>{productivityScore}</Text>
          </View>
        </View>

        {/* Premium Themes Grid */}
        <View style={styles.profileSection}>
          <Text style={styles.profileSectionTitle}>Premium Themes</Text>
          <View style={styles.shopThemesGrid}>
            {premiumThemes.map((themeKey) => {
              const theme = themes[themeKey];
              const isPurchased = purchasedThemes.includes(themeKey);
              const canAfford = productivityScore >= theme.price;
              
              return (
                <View key={themeKey} style={[
                  styles.shopThemeCard,
                  isPurchased && styles.shopThemeCardPurchased,
                  currentTheme === themeKey && styles.shopThemeCardActive
                ]}>
                  <View style={[
                    styles.shopThemePreview,
                    { backgroundColor: theme.bg, borderColor: theme.border }
                  ]}>
                    <View style={[styles.shopThemeColorBox, { backgroundColor: theme.primary }]} />
                    <View style={[styles.shopThemeColorBox, { backgroundColor: theme.accent }]} />
                    <View style={[styles.shopThemeColorBox, { backgroundColor: theme.secondary }]} />
                  </View>
                  <Text style={styles.shopThemeName}>{theme.name}</Text>
                  
                  {isPurchased ? (
                    <View style={styles.shopPurchasedBadge}>
                      <Text style={styles.shopPurchasedText}>✓ Owned</Text>
                    </View>
                  ) : (
                    <>
                      <View style={styles.shopPriceTag}>
                        <Text style={styles.shopPriceIcon}>⭐</Text>
                        <Text style={styles.shopPriceText}>{theme.price}</Text>
                      </View>
                      <TouchableOpacity
                        style={[
                          styles.shopBuyButton,
                          !canAfford && styles.shopBuyButtonDisabled
                        ]}
                        onPress={() => purchaseTheme(themeKey, theme.price)}
                        disabled={!canAfford}
                      >
                        <Text style={[
                          styles.shopBuyButtonText,
                          !canAfford && styles.shopBuyButtonTextDisabled
                        ]}>
                          {canAfford ? 'Purchase' : 'Insufficient Score'}
                        </Text>
                      </TouchableOpacity>
                    </>
                  )}
                  
                  {isPurchased && currentTheme !== themeKey && (
                    <TouchableOpacity
                      style={styles.shopUseButton}
                      onPress={() => setCurrentTheme(themeKey)}
                    >
                      <Text style={styles.shopUseButtonText}>Use Theme</Text>
                    </TouchableOpacity>
                  )}
                </View>
              );
            })}
          </View>
        </View>

        {/* Free Themes Info */}
        <View style={styles.profileSection}>
          <Text style={styles.profileSectionTitle}>Free Themes</Text>
          <Text style={styles.shopInfoText}>
            Free themes (White, Pink, Purple, Green, Dark, Blue) are available in Settings → Theme
          </Text>
        </View>

        <View style={{ height: 80 }} />
      </ScrollView>
    );
  };

  const renderAchievementsPage = () => {
    const allAchievements = [
      { id: 'first', icon: '🎉', title: 'First Pomodoro', desc: 'Complete your first pomodoro session', unlocked: achievements.includes('first') },
      { id: 'five', icon: '💪', title: 'Getting Stronger', desc: 'Complete 5 pomodoros', unlocked: achievements.includes('five') },
      { id: 'ten', icon: '🔥', title: 'You\'re a Machine', desc: 'Complete 10 pomodoros', unlocked: achievements.includes('ten') },
      { id: 'streak7', icon: '🏆', title: 'Unstoppable', desc: 'Maintain a 7-day streak', unlocked: achievements.includes('streak7') },
      { id: 'streak30', icon: '🌟', title: 'Dedication Master', desc: 'Maintain a 30-day streak', unlocked: false },
      { id: 'focused100', icon: '💯', title: 'Century Club', desc: 'Complete 100 pomodoros', unlocked: false },
      { id: 'perfectweek', icon: '✨', title: 'Perfect Week', desc: 'Complete your daily goal every day for a week', unlocked: false },
      { id: 'earlybird', icon: '🌅', title: 'Early Bird', desc: 'Complete a pomodoro before 8 AM', unlocked: false },
    ];

    const unlockedCount = achievements.length;
    const totalCount = allAchievements.length;

    return (
      <ScrollView contentContainerStyle={styles.profileScrollContent} showsVerticalScrollIndicator={false}>
        {/* Achievements Header */}
        <View style={styles.profileHeader}>
          <View style={styles.achievementsHeaderIcon}>
            <Text style={styles.achievementsHeaderIconText}>🏆</Text>
          </View>
          <Text style={styles.profileName}>Achievements</Text>
          <Text style={styles.profileSubtitle}>
            {unlockedCount} of {totalCount} unlocked
          </Text>
          {/* Progress Bar */}
          <View style={styles.achievementsProgressBar}>
            <View style={[styles.achievementsProgressFill, { width: `${(unlockedCount / totalCount) * 100}%` }]} />
          </View>
        </View>

        {/* Achievements Grid */}
        <View style={styles.achievementsGrid}>
          {allAchievements.map((ach) => (
            <View 
              key={ach.id} 
              style={[
                styles.achievementCard,
                !ach.unlocked && styles.achievementCardLocked
              ]}
            >
              <View style={[
                styles.achievementIconContainer,
                !ach.unlocked && styles.achievementIconContainerLocked
              ]}>
                <Text style={[
                  styles.achievementIconText,
                  !ach.unlocked && styles.achievementIconTextLocked
                ]}>
                  {ach.unlocked ? ach.icon : '🔒'}
                </Text>
              </View>
              <Text style={[
                styles.achievementCardTitle,
                !ach.unlocked && styles.achievementCardTitleLocked
              ]}>
                {ach.title}
              </Text>
              <Text style={[
                styles.achievementCardDesc,
                !ach.unlocked && styles.achievementCardDescLocked
              ]}>
                {ach.desc}
              </Text>
              {ach.unlocked && (
                <View style={styles.achievementUnlockedBadge}>
                  <Text style={styles.achievementUnlockedText}>✓ Unlocked</Text>
                </View>
              )}
            </View>
          ))}
        </View>

        <View style={{ height: 80 }} />
      </ScrollView>
    );
  };

  const renderProfilePage = () => {
    const goalProgress = Math.min(100, (completedSessions / dailyGoal) * 100);
    
    return (
      <ScrollView contentContainerStyle={styles.profileScrollContent} showsVerticalScrollIndicator={false}>
        {/* Profile Header */}
        <View style={styles.profileHeader}>
          <View style={styles.profileAvatar}>
            <Text style={styles.profileAvatarText}>👤</Text>
          </View>
          <Text style={styles.profileName}>Your Profile</Text>
          <Text style={styles.profileSubtitle}>Stay focused, stay productive!</Text>
        </View>

        {/* Productivity Score - Hero Card */}
        <View style={styles.productivityHeroCard}>
          <Text style={styles.productivityHeroTitle}>Productivity Score</Text>
          <Text style={styles.productivityHeroScore}>{productivityScore}</Text>
          <Text style={styles.productivityHeroLabel}>
            Keep going! Every pomodoro adds to your score! 🚀
          </Text>
        </View>

        {/* Today's Stats */}
        <View style={styles.profileSection}>
          <Text style={styles.profileSectionTitle}>Today's Focus</Text>
          <View style={styles.profileStatsGrid}>
            <View style={styles.profileStatCard}>
              <Text style={styles.profileStatIcon}>⏱️</Text>
              <Text style={styles.profileStatValue}>{todayMinutes}</Text>
              <Text style={styles.profileStatLabel}>Minutes</Text>
            </View>
            <View style={styles.profileStatCard}>
              <Text style={styles.profileStatIcon}>🎯</Text>
              <Text style={styles.profileStatValue}>{completedSessions}</Text>
              <Text style={styles.profileStatLabel}>Sessions</Text>
            </View>
          </View>
        </View>

        {/* Streak & Goal */}
        <View style={styles.profileSection}>
          <View style={styles.profileStatsGrid}>
            <View style={styles.streakCardProfile}>
              <Text style={styles.streakIconProfile}>🔥</Text>
              <Text style={styles.streakLabelProfile}>Current Streak</Text>
              <Text style={styles.streakValueProfile}>{currentStreak}</Text>
              <Text style={styles.streakDaysText}>days</Text>
            </View>
            <View style={styles.goalCardProfile}>
              <Text style={styles.goalIconProfile}>🎯</Text>
              <Text style={styles.goalLabelProfile}>Daily Goal</Text>
              <Text style={styles.goalValueProfile}>{completedSessions}/{dailyGoal}</Text>
              <View style={styles.goalProgressProfile}>
                <View style={[styles.goalProgressBarProfile, { width: `${goalProgress}%` }]} />
              </View>
              <Text style={styles.goalProgressText}>{Math.round(goalProgress)}% Complete</Text>
            </View>
          </View>
        </View>

        {/* Total Stats */}
        <View style={styles.profileSection}>
          <Text style={styles.profileSectionTitle}>All-Time Stats</Text>
          <View style={styles.totalStatsContainerProfile}>
            <View style={styles.totalStatItemProfile}>
              <Text style={styles.totalStatIconProfile}>📊</Text>
              <Text style={styles.totalStatValueProfile}>{totalSessions}</Text>
              <Text style={styles.totalStatLabelProfile}>Total Sessions</Text>
            </View>
            <View style={styles.totalStatItemProfile}>
              <Text style={styles.totalStatIconProfile}>⏰</Text>
              <Text style={styles.totalStatValueProfile}>{Math.floor(totalMinutes / 60)}h</Text>
              <Text style={styles.totalStatLabelProfile}>Total Focus</Text>
            </View>
            <View style={styles.totalStatItemProfile}>
              <Text style={styles.totalStatIconProfile}>🔥</Text>
              <Text style={styles.totalStatValueProfile}>{maxStreak}</Text>
              <Text style={styles.totalStatLabelProfile}>Best Streak</Text>
            </View>
          </View>
        </View>

        {/* Weekly History */}
        {weeklyStats.length > 0 && (
          <View style={styles.profileSection}>
            <Text style={styles.profileSectionTitle}>Weekly History</Text>
            <View style={styles.weeklyStatsContainerProfile}>
              {weeklyStats.slice(-7).reverse().map((stat, index) => (
                <View key={index} style={styles.weeklyStatRowProfile}>
                  <View style={styles.weeklyStatLeft}>
                    <Text style={styles.weeklyDateProfile}>{stat.date}</Text>
                  </View>
                  <View style={styles.weeklyStatRight}>
                    <Text style={styles.weeklyMinutesProfile}>{stat.minutes} min</Text>
                    <Text style={styles.weeklySessionsProfile}>{stat.sessions} ⭐</Text>
                  </View>
                </View>
              ))}
            </View>
          </View>
        )}

        <View style={{ height: 40 }} />
      </ScrollView>
    );
  };

  const renderProgressRing = () => {
    const size = Math.min(width * 0.75, 280);
    const radius = (size - 20) / 2;
    const circumference = 2 * Math.PI * radius;
    const percentage = calculatePercentage() / 100;
    const strokeDashoffset = circumference * (1 - percentage);
    const total = getModeDuration(mode);
    const elapsed = total - timeLeft;

    return (
      <Svg width={size} height={size} style={styles.svg}>
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="#e0e0e0"
          strokeWidth="3"
          fill="none"
        />
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="#000000"
          strokeWidth="3"
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
      </Svg>
    );
  };

  const renderModeButton = (modesName, isActive) => {
    return (
      <TouchableOpacity
        style={[
          styles.modeButton,
          { borderColor: currentThemeColors.primary },
          isActive && { backgroundColor: currentThemeColors.accent }
        ]}
        onPress={() => changeMode(modesName)}
        activeOpacity={0.7}
      >
        <Text style={styles.modeIcon}>{modesName === 'Focus' ? '🎯' : modesName === 'Short Break' ? '☕' : '🎧'}</Text>
        <Text style={[
          styles.modeButtonText,
          { color: isActive ? currentThemeColors.bg : currentThemeColors.primary }
        ]}>
          {modesName}
        </Text>
      </TouchableOpacity>
    );
  };

  // Dinamik stil fonksiyonu
  const getDynamicStyles = () => {
    return {
      container: { ...styles.container, backgroundColor: currentThemeColors.bg },
      headerTitle: { ...styles.headerTitle, color: currentThemeColors.primary },
      headerSubtitle: { ...styles.headerSubtitle, color: currentThemeColors.primary },
      iconButton: { ...styles.iconButton, backgroundColor: currentThemeColors.secondary },
      modeButton: { ...styles.modeButton, borderColor: currentThemeColors.primary },
      modeButtonActive: { backgroundColor: currentThemeColors.primary },
      modeButtonTextActive: { color: currentThemeColors.bg },
      startButton: { backgroundColor: currentThemeColors.accent },
      timerText: { ...styles.timerText, color: currentThemeColors.primary },
      timerStatus: { ...styles.timerStatus, color: currentThemeColors.primary },
      shortcutsText: { ...styles.shortcutsText, color: currentThemeColors.primary },
      statCard: { ...styles.statCard, backgroundColor: currentThemeColors.secondary, borderColor: currentThemeColors.border },
      statLabel: { ...styles.statLabel, color: currentThemeColors.primary },
      statValue: { ...styles.statValue, color: currentThemeColors.primary },
      quickSetButton: { ...styles.quickSetButton, borderColor: currentThemeColors.primary },
      quickSetButtonText: { ...styles.quickSetButtonText, color: currentThemeColors.primary },
    };
  };

  const dynamicStyles = getDynamicStyles();

  // Prevent using premium themes without purchase
  useEffect(() => {
    const theme = themes[currentTheme];
    if (theme?.premium && !purchasedThemes.includes(currentTheme)) {
      setCurrentTheme('white');
    }
  }, [currentTheme, purchasedThemes]);

  return (
    <View style={dynamicStyles.container}>
      <StatusBar barStyle={currentTheme === 'black' ? "light-content" : "dark-content"} backgroundColor={currentThemeColors.bg} />
      
      {/* Header */}
      <View style={[styles.header, { borderBottomColor: currentThemeColors.border }]}>
        <TouchableOpacity 
          style={styles.headerLeft}
          onPress={() => setShowAbout(true)}
          activeOpacity={0.7}
        >
          <Text style={dynamicStyles.headerTitle}>Pomodoro — {currentThemeColors.name} Edition</Text>
          <Text style={[dynamicStyles.headerSubtitle, { opacity: 0.7 }]}>made by wortex213433</Text>
        </TouchableOpacity>
        <View style={styles.headerRight}>
          <TouchableOpacity 
            style={[styles.iconButton, { backgroundColor: currentThemeColors.secondary }]}
            onPress={() => setShowMenu(!showMenu)}
          >
            <Text style={styles.iconText}>{showMenu ? '✕' : '⬇'}</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.iconButton, { backgroundColor: currentThemeColors.secondary }]}
            onPress={() => setShowSettings(true)}
          >
            <Text style={styles.iconText}>⚙</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Dropdown Menu */}
      {showMenu && (
        <View style={styles.dropdown}>
          <TouchableOpacity 
            style={styles.dropdownItem}
            onPress={() => {
              setShowTasks(true);
              setShowMenu(false);
            }}
          >
            <Text style={styles.dropdownText}>✓ Tasks</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.dropdownItem}
            onPress={() => {
              setShowNotes(true);
              setShowMenu(false);
            }}
          >
            <Text style={styles.dropdownText}>📝 Session Notes</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.dropdownItem}
            onPress={() => {
              setAlarmType(alarmType === 'gentle' ? 'standard' : alarmType === 'standard' ? 'strong' : 'gentle');
              setShowMenu(false);
            }}
          >
            <Text style={styles.dropdownText}>
              🔔 Alarm: {alarmType === 'gentle' ? 'Gentle' : alarmType === 'strong' ? 'Strong' : 'Standard'}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.dropdownItem}
            onPress={() => {
              const newGoal = dailyGoal + 1 > 10 ? 1 : dailyGoal + 1;
              setDailyGoal(newGoal);
              setShowMenu(false);
            }}
          >
            <Text style={styles.dropdownText}>🎯 Daily Goal: {dailyGoal} pomodoros</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.dropdownItem}
            onPress={() => {
              resetTimer();
              setTodayMinutes(0);
              setCompletedSessions(0);
              setWeeklyStats([]);
              setShowMenu(false);
            }}
          >
            <Text style={styles.dropdownText}>🗑️ Reset All Data</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Stats Overlay */}
      {showStats && (
        <View style={styles.overlay}>
          <View style={styles.statsModal}>
            <Text style={styles.modalTitle}>Statistics</Text>
            <View style={styles.statsRow}>
              <View style={styles.statBox}>
                <Text style={styles.statNumber}>{completedSessions}</Text>
                <Text style={styles.statLabel}>Sessions Today</Text>
              </View>
              <View style={styles.statBox}>
                <Text style={styles.statNumber}>{todayMinutes}</Text>
                <Text style={styles.statLabel}>Minutes Today</Text>
              </View>
            </View>
            
            <View style={styles.statsRow}>
              <View style={styles.statBox}>
                <Text style={styles.statNumber}>🔥 {currentStreak}</Text>
                <Text style={styles.statLabel}>Current Streak</Text>
              </View>
              <View style={styles.statBox}>
                <Text style={styles.statNumber}>{totalSessions}</Text>
                <Text style={styles.statLabel}>Total Sessions</Text>
              </View>
            </View>
            
            {/* Haftalık İstatistikler */}
            {weeklyStats.length > 0 && (
              <View style={styles.weeklyStatsContainer}>
                <Text style={styles.weeklyStatsTitle}>Weekly History</Text>
                <ScrollView style={styles.weeklyScroll}>
                  {weeklyStats.slice(-7).reverse().map((stat, index) => (
                    <View key={index} style={styles.weeklyStatRow}>
                      <Text style={styles.weeklyDate}>{stat.date}</Text>
                      <Text style={styles.weeklyMinutes}>{stat.minutes} min</Text>
                      <Text style={styles.weeklySessions}>{stat.sessions} ⭐</Text>
                    </View>
                  ))}
                </ScrollView>
              </View>
            )}
            
            <TouchableOpacity 
              style={styles.closeButton}
              onPress={() => setShowStats(false)}
            >
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* Notes Modal */}
      {showNotes && (
        <View style={styles.overlay}>
          <View style={styles.notesModal}>
            <Text style={styles.modalTitle}>Session Notes</Text>
            
            <Text style={styles.notesSubtitle}>Category</Text>
            <View style={styles.categoryContainer}>
              {['work', 'study', 'break', 'other'].map(cat => (
                <TouchableOpacity
                  key={cat}
                  style={[styles.categoryButton, noteCategory === cat && styles.categoryButtonActive]}
                  onPress={() => setNoteCategory(cat)}
                >
                  <Text style={styles.categoryIcon}>
                    {cat === 'work' && '💼'}
                    {cat === 'study' && '📚'}
                    {cat === 'break' && '☕'}
                    {cat === 'other' && '📝'}
                  </Text>
                  <Text style={styles.categoryText}>{cat}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={styles.notesSubtitle}>Your Notes</Text>
            <TextInput
              style={styles.notesInput}
              multiline
              placeholder="What are you working on? Add your notes here..."
              value={sessionNotes}
              onChangeText={setSessionNotes}
              textAlignVertical="top"
            />

            <ScrollView style={styles.savedNotesList}>
              {notesList.map(note => (
                <View key={note.id} style={styles.savedNoteItem}>
                  <View style={styles.noteHeader}>
                    <Text style={styles.noteCategory}>
                      {note.category === 'work' && '💼'}
                      {note.category === 'study' && '📚'}
                      {note.category === 'break' && '☕'}
                      {note.category === 'other' && '📝'}
                      {' '}{note.category}
                    </Text>
                    <Text style={styles.noteDate}>{note.date} {note.time}</Text>
                  </View>
                  <Text style={styles.savedNoteText}>{note.text}</Text>
                  <TouchableOpacity 
                    style={styles.deleteNoteButton}
                    onPress={() => deleteNote(note.id)}
                  >
                    <Text style={styles.deleteNoteText}>🗑️ Delete</Text>
                  </TouchableOpacity>
                </View>
              ))}
              {notesList.length === 0 && (
                <Text style={styles.emptyTaskText}>No saved notes yet</Text>
              )}
            </ScrollView>

            <View style={styles.notesButtons}>
              <TouchableOpacity 
                style={styles.cancelButton}
                onPress={() => setShowNotes(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.saveButton}
                onPress={saveNote}
              >
                <Text style={styles.saveButtonText}>Save Note</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}

      {/* Achievement Notification */}
      {showAchievement && (
        <View style={styles.achievementBanner}>
          <Text style={styles.achievementEmoji}>🎉</Text>
          <Text style={styles.achievementText}>{achievementText}</Text>
        </View>
      )}

      {/* Task List Modal */}
      {showTasks && (
        <View style={styles.overlay}>
          <View style={styles.tasksModal}>
            <Text style={styles.modalTitle}>Task List</Text>
            <Text style={styles.notesSubtitle}>What needs to be done?</Text>
            
            <View style={styles.taskInputContainer}>
              <TextInput
                style={styles.taskInput}
                placeholder="Add new task..."
                value={newTask}
                onChangeText={setNewTask}
              />
              <TouchableOpacity style={styles.addTaskButton} onPress={addTask}>
                <Text style={styles.addTaskButtonText}>+</Text>
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.taskList}>
              {tasks.map(task => (
                <View key={task.id} style={styles.taskItem}>
                  <TouchableOpacity 
                    style={styles.taskCheckbox}
                    onPress={() => toggleTask(task.id)}
                  >
                    <Text style={styles.taskCheckboxText}>
                      {task.completed ? '✓' : '○'}
                    </Text>
                  </TouchableOpacity>
                  <Text style={[styles.taskText, task.completed && styles.taskTextCompleted]}>
                    {task.text}
                  </Text>
                  <TouchableOpacity onPress={() => deleteTask(task.id)}>
                    <Text style={styles.taskDelete}>🗑️</Text>
                  </TouchableOpacity>
                </View>
              ))}
              {tasks.length === 0 && (
                <Text style={styles.emptyTaskText}>No tasks yet. Add one above!</Text>
              )}
            </ScrollView>
            
            <TouchableOpacity 
              style={styles.closeButton}
              onPress={() => setShowTasks(false)}
            >
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* Settings Modal */}
      {showSettings && (
        <View style={styles.overlay}>
          <View style={styles.settingsModal}>
            <Text style={styles.modalTitle}>Settings</Text>
            
            {/* Top Tab Menu */}
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false}
              style={styles.settingsTabsContainer}
            >
              {[
                { key: 'theme', icon: '🎨', label: 'Theme' },
                { key: 'timer', icon: '⏱️', label: 'Timer' },
                { key: 'sound', icon: '🔔', label: 'Sound' },
                { key: 'notifications', icon: '📢', label: 'Notify' },
                { key: 'data', icon: '💾', label: 'Data' },
                { key: 'credits', icon: '👨‍💻', label: 'Credits' }
              ].map(tab => (
                <TouchableOpacity
                  key={tab.key}
                  style={[styles.settingsTab, selectedSettingsMenu === tab.key && styles.settingsTabActive]}
                  onPress={() => setSelectedSettingsMenu(tab.key)}
                >
                  <Text style={styles.settingsTabIcon}>{tab.icon}</Text>
                  <Text style={[styles.settingsTabText, selectedSettingsMenu === tab.key && { color: '#ffffff' }]}>
                    {tab.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            {/* Content */}
            <ScrollView style={styles.settingsMenuContent}>
                {selectedSettingsMenu === 'theme' && (
                  <>
                    <Text style={styles.settingsSectionTitle}>🎨 Choose Theme</Text>
              <View style={styles.themesContainer}>
                {Object.keys(themes).map((themeKey) => {
                  const theme = themes[themeKey];
                  const isLocked = !!theme.premium && !purchasedThemes.includes(themeKey);
                  return (
                    <TouchableOpacity
                      key={themeKey}
                      style={[
                        styles.themeButton,
                        currentTheme === themeKey && styles.themeButtonActive,
                        { backgroundColor: theme.bg, borderColor: theme.border }
                      ]}
                      onPress={() => {
                        if (isLocked) {
                          setSelectedSettingsMenu('theme');
                          setShowSettings(false);
                          setCurrentTab('shop');
                          return;
                        }
                        setCurrentTheme(themeKey);
                      }}
                    >
                      <Text style={styles.themeIcon}>
                        {themeKey === 'white' && '⚪'}
                        {themeKey === 'pink' && '🌸'}
                        {themeKey === 'purple' && '💜'}
                        {themeKey === 'green' && '💚'}
                        {themeKey === 'black' && '⚫'}
                        {themeKey === 'blue' && '🔵'}
                        {themeKey === 'gold' && '🥇'}
                        {themeKey === 'sunset' && '🌇'}
                        {themeKey === 'ocean' && '🌊'}
                        {themeKey === 'forest' && '🌲'}
                        {themeKey === 'neon' && '🟢'}
                        {themeKey === 'cherry' && '🍒'}
                      </Text>
                      <Text style={[
                        styles.themeName,
                        { color: theme.primary }
                      ]}>
                        {theme.name}
                      </Text>
                      {isLocked && (
                        <Text style={styles.checkmark}>🔒</Text>
                      )}
                      {!isLocked && currentTheme === themeKey && (
                        <Text style={styles.checkmark}>✓</Text>
                      )}
                    </TouchableOpacity>
                  );
                })}
              </View>
                  </>
                )}

                {selectedSettingsMenu === 'timer' && (
                  <>
                    <Text style={styles.settingsSectionTitle}>⏱️ Timer Settings</Text>
                    <View style={styles.settingItem}>
                      <Text style={styles.settingLabel}>Auto-start breaks</Text>
                      <TouchableOpacity
                        style={[styles.toggleButton, autoBreak && styles.toggleButtonActive]}
                        onPress={() => setAutoBreak(!autoBreak)}
                      >
                        <Text style={[styles.toggleText, autoBreak && { color: '#ffffff' }]}>
                          {autoBreak ? 'ON' : 'OFF'}
                        </Text>
                      </TouchableOpacity>
                    </View>
                    <View style={styles.settingItem}>
                      <Text style={styles.settingLabel}>Work/Rest Ratio</Text>
                      <Text style={styles.settingValue}>{workRestRatio}:1</Text>
                    </View>

                    <Text style={styles.settingsSectionTitle}>🧩 Customize Durations (HH:MM:SS)</Text>
                    <View style={styles.settingItem}>
                      <Text style={styles.settingLabel}>Focus</Text>
                      <View style={styles.hmsRow}>
                        <TextInput
                          style={styles.hmsInput}
                          keyboardType="numeric"
                          defaultValue={String(Math.floor(focusDurationSec / 3600))}
                          onChangeText={(v) => {
                            const h = Math.max(0, parseInt(v || '0', 10) || 0);
                            const m = Math.floor((focusDurationSec % 3600) / 60);
                            const s = focusDurationSec % 60;
                            setFocusDurationSec(h * 3600 + m * 60 + s);
                          }}
                        />
                        <Text style={styles.hmsColon}>:</Text>
                        <TextInput
                          style={styles.hmsInput}
                          keyboardType="numeric"
                          defaultValue={String(Math.floor((focusDurationSec % 3600) / 60))}
                          onChangeText={(v) => {
                            const h = Math.floor(focusDurationSec / 3600);
                            let m = Math.max(0, parseInt(v || '0', 10) || 0);
                            if (m > 59) m = 59;
                            const s = focusDurationSec % 60;
                            setFocusDurationSec(h * 3600 + m * 60 + s);
                          }}
                        />
                        <Text style={styles.hmsColon}>:</Text>
                        <TextInput
                          style={styles.hmsInput}
                          keyboardType="numeric"
                          defaultValue={String(focusDurationSec % 60)}
                          onChangeText={(v) => {
                            const h = Math.floor(focusDurationSec / 3600);
                            const m = Math.floor((focusDurationSec % 3600) / 60);
                            let s = Math.max(0, parseInt(v || '0', 10) || 0);
                            if (s > 59) s = 59;
                            setFocusDurationSec(h * 3600 + m * 60 + s);
                          }}
                        />
                      </View>
                    </View>

                    <View style={styles.settingItem}>
                      <Text style={styles.settingLabel}>Short Break</Text>
                      <View style={styles.hmsRow}>
                        <TextInput
                          style={styles.hmsInput}
                          keyboardType="numeric"
                          defaultValue={String(Math.floor(shortBreakDurationSec / 3600))}
                          onChangeText={(v) => {
                            const h = Math.max(0, parseInt(v || '0', 10) || 0);
                            const m = Math.floor((shortBreakDurationSec % 3600) / 60);
                            const s = shortBreakDurationSec % 60;
                            setShortBreakDurationSec(h * 3600 + m * 60 + s);
                          }}
                        />
                        <Text style={styles.hmsColon}>:</Text>
                        <TextInput
                          style={styles.hmsInput}
                          keyboardType="numeric"
                          defaultValue={String(Math.floor((shortBreakDurationSec % 3600) / 60))}
                          onChangeText={(v) => {
                            const h = Math.floor(shortBreakDurationSec / 3600);
                            let m = Math.max(0, parseInt(v || '0', 10) || 0);
                            if (m > 59) m = 59;
                            const s = shortBreakDurationSec % 60;
                            setShortBreakDurationSec(h * 3600 + m * 60 + s);
                          }}
                        />
                        <Text style={styles.hmsColon}>:</Text>
                        <TextInput
                          style={styles.hmsInput}
                          keyboardType="numeric"
                          defaultValue={String(shortBreakDurationSec % 60)}
                          onChangeText={(v) => {
                            const h = Math.floor(shortBreakDurationSec / 3600);
                            const m = Math.floor((shortBreakDurationSec % 3600) / 60);
                            let s = Math.max(0, parseInt(v || '0', 10) || 0);
                            if (s > 59) s = 59;
                            setShortBreakDurationSec(h * 3600 + m * 60 + s);
                          }}
                        />
                      </View>
                    </View>

                    <View style={styles.settingItem}>
                      <Text style={styles.settingLabel}>Long Break</Text>
                      <View style={styles.hmsRow}>
                        <TextInput
                          style={styles.hmsInput}
                          keyboardType="numeric"
                          defaultValue={String(Math.floor(longBreakDurationSec / 3600))}
                          onChangeText={(v) => {
                            const h = Math.max(0, parseInt(v || '0', 10) || 0);
                            const m = Math.floor((longBreakDurationSec % 3600) / 60);
                            const s = longBreakDurationSec % 60;
                            setLongBreakDurationSec(h * 3600 + m * 60 + s);
                          }}
                        />
                        <Text style={styles.hmsColon}>:</Text>
                        <TextInput
                          style={styles.hmsInput}
                          keyboardType="numeric"
                          defaultValue={String(Math.floor((longBreakDurationSec % 3600) / 60))}
                          onChangeText={(v) => {
                            const h = Math.floor(longBreakDurationSec / 3600);
                            let m = Math.max(0, parseInt(v || '0', 10) || 0);
                            if (m > 59) m = 59;
                            const s = longBreakDurationSec % 60;
                            setLongBreakDurationSec(h * 3600 + m * 60 + s);
                          }}
                        />
                        <Text style={styles.hmsColon}>:</Text>
                        <TextInput
                          style={styles.hmsInput}
                          keyboardType="numeric"
                          defaultValue={String(longBreakDurationSec % 60)}
                          onChangeText={(v) => {
                            const h = Math.floor(longBreakDurationSec / 3600);
                            const m = Math.floor((longBreakDurationSec % 3600) / 60);
                            let s = Math.max(0, parseInt(v || '0', 10) || 0);
                            if (s > 59) s = 59;
                            setLongBreakDurationSec(h * 3600 + m * 60 + s);
                          }}
                        />
                      </View>
                    </View>

                    <TouchableOpacity
                      style={styles.settingActionButton}
                      onPress={() => {
                        // If timer not started, sync current mode's remaining time
                        if (!isRunning && !hasStarted) {
                          setTimeLeft(getModeDuration(mode));
                        }
                      }}
                    >
                      <Text style={styles.settingActionButtonText}>Apply Durations</Text>
                    </TouchableOpacity>
                  </>
                )}

                {selectedSettingsMenu === 'sound' && (
                  <>
                    <Text style={styles.settingsSectionTitle}>🔔 Sound & Alarm</Text>
                    <View style={styles.settingItem}>
                      <Text style={styles.settingLabel}>Sound effects</Text>
                      <TouchableOpacity
                        style={[styles.toggleButton, soundEffects && styles.toggleButtonActive]}
                        onPress={() => setSoundEffects(!soundEffects)}
                      >
                        <Text style={[styles.toggleText, soundEffects && { color: '#ffffff' }]}>
                          {soundEffects ? 'ON' : 'OFF'}
                        </Text>
                      </TouchableOpacity>
                    </View>
                    <View style={styles.settingItem}>
                      <Text style={styles.settingLabel}>Alarm type</Text>
                      <View style={styles.alarmOptions}>
                        {['gentle', 'standard', 'strong'].map(type => (
                          <TouchableOpacity
                            key={type}
                            style={[styles.alarmOption, alarmType === type && styles.alarmOptionActive]}
                            onPress={() => setAlarmType(type)}
                          >
                            <Text style={[styles.alarmOptionText, alarmType === type && { color: '#ffffff' }]}>
                              {type === 'gentle' ? '😌 Gentle' : type === 'strong' ? '💪 Strong' : '⚡ Standard'}
                            </Text>
                          </TouchableOpacity>
                        ))}
                      </View>
                    </View>
                  </>
                )}

                {selectedSettingsMenu === 'notifications' && (
                  <>
                    <Text style={styles.settingsSectionTitle}>📢 Notifications</Text>
                    <View style={styles.settingItem}>
                      <Text style={styles.settingLabel}>Enable notifications</Text>
                      <TouchableOpacity
                        style={[styles.toggleButton, notifications && styles.toggleButtonActive]}
                        onPress={() => setNotifications(!notifications)}
                      >
                        <Text style={[styles.toggleText, notifications && { color: '#ffffff' }]}>
                          {notifications ? 'ON' : 'OFF'}
                        </Text>
                      </TouchableOpacity>
                    </View>
                    <View style={styles.settingItem}>
                      <Text style={styles.settingLabel}>Focus mode</Text>
                      <TouchableOpacity
                        style={[styles.toggleButton, focusMode && styles.toggleButtonActive]}
                        onPress={() => setFocusMode(!focusMode)}
                      >
                        <Text style={[styles.toggleText, focusMode && { color: '#ffffff' }]}>
                          {focusMode ? 'ON' : 'OFF'}
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </>
                )}

                {selectedSettingsMenu === 'data' && (
                  <>
                    <Text style={styles.settingsSectionTitle}>💾 Data Management</Text>
                    <View style={styles.settingItem}>
                      <TouchableOpacity
                        style={styles.exportButton}
                        onPress={() => setShowExport(true)}
                      >
                        <Text style={styles.exportButtonText}>📤 Export Data</Text>
                      </TouchableOpacity>
                    </View>
                    <View style={styles.settingItem}>
                      <TouchableOpacity
                        style={styles.settingActionButton}
                        onPress={() => {
                          setTodayMinutes(0);
                          setCompletedSessions(0);
                          setWeeklyStats([]);
                          setTasks([]);
                          setNotesList([]);
                          setAchievements([]);
                          setProductivityScore(0);
                          setCurrentStreak(0);
                          setTotalSessions(0);
                          setTotalMinutes(0);
                        }}
                      >
                        <Text style={styles.settingActionButtonText}>🗑️ Reset All Data</Text>
                      </TouchableOpacity>
                    </View>
                  </>
                )}

                {selectedSettingsMenu === 'credits' && (
                  <>
                    <Text style={styles.settingsSectionTitle}>👨‍💻 Credits</Text>
                    <View style={styles.creditsBox}>
                      <Text style={styles.creditsEmoji}>👨‍💻</Text>
                      <Text style={styles.creditsMadeBy}>Made by</Text>
                      <Text style={styles.creditsName}>wortex213433</Text>
                      <View style={styles.creditsDivider} />
                      <Text style={styles.creditsTitle}>GitHub:</Text>
                      <TouchableOpacity style={styles.githubButton}>
                        <Text style={styles.githubButtonText}>
                          github.com/wortex213433
                        </Text>
                      </TouchableOpacity>
                      <View style={styles.creditsDivider} />
                      <Text style={styles.creditsVersion}>Version 2.1.0</Text>
                      <Text style={styles.creditsLicense}>MIT License</Text>
                    </View>
                  </>
                )}
              </ScrollView>
            
            <TouchableOpacity 
              style={styles.closeButton}
              onPress={() => setShowSettings(false)}
            >
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* About Modal */}
      {showAbout && (
        <View style={styles.overlay}>
          <View style={styles.aboutModal}>
            <Text style={styles.aboutTitle}>Pomodoro — White Edition</Text>
            <View style={styles.aboutContent}>
              <Text style={styles.aboutText}>
                Modern, minimalist ve işlevsel Pomodoro zamanlayıcı uygulaması.
              </Text>
              <View style={styles.creditsBox}>
                <Text style={styles.creditsEmoji}>👨‍💻</Text>
                <Text style={styles.creditsTitle}>Made by</Text>
                <Text style={styles.creditsName}>wortex213433</Text>
              </View>
              <View style={styles.aboutFeatures}>
                <Text style={styles.featureItem}>✓ Minimalist Design</Text>
                <Text style={styles.featureItem}>✓ Real-time Progress Ring</Text>
                <Text style={styles.featureItem}>✓ Weekly Statistics</Text>
                <Text style={styles.featureItem}>✓ Session Notes</Text>
                <Text style={styles.featureItem}>✓ Customizable Alarms</Text>
                <Text style={styles.featureItem}>✓ Goal Tracking</Text>
              </View>
            </View>
            <TouchableOpacity 
              style={styles.closeButton}
              onPress={() => setShowAbout(false)}
            >
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {currentTab === 'shop' ? renderShopPage() : currentTab === 'profile' ? renderProfilePage() : currentTab === 'achievements' ? renderAchievementsPage() : (
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Mode Selection */}
        <View style={styles.modeContainer}>
          {renderModeButton('Focus', mode === 'Focus')}
          {renderModeButton('Short Break', mode === 'Short Break')}
          {renderModeButton('Long Break', mode === 'Long Break')}
        </View>

        {/* Timer Display */}
        <View style={styles.timerContainer}>
          <View style={styles.ringContainer}>
            <View style={styles.ring}>
              {renderProgressRing()}
              <View style={styles.timerTextContainer}>
                <Text style={dynamicStyles.timerText}>{formatTime(timeLeft)}</Text>
              </View>
            </View>
            <Text style={dynamicStyles.timerStatus}>{mode.toUpperCase()} • {calculatePercentage()}%</Text>
          </View>

          {/* Controls */}
          <View style={styles.controlsContainer}>
            <TouchableOpacity
              style={[dynamicStyles.startButton, { backgroundColor: currentThemeColors.accent }]}
              onPress={toggleTimer}
              activeOpacity={0.8}
            >
              <Text style={styles.startButtonText}>{isRunning ? 'Pause' : 'Start'}</Text>
            </TouchableOpacity>
            
            <View style={styles.controlButtons}>
              <TouchableOpacity style={styles.controlButton} onPress={resetTimer}>
                <Text style={styles.controlIcon}>↶</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.controlButton} onPress={skipTimer}>
                <Text style={styles.controlIcon}>↻</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.controlButton} onPress={nextTimer}>
                <Text style={styles.controlIcon}>⊳</Text>
              </TouchableOpacity>
            </View>
          </View>

          <Text style={styles.shortcutsText}>
            Space: Start/Pause • R: Reset • N: Next
          </Text>
        </View>

        {/* Quick Settings */}
        <View style={styles.quickSetContainer}>
          <Text style={styles.quickSetLabel}>Quick set:</Text>
          <View style={styles.quickSetButtons}>
            {[15, 20, 25, 30, 45, 60].map((min) => (
              <TouchableOpacity
                key={min}
                style={[dynamicStyles.quickSetButton, { borderColor: currentThemeColors.border }]}
                onPress={() => quickSet(min)}
                activeOpacity={0.7}
              >
                <Text style={dynamicStyles.quickSetButtonText}>{min}m Focus</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Quick Stats Summary */}
        <View style={styles.quickStatsSummary}>
          <Text style={styles.quickStatsText}>
            Today: {todayMinutes}m • Sessions: {completedSessions} • Streak: 🔥{currentStreak}
          </Text>
          <TouchableOpacity onPress={() => setCurrentTab('profile')}>
              <Text style={styles.viewProfileText}>View Full Profile →</Text>
            </TouchableOpacity>
        </View>
      </ScrollView>
      )}

      {/* Bottom Tab Navigation */}
      <View style={[styles.bottomTabBar, { backgroundColor: currentThemeColors.bg, borderTopColor: currentThemeColors.border }]}>
        <TouchableOpacity 
          style={[styles.tabItem, currentTab === 'timer' && styles.tabItemActive]}
          onPress={() => setCurrentTab('timer')}
        >
          <Text style={[
            styles.tabIcon,
            { color: currentTab === 'timer' ? currentThemeColors.primary : '#999999' }
          ]}>
            ⏱️
          </Text>
          <Text style={[
            styles.tabLabel,
            { color: currentTab === 'timer' ? currentThemeColors.primary : '#999999' }
          ]}>
            Timer
          </Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.tabItem, currentTab === 'profile' && styles.tabItemActive]}
          onPress={() => setCurrentTab('profile')}
        >
          <Text style={[
            styles.tabIcon,
            { color: currentTab === 'profile' ? currentThemeColors.primary : '#999999' }
          ]}>
            👤
          </Text>
          <Text style={[
            styles.tabLabel,
            { color: currentTab === 'profile' ? currentThemeColors.primary : '#999999' }
          ]}>
            Profile
          </Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.tabItem, currentTab === 'achievements' && styles.tabItemActive]}
          onPress={() => setCurrentTab('achievements')}
        >
          <Text style={[
            styles.tabIcon,
            { color: currentTab === 'achievements' ? currentThemeColors.primary : '#999999' }
          ]}>
            🏆
          </Text>
          <Text style={[
            styles.tabLabel,
            { color: currentTab === 'achievements' ? currentThemeColors.primary : '#999999' }
          ]}>
            Achievements
          </Text>
          {achievements.length > 0 && (
            <View style={styles.tabBadge}>
              <Text style={styles.tabBadgeText}>{achievements.length}</Text>
            </View>
          )}
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.tabItem, currentTab === 'shop' && styles.tabItemActive]}
          onPress={() => setCurrentTab('shop')}
        >
          <Text style={[
            styles.tabIcon,
            { color: currentTab === 'shop' ? currentThemeColors.primary : '#999999' }
          ]}>
            🛍️
          </Text>
          <Text style={[
            styles.tabLabel,
            { color: currentTab === 'shop' ? currentThemeColors.primary : '#999999' }
          ]}>
            Shop
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    paddingTop: 40,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  headerLeft: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 3,
  },
  headerSubtitle: {
    fontSize: 12,
    color: '#999999',
  },
  headerRight: {
    flexDirection: 'row',
    gap: 10,
  },
  iconButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconText: {
    fontSize: 18,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  modeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 30,
    gap: 10,
  },
  modeButton: {
    flex: 1,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#000000',
    borderRadius: 25,
    paddingVertical: 12,
    paddingHorizontal: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  modeButtonActive: {
    backgroundColor: '#000000',
  },
  modeButtonText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#000000',
  },
  modeButtonTextActive: {
    color: '#ffffff',
  },
  modeIcon: {
    fontSize: 16,
  },
  timerContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  ringContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  ring: {
    width: Math.min(width * 0.75, 280),
    height: Math.min(width * 0.75, 280),
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
    position: 'relative',
  },
  svg: {
    position: 'absolute',
  },
  timerTextContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  timerText: {
    fontSize: 56,
    fontWeight: 'bold',
    color: '#000000',
  },
  timerStatus: {
    fontSize: 14,
    color: '#999999',
    fontWeight: '500',
  },
  controlsContainer: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 10,
  },
  startButton: {
    backgroundColor: '#000000',
    borderRadius: 25,
    paddingVertical: 16,
    paddingHorizontal: 50,
    marginBottom: 20,
  },
  startButtonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  controlButtons: {
    flexDirection: 'row',
    gap: 15,
  },
  controlButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  controlIcon: {
    fontSize: 20,
    color: '#000000',
  },
  shortcutsText: {
    fontSize: 12,
    color: '#999999',
    marginTop: 10,
  },
  quickSetContainer: {
    marginBottom: 30,
  },
  quickSetLabel: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 12,
  },
  quickSetButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  quickSetButton: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#000000',
    backgroundColor: '#ffffff',
  },
  quickSetButtonText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#000000',
  },
  statsContainer: {
    flexDirection: 'row',
    gap: 15,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#f9f9f9',
    padding: 20,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  statLabel: {
    fontSize: 12,
    color: '#666666',
    marginBottom: 8,
  },
  statValue: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#000000',
  },
  dropdown: {
    position: 'absolute',
    top: 70,
    right: 20,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#000000',
    borderRadius: 8,
    paddingVertical: 5,
    minWidth: 150,
    zIndex: 1000,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  dropdownItem: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  dropdownText: {
    fontSize: 14,
    color: '#000000',
    fontWeight: '500',
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 999,
  },
  statsModal: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 30,
    minWidth: 280,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#000000',
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 30,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 20,
    marginBottom: 30,
  },
  statBox: {
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f9f9f9',
    borderRadius: 15,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    minWidth: 120,
  },
  statNumber: {
    fontSize: 40,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 8,
  },
  statLabel: {
    fontSize: 12,
    color: '#666666',
    textAlign: 'center',
  },
  closeButton: {
    backgroundColor: '#000000',
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderRadius: 25,
  },
  closeButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  aboutModal: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 30,
    minWidth: 320,
    maxWidth: 340,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#000000',
  },
  aboutTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 20,
    textAlign: 'center',
  },
  aboutContent: {
    width: '100%',
    marginBottom: 30,
  },
  aboutText: {
    fontSize: 14,
    color: '#666666',
    textAlign: 'center',
    marginBottom: 30,
    lineHeight: 22,
  },
  creditsBox: {
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f9f9f9',
    borderRadius: 15,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    marginBottom: 20,
  },
  creditsEmoji: {
    fontSize: 40,
    marginBottom: 10,
  },
  creditsTitle: {
    fontSize: 12,
    color: '#999999',
    marginBottom: 5,
  },
  creditsName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000000',
  },
  aboutFeatures: {
    gap: 12,
  },
  featureItem: {
    fontSize: 14,
    color: '#000000',
    textAlign: 'left',
    fontWeight: '500',
  },
  weeklyStatsContainer: {
    width: '100%',
    marginTop: 20,
  },
  weeklyStatsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 10,
  },
  weeklyScroll: {
    maxHeight: 200,
  },
  weeklyStatRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    paddingHorizontal: 15,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    marginBottom: 5,
    alignItems: 'center',
  },
  weeklyDate: {
    fontSize: 12,
    color: '#666666',
    flex: 2,
  },
  weeklyMinutes: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000000',
    flex: 1,
    textAlign: 'right',
  },
  weeklySessions: {
    fontSize: 12,
    color: '#000000',
    flex: 1,
    textAlign: 'right',
  },
  notesModal: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 30,
    minWidth: 320,
    maxWidth: 340,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#000000',
    maxHeight: '80%',
  },
  notesSubtitle: {
    fontSize: 12,
    color: '#666666',
    marginBottom: 20,
  },
  notesInput: {
    width: '100%',
    minHeight: 200,
    maxHeight: 300,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 15,
    padding: 15,
    fontSize: 14,
    color: '#000000',
    backgroundColor: '#f9f9f9',
    textAlignVertical: 'top',
  },
  notesButtons: {
    flexDirection: 'row',
    gap: 15,
    marginTop: 20,
  },
  cancelButton: {
    backgroundColor: '#f5f5f5',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: '#000000',
  },
  cancelButtonText: {
    color: '#000000',
    fontSize: 16,
    fontWeight: '600',
  },
  saveButton: {
    backgroundColor: '#000000',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 25,
  },
  saveButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  streakCard: {
    flex: 1,
    backgroundColor: '#fff5e6',
    padding: 20,
    borderRadius: 15,
    borderWidth: 2,
    borderColor: '#ffcc80',
    alignItems: 'center',
  },
  streakIcon: {
    fontSize: 40,
    marginBottom: 8,
  },
  streakLabel: {
    fontSize: 11,
    color: '#666666',
    marginBottom: 5,
  },
  streakValue: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#ff6600',
  },
  goalCard: {
    flex: 1,
    backgroundColor: '#e3f2fd',
    padding: 20,
    borderRadius: 15,
    borderWidth: 2,
    borderColor: '#90caf9',
    alignItems: 'center',
  },
  goalIcon: {
    fontSize: 40,
    marginBottom: 8,
  },
  goalLabel: {
    fontSize: 11,
    color: '#666666',
    marginBottom: 5,
  },
  goalValue: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1976d2',
    marginBottom: 10,
  },
  goalProgress: {
    width: '80%',
    height: 6,
    backgroundColor: '#e0e0e0',
    borderRadius: 3,
    overflow: 'hidden',
  },
  goalProgressBar: {
    height: '100%',
    backgroundColor: '#1976d2',
    borderRadius: 3,
  },
  totalStatsContainer: {
    flexDirection: 'row',
    backgroundColor: '#f9f9f9',
    padding: 20,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    gap: 15,
  },
  totalStatItem: {
    flex: 1,
    alignItems: 'center',
  },
  totalStatLabel: {
    fontSize: 11,
    color: '#666666',
    marginBottom: 8,
    textAlign: 'center',
  },
  totalStatValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000000',
  },
  settingsModal: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 20,
    width: '90%',
    maxWidth: 500,
    maxHeight: '90%',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#000000',
  },
  settingsSubtitle: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 25,
  },
  themesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    justifyContent: 'center',
    marginBottom: 20,
  },
  themeButton: {
    width: 80,
    height: 80,
    borderRadius: 15,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  themeButtonActive: {
    borderWidth: 3,
    transform: [{ scale: 1.05 }],
  },
  themeIcon: {
    fontSize: 32,
    marginBottom: 5,
  },
  themeName: {
    fontSize: 10,
    fontWeight: '600',
  },
  checkmark: {
    position: 'absolute',
    top: 3,
    right: 3,
    fontSize: 16,
    color: '#000000',
    fontWeight: 'bold',
  },
  achievementBanner: {
    position: 'absolute',
    top: 100,
    left: 20,
    right: 20,
    backgroundColor: '#ffd700',
    borderRadius: 15,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    zIndex: 9999,
    borderWidth: 2,
    borderColor: '#ffcc00',
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  achievementEmoji: {
    fontSize: 30,
  },
  achievementText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000000',
    flex: 1,
    textAlign: 'center',
  },
  tasksModal: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 30,
    minWidth: 320,
    maxWidth: 400,
    maxHeight: '80%',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#000000',
  },
  taskInputContainer: {
    flexDirection: 'row',
    gap: 10,
    width: '100%',
    marginBottom: 20,
  },
  taskInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 10,
    padding: 12,
    fontSize: 14,
    backgroundColor: '#f9f9f9',
  },
  addTaskButton: {
    backgroundColor: '#000000',
    borderRadius: 10,
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addTaskButtonText: {
    color: '#ffffff',
    fontSize: 24,
    fontWeight: 'bold',
  },
  taskList: {
    width: '100%',
    maxHeight: 300,
    marginBottom: 20,
  },
  taskItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    gap: 10,
  },
  taskCheckbox: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: '#000000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  taskCheckboxText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  taskText: {
    flex: 1,
    fontSize: 14,
    color: '#000000',
  },
  taskTextCompleted: {
    textDecorationLine: 'line-through',
    opacity: 0.5,
  },
  taskDelete: {
    fontSize: 18,
  },
  emptyTaskText: {
    textAlign: 'center',
    color: '#999999',
    fontSize: 14,
    padding: 40,
  },
  productivityCard: {
    backgroundColor: '#f0f9ff',
    padding: 25,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#93c5fd',
    alignItems: 'center',
    marginBottom: 20,
  },
  productivityTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e40af',
    marginBottom: 15,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  productivityScore: {
    fontSize: 56,
    fontWeight: 'bold',
    color: '#1e40af',
    marginBottom: 10,
  },
  productivityLabel: {
    fontSize: 12,
    color: '#64748b',
    textAlign: 'center',
  },
  categoryContainer: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 20,
  },
  categoryButton: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    borderRadius: 10,
    padding: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  categoryButtonActive: {
    backgroundColor: '#000000',
    borderColor: '#000000',
  },
  categoryIcon: {
    fontSize: 24,
    marginBottom: 4,
  },
  categoryText: {
    fontSize: 10,
    color: '#666666',
    textTransform: 'capitalize',
  },
  savedNotesList: {
    maxHeight: 200,
    marginBottom: 20,
  },
  savedNoteItem: {
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  noteHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  noteCategory: {
    fontSize: 12,
    fontWeight: '600',
    color: '#000000',
  },
  noteDate: {
    fontSize: 10,
    color: '#999999',
  },
  savedNoteText: {
    fontSize: 14,
    color: '#000000',
    marginBottom: 10,
    lineHeight: 20,
  },
  deleteNoteButton: {
    alignSelf: 'flex-end',
  },
  deleteNoteText: {
    fontSize: 12,
    color: '#ff0000',
    fontWeight: '600',
  },
  settingsContent: {
    width: '100%',
    maxHeight: 500,
    marginBottom: 20,
  },
  settingsSectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000000',
    marginTop: 25,
    marginBottom: 15,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  settingLabel: {
    fontSize: 14,
    color: '#000000',
    fontWeight: '500',
  },
  toggleButton: {
    backgroundColor: '#f5f5f5',
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#e0e0e0',
  },
  toggleButtonActive: {
    backgroundColor: '#000000',
    borderColor: '#000000',
  },
  toggleText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#000000',
  },
  alarmOptions: {
    flexDirection: 'row',
    gap: 10,
  },
  alarmOption: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    backgroundColor: '#ffffff',
  },
  alarmOptionActive: {
    backgroundColor: '#000000',
    borderColor: '#000000',
  },
  alarmOptionText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#000000',
  },
  settingActionButton: {
    backgroundColor: '#ffebee',
    padding: 15,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ffcccb',
    width: '100%',
    alignItems: 'center',
  },
  settingActionButtonText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#c62828',
  },
  settingsTabsContainer: {
    marginTop: 20,
    marginBottom: 20,
    maxHeight: 60,
  },
  settingsTab: {
    flexDirection: 'column',
    alignItems: 'center',
    padding: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    marginRight: 10,
    backgroundColor: '#f5f5f5',
    minWidth: 70,
  },
  settingsTabActive: {
    backgroundColor: '#000000',
  },
  settingsTabIcon: {
    fontSize: 24,
    marginBottom: 4,
  },
  settingsTabText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#000000',
  },
  settingsMenuContent: {
    width: '100%',
    maxHeight: 400,
    marginBottom: 10,
  },
  settingValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#666666',
  },
  exportButton: {
    backgroundColor: '#e3f2fd',
    padding: 15,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#90caf9',
    width: '100%',
    alignItems: 'center',
  },
  exportButtonText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1976d2',
  },
  hmsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  hmsInput: {
    width: 50,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    paddingVertical: 6,
    paddingHorizontal: 8,
    textAlign: 'center',
    backgroundColor: '#f9f9f9',
  },
  hmsColon: {
    fontSize: 16,
    color: '#666666',
    marginHorizontal: 2,
  },
  creditsMadeBy: {
    fontSize: 12,
    color: '#999999',
    marginBottom: 5,
  },
  creditsDivider: {
    height: 1,
    backgroundColor: '#e0e0e0',
    width: '100%',
    marginVertical: 20,
  },
  creditsTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 10,
  },
  githubButton: {
    backgroundColor: '#f5f5f5',
    padding: 15,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#000000',
    width: '100%',
    alignItems: 'center',
  },
  githubButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#000000',
  },
  creditsVersion: {
    fontSize: 12,
    color: '#666666',
    marginBottom: 5,
  },
  creditsLicense: {
    fontSize: 12,
    color: '#999999',
  },
  // Profile Page Styles
  profileScrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  profileHeader: {
    alignItems: 'center',
    paddingVertical: 30,
    marginBottom: 20,
  },
  profileAvatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
    borderWidth: 3,
    borderColor: '#000000',
  },
  profileAvatarText: {
    fontSize: 50,
  },
  profileName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 5,
  },
  profileSubtitle: {
    fontSize: 14,
    color: '#666666',
  },
  productivityHeroCard: {
    backgroundColor: '#f0f9ff',
    padding: 30,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#93c5fd',
    alignItems: 'center',
    marginBottom: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  productivityHeroTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1e40af',
    marginBottom: 15,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  productivityHeroScore: {
    fontSize: 64,
    fontWeight: 'bold',
    color: '#1e40af',
    marginBottom: 10,
  },
  productivityHeroLabel: {
    fontSize: 14,
    color: '#64748b',
    textAlign: 'center',
  },
  profileSection: {
    marginBottom: 30,
  },
  profileSectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 15,
  },
  profileStatsGrid: {
    flexDirection: 'row',
    gap: 15,
  },
  profileStatCard: {
    flex: 1,
    backgroundColor: '#f9f9f9',
    padding: 20,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    alignItems: 'center',
  },
  profileStatIcon: {
    fontSize: 32,
    marginBottom: 10,
  },
  profileStatValue: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 5,
  },
  profileStatLabel: {
    fontSize: 12,
    color: '#666666',
  },
  streakCardProfile: {
    flex: 1,
    backgroundColor: '#fff5e6',
    padding: 20,
    borderRadius: 15,
    borderWidth: 2,
    borderColor: '#ffcc80',
    alignItems: 'center',
  },
  streakIconProfile: {
    fontSize: 40,
    marginBottom: 8,
  },
  streakLabelProfile: {
    fontSize: 12,
    color: '#666666',
    marginBottom: 5,
  },
  streakValueProfile: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#ff6600',
    marginBottom: 2,
  },
  streakDaysText: {
    fontSize: 11,
    color: '#999999',
  },
  goalCardProfile: {
    flex: 1,
    backgroundColor: '#e3f2fd',
    padding: 20,
    borderRadius: 15,
    borderWidth: 2,
    borderColor: '#90caf9',
    alignItems: 'center',
  },
  goalIconProfile: {
    fontSize: 40,
    marginBottom: 8,
  },
  goalLabelProfile: {
    fontSize: 12,
    color: '#666666',
    marginBottom: 5,
  },
  goalValueProfile: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#1976d2',
    marginBottom: 10,
  },
  goalProgressProfile: {
    width: '80%',
    height: 8,
    backgroundColor: '#e0e0e0',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 8,
  },
  goalProgressBarProfile: {
    height: '100%',
    backgroundColor: '#1976d2',
    borderRadius: 4,
  },
  goalProgressText: {
    fontSize: 11,
    color: '#1976d2',
    fontWeight: '600',
  },
  totalStatsContainerProfile: {
    flexDirection: 'row',
    backgroundColor: '#f9f9f9',
    padding: 20,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    gap: 15,
  },
  totalStatItemProfile: {
    flex: 1,
    alignItems: 'center',
  },
  totalStatIconProfile: {
    fontSize: 32,
    marginBottom: 8,
  },
  totalStatValueProfile: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 5,
  },
  totalStatLabelProfile: {
    fontSize: 11,
    color: '#666666',
    textAlign: 'center',
  },
  weeklyStatsContainerProfile: {
    gap: 10,
  },
  weeklyStatRowProfile: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 15,
    paddingHorizontal: 15,
    backgroundColor: '#f5f5f5',
    borderRadius: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  weeklyStatLeft: {
    flex: 2,
  },
  weeklyDateProfile: {
    fontSize: 14,
    color: '#000000',
    fontWeight: '500',
  },
  weeklyStatRight: {
    flex: 1,
    alignItems: 'flex-end',
  },
  weeklyMinutesProfile: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 2,
  },
  weeklySessionsProfile: {
    fontSize: 12,
    color: '#666666',
  },
  achievementsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 15,
  },
  achievementBadge: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#fff5e6',
    borderWidth: 3,
    borderColor: '#ffcc80',
    justifyContent: 'center',
    alignItems: 'center',
  },
  achievementBadgeIcon: {
    fontSize: 40,
  },
  quickStatsSummary: {
    backgroundColor: '#f9f9f9',
    padding: 20,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    marginTop: 20,
    alignItems: 'center',
  },
  quickStatsText: {
    fontSize: 14,
    color: '#000000',
    marginBottom: 10,
    textAlign: 'center',
  },
  viewProfileText: {
    fontSize: 14,
    color: '#1976d2',
    fontWeight: '600',
  },
  // Bottom Tab Bar Styles
  bottomTabBar: {
    flexDirection: 'row',
    borderTopWidth: 1,
    paddingVertical: 8,
    paddingBottom: 20,
    paddingTop: 8,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    position: 'relative',
  },
  tabItemActive: {
    // Active state handled by color
  },
  tabIcon: {
    fontSize: 24,
    marginBottom: 4,
  },
  tabLabel: {
    fontSize: 11,
    fontWeight: '600',
  },
  tabBadge: {
    position: 'absolute',
    top: 4,
    right: '30%',
    backgroundColor: '#ff4444',
    borderRadius: 10,
    minWidth: 18,
    height: 18,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
  },
  tabBadgeText: {
    color: '#ffffff',
    fontSize: 10,
    fontWeight: 'bold',
  },
  // Achievements Page Styles
  achievementsHeaderIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#fff5e6',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
    borderWidth: 3,
    borderColor: '#ffcc80',
  },
  achievementsHeaderIconText: {
    fontSize: 50,
  },
  achievementsProgressBar: {
    width: '80%',
    height: 8,
    backgroundColor: '#e0e0e0',
    borderRadius: 4,
    overflow: 'hidden',
    marginTop: 15,
  },
  achievementsProgressFill: {
    height: '100%',
    backgroundColor: '#ff6600',
    borderRadius: 4,
  },
  achievementsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 15,
    justifyContent: 'space-between',
  },
  achievementCard: {
    width: '48%',
    backgroundColor: '#ffffff',
    borderRadius: 15,
    padding: 20,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#ffcc80',
    minHeight: 200,
    justifyContent: 'space-between',
  },
  achievementCardLocked: {
    backgroundColor: '#f5f5f5',
    borderColor: '#e0e0e0',
    opacity: 0.7,
  },
  achievementIconContainer: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#fff5e6',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
    borderWidth: 2,
    borderColor: '#ffcc80',
  },
  achievementIconContainerLocked: {
    backgroundColor: '#e0e0e0',
    borderColor: '#cccccc',
  },
  achievementIconText: {
    fontSize: 40,
  },
  achievementIconTextLocked: {
    fontSize: 30,
  },
  achievementCardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 8,
    textAlign: 'center',
  },
  achievementCardTitleLocked: {
    color: '#666666',
  },
  achievementCardDesc: {
    fontSize: 12,
    color: '#666666',
    textAlign: 'center',
    marginBottom: 10,
  },
  achievementCardDescLocked: {
    color: '#999999',
  },
  achievementUnlockedBadge: {
    backgroundColor: '#4caf50',
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 12,
    marginTop: 5,
  },
  achievementUnlockedText: {
    color: '#ffffff',
    fontSize: 11,
    fontWeight: '600',
  },
});

