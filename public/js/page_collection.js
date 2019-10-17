// const hostSite = "http://localhost:5000";
const prot = window.location.protocol;
const hostName = window.location.hostname;
const port = window.location.port;
const hostSite = `${prot}\/\/${hostName}\:${port}`;

const coinURL = `${hostSite}/api/coin`;
const coinAddURL = `${hostSite}/collection/addcoin`;
const coinDelURL = `${hostSite}/collection/delcoins`;
const coinEditURL = `${hostSite}/collection/editcoins`;
const coinGetURL = `${hostSite}/collection/getcoins`;

const btnAddCoin = document.querySelectorAll(".btn-add-coin");
const btnDelCoin = document.querySelectorAll(".btn-del-coin");
const btnEditCoin = document.querySelectorAll(".btn-edit-coin");
const cancelAdd = document.querySelector("#cancel-add");
const submitAdd = document.querySelector("#submit-add");
const cancelDel = document.querySelector("#cancel-del");
const submitDel = document.querySelector("#submit-del");
const cancelEdit = document.querySelector("#cancel-edit");
const submitEdit = document.querySelector("#submit-edit");

Array.from(btnAddCoin).forEach(addCoin => {
  addCoin.addEventListener("click", e => {
    let elementAdd;
    if (e.target.tagName === "I") elementAdd = e.target.parentElement.id;
    else elementAdd = e.target.id;
    const elementAddCoin = elementAdd.split(/-/)[1];
    processAddCoin(elementAddCoin).then(coinData => {
      console.log(coinData);
    });
  });
});

async function processAddCoin(coinID) {
  let coinCond;
  let cancelAdd = false;
  const coin = await getCoinFromApi(coinID);
  await createModal(coin)
    .then(cond => {
      coinCond = cond;
      console.log("Key is pressed");
    })
    .catch(() => {
      cancelAdd = true;
    });
  if (cancelAdd) return "Cancel";
  const coinAdded = await postCoin(coin, coinCond);
  let count = parseInt(document.querySelector(`#count-${coinID}`).textContent);
  count++;
  document.querySelector(`#count-${coinID}`).textContent = count.toString();
  if (count == 1) addDeleteEditButtons(coin._id);

  return "Ready";
}

function addDeleteEditButtons(coin) {
  const elementBefore = document.querySelector(`#add-${coin}`).parentNode;
  const delButton = document.createElement("td");
  delButton.innerHTML = `<button type="button" data-toggle="modal" data-target="#delCoinModal" id="del-${coin}" class="text-danger btn-del-coin"><i data-toggle="tooltip" data-placement="left"
  title="Click to Delete one or more coins based on the condition of the coin" class="fa fa-trash"></i>`;

  const editButton = document.createElement("td");
  editButton.innerHTML = `<button type="button" data-toggle="modal" data-target="#editCoinModal" id="edit-${coin}" class="text-primary btn-edit-coin"><i data-toggle="tooltip" data-placement="left"
  title="Click to Edit one or more coins based on the condition of the coin" class="fa fa-edit"></i>`;
  elementBefore.after(delButton);

  const delButtonE = document.querySelector(`#del-${coin}`);
  deleteEventList(delButtonE);
  delButton.after(editButton);
  const editButtonE = document.querySelector(`#edit-${coin}`);
  editEventList(editButtonE);
  $('[data-toggle="tooltip"]').tooltip();
}

async function postCoin(coin, cond) {
  let coinPass = `_${coin._id}_${cond}`;
  const response = await fetch(`${coinAddURL}/:${coinPass}`);
  const data = await response.json();
  return data;
}

async function getCoinFromApi(coin) {
  console.log(`${coinURL}:${coin}`);
  const response = await fetch(`${coinURL}:${coin}`);
  const data = response.json();
  return data;
}

async function createModal(coin) {
  const modalBody = document.querySelector("#modal-coin-info");
  modalBody.innerText = "";
  let node = document.createElement("h6");
  node.appendChild(document.createTextNode(`Year: ${coin.coinYear}`));
  modalBody.appendChild(node);
  node = document.createElement("h6");
  node.appendChild(document.createTextNode(`Mint: ${coin.mint}`));
  modalBody.appendChild(node);
  node = document.createElement("h6");
  node.appendChild(
    document.createTextNode(`${coin.coinName.substring(0, 33)}`)
  );
  modalBody.appendChild(node);
  node = document.createElement("input");
  node.setAttribute("type", "text");
  node.setAttribute("name", "coinCondition");
  node.setAttribute("class", "form-control my-4");
  node.setAttribute("placeholder", "Enter Condition of coin");
  modalBody.appendChild(node);
  return new Promise((resolve, reject) => {
    submitAdd.onclick = () => {
      let con;
      if (node.value == "") con = "average";
      else con = node.value;
      resolve(con);
    };
    cancelAdd.onclick = () => {
      reject("Cancel button");
    };
  });
}

//Delete coin button section
Array.from(btnDelCoin).forEach(delCoin => {
  deleteEventList(delCoin);
});

function deleteEventList(delCoin) {
  delCoin.addEventListener("click", e => {
    let elementDel;
    console.log(e.target);
    if (e.target.tagName === "I") elementDel = e.target.parentElement.id;
    else elementDel = e.target.id;
    console.log(elementDel);
    const elementDelCoin = elementDel.split(/-/)[1];

    processDelCoin(elementDelCoin).then(coinData => {
      console.log(coinData);
    });
  });
}

