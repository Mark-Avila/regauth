let format = "form-register-";

//Register Values
let fnameInput = document.getElementById(format.concat("fname"));
let lnameInput = document.getElementById(format.concat("lname"));
let emailInput = document.getElementById(format.concat("email"));
let contactInput = document.getElementById(format.concat("contact"));
let dateInput = document.getElementById(format.concat("date"));
let passwordInput = document.getElementById(format.concat("password"));
let rePasswordInput = document.getElementById(format.concat("repassword"));
let sexInput;

//Login values
let loginEmailInput = document.getElementById("form-login-email");
let loginPasswordInput = document.getElementById("form-login-password");

document.getElementById("main-link-btn-reg").addEventListener("click", () => {
  let loginPage = document.getElementById("login-page");
  let registerPage = document.getElementById("register-page");

  anime({
    targets: "#login-page",
    translateX: [0, -100],
    duration: 200,
    opacity: 0,
    easing: "easeInOutSine",
    complete: () => {
      loginPage.style.display = "none";

      anime({
        targets: "#register-page",
        translateX: [100, 0],
        duration: 200,
        opacity: 1,
        easing: "easeInOutSine",
        begin: () => {
          registerPage.style.display = "block";
        },
        complete: () => {
          document.getElementById("form-register-info").style.display = "block";
          document.getElementById("form-register-next").style.display = "block";
          document.getElementById("form-register-pwds").style.display = "none";
          document.getElementById("form-register-prev").style.display = "none";
          document.getElementById("form-register-submit").style.display =
            "none";
          document.getElementById(
            "form-register-next-container"
          ).style.justifyContent = "flex-end";
        },
      });
    },
  });
});

function showLoginPage() {
  let loginPage = document.getElementById("login-page");
  let registerPage = document.getElementById("register-page");

  anime({
    targets: "#register-page",
    translateX: [0, 100],
    duration: 200,
    opacity: 0,
    easing: "easeInOutSine",
    complete: () => {
      registerPage.style.display = "none";
      anime({
        targets: "#login-page",
        translateX: [-100, 0],
        duration: 200,
        opacity: 1,
        easing: "easeInOutSine",
        begin: () => {
          loginPage.style.display = "block";
        },
      });
    },
  });
}

document
  .getElementById("main-link-btn-login")
  .addEventListener("click", showLoginPage);

let fname, lname, contact, email;
fname = "";
lname = "";
contact = "";
email = "";
date = "";

let strengthIndicators = document.getElementsByClassName("form-pwd-str-item");
let strengthLabel = document.getElementById("pwd-strength");

function passwordStrength() {
  const passChecks = [
    "^.*(?=.*?[a-z]).*$",
    "^.*(?=.*?[A-Z]).*$",
    "^.*(?=.*?[0-9]).*$",
    "^.*(?=.*?[#?!@$%^&*-]).*$",
    "^.{11,}.*$",
  ];

  let matches = 0;

  passChecks.forEach((item) => {
    const passRegex = new RegExp(item);

    if (passRegex.test(passwordInput.value)) {
      matches++;
    }
  });

  for (let i = 0; i < strengthIndicators.length; i++) {
    strengthIndicators[i].classList.remove("weak");
    strengthIndicators[i].classList.remove("moderate");
    strengthIndicators[i].classList.remove("strong");

    strengthIndicators[i].classList.add("weak");
    strengthLabel.innerText = "Weak";
    strengthLabel.style.color = "red";
  }

  if (matches >= 4) {
    strengthIndicators[0].classList.add("strong");
    strengthIndicators[1].classList.add("strong");
    strengthIndicators[2].classList.add("strong");
    strengthIndicators[3].classList.add("strong");
    strengthIndicators[4].classList.add("strong");
    strengthLabel.innerText = "Strong";
    strengthLabel.style.color = "Green";
  } else if (matches >= 2) {
    strengthIndicators[0].classList.add("moderate");
    strengthIndicators[1].classList.add("moderate");
    strengthIndicators[2].classList.add("moderate");
    strengthLabel.innerText = "Moderate";
    strengthLabel.style.color = "Orange";
  }
}

document
  .getElementById("form-register-password")
  .addEventListener("input", passwordStrength);

document.getElementById("form-register-next").addEventListener("click", (e) => {
  e.preventDefault();

  if (
    !fnameInput.value ||
    !lnameInput.value ||
    !emailInput.value ||
    !contactInput.value ||
    !dateInput.value
  ) {
    return showNotif("error", "Empty input");
  }

  [fname, lname, email, contact, date] = [
    fnameInput.value,
    lnameInput.value,
    emailInput.value,
    contactInput.value,
    dateInput.value,
  ];

  sexInput = document.querySelector('input[name="gender"]:checked').value;

  anime({
    targets: "#form-register",
    translateX: [0, -100],
    duration: 200,
    opacity: 0,
    easing: "easeInOutSine",
    complete: () => {
      document.getElementById("form-register-info").style.display = "none";
      document.getElementById("form-register-next").style.display = "none";
      document.getElementById("form-register-pwds").style.display = "block";
      document.getElementById("form-register-prev").style.display = "block";
      document.getElementById("form-register-submit").style.display = "block";
      document.getElementById(
        "form-register-next-container"
      ).style.justifyContent = "space-between";

      anime({
        targets: "#form-register",
        translateX: [100, 0],
        duration: 200,
        opacity: 1,
        easing: "easeInOutSine",
      });
    },
  });
});

