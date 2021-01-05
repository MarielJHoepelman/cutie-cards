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
        this.displayErrors(error);
      });
  }
}
