const result = document.querySelector(".result");
const userChosenInput = document.querySelector("#fibo-index");
const errorMessage = document.querySelector(".error-message");

// Check number
const checkNumber = () => {
  if (errorMessage.style.display) {
    userChosenInput.classList.remove("error");
    errorMessage.style.display = "none";
  }
  userChosenInput.value > 50 ? displayOutOfBoundError() : calcFibo();
};
// Display error
const displayOutOfBoundError = () => {
  errorMessage.style.display = "block";
  result.innerText = "";
  userChosenInput.classList.add("error");
};

// Comunicate with the server
const serverCalculation = async (index) => {
  try {
    const res = await fetch(`http://localhost:5050/fibonacci/${index}`);

    console.log(res);
    result.innerText = data.result;
  } catch (err) {
    res.reresult.innerHTML = "";
    console.error();
    result.inneHTML = "";
  }
};

const calcFibo = () => {
  if (result.innerText !== "") result.innerText = "";
  // Creating and adding to the DOM the spinner element
  const spinner = `
  <div class="spinner-border" role="status">
  <span class="visually-hidden">Loading...</span>
  </div>
  `;
  result.insertAdjacentHTML("beforeend", spinner);
  // Sending to the server the user's chosen index, it will calculte it and then we will return to the DOM
  serverCalculation(userChosenInput.value);
};

document.querySelector(".calculate").addEventListener("click", checkNumber);
