window.onload = function() {

  const wordPairs = [
    { en: "Hello", ch: "Nihao" },
    { en: "Good morning", ch: "Zao Shang Hao" },
    { en: "Good afternoon", ch: "Xia Wu Hao" },
    { en: "Good night", ch: "Wan Shang Hao" },
    { en: "Thank you", ch: "Xie Xie" },
    { en: "Goodbye", ch: "Zai Jian" }
  ];

  let selectedEnglish = null;

  function shuffle(arr) {
    return arr.sort(() => Math.random() - 0.5);
  }

  function createGame() {
    const englishDiv = document.getElementById("englishWords");
    const chineseDiv = document.getElementById("chineseWords");
    console.log(englishDiv);

    englishDiv.innerHTML = "";
    chineseDiv.innerHTML = "";

    const shuffledEnglish = shuffle([...wordPairs]);
    const shuffledChinese = shuffle([...wordPairs]);

    shuffledEnglish.forEach(pair => {
      const btn = document.createElement("div");
      btn.className = "item";
      btn.textContent = pair.en;
      btn.onclick = () => {
        selectedEnglish = pair;
        document.querySelectorAll(".item").forEach(el => el.classList.remove("selected"));
        btn.classList.add("selected");
      };
      englishDiv.appendChild(btn);
    });

    shuffledChinese.forEach(pair => {
      const btn = document.createElement("div");
      btn.className = "item";
      btn.textContent = pair.ch;
      btn.onclick = () => {
        // if (!selectedEnglish) return;
        if (pair.ch === selectedEnglish.ch) {
          btn.classList.add("correct");
          document.querySelectorAll("#englishWords .item").forEach(b => {
            if (b.textContent === selectedEnglish.en) b.classList.add("correct");
          });
        } else {
          btn.classList.add("wrong");
        }
        selectedEnglish = null;
        setTimeout(() => {
          document.querySelectorAll(".item").forEach(el => el.classList.remove("wrong", "selected"));
        }, 1000);
      };
      chineseDiv.appendChild(btn);
    });
  }

  createGame();
 }