async function processDelCoin(coinID) {
  let delCoins = [];
  let cancelAdd = false;
  const coin = await getCoinsFromInventory(coinID);
  await createDeleteModal(coin)
    .then(coins => {
      delCoins = coins;
    })
    .catch(() => {
      cancelAdd = true;
    });
  if (cancelAdd || delCoins.length == 0) return "Cancel";
  await delCoinsFromInventory(delCoins);
  let count = parseInt(document.querySelector(`#count-${coinID}`).textContent);
  count -= delCoins.length;
  document.querySelector(`#count-${coinID}`).textContent = count.toString();
  if (count == 0) removeDeleteEditButtons(coinID);
  return "Ready";
}

function removeDeleteEditButtons(coin) {
  const elementBefore = document.querySelector(`#add-${coin}`).parentNode;
  while (elementBefore.nextSibling) elementBefore.nextSibling.remove();
}

async function delCoinsFromInventory(coin) {
  let coinPass = "";
  for (let i = 0; i < coin.length; i++) coinPass += `_${coin[i]}`;
  const response = await fetch(`${coinDelURL}/:${coinPass}`);
  const data = response.json();
  return data;
}

async function getCoinsFromInventory(coin) {
  const response = await fetch(`${coinGetURL}/:${coin}`);
  const data = response.json();
  return data;
}

async function createDeleteModal(coin) {
  let delCoinsArr = [];
  const modalBody = document.querySelector("#modal-del-coin-info");
  modalBody.innerText = "";
  let node = document.createElement("h6");
  node.appendChild(document.createTextNode(`Year: ${coin[0].coin.coinYear}`));
  modalBody.appendChild(node);
  node = document.createElement("h6");
  node.appendChild(document.createTextNode(`Mint: ${coin[0].coin.mint}`));
  modalBody.appendChild(node);
  node = document.createElement("h6");
  node.appendChild(
    document.createTextNode(`${coin[0].coin.coinName.substring(0, 33)}`)
  );
  modalBody.appendChild(node);
  node = document.createElement("p");
  node.appendChild(
    document.createTextNode(
      `You have ${coin.length} coin(s). Check the boxes next to the coin conditions that you want to delete.`
    )
  );
  modalBody.appendChild(node);

  for (let co of coin) {
    node = document.createElement("div");
    node.innerHTML = `<input type="checkbox" id="check-del-${co._id}"> ${co.condition}`;
    modalBody.appendChild(node);
  }

  return new Promise((resolve, reject) => {
    submitDel.onclick = () => {
      for (let cb of coin) {
        let q = document.querySelector(`#check-del-${cb._id}`);
        if (q.checked) delCoinsArr.push(cb._id);
      }
      resolve(delCoinsArr);
    };
    cancelDel.onclick = () => {
      reject("Cancel button");
    };
  });
}

//Edit coin button section
Array.from(btnEditCoin).forEach(editCoin => {
  editEventList(editCoin);
});

function editEventList(editCoin) {
  editCoin.addEventListener("click", e => {
    let elementEdit;
    if (e.target.tagName === "I") elementEdit = e.target.parentElement.id;
    else elementEdit = e.target.id;
    const elementEditCoin = elementEdit.split(/-/)[1];

    processEditCoin(elementEditCoin).then(coinData => {});
  });
}

async function processEditCoin(coinID) {
  let editCoins = [];
  let cancelEdit = false;
  const coin = await getCoinsFromInventory(coinID);
  await createEditModal(coin)
    .then(coins => {
      editCoins = coins;
    })
    .catch(() => {
      cancelEdit = true;
    });
  if (cancelEdit || editCoins.length == 0) return "Cancel";
  await editCoinsFromInventory(editCoins);
  return "Ready";
}

async function createEditModal(coin) {
  let editCoinsArr = [];
  const modalBody = document.querySelector("#modal-edit-coin-info");
  modalBody.innerText = "";
  let node = document.createElement("h6");
  node.appendChild(document.createTextNode(`Year: ${coin[0].coin.coinYear}`));
  modalBody.appendChild(node);
  node = document.createElement("h6");
  node.appendChild(document.createTextNode(`Mint: ${coin[0].coin.mint}`));
  modalBody.appendChild(node);
  node = document.createElement("h6");
  node.appendChild(
    document.createTextNode(`${coin[0].coin.coinName.substring(0, 33)}`)
  );
  modalBody.appendChild(node);
  node = document.createElement("p");
  node.appendChild(
    document.createTextNode(
      `You have ${coin.length} coin(s). Check the boxes and edit the conditions of the coins that you want to change.`
    )
  );
  modalBody.appendChild(node);

  for (let co of coin) {
    node = document.createElement("div");
    node.innerHTML = `<input type="checkbox" id="check-edit-${co._id}">
                      <input type="text" class="my-1" id="text-edit-${co._id}" value="${co.condition}">`;
    modalBody.appendChild(node);
  }

  return new Promise((resolve, reject) => {
    submitEdit.onclick = () => {
      for (let cb of coin) {
        let q = document.querySelector(`#check-edit-${cb._id}`);
        let w = document.querySelector(`#text-edit-${cb._id}`);
        if (q.checked) {
          editCoinsArr.push(cb._id);
          editCoinsArr.push(w.value);
        }
      }
      resolve(editCoinsArr);
    };
    cancelEdit.onclick = () => {
      reject("Cancel button");
    };
  });
}

async function editCoinsFromInventory(coin) {
  let coinPass = "";
  for (let i = 0; i < coin.length; i++) coinPass += `_${coin[i]}`;
  const response = await fetch(`${coinEditURL}/:${coinPass}`);
  const data = response.json();
  return data;
}
