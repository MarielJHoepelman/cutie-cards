export class Registration {
  constructor() {
    this.registrationForm = document.getElementById("registration-form");
    this.registrationForm.addEventListener("submit", (event) => {
      event.preventDefault();
      this.username = event.target.elements.username.value;
      const a = this.submitData();
      console.log(a);
    });
  }

  submitData() {
    let payload = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({ username: this.username }),
    };

    return fetch("http://localhost:3000/users", payload)
      .then(function (response) {
        return response.json();
      })
      .then(function (response) {
        console.log(response);
        return response;
      })
      .catch(function (error) {
        //what to do if error
      });
  }
}
