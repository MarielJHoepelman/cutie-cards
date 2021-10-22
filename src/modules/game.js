import { Fetcher } from "./fetcher.js";

export class Game {
  CARDS = [
    "strawberry",
    "apple",
    "cherry",
    "coffee",
    "avocado",
    "watermelon",
    "kiwi",
    "applejuice",
    "bubbletea",
    "donut",
    "chocolatemilk",
    "matchatea",
    "strawberrymilk",
    "popsie",
  ];

  INITIAL_TIMER = 5000;
  FLIP_TIMER = 500;
  MOVES_LIMIT = this.CARDS.length * 2;
  MATCHES_TO_WIN = this.CARDS.length;

  constructor(userId) {
    this.userId = userId;
    this.initGame();
  }

  initGame = () => {
    this.matchesCounter = 0;
    this.currentScore = 0;
    this.clickedCardMemo = null;
    this.movesLeft = this.MOVES_LIMIT;
    document.getElementById("scores").classList.remove("hidden");
    this.scoresButton = document.getElementById("scores_list");
    this.logoutButton = document.getElementById("logout-button");
    this.logoutButton.classList.remove("hidden");
    this.getCardsElement().innerHTML = "";
    this.displayCards();
    this.flipCards(this.INITIAL_TIMER);
    this.movesMessage();
    this.displayAllScoresButton();
    this.refreshUserScore();
    this.logout();
  };

  duplicateCards = () => {
    const gameCards = [...this.CARDS, ...this.CARDS];
    return gameCards;
  };

  shuffleCards = (cards) => {
    let counter = cards.length,
      temp,
      randomIndex;

    // While there are elements in the array
    while (counter > 0) {
      // Picks a random index
      randomIndex = Math.floor(Math.random() * counter);
      // Decrease counter by 1
      counter--;
      // And swap the last element with it
      // temp is now last element.
      temp = cards[counter];
      //cards counter is now random index
      cards[counter] = cards[randomIndex];
      //randomIndex is now temp
      cards[randomIndex] = temp;
    }
    return cards;
  };

  flipCards = (timer) => {
    setTimeout((timer) => {
      Object.values(
        this.getCardsElement().getElementsByClassName("card")
      ).forEach((item) => {
        item.classList.add("flipped");
      });
    }, timer);
  };

  getWrapperElement = () => {
    return document.getElementById("game");
  };

  getCardsElement = () => {
    return this.getWrapperElement().querySelector(".cards");
  };

  getCardsButtons = () => {
    return Object.values(this.getCardsElement().querySelectorAll("button"));
  };

  disableClick = () => {
    this.getCardsButtons().forEach((item) => {
      item.setAttribute("disabled", true);
    });
  };

  enableClick = () => {
    this.getCardsButtons().forEach((item, i) => {
      item.removeAttribute("disabled");
    });
  };

  matchTracker = (cardOne, cardTwo) => {
    return cardOne === cardTwo;
  };

  winChecker = () => {
    let gameState;
    const gameIsWon = this.matchesCounter === this.MATCHES_TO_WIN;
    if (gameIsWon) {
      Fetcher.submitData(
        "POST",
        {
          data: { user_id: this.userId, score: this.currentScore.toString() },
        },
        "scores"
      ).then((json) => {
        gameState = true;
        this.displayWinLoseModal(gameState);
      });
    } else if (!gameIsWon && this.movesLeft === 0) {
      gameState = false;
      this.displayWinLoseModal(gameState);
    }
    return gameState;
  };

  createCard = (cardName, imageTag) => {
    const card = document.createElement("button");
    card.classList.add("card-button");
    card.setAttribute("data-id", cardName); //name of attr, value of attr
    card.appendChild(imageTag);
    return card;
  };

  createImageTag = (source, format) => {
    const imageTag = document.createElement("img");
    imageTag.src = `./images/${source}.${format}`;
    return imageTag;
  };

  createflipContainer = () => {
    const cardContainer = document.createElement("div");
    cardContainer.classList.add("flip-container", "card");
    return cardContainer;
  };

  createFlipperElement = () => {
    const flipper = document.createElement("div");
    flipper.classList.add("flipper");
    return flipper;
  };

  createCardAngleElement = (angle) => {
    const side = document.createElement("div");
    side.classList.add(angle);
    return side;
  };

