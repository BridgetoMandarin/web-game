window.onload = function() {

  // --- Start of Shared Logic with src-bar/script.js ---

  // Initialize user data or load from localStorage
  let userData;
  const defaultUserData = {
      streak: 0,
      currentLevel: 1, // Profile level
      currentXP: 0,
      levelXP: 100,
      dailyXP: 0,
      dailyGoal: 50,
      lastLogin: new Date().toDateString(),
      achievements: [],
      game: {
        currentLevel: 0, // 0-indexed game level
      },
  };

  try {
    userData = JSON.parse(localStorage.getItem("mandarinProgress")) || defaultUserData;
  } catch (error) {
    console.error("Could not parse user progress, resetting.", error);
    userData = defaultUserData;
  }

  // Save user data to localStorage
  function saveUserData() {
    localStorage.setItem("mandarinProgress", JSON.stringify(userData));
  }

  // Add achievement
  function addAchievement(text) {
    const now = new Date();
    const timeString = now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

    userData.achievements.unshift({
      text: text,
      time: timeString,
      date: now.toDateString(),
    });

    // Keep only the last 10 achievements
    if (userData.achievements.length > 10) {
      userData.achievements.pop();
    }
    // No need to render achievements here, but we save the data
    saveUserData();
  }

  // Level up function for the user's profile
  function levelUp() {
    const extraXP = userData.currentXP - userData.levelXP;
    userData.currentLevel++;

    // Increase XP required for next level
    userData.levelXP = Math.floor(userData.levelXP * 1.5);
    userData.currentXP = extraXP;

    addAchievement("🎉 Level up! You reached level " + userData.currentLevel);
  }

  // Add XP and update progress
  function addXP(amount) {
    userData.currentXP += amount;
    userData.dailyXP += amount;

    // Check if profile level up
    if (userData.currentXP >= userData.levelXP) {
      levelUp();
    }

    // Check if daily goal achieved
    if (userData.dailyXP >= userData.dailyGoal && userData.dailyXP - amount < userData.dailyGoal) {
      addAchievement("🎯 Daily goal achieved! +" + userData.dailyGoal + " XP");
    }

    saveUserData();
  }

  // --- End of Shared Logic ---

  // --- Game Specific Logic ---

  const XP_PER_LEVEL = 25; // XP awarded for completing a level

  const levels = [
    // Level 1
    [
      { en: "Hello", ch: "Nihao" },
      { en: "Thank you", ch: "Xie Xie" },
      { en: "Goodbye", ch: "Zai Jian" },
      { en: "You're welcome", ch: "Bu Ke Qi" },
      { en: "Please", ch: "Qing" }
    ],
    // Level 2
    [
      { en: "Good morning", ch: "Zao Shang Hao" },
      { en: "Good afternoon", ch: "Xia Wu Hao" },
      { en: "Good night", ch: "Wan Shang Hao" },
      { en: "See you tomorrow", ch: "Ming Tian Jian" },

    ],
    // Level 3 - Common Phrases
    [
      { en: "How are you?", ch: "Nǐ hǎo ma?" },
      { en: "What is your name?", ch: "Ni Jiao Shenme Mingzi" }

    ],
    //Level 4 - Family 
    [
      { en: "Mother", ch: "Māmā" },
      { en: "Father", ch: "Bàba" },
      { en: "Older Brother", ch: "Gēgē" },
      { en: "Older Sister", ch: "Jiějiě" },
      { en: "Younger Brother", ch: "Dìdì" },
      { en: "Younger Sister", ch: "Mèimei" }
    ],
    // Level 5 - People (Template)
    [ 
      { en: "Teacher", ch: "Lǎoshī" },
      { en: "Student", ch: "Xuéshēng" },
      { en: "Friend", ch: "Péngyǒu" },
      { en: "Doctor", ch: "Yīshēng" },
    ],
    // Level 6 - Numbers 
    [
      { en: "One", ch: "Yi" },
      { en: "Two", ch: "Èr" },
      { en: "Three", ch: "Sān" },
      { en: "Four", ch: "Sì" },
      { en: "Five", ch: "Wǔ" }
    ],
  ];

  // We will use userData.game.currentLevel directly to avoid sync issues.
  let selectedPair = null;
  let correctMatches = 0;

  const englishDiv = document.getElementById("englishWords");
  const chineseDiv = document.getElementById("chineseWords");
  const levelIndicator = document.getElementById("levelIndicator");
  const nextLevelBtn = document.getElementById("nextLevelBtn");
  const winMessage = document.getElementById("winMessage");

  function shuffle(arr) {
    return arr.sort(() => Math.random() - 0.5);
  }

  function createGame(levelIndex) {
    // Check if all levels are completed
    if (levelIndex >= levels.length) {
      englishDiv.innerHTML = "";
      chineseDiv.innerHTML = "";
      levelIndicator.textContent = "All levels completed!";
      winMessage.style.display = "block";
      nextLevelBtn.style.display = "none";
      return;
    }

    const wordPairs = levels[levelIndex];
    correctMatches = 0;
    selectedPair = null;

    levelIndicator.textContent = `Level ${levelIndex + 1}`;
    nextLevelBtn.style.display = "none";
    winMessage.style.display = "none";

    englishDiv.innerHTML = "";
    chineseDiv.innerHTML = "";

    const shuffledEnglish = shuffle([...wordPairs]);
    const shuffledChinese = shuffle([...wordPairs]);

    shuffledEnglish.forEach(pair => {
      const item = document.createElement("div");
      item.className = "item";
      item.textContent = pair.en;
      item.dataset.ch = pair.ch;

      item.onclick = () => {
        if (item.classList.contains('correct')) return;

        selectedPair = pair;
        document.querySelectorAll("#englishWords .item").forEach(el => el.classList.remove("selected"));
        item.classList.add("selected");
      };
      englishDiv.appendChild(item);
    });

    shuffledChinese.forEach(pair => {
      const item = document.createElement("div");
      item.className = "item";
      item.textContent = pair.ch;
      item.dataset.ch = pair.ch;

      item.onclick = () => {
        if (!selectedPair || item.classList.contains('correct')) return;

        if (selectedPair.ch === item.dataset.ch) {
          item.classList.add("correct");
          correctMatches++;

          const englishItem = document.querySelector(`#englishWords .item[data-ch='${selectedPair.ch}']`);
          if (englishItem) {
            englishItem.classList.add("correct");
            englishItem.classList.remove("selected");
          }

          if (correctMatches === wordPairs.length) {
            // Level complete! Award XP and save progress.
            const completedLevel = userData.game.currentLevel;
            addXP(XP_PER_LEVEL);
            addAchievement(`✅ Completed game level ${completedLevel + 1}! +${XP_PER_LEVEL} XP`);
            userData.game.currentLevel++;
            saveUserData();

            setTimeout(() => {
              if (userData.game.currentLevel < levels.length) {
                nextLevelBtn.style.display = "block";
              } else {
                winMessage.style.display = "block";
              }
            }, 500);
          }
        } else {
          item.classList.add("wrong");
          const selectedEnglishItem = document.querySelector("#englishWords .item.selected");
          if (selectedEnglishItem) selectedEnglishItem.classList.add("wrong");

          setTimeout(() => {
            item.classList.remove("wrong");
            if (selectedEnglishItem) selectedEnglishItem.classList.remove("wrong", "selected");
          }, 800);
        }
        selectedPair = null;
      };
      chineseDiv.appendChild(item);
    });
  }

  nextLevelBtn.onclick = () => {
    // The level is already incremented in userData when the previous one was completed.
    if (userData.game.currentLevel < levels.length) {
      createGame(userData.game.currentLevel);
    }
  };

  // Start the game with the user's current level
  createGame(userData.game.currentLevel);
};
