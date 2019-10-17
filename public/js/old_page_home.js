const hostSite = "http://localhost:5000";

const coinURL = `${hostSite}/api/coins`;
const categoryURL = `${hostSite}/api/categories`;
const denominationURL = `${hostSite}/api/denominations`;

const showDenominations = document.querySelector("#show-denominations");
const showCategories = document.querySelector("#show-categories");

showDenominations.addEventListener("click", elShowDenominations);
showCategories.addEventListener("click", elShowCategories);

function elShowDenominations() {
  asShowDenominations().then(data => {
    console.log(data);
  });
}

async function asShowDenominations() {
  const response = await fetch(denominationURL);
  const data = await response.json();
  return data;
}

function elShowCategories() {
  asShowCategories().then(data => {
    console.log(data);
  });
}

async function asShowCategories() {
  const response = await fetch(`${categoryURL}:Quarters`);
  const data = await response.json();
  return data;
}
