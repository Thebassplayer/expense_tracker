const balance = document.getElementById('balance'),
  moneyPlus = document.getElementById('money-plus'),
  moneyMinus = document.getElementById('money-minus'),
  list = document.getElementById('list'),
  form = document.getElementById('form'),
  plusBtn = document.getElementById('option-1'),
  minusBtn = document.getElementById('option-2'),
  detail = document.getElementById('detail'),
  amount = document.getElementById('amount');

let ulEl, newTransaction;

const localStorageTransactions = JSON.parse(
  localStorage.getItem('transactions')
);

let transactions =
  localStorage.getItem('transactions') !== null ? localStorageTransactions : [];

let positiveTransaction = true;

//! Add transaction
function addTransaction(e) {
  e.preventDefault();

  let signedAmount = Math.abs(amount.value.trim());

  if (!positiveTransaction) {
    signedAmount = -Math.abs(amount.value);
  }

  if (detail.value.trim() === '' || amount.value.trim() === '') {
    alert('Please add detail and amount');
  } else {
    newTransaction = {
      id: generateID(),
      detail: detail.value,
      amount: signedAmount,
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
  const sign = transaction.amount > 0 ? '+' : '-';

  //! Create li
  const item = document.createElement('li');

  //! Add class based on value
  item.classList.add(transaction.amount > 0 ? 'plus' : 'minus');

  //! Emojify

  let printableDetail = transaction.detail,
    transDet = transaction.detail.toLowerCase();
  if (transDet === 'piza' || transDet === 'pizza' || transDet === 'picsa') {
    printableDetail = `${printableDetail} 🍕`;
  } else if (
    transDet === 'burger' ||
    transDet === 'hamburger' ||
    transDet === 'hamburguesa'
  ) {
    printableDetail = `${printableDetail} 🍔`;
  }

  item.innerHTML = `${printableDetail}<span>${sign}$ ${Math.abs(
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

plusBtn.addEventListener('click', () => {
  positiveTransaction = true;
  amount.classList.remove('negative');
  amount.classList.add('positive');
});

minusBtn.addEventListener('click', () => {
  positiveTransaction = false;
  amount.classList.remove('positive');
  amount.classList.add('negative');
});