  timeSetter = (parentElement) => {
    const timeSetter = setTimeout((timer) => {
      this.clickedCardMemo.closest(".flip-container").classList.add("flipped"); // fliped the first card
      parentElement.classList.add("flipped"); // flip the second card
      this.clickedCardMemo = null; // reset the memo card
      // this.score = 0;//resetScore
      this.enableClick();
    }, this.FLIP_TIMER);
    return timeSetter;
  };

  movesMessage = () => {
    document.getElementById(
      "moves"
    ).innerHTML = `You have ${this.movesLeft} moves left to complete this round`;
  };

  displayWinLoseModal = (gameState) => {
    const modal = document.getElementById("modal");
    const playAgain = document.getElementById("play-again");
    const yesButton = document.getElementById("yes-button");
    const noButton = document.getElementById("no-button");

    modal.classList.add("show");

    const image = gameState
      ? document.getElementById("win-image")
      : document.getElementById("lose-image");

    modal.classList.add("show");
    image.classList.add("show");

    yesButton.addEventListener("click", () => {
      modal.classList.remove("show");
      image.classList.remove("show");
      this.initGame();
    });

    noButton.addEventListener("click", () => {
      location.reload();
    });
  };

  addListener = (cardButton) => {
    cardButton.addEventListener("click", (event) => {
      const currentClickedCard = event.target;
      const parentDiv = currentClickedCard.closest(".flip-container"); // same as parent parent parent

      parentDiv.classList.remove("flipped"); // flip this card to see it

      if (!this.clickedCardMemo) {
        // First click
        this.clickedCardMemo = currentClickedCard; // this is the first card clicked, save it
      } else {
        // Second click
        this.currentScore += 1;
        this.movesLeft -= 1;
        this.movesMessage();
        this.disableClick();
        const matched = this.matchTracker(
          currentClickedCard.dataset.id,
          this.clickedCardMemo.dataset.id
        );

        if (matched) {
          /// score!
          this.matchesCounter += 1;
          this.clickedCardMemo = null; // reset the memo card
          this.enableClick();
        } else {
          this.timeSetter(parentDiv);
        }

        this.winChecker();
      }
    });
  };

  displayCards = () => {
    for (const cardName of this.shuffleCards(this.duplicateCards())) {
      const flipContainer = this.createflipContainer();
      const flipper = this.createFlipperElement();
      const front = this.createCardAngleElement("front");
      const back = this.createCardAngleElement("back");
      const frontCardImageTag = this.createImageTag(cardName, "jpg");
      const reverseCardImageTag = this.createImageTag("reverse", "png");
      const cardButton = this.createCard(cardName, reverseCardImageTag);

      this.addListener(cardButton);

      front.appendChild(frontCardImageTag);
      back.appendChild(cardButton);

      flipper.appendChild(front);
      flipper.appendChild(back);

      flipContainer.appendChild(flipper);

      this.getCardsElement().appendChild(flipContainer);
    }
  };

  addListenerToExitButton = (scoresContainerModal) => {
    const exitButton = document.getElementById("exitBtn");
    exitButton.addEventListener("click", () => {
      scoresContainerModal.classList.remove("show");
    });
  };

  displayAllScoresButton = () => {
    const scoresContainer = document.getElementById("scores-container");
    this.addListenerToExitButton(scoresContainer);
    this.scoresButton.addEventListener("click", () => {
      scoresContainer.classList.add("show");
      Fetcher.submitData("GET", null, "scores").then((json) => {
        json.sort((a, b) => (a.name < b.name ? -1 : 1));
        const ul = scoresContainer.querySelector("ul");
        ul.innerHTML = "";
        for (const element of json) {
          const li = document.createElement("li");
          li.innerHTML = `${element.name} - ${element.score}`;
          ul.appendChild(li);
        }
      });
    });
  };

  scoreMessage = (score) => {
    return score
      ? `Your best score is ${score}`
      : "You don't have any scores saved.";
  };

  refreshUserScore = () => {
    const userBestScore = document.getElementById("user_best_score");
    Fetcher.submitData("GET", null, `users/${this.userId}`).then((json) => {
      userBestScore.innerHTML = this.scoreMessage(json.best_score);
    });
  };

  logout = () => {
    this.logoutButton.addEventListener("click", () => {
      location.reload();
    });
  };
}
