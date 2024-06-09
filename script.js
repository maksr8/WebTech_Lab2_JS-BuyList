
// store all items

let itemsArray = new Array;
const form = document.getElementById('add-form');
const input = document.getElementById('input-prod-name');
const col1Section = document.getElementById('col1');
const notBoughtDiv = document.getElementById('not-bought-category');
const boughtDiv = document.getElementById('bought-category');

// reading items from local storage (name, quantity, is bought)

for (let key in localStorage) {
  if (!localStorage.hasOwnProperty(key)) {
    continue;
  }
  console.log(`${key}: ${localStorage.getItem(key)}`);
  itemsArray = JSON.parse(localStorage.user);
  for (let i = 0; i < itemsArray.length; i++) {
    appendItem(itemsArray[i]);
  }
}

// initial items

if (itemsArray.length === 0) {
  storeItem('Помідори', 2, true);
  storeItem('Печиво', 2);
  storeItem('Сир', 1);
}

// adding items to document

function appendItem(item) {
  const fragment = document.createDocumentFragment();

  const prodDiv = document.createElement('div');
  if (item.isBought) {
    prodDiv.classList.add('bought');
  } else {
    prodDiv.classList.add('not-bought');
  }

  const productName = document.createElement('span');
  productName.className = 'product-name';
  productName.textContent = item.name;
  prodDiv.appendChild(productName);

  const productNameInput = document.createElement('input');
  productNameInput.className = 'product-name-input-disabled';
  productNameInput.value = item.name;
  prodDiv.appendChild(productNameInput);

  const quantityDiv = document.createElement('div');

  const outerMinusDiv = document.createElement('div');
  const minusButton = document.createElement('button');
  if (item.quantity === 1) {
    outerMinusDiv.className = 'outer-minus-disabled';
    minusButton.className = 'minus-disabled';
    minusButton.setAttribute('data-tooltip', 'Мінімальна кількість товару');
  } else {
    outerMinusDiv.className = 'outer-minus';
    minusButton.className = 'minus';
    minusButton.setAttribute('data-tooltip', 'Зменшити кількість товару');
  }
  minusButton.textContent = '−';
  outerMinusDiv.appendChild(minusButton);
  quantityDiv.appendChild(outerMinusDiv);

  const amountSpan = document.createElement('span');
  amountSpan.className = 'amount';
  amountSpan.textContent = item.quantity;
  quantityDiv.appendChild(amountSpan);

  const outerPlusDiv = document.createElement('div');
  outerPlusDiv.className = 'outer-plus';
  const plusButton = document.createElement('button');
  plusButton.className = 'plus';
  plusButton.setAttribute('data-tooltip', 'Збільшити кількість товару');
  plusButton.textContent = '+';
  outerPlusDiv.appendChild(plusButton);
  quantityDiv.appendChild(outerPlusDiv);

  prodDiv.appendChild(quantityDiv);

  const isBoughtDiv = document.createElement('div');
  isBoughtDiv.className = 'div-isbought';

  const outerIsBoughtDiv = document.createElement('div');
  outerIsBoughtDiv.className = 'outer-isbought';
  const isBoughtButton = document.createElement('button');
  isBoughtButton.className = 'isbought';
  if (item.isBought) {
    isBoughtButton.textContent = 'Не куплено';
    isBoughtButton.setAttribute('data-tooltip', 'Перемкнути стан товару на не куплений');
  } else {
    isBoughtButton.textContent = 'Куплено';
    isBoughtButton.setAttribute('data-tooltip', 'Перемкнути стан товару на куплений');
  }
  outerIsBoughtDiv.appendChild(isBoughtButton);
  isBoughtDiv.appendChild(outerIsBoughtDiv);

  const outerRemoveDiv = document.createElement('div');
  outerRemoveDiv.className = 'outer-remove';
  const removeButton = document.createElement('button');
  removeButton.className = 'remove';
  removeButton.setAttribute('data-tooltip', 'Видалити товар');
  removeButton.textContent = '×';
  outerRemoveDiv.appendChild(removeButton);
  isBoughtDiv.appendChild(outerRemoveDiv);

  prodDiv.appendChild(isBoughtDiv);

  fragment.appendChild(prodDiv);

  col1Section.appendChild(fragment);

  // adding to side bar

  const prodItemSpan = document.createElement('span');
  prodItemSpan.className = 'product-item';
  const nameTextNode = document.createTextNode(item.name);
  prodItemSpan.appendChild(nameTextNode);
  const prodAmountSpan = document.createElement('span');
  prodAmountSpan.className = 'amount-left';
  prodAmountSpan.textContent = item.quantity;
  prodItemSpan.appendChild(prodAmountSpan);
  if (item.isBought) {
    boughtDiv.appendChild(prodItemSpan);
  } else {
    notBoughtDiv.appendChild(prodItemSpan);
  }

  // change product name

  productNameInput.addEventListener('keypress', function (event) {
    if (event.key === 'Enter') {
      let newName = productNameInput.value;
      if (newName.length < 2) {
        productNameInput.setCustomValidity('Назва товару повинна містити принаймні 2 символи.');
        productNameInput.reportValidity();
        return;
      } else if (newName.length > 17) {
        productNameInput.setCustomValidity('Назва товару повинна містити не більше 17 символів.');
        productNameInput.reportValidity();
        return;
      } else if (/^[A-Za-zА-ЩЬЮЯҐЄІЇа-щьюяґєії0-9]+$/.test(newName) === false) {
        productNameInput.setCustomValidity('Назва товару може містити лише літери латинського та українського алфавітів та цифри.');
        productNameInput.reportValidity();
        return;
      } else if (checkForExist(newName)) {
        productNameInput.setCustomValidity('Товар з такою назвою вже існує.');
        productNameInput.reportValidity();
        return;
      }

      let index = itemsArray.indexOf(item);
      nameTextNode.textContent = newName;
      itemsArray[index].name = newName;
      localStorage.user = JSON.stringify(itemsArray);
      productName.textContent = newName;
      productNameInput.blur();
    } else {
      productNameInput.setCustomValidity('');
    }
  });
  productNameInput.addEventListener('blur', function (event) {
    productName.classList.toggle('product-name');
    productName.classList.toggle('product-name-disabled');
    productNameInput.classList.toggle('product-name-input');
    productNameInput.classList.toggle('product-name-input-disabled');
  });

  prodDiv.addEventListener('click', function (event) {
    if (event.target) {
      let index = itemsArray.indexOf(item);
      if (event.target.className === 'remove') {

        // remove items

        console.log(item.name);
        console.log(index);
        itemsArray.splice(index, 1);
        prodDiv.remove();
        prodItemSpan.remove();
      } else if (event.target.className === 'isbought') {

        // toggle isBought

        itemsArray[index].isBought = !itemsArray[index].isBought;
        prodDiv.classList.toggle('bought');
        prodDiv.classList.toggle('not-bought');

        if (itemsArray[index].isBought) {
          isBoughtButton.textContent = 'Не куплено';
          isBoughtButton.setAttribute('data-tooltip', 'Перемкнути стан товару на не куплений');
          boughtDiv.append(prodItemSpan);
        } else {
          isBoughtButton.textContent = 'Куплено';
          isBoughtButton.setAttribute('data-tooltip', 'Перемкнути стан товару на куплений');
          notBoughtDiv.append(prodItemSpan);
        }
      } else if (event.target.className === 'plus') {

        // increase quantity

        let curQuantity = ++itemsArray[index].quantity;
        prodAmountSpan.textContent = curQuantity;
        amountSpan.textContent = curQuantity;

        if (curQuantity > 1) {
          outerMinusDiv.className = 'outer-minus';
          minusButton.className = 'minus';
          minusButton.setAttribute('data-tooltip', 'Зменшити кількість товару');
        }
      } else if (event.target.className === 'minus') {

        // decrease quantity

        let curQuantity = --itemsArray[index].quantity;
        if (curQuantity <= 1) {
          outerMinusDiv.className = 'outer-minus-disabled';
          minusButton.className = 'minus-disabled';
          minusButton.setAttribute('data-tooltip', 'Мінімальна кількість товару');
        }
        prodAmountSpan.textContent = curQuantity;
        amountSpan.textContent = curQuantity;
      } else if (event.target.className === 'product-name' && event.target.closest('.not-bought')) {

        // activate change product name input

        productName.classList.toggle('product-name');
        productName.classList.toggle('product-name-disabled');
        productNameInput.classList.toggle('product-name-input');
        productNameInput.classList.toggle('product-name-input-disabled');
        productNameInput.value = productName.textContent;
        productNameInput.focus();
      }
      
      localStorage.user = JSON.stringify(itemsArray);
    }
  });
}

// adding items to array

function storeItem(name, quantity = 1, isBought = false) {
  const item = {
    name,
    quantity,
    isBought,
  };
  itemsArray.push(item);
  localStorage.user = JSON.stringify(itemsArray);
  appendItem(item);
}

// item input

form.addEventListener('submit', function (event) {
  event.preventDefault();
  let name = input.value;
  if (checkForExist(name)) {
    input.setCustomValidity('Товар з такою назвою вже існує.');
    input.reportValidity();
    return;
  }
  storeItem(name);
  input.value = '';
  input.focus();
});

form.addEventListener('input', function (event) {
  if (!input.checkValidity()) {
    if (input.validity.patternMismatch) {
      input.setCustomValidity('Назва може складатися лише з літер латинського та українського алфавітів та цифр.');
    } else {
      input.setCustomValidity('');
    }
    input.reportValidity();
    return;
  }
});

function checkForExist(name) {
  for (item of itemsArray) {
    if (item.name === name)
      return true;
  }
  return false;
}
