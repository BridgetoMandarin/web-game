window.onload = function() {
 // --- Game Specific Logic ---

  // Dynamically create and append game controls to the page
  const nextLevelBtnEl = document.createElement('button');
  nextLevelBtnEl.id = 'nextLevelBtn';
  nextLevelBtnEl.style.display = 'none';
  nextLevelBtnEl.textContent = 'Next Level';

  const winMessageEl = document.createElement('div');
  winMessageEl.id = 'winMessage';
  winMessageEl.style.display = 'none';
  winMessageEl.textContent = "Congratulations! You've completed all levels!";

  // Append controls to the body. They will be styled by the existing CSS.
  document.body.appendChild(nextLevelBtnEl);
  document.body.appendChild(winMessageEl);

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

  let currentLevel = 0;
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
            setTimeout(() => {
              if (currentLevel < levels.length - 1) {
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
    currentLevel++;
    if (currentLevel < levels.length) {
      createGame(currentLevel);
    }
  };

  // Start the game with the user's current level
  createGame(currentLevel);
};
