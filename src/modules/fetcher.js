export class Fetcher {
  static submitData(method, body, endPoint) {
    const payload = {
      method: method,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: body ? JSON.stringify(body) : null,
    };

    const getBackendUrl = () => {
      console.log("fetcher", process.env.NODE_ENV);
      return process.env.NODE_ENV === "production"
        ? "https://cutie-cards-backend.herokuapp.com/"
        : "http://localhost:3000/";
    };

    const displayErrors = (error) => {
      const errorDiv = document.getElementById("errors");
      errorDiv.innerHTML = error;
      setTimeout(() => {
        errorDiv.innerHTML = "";
      }, 2000);
    };

    return fetch(`${getBackendUrl()}${endPoint}`, payload)
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
        displayErrors(error);
      });
  }
}
