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
  MOVES_LIMIT = 6;
  MATCHES_TO_WIN = 2;

  constructor(userId) {
    this.userId = userId;
    this.initGame();
  }

  initGame = () => {
    this.matchesCounter = 0;
    this.moves = 0;
    this.movesLeft = 0;
    this.clickedCardMemo = null;
    this.movesLeft = this.MOVES_LIMIT;
    this.scoresButton = document.getElementById("scores_list");
    this.getCardsElement().innerHTML = "";
    this.displayCards();
    this.flipCards(this.INITIAL_TIMER);
    this.movesMessage();
    this.displayAllScores();
  };

  duplicateCards = () => {
    const gameCards = [...this.CARDS, ...this.CARDS];
    return gameCards;
  };

  shuffleCards = (cards) => {
    let ctr = cards.length,
      temp,
      index;

    // While there are elements in the array
    while (ctr > 0) {
      // Pick a random index
      index = Math.floor(Math.random() * ctr);
      // Decrease ctr by 1
      ctr--;
      // And swap the last element with it
      temp = cards[ctr];
      cards[ctr] = cards[index];
      cards[index] = temp;
    }
    return cards;
  };

  flipCards = (timer) => {
    setTimeout((timer) => {
      Object.values(
        this.getCardsElement().getElementsByClassName("card")
      ).forEach((item, i) => {
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
    this.getCardsButtons().forEach((item, i) => {
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
    let wonGame;
    let userId = document.getElementById("username").getAttribute("data-id");
    if (this.movesLeft === 0) {
      wonGame = false;
      this.displayModal(wonGame);
    } else if (this.matchesCounter === this.MATCHES_TO_WIN && !!userId) {
      Fetcher.submitData(
        "POST",
        {
          data: { user_id: userId, score: this.moves.toString() },
        },
        "scores"
      ).then((json) => {
        wonGame = true;
        this.displayModal(wonGame);
      });
    }
    return wonGame;
  };

  createCard = (element, imageTag) => {
    let card = document.createElement("button");
    card.classList.add("card-button");
    card.setAttribute("data-id", element);
    card.appendChild(imageTag);
    return card;
  };

  createImageTag = (source, format) => {
    let imageTag = document.createElement("img");
    imageTag.src = `./images/${source}.${format}`;
    return imageTag;
  };

  createflipContainer = () => {
    let cardContainer = document.createElement("div");
    cardContainer.classList.add("flip-container", "card");
    return cardContainer;
  };

  createFlipperElement = () => {
    let flipper = document.createElement("div");
    flipper.classList.add("flipper");
    return flipper;
  };

  createCardAngleElement = (angle) => {
    let side = document.createElement("div");
    side.classList.add(angle);
    return side;
  };

  timeSetter = (parentElement) => {
    let timeSetter = setTimeout((timer) => {
      this.clickedCardMemo.closest(".flip-container").classList.add("flipped"); // fliped the first card
      parentElement.classList.add("flipped"); // flip the second card
      this.clickedCardMemo = null; // reset the memo card
      // this.score = 0;//resetScore
      this.enableClick();
    }, this.FLIP_TIMER);
    return timeSetter;
  };

  movesMessage = () => {
    document.getElementById("moves").innerHTML = `Moves left ${this.movesLeft}`;
  };

  displayModal = (state) => {
    const modal = document.getElementById("modal");
    const playAgain = document.getElementById("playAgain");
    const yesBtn = document.getElementById("yesBtn");
    const noBtn = document.getElementById("noBtn");

    modal.classList.add("show");

    const image = state
      ? document.getElementById("win-image")
      : document.getElementById("lose-image");

    // const banner = modal.querySelector("#banner");
    // banner.appendChild(image);
    modal.classList.add("show");
    image.classList.add("show");

    yesBtn.addEventListener("click", () => {
      modal.classList.remove("show");
      image.classList.remove("show");
      this.initGame();
    });

    noBtn.addEventListener("click", () => {
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
        this.moves += 1;
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
    for (const element of this.shuffleCards(this.duplicateCards())) {
      let flipContainer = this.createflipContainer();
      let flipper = this.createFlipperElement();
      let front = this.createCardAngleElement("front");
      let back = this.createCardAngleElement("back");
      let frontCardImageTag = this.createImageTag(element, "jpg");
      let reverseCardImageTag = this.createImageTag("reverse", "png");
      let cardButton = this.createCard(element, reverseCardImageTag);

      this.addListener(cardButton);

      front.appendChild(frontCardImageTag);
      back.appendChild(cardButton);

      flipper.appendChild(front);
      flipper.appendChild(back);

      flipContainer.appendChild(flipper);

      this.getCardsElement().appendChild(flipContainer);
    }
  };
  displayAllScores = () => {
    this.scoresButton.addEventListener("click", (event) => {
      Fetcher.submitData("GET", null, "scores").then((json) => {});
    });
  };
}
