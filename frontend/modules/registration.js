import { Fetcher } from "./fetcher.js";
import { Game } from "./game.js";

export class Registration {
  constructor() {
    this.registrationForm = document.getElementById("registration-form");
    this.userNameContainer = document.getElementById("username");
    this.hideLoginWrapper = document.getElementById("login_wrapper");
    this.recordScore = document.getElementById("record_score");
    this.userBestScore = document.getElementById("user_best_score");
    this.addListener();
  }

  scoreMessage = (score) => {
    return score
      ? `Your best score is ${score}`
      : "You don't have any scores saved.";
  };

  addListener = () => {
    this.registrationForm.addEventListener("submit", (event) => {
      event.preventDefault();
      this.name = event.target.elements["user[name]"].value;

      Fetcher.submitData("POST", { name: this.name }, "users").then((json) => {
        if (json) {
          this.hideLoginWrapper.classList.add("hide");
        }
        this.userNameContainer.innerHTML = `Hi ${json.name}!`;
        this.userBestScore.innerHTML = this.scoreMessage(json.best_score);
        this.recordScore.innerHTML = `The highest score of all players is ${json.record}`;
        new Game(json.id);
        this.registrationForm.classList.add("hidden");
      });
    });
  };
}
