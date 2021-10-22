import "./styles.css";
import { Registration } from "./modules/registration.js";

document.addEventListener("DOMContentLoaded", function () {
  console.log(process.env.NODE_ENV);
  new Registration();
});
