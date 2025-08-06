document.addEventListener("DOMContentLoaded", () => {
  // Game variables
  let moves = 0
  let timer
  let seconds = 0
  let minutes = 0
  let firstCard = null
  let secondCard = null
  let locked = false
  let matchedPairs = 0

  // Fruit data with Chinese words and image queries
  const fruits = [
    // IMPORTANT: Replace these placeholder URLs with the actual URLs of your images
    // after uploading them to the Webflow Asset Manager.
    { name: "apple", chinese: "苹果", pinyin: "píngguǒ", imageUrl: "https://uploads-ssl.webflow.com/path/to/your/apple.jpg" },
    { name: "banana", chinese: "香蕉", pinyin: "xiāngjiāo", imageUrl: "https://uploads-ssl.webflow.com/path/to/your/banana.jpg" },
    { name: "orange", chinese: "橙子", pinyin: "chéngzi", imageUrl: "https://uploads-ssl.webflow.com/path/to/your/orange.jpg" },
    { name: "strawberry", chinese: "草莓", pinyin: "cǎoméi", imageUrl: "https://uploads-ssl.webflow.com/path/to/your/strawberry.jpg" },
    { name: "watermelon", chinese: "西瓜", pinyin: "xīguā", imageUrl: "https://uploads-ssl.webflow.com/path/to/your/watermelon.jpg" },
    { name: "grape", chinese: "葡萄", pinyin: "pútáo", imageUrl: "https://uploads-ssl.webflow.com/path/to/your/grape.jpg" },
    { name: "pear", chinese: "梨", pinyin: "lí", imageUrl: "https://uploads-ssl.webflow.com/path/to/your/pear.jpg" },
    { name: "peach", chinese: "桃子", pinyin: "táozi", imageUrl: "https://uploads-ssl.webflow.com/path/to/your/peach.jpg" },
  ]

  // DOM elements
  const gameBoard = document.getElementById("game-board")
  const movesCount = document.getElementById("moves-count")
  const timerElement = document.getElementById("timer")
  const result = document.getElementById("result")
  const finalMoves = document.getElementById("final-moves")
  const finalTime = document.getElementById("final-time")
  const restartButton = document.getElementById("restart")
  const playAgainButton = document.getElementById("play-again")
  const startGameButton = document.getElementById("start-game")
  const gameWrapper = document.getElementById("game-wrapper")

  // Initialize game
  function initializeGame() {
    // Reset variables
    moves = 0
    seconds = 0
    minutes = 0
    matchedPairs = 0
    firstCard = null
    secondCard = null
    locked = false

    // Update UI
    movesCount.textContent = moves
    timerElement.textContent = "00:00"
    result.classList.add("hide")

    // Clear timer
    clearInterval(timer)

    // Generate cards
    generateCards()

    // Start timer
    startTimer()
  }

  // Generate cards
  function generateCards() {
    // Clear game board
    gameBoard.innerHTML = ""

    // Create array with pairs (Chinese words and images)
    let cardPairs = []

    // Add Chinese word cards
    fruits.forEach((fruit) => {
      cardPairs.push({
        type: "word",
        fruit: fruit.name,
        content: fruit.pinyin,
        tooltip: fruit.pinyin,
      })
    })

    // Add image cards
    fruits.forEach((fruit) => {
      cardPairs.push({
        type: "image",
        fruit: fruit.name,
        // Use the imageUrl from the fruits object
        content: fruit.imageUrl,
      })
    })

    // Shuffle cards
    cardPairs = shuffleArray(cardPairs)

    // Create card elements
    cardPairs.forEach((card) => {
      const cardElement = document.createElement("div")
      cardElement.classList.add("card")
      cardElement.dataset.fruit = card.fruit
      cardElement.dataset.type = card.type

      // Card front (content side)
      const cardFront = document.createElement("div")
      cardFront.classList.add("card-front")

      if (card.type === "word") {
        const wordElement = document.createElement("div")
        wordElement.classList.add("chinese-word")
        wordElement.textContent = card.content
        wordElement.title = card.tooltip
        cardFront.appendChild(wordElement)
      } else {
        const imageElement = document.createElement("img")
        imageElement.classList.add("fruit-image")
        imageElement.src = card.content
        imageElement.alt = card.fruit
        cardFront.appendChild(imageElement)
      }

      // Card back (hidden side)
      const cardBack = document.createElement("div")
      cardBack.classList.add("card-back")
      cardBack.innerHTML = "?"

      // Append to card
      cardElement.appendChild(cardFront)
      cardElement.appendChild(cardBack)

      // Add click event
      cardElement.addEventListener("click", flipCard)

      // Append to game board
      gameBoard.appendChild(cardElement)
    })
  }

  // Flip card function
  function flipCard() {
    // Return if card is locked, already flipped, or matched
    if (locked || this === firstCard || this.classList.contains("matched")) {
      return
    }

    // Flip the card
    this.classList.add("flipped")

    // Set first or second card
    if (!firstCard) {
      firstCard = this
      return
    }

    secondCard = this
    locked = true

    // Increment moves
    moves++
    movesCount.textContent = moves

    // Check for match
    checkForMatch()
  }

  // Check if cards match
  function checkForMatch() {
    const isMatch =
      firstCard.dataset.fruit === secondCard.dataset.fruit && firstCard.dataset.type !== secondCard.dataset.type

    if (isMatch) {
      disableCards()
    } else {
      unflipCards()
    }
  }

  // Disable matched cards
  function disableCards() {
    firstCard.classList.add("matched")
    secondCard.classList.add("matched")
    firstCard.removeEventListener("click", flipCard)
    secondCard.removeEventListener("click", flipCard)

    matchedPairs++

    // Check if game is complete
    if (matchedPairs === fruits.length) {
      setTimeout(() => {
        endGame()
      }, 1000)
    }

    resetCards()
  }

  // Unflip non-matching cards
  function unflipCards() {
    setTimeout(() => {
      firstCard.classList.remove("flipped")
      secondCard.classList.remove("flipped")
      resetCards()
    }, 1000)
  }

  // Reset card selection
  function resetCards() {
    firstCard = null
    secondCard = null
    locked = false
  }

  // Start timer
  function startTimer() {
    timer = setInterval(() => {
      seconds++
      if (seconds === 60) {
        minutes++
        seconds = 0
      }

      // Update timer display
      timerElement.textContent = `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`
    }, 1000)
  }

  // End game
  function endGame() {
    clearInterval(timer)

    finalMoves.textContent = moves
    finalTime.textContent = timerElement.textContent
    result.classList.remove("hide")
  }

  // Shuffle array (Fisher-Yates algorithm)
  function shuffleArray(array) {
    const newArray = [...array]
    for (let i = newArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[newArray[i], newArray[j]] = [newArray[j], newArray[i]]
    }
    return newArray
  }

  // Start game function
  function startGame() {
    startGameButton.classList.add("hide")
    gameWrapper.classList.remove("hide")
    initializeGame()
  }

  // Event listeners
  startGameButton.addEventListener("click", startGame)
  restartButton.addEventListener("click", initializeGame)
  playAgainButton.addEventListener("click", initializeGame)

})
