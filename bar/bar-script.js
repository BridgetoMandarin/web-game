document.addEventListener("DOMContentLoaded", () => {
  // Initialize user data or load from localStorage
  let userData;
  const defaultUserData = {
      streak: 0,
      currentLevel: 1,
      currentXP: 0,
      levelXP: 100,
      dailyXP: 0,
      dailyGoal: 50,
      lastLogin: new Date().toDateString(),
      achievements: [],
      game: {
        currentLevel: 0, // 0-indexed
      },
  };

  try {
    userData = JSON.parse(localStorage.getItem("mandarinProgress")) || defaultUserData;
  } catch (error) {
    console.error("Could not parse user progress, resetting.", error);
    userData = defaultUserData;
  }

  // DOM elements
  const streakCount = document.getElementById("streak-count")
  const currentLevel = document.getElementById("current-level")
  const nextLevel = document.getElementById("next-level")
  const currentXP = document.getElementById("current-xp")
  const levelXP = document.getElementById("level-xp")
  const progressFill = document.getElementById("progress-fill")
  const dailyXP = document.getElementById("daily-xp")
  const dailyGoal = document.getElementById("daily-goal")
  const dailyGoalFill = document.getElementById("daily-goal-fill")
  const achievementsList = document.getElementById("achievements-list")

  // Buttons
  const completeLesson = document.getElementById("complete-lesson")
  const practiceCharacters = document.getElementById("practice-characters")
  const reviewVocabulary = document.getElementById("review-vocabulary")
  const resetProgress = document.getElementById("reset-progress")

  // Check if it's a new day
  function checkNewDay() {
    const today = new Date().toDateString()
    if (userData.lastLogin !== today) {
      // It's a new day
      if (userData.dailyXP >= userData.dailyGoal) {
        // User met their goal yesterday, increase streak
        userData.streak++
        addAchievement("🔥 Streak increased to " + userData.streak + " days!")
      } else if (userData.dailyXP > 0) {
        // User did some work but didn't meet goal, maintain streak
        addAchievement("⚠️ You didn't meet your daily goal yesterday")
      } else {
        // User did no work yesterday, reset streak
        if (userData.streak > 0) {
          addAchievement("💔 Streak reset! You were on a " + userData.streak + " day streak")
          userData.streak = 0
        }
      }

      // Reset daily XP for the new day
      userData.dailyXP = 0
      userData.lastLogin = today
      saveUserData()
    }
  }

  // Update UI with current data
  function updateUI() {
    streakCount.textContent = userData.streak
    currentLevel.textContent = userData.currentLevel
    nextLevel.textContent = userData.currentLevel + 1
    currentXP.textContent = userData.currentXP
    levelXP.textContent = userData.levelXP

    // Calculate progress percentages
    const levelProgress = (userData.currentXP / userData.levelXP) * 100
    progressFill.style.width = `${levelProgress}%`

    dailyXP.textContent = userData.dailyXP
    dailyGoal.textContent = userData.dailyGoal

    const dailyProgress = (userData.dailyXP / userData.dailyGoal) * 100
    dailyGoalFill.style.width = `${dailyProgress}%`

    // Update achievements list
    renderAchievements()
  }

  // Add XP and update progress
  function addXP(amount) {
    // Add animation class
    currentXP.classList.add("xp-animation")
    dailyXP.classList.add("xp-animation")

    // Remove animation class after animation completes
    setTimeout(() => {
      currentXP.classList.remove("xp-animation")
      dailyXP.classList.remove("xp-animation")
    }, 500)

    userData.currentXP += amount
    userData.dailyXP += amount

    // Check if level up
    if (userData.currentXP >= userData.levelXP) {
      levelUp()
    }

    // Check if daily goal achieved
    if (userData.dailyXP >= userData.dailyGoal && userData.dailyXP - amount < userData.dailyGoal) {
      addAchievement("🎯 Daily goal achieved! +" + userData.dailyGoal + " XP")
    }

    saveUserData()
    updateUI()
  }

  // Level up function
  function levelUp() {
    const extraXP = userData.currentXP - userData.levelXP
    userData.currentLevel++

    // Increase XP required for next level
    userData.levelXP = Math.floor(userData.levelXP * 1.5)
    userData.currentXP = extraXP

    addAchievement("🎉 Level up! You reached level " + userData.currentLevel)
  }

  // Add achievement
  function addAchievement(text) {
    const now = new Date()
    const timeString = now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })

    userData.achievements.unshift({
      text: text,
      time: timeString,
      date: now.toDateString(),
    })

    // Keep only the last 10 achievements
    if (userData.achievements.length > 10) {
      userData.achievements.pop()
    }

    saveUserData()
    renderAchievements()
  }

  // Render achievements list
  function renderAchievements() {
    achievementsList.innerHTML = ""

    if (userData.achievements.length === 0) {
      const emptyItem = document.createElement("li")
      emptyItem.className = "achievement-item"
      emptyItem.textContent = "No achievements yet. Start learning!"
      achievementsList.appendChild(emptyItem)
      return
    }

    userData.achievements.forEach((achievement) => {
      const item = document.createElement("li")
      item.className = "achievement-item"

      const icon = document.createElement("span")
      icon.className = "achievement-icon"
      icon.textContent = achievement.text.substring(0, 2)

      const text = document.createElement("span")
      text.className = "achievement-text"
      text.textContent = achievement.text.substring(2)

      const time = document.createElement("span")
      time.className = "achievement-time"

      // Check if achievement is from today
      if (achievement.date === new Date().toDateString()) {
        time.textContent = achievement.time
      } else {
        time.textContent =
          achievement.time +
          " · " +
          new Date(achievement.date).toLocaleDateString([], {
            month: "short",
            day: "numeric",
          })
      }

      item.appendChild(icon)
      item.appendChild(text)
      item.appendChild(time)
      achievementsList.appendChild(item)
    })
  }

  // Save user data to localStorage
  function saveUserData() {
    localStorage.setItem("mandarinProgress", JSON.stringify(userData))
  }

  // Reset all progress
  function resetAllProgress() {
    if (confirm("Are you sure you want to reset all progress? This cannot be undone.")) {
      userData = {
        streak: 0,
        currentLevel: 1,
        currentXP: 0,
        levelXP: 100,
        dailyXP: 0,
        dailyGoal: 50,
        lastLogin: new Date().toDateString(),
        achievements: [
          {
            text: "🔄 Progress reset",
            time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
            date: new Date().toDateString(),
          },
        ],
        game: {
          currentLevel: 0,
        },
      }
      saveUserData()
      updateUI()
    }
  }

  // Event listeners for buttons
  completeLesson.addEventListener("click", () => {
    addXP(10)
    addAchievement("📚 Completed a lesson +10 XP")
  })

  practiceCharacters.addEventListener("click", () => {
    addXP(5)
    addAchievement("✍️ Practiced characters +5 XP")
  })

  reviewVocabulary.addEventListener("click", () => {
    addXP(8)
    addAchievement("🔄 Reviewed vocabulary +8 XP")
  })

  resetProgress.addEventListener("click", resetAllProgress)

  // Initialize
  checkNewDay()
  updateUI()
})
 
