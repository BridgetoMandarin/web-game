window.onload = function() {

  const levels = [
    // Level 1
    [
      { en: "Hello", ch: "Nihao" },
      { en: "Thank you", ch: "Xie Xie" },
      { en: "Goodbye", ch: "Zai Jian" }
    ],
    // Level 2
    [
      { en: "Good morning", ch: "Zao Shang Hao" },
      { en: "Good afternoon", ch: "Xia Wu Hao" },
      { en: "Good night", ch: "Wan Shang Hao" },
      { en: "You're welcome", ch: "Bu Ke Qi" }
    ]
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
      item.dataset.ch = pair.ch; // Store the matching Chinese word for identification

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

  createGame(currentLevel);
 }
