import axios from "axios";
import { showAlert } from "./alerts";

const authBtn = document.getElementById("authentication-btn");

export const signup = async (name, email, password, passwordConfirm) => {
  try {
    authBtn.disabled = true;
    const res = await axios({
      method: "POST",
      url: "/api/v1/users/signup",
      data: {
        name,
        email,
        password,
        passwordConfirm,
      },
    });

    if (res.data.status === "success") {
      showAlert("success", "Signup successfull!");
      window.setTimeout(() => {
        location.assign("/");
      }, 1000);
    } else {
      authBtn.disabled = false;
    }
  } catch (err) {
    authBtn.disabled = false;
    showAlert("error", err.response.data.message);
  }
};
