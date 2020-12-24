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

  clickedCardMemo = null;

  constructor() {
    this.displayCards();
    this.flipCards(this.INITIAL_TIMER);
  }

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

  displayCards = () => {
    for (const element of this.shuffleCards(this.duplicateCards())) {
      let flipContainer = document.createElement("div");
      flipContainer.classList.add("flip-container");
      flipContainer.classList.add("card");

      let flipper = document.createElement("div");
      flipper.classList.add("flipper");

      let front = document.createElement("div");
      front.classList.add("front");

      let back = document.createElement("div");
      back.classList.add("back");

      let frontCardImageTag = document.createElement("img");
      frontCardImageTag.src = `./images/${element}.jpg`;

      let reverseCardImageTag = document.createElement("img");
      reverseCardImageTag.src = "./images/reverse.png";

      let cardButton = document.createElement("button");
      cardButton.classList.add("card-button");
      cardButton.setAttribute("data-id", element);
      cardButton.appendChild(reverseCardImageTag);

      cardButton.addEventListener("click", (event) => {
        const currentClickedCard = event.target;
        const parentDiv = currentClickedCard.closest(".flip-container"); // same as parent parent parent

        parentDiv.classList.remove("flipped"); // flip this card to see it

        if (!this.clickedCardMemo) {
          // First click
          this.clickedCardMemo = currentClickedCard; // this is the first card clicked, save it
        } else {
          // Second click

          this.disableClick();
          const matched = this.matchTracker(
            currentClickedCard.dataset.id,
            this.clickedCardMemo.dataset.id
          );

          if (matched) {
            /// score!
            this.clickedCardMemo = null; // reset the memo card
            this.enableClick();
          } else {
            setTimeout((timer) => {
              this.clickedCardMemo
                .closest(".flip-container")
                .classList.add("flipped"); // fliped the first card

              parentDiv.classList.add("flipped"); // flip the second card

              this.clickedCardMemo = null; // reset the memo card
              this.enableClick();
            }, this.FLIP_TIMER);
          }
        }
      });

      front.appendChild(frontCardImageTag);
      back.appendChild(cardButton);

      flipper.appendChild(front);
      flipper.appendChild(back);

      flipContainer.appendChild(flipper);

      this.getCardsElement().appendChild(flipContainer);
    }
  };
}
