import { Fetcher } from "./fetcher.js";

export class Registration {
  constructor() {
    this.registrationForm = document.getElementById("registration-form");
    this.userNameContainer = document.getElementById("username");
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
        console.log(json);
        this.userNameContainer.innerHTML = `Hi ${
          json.name
        }! ${this.scoreMessage(json.best_score)}`;
        this.userNameContainer.setAttribute("data-id", json.id);
        this.registrationForm.classList.add("hidden");
      });
    });
  };
}
