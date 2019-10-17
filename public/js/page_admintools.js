// const hostSite = "http://localhost:5000";
const prot = window.location.protocol;
const hostName = window.location.hostname;
const port = window.location.port;
const hostSite = `${prot}\/\/${hostName}\:${port}`;

const urlScrapeDenominations = `${hostSite}/admintools/scrapedenominations`;
const urlScrapeCategories = `${hostSite}/admintools/scrapecategories`;
const urlScrapeCoins = `${hostSite}/admintools/scrapecoins`;
const urlConvertJSON = `${hostSite}/admintools/convertjson`;
const uploadUrl = `${hostSite}/admintools/upload`;

const btnScrapeDenominations = document.querySelector(
  "#btnScrape-Denominations"
);
const btnAddPennies = document.querySelector("#btnAdd-Pennies");
const btnAddNickels = document.querySelector("#btnAdd-Nickels");
const btnAddDimes = document.querySelector("#btnAdd-Dimes");
const btnAddQuarters = document.querySelector("#btnAdd-Quarters");
const btnAddHalfDollars = document.querySelector("#btnAdd-HalfDollars");
const btnAddDollars = document.querySelector("#btnAdd-Dollars");
const btnConvertJSON = document.querySelector("#btnConvert-json");
const resultsArea = document.querySelector("#results-area");
const btnAddDatabase = document.querySelector("#btnAdd-database");

//Add Event Listener. All these functions start with el
//Passing denomination and scraping column and row for the coin denomination. Passing this through the URL
btnScrapeDenominations.addEventListener("click", elScrapeDenominations);
btnConvertJSON.addEventListener("click", elConvertJSON);
btnAddPennies.addEventListener("click", function(e) {
  elAddCoins(e, "Pennies", 1, 3);
});
btnAddNickels.addEventListener("click", function(e) {
  elAddCoins(e, "Nickels", 1, 6);
});
btnAddDimes.addEventListener("click", function(e) {
  elAddCoins(e, "Dimes", 1, 8);
});
btnAddQuarters.addEventListener("click", function(e) {
  elAddCoins(e, "Quarters", 1, 10);
});
btnAddHalfDollars.addEventListener("click", function(e) {
  elAddCoins(e, "HalfDollars", 1, 11);
});
btnAddDollars.addEventListener("click", function(e) {
  elAddCoins(e, "Dollars", 1, 12);
});

btnAddDatabase.addEventListener("click", elAddToDatabase);

function elScrapeDenominations(e) {
  asScrapeDenominations().then(den => {
    console.log(den);
  });
}
function addResultForScrape(den) {
  console.log("In add result for scrape");
  console.log(den);
  let node = document.createElement("p");
  node.appendChild(document.createTextNode(`Finished scraping ${den}`));
  resultsArea.appendChild(node);
}
function addResultForConvert() {
  console.log("In add result for convert");
  let node = document.createElement("p");
  node.appendChild(
    document.createTextNode(`Finished converting files to JSON`)
  );
  resultsArea.appendChild(node);
}

//as stands for asynchronous
async function asScrapeDenominations() {
  const response = await fetch(urlScrapeDenominations);
  const data = await response.json();
  return data;
}
//Event listener calls this function for add coins
function elAddCoins(e, denom, col, row) {
  let addOn = `:_${col}_${row}_${denom}`;
  asAddCoins(`${urlScrapeCategories}${addOn}`).then(() => {
    console.log("Finished scraping categories");
    addResultForScrape(denom);
  });
}

async function asAddCoins(fetchUrl) {
  const response = await fetch(fetchUrl);
  const data = await response.json();
  return "Finished";
}

function elConvertJSON(e) {
  asConvertJSON().then(res => {
    addResultForConvert();
    console.log(res);
  });
}
async function asConvertJSON() {
  const response = await fetch(urlConvertJSON);
  console.log(response);
  const data = await response.json();
  console.log(data);
  return "Finished";
}

function elAddToDatabase() {
  asAddToDatabase().then(res => {
    console.log(res);
  });
}

async function asAddToDatabase() {
  const denominationJSONFile = "../files/denomination.json";
  const categoriesJSONFile = "../files/categories.json";
  const coinsJSONFile = "../files/coins.json";

  let response = await fetch(denominationJSONFile);
  let data = await response.json();
  await uploadItems(data, "denomination");

  response = await fetch(categoriesJSONFile);
  data = await response.json();
  await uploadItems(data, "category");

  response = await fetch(coinsJSONFile);
  data = await response.json();
  await uploadItems(data, "coin");
}

async function uploadItems(data, addUrl) {
  let PromiseChain = Promise.resolve();
  for (const item of data) {
    PromiseChain = PromiseChain.then(() => processItem(item, addUrl));
  }
}
function processItem(item, addOn) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      fetch(`${uploadUrl}:_${addOn}`, {
        method: "POST",
        headers: {
          "Content-type": "application/json"
        },
        body: JSON.stringify(item)
      }).then(res => console.log(res));
      console.log(item);
      resolve();
    }, 1000);
  });
}
