export class Fetcher {
  static submitData(method, body, endPoint) {
    let payload = {
      method: method,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(body),
    };

    const displayErrors = (error) => {
      const errorDiv = document.getElementById("errors");
      errorDiv.innerHTML = error;
      setTimeout(() => {
        errorDiv.innerHTML = "";
      }, 2000);
    };

    return fetch(`http://localhost:3000/${endPoint}`, payload)
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