document.getElementById("form-register-prev").addEventListener("click", (e) => {
  e.preventDefault();

  [
    fnameInput.value,
    lnameInput.value,
    contactInput.value,
    emailInput.value,
    dateInput.value,
  ] = [fname, lname, contact, email, date];

  anime({
    targets: "#form-register",
    translateX: [0, 100],
    duration: 200,
    opacity: 0,
    easing: "easeInOutSine",
    complete: () => {
      document.getElementById("form-register-info").style.display = "block";
      document.getElementById("form-register-next").style.display = "block";
      document.getElementById(
        "form-register-next-container"
      ).style.justifyContent = "flex-end";
      document.getElementById("form-register-pwds").style.display = "none";
      document.getElementById("form-register-submit").style.display = "none";
      document.getElementById("form-register-prev").style.display = "none";

      anime({
        targets: "#form-register",
        translateX: [-100, 0],
        duration: 200,
        opacity: 1,
        easing: "easeInOutSine",
      });
    },
  });
});

function showNotif(type, message) {
  let errorContainer = document.getElementById("notif");
  let errorType = document.getElementById("notif-type");
  let errorMessage = document.getElementById("notif-message");

  let errorTypeText;

  anime({
    targets: "#notif",
    translateY: [-100, 0],
    easing: "easeOutSine",
    duration: 200,
    begin: () => {
      if (type == "error") {
        errorTypeText = "ERROR: ";
        errorContainer.classList.remove("notif-success");
        errorContainer.classList.add("notif-error");
      } else {
        errorContainer.classList.add("notif-success");
        errorContainer.classList.remove("notif-error");
        errorTypeText = "SUCCESS: ";
      }

      errorContainer.style.display = "flex";
      errorType.innerText = errorTypeText;
      errorMessage.innerText = message;
    },
  });
}

function closeNotif() {
  let errorMessage = document.getElementById("notif");

  anime({
    targets: "#notif",
    translateY: [0, -100],
    easing: "easeInSine",
    duration: 200,
    complete: () => {
      errorMessage.style.display = "none";
    },
  });
}

function toURLEncoded(details) {
  var requestBody = [];
  for (var property in details) {
    var encodedKey = encodeURIComponent(property);
    var encodedValue = encodeURIComponent(details[property]);
    requestBody.push(encodedKey + "=" + encodedValue);
  }
  return requestBody.join("&");
}

document.getElementById("notif-close").addEventListener("click", closeNotif);

document.getElementById("form-login").addEventListener("submit", (e) => {
  e.preventDefault();

  if (!loginEmailInput.value) {
    return showNotif("error", "Email field is empty");
  }
  if (!loginPasswordInput.value) {
    return showNotif("error", "Password field is empty");
  }
  const requestDetails = {
    email: loginEmailInput.value,
    password: loginPasswordInput.value,
  };

  const requestBody = toURLEncoded(requestDetails);

  console.log(requestBody);

  fetch("http://localhost:8000/api/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: requestBody,
  })
    .then((res) => res.json())
    .then((data) => {
      if (data.status === "success") {
        showNotif("success", data.message);
        window.location.href = "homepage.html";
      } else if (data.status === "failed") {
        showNotif("error", data.message);
      }
    })
    .catch((error) => console.log(error));
});

document.getElementById("form-register").addEventListener("submit", (e) => {
  e.preventDefault();

  if (!passwordInput.value || !rePasswordInput.value) {
    return showNotif("error", "Password/s is empty");
  } else if (passwordInput.value.length <= 8) {
    return showNotif("error", "Password is too short");
  } else if (passwordInput.value !== rePasswordInput.value) {
    return showNotif("error", "Passwords do not match");
  }

  const requestDetails = {
    fname: fnameInput.value,
    lname: lnameInput.value,
    email: emailInput.value,
    bday: dateInput.value,
    contact: contactInput.value,
    sex: sexInput,
    password: passwordInput.value,
  };

  requestBody = toURLEncoded(requestDetails);

  fetch("http://localhost:8000/api/register", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: requestBody,
  })
    .then((res) => res.json())
    .then((data) => {
      if (data.status === "success") {
        showNotif("success", data.message);
        return showLoginPage();
      } else if (data.status === "failed") {
        showNotif("error", data.message);
      }
    })
    .catch((error) => console.error(error));
});
