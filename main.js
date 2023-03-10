const result = document.querySelector(".result");
const userChosenInput = document.querySelector("#fibo-index");
const errorMessage = document.querySelector(".error-message");
const resultsHeadline = document.querySelector(".results-headline");
const saveCalcCBox = document.querySelector("#save-calculations");
const displayMethod = document.querySelector(".sort");

const spinner = `
<div class="spinner-border result-spinner" role="status">
<span class="visually-hidden">Loading...</span>
</div>
`;

// Comunicate with the server
// Calculate fibonacci number
const serverCalculation = async (index) => {
  const res = await fetch(`http://localhost:5050/fibonacci/${index}`);
  let data;
  if (res.status >= 200 && res.status <= 300) {
    data = await res.json();
    displayUserResult(data.result);
    returnServerDbData(false);
  } else {
    data = await res.text();
    result.classList.add("text-danger");
    result.classList.remove("border-bottom");
    result.innerText = data;
  }
};

// fetch results from db through the server
const fetchResultsFromServer = async () => {
  const res = await fetch("http://localhost:5050/getFibonacciResults");
  if (res.status >= 200 && res.status <= 300) {
    data = await res.json();
    return data;
  } else {
  }
};

// Intrenal fibo calaulation function
const fiboCalculation = (num) => {
  const fiboArr = [0, 1];
  for (let i = 1; i < num; i++) {
    fiboArr.push(fiboArr[i - 1] + fiboArr[i]);
  }
  displayUserResult(fiboArr[num]);
};

const displayUserResult = (num) => (result.innerText = num);

// Validate number
const validateNumber = () => {
  if (errorMessage.style.display) {
    userChosenInput.classList.remove("error");
    errorMessage.style.display = "none";
  }
  userChosenInput.value > 50
    ? displayOutOfBoundError("Can't be larger than 50")
    : calcFibo();
};
// Display error
const displayOutOfBoundError = (message) => {
  errorMessage.style.display = "block";
  result.innerText = "";
  errorMessage.innerText = message;
  userChosenInput.classList.add("error");
};

const calcFibo = () => {
  if (result.innerText !== "") result.innerText = "";
  result.insertAdjacentHTML("beforeend", spinner);
  // Sending to the server the user's chosen index, it will calculte it and then we will return to the DOM
  saveCalcCBox.checked === false
    ? fiboCalculation(userChosenInput.value)
    : serverCalculation(userChosenInput.value);
};

const returnServerDbData = async (isFirstLoad) => {
  const resultsList = await fetchResultsFromServer();
  sortResults(resultsList.results, isFirstLoad);
};

// Sort results from db
const sortResults = (arr, isFirstLoad) => {
  switch (displayMethod.value) {
    case "numberAsc":
      arr = arr.sort((a, b) => a.number - b.number);
      break;
    case "numberDesc":
      arr = arr.sort((a, b) => b.number - a.number);
      break;
    case "dateDesc":
      arr = arr.sort((a, b) => b.createdDate - a.createdDate);
      break;
    default:
      arr = arr.sort((a, b) => a.createdDate - b.createdDate);
      break;
  }
  arr.splice(3); // instead hardcoding switch to a constant elemnt

  displayResults(arr, isFirstLoad);
};

const displayResults = (arr, isFirstLoad) => {
  const resultUl = document.querySelector(".result-display-ul");
  if (!isFirstLoad) resultUl.innerHTML = "";
  arr.forEach((item) => {
    const date = new Date(item.createdDate);
    resultUl.innerHTML += `<li class="border-bottom border-dark pb-2 mb-2 col-xxl-8 col-xl-9 col-lg-10 col-md-12">
      The Fibonnaci Of ${item.number} is ${item.result}. 
      Calculated at: ${date}</li>`;
  });
  resultsHeadline.parentElement.querySelector(".result-spinner").style.display =
    "none";
};

// Event listeners
// Calculate button listener
document.querySelector(".calculate").addEventListener("click", validateNumber);

// DOM load event
document.addEventListener("DOMContentLoaded", () => {
  resultsHeadline.insertAdjacentHTML("beforeend", spinner);
  setTimeout(() => returnServerDbData(true), 1000);
});

// Choosing sorting type
displayMethod.addEventListener("change", () => returnServerDbData(false));
