/*eslint-disable*/
import "@babel/polyfill";
import { login, logout } from "./login";
import { displayMap } from "./map";
import { updateSettings } from "./updateSettings";
import { bookTour } from "./stripe";

const mapB = document.getElementById("map");
const loginForm = document.querySelector(".form--login");
const logOutBtn = document.querySelector(".nav__el--logout");
const updateUserForm = document.querySelector(".form-user-data");
const userPasswordForm = document.querySelector(".form-user-password");
const bookBtn = document.getElementById("book-tour");

if (mapB) {
  // locations are set in the data-locations in the map element
  const locations = JSON.parse(mapB.dataset.locations);
  displayMap(locations);
}

if (loginForm) {
  loginForm.addEventListener("submit", async function (e) {
    e.preventDefault();

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    login(email, password);
  });
}

if (logOutBtn) logOutBtn.addEventListener("click", logout);

if (updateUserForm) {
  updateUserForm.addEventListener("submit", async function (e) {
    e.preventDefault();

    // Create a new form object because we need to add files to the form
    const form = new FormData();

    form.append("name", document.getElementById("name").value);
    form.append("email", document.getElementById("email").value);
    form.append("photo", document.getElementById("photo").files[0]);

    updateSettings(form, "data");
  });
}

if (userPasswordForm) {
  userPasswordForm.addEventListener("submit", async function (e) {
    e.preventDefault();

    document.querySelector(".btn--save-password").textContent = "Updating...";
    const passwordCurrent = document.getElementById("password-current").value;
    const password = document.getElementById("password").value;
    const passwordConfirm = document.getElementById("password-confirm").value;

    await updateSettings({ passwordCurrent, password, passwordConfirm }, "password");

    userPasswordForm.reset();

    document.querySelector(".btn--save-password").textContent = "Save password";
  });
}

if (bookBtn) {
  bookBtn.addEventListener("click", (e) => {
    e.target.textContent = "Processing";
    const { tourId } = e.target.dataset;
    bookTour(tourId);
  });
}
