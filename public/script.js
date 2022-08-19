const balance = document.getElementById('balance'),
  moneyPlus = document.getElementById('money-plus'),
  moneyMinus = document.getElementById('money-minus'),
  list = document.getElementById('list'),
  form = document.getElementById('form'),
  detail = document.getElementById('detail'),
  amount = document.getElementById('amount');

const localStorageTransactions = JSON.parse(
  localStorage.getItem('transactions')
);

let transactions =
  localStorage.getItem('transactions') !== null ? localStorageTransactions : [];

//! Add transaction
function addTransaction(e) {
  e.preventDefault();

  if (detail.value.trim() === '' || amount.value.trim() === '') {
    alert('Please add detail and amount');
  } else {
    const newTransaction = {
      id: generateID(),
      detail: detail.value,
      amount: +amount.value,
    };

    transactions.push(newTransaction);
    addTransactionDOM(newTransaction);
    updateValuesDOM();
    updateLocalStorage();
    detail.value = '';
    amount.value = '';
  }
}

//! Generate random ID
function generateID() {
  return Math.floor(Math.random() * 100000000);
}

//! Add transactions to DOM list BTN
function addTransactionDOM(transaction) {
  //! Get sign
  const sign = transaction.amount < 0 ? '-' : '+';

  //! Create li
  const item = document.createElement('li');

  //! Add class based on value
  item.classList.add(transaction.amount < 0 ? 'minus' : 'plus');

  item.innerHTML = `${transaction.detail}<span>${sign}$ ${Math.abs(
    transaction.amount
  ).toFixed(2)}</span> <button class="delete-btn" onclick="removeTransaction(${
    transaction.id
  })">x</button>`;

  list.appendChild(item);
}

//! Update balance income & expense

function updateValuesDOM() {
  if (transactions[0]) {
    const amountsArr = transactions.map((transaction) => transaction.amount);

    const total = amountsArr.reduce((acc, item) => acc + item, 0).toFixed(2);

    console.log('Total: ', total, typeof total);

    const income = amountsArr
      .filter((val) => val > 0)
      .reduce((acc, val) => acc + val, 0)
      .toFixed(2);

    const expense = amountsArr
      .filter((val) => val < 0)
      .reduce((acc, val) => acc + val, 0)
      .toFixed(2);

    balance.innerText = `$${total}`;
    moneyPlus.innerText = `$${income}`;
    moneyMinus.innerText = `$${expense}`;
  }
}

//! Remove transaction by ID
function removeTransaction(id) {
  if (transactions[0]) {
    transactions = transactions.filter((transaction) => transaction.id !== id);
  }

  updateLocalStorage();

  init();
}

//! Update local storage transactions
function updateLocalStorage() {
  localStorage.setItem('transactions', JSON.stringify(transactions));
}

// Init app
function init() {
  list.innerHTML = '';

  transactions.forEach(addTransactionDOM);
  updateValuesDOM();
}

init();

//! Event Listeners

form.addEventListener('submit', addTransaction);
