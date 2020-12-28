export class Registration {
  constructor() {
    this.registrationForm = document.getElementById("registration-form");
    this.registrationForm.addEventListener("submit", (event) => {
      event.preventDefault();
      this.name = event.target.elements["user[name]"].value;
      this.submitData();
    });
  }

  displayErrors = (error) => {
    const errorDiv = document.getElementById("errors");
    errorDiv.innerHTML = error;
    setTimeout(() => {
      errorDiv.innerHTML = "";
    }, 2000);
  };
  submitData() {
    let payload = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({ name: this.name }),
    };

    return fetch("http://localhost:3000/users", payload)
      .then((response) => {
        if (!response.ok) {
          return response.json().then((json) => {
            throw new Error(json.name[0]);
          });
        } else {
          return response.json();
        }
      })
      .then((json) => {
        return json;
      })
      .catch((error) => {
        this.displayErrors(error);
      });
  }
}
