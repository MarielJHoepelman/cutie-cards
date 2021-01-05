import { Fetcher } from "./fetcher.js";

export class Registration {
  constructor() {
    this.registrationForm = document.getElementById("registration-form");
    this.userNameContainer = document.getElementById("username");
    this.addListener();
  }

  addListener = () => {
    this.registrationForm.addEventListener("submit", (event) => {
      event.preventDefault();
      this.name = event.target.elements["user[name]"].value;

      Fetcher.submitData("POST", { name: this.name }, "users").then((json) => {
        console.log(json);
        this.userNameContainer.innerHTML = `Hi ${json.name}!`;
        this.userNameContainer.setAttribute("data-id", json.id);
        this.registrationForm.classList.add("hidden");
      });
    });
  };

  displayErrors = (error) => {
    const errorDiv = document.getElementById("errors");
    errorDiv.innerHTML = error;
    setTimeout(() => {
      errorDiv.innerHTML = "";
    }, 2000);
  };
}
