const itemInput = document.getElementById('item-input');
const itemList = document.getElementById('item-list');
const itemForm = document.getElementById('item-form');
const filter = document.getElementById('filter');
const clearBtn = document.getElementById('clear');
const btn = document.getElementById('btn');

let editMode = false;

// Add Item
function onItemSubmit(e) {
  e.preventDefault();

  const newItem = itemInput.value;

  if (newItem.trim('') === '') {
    alert('Please enter something');
    return;
  }

  if (editMode) {
    if (!checkForDuplicates(newItem)) {
      const itemToEdit = document.querySelector('.edit-mode');

      itemToEdit.classList.remove('edit-mode');
      itemToEdit.remove();
      editMode = false;
    }
  }

  if (checkForDuplicates(newItem)) {
    alert('This item already exists!');
    return;
  }

  addToDOM(newItem);
  addItemToLocalStorage(newItem);
  updateUI();
  itemInput.value = '';
}

// Check for duplicates
function checkForDuplicates(newItem) {
  const items = getItemsFromLocalStorage();

  return items.includes(newItem);
}

// Add Item to dom
function addToDOM(newItem) {
  const li = document.createElement('li');
  li.appendChild(document.createTextNode(newItem));
  li.classList.add('list-item');

  const button = createButton();

  li.appendChild(button);
  itemList.appendChild(li);
}

// Create Button for list item
function createButton() {
  const button = document.createElement('button');
  button.classList = 'remove-item btn-link text-red';

  const icon = document.createElement('icon');
  icon.classList = 'fa-solid fa-xmark';

  button.appendChild(icon);

  return button;
}

// On item click
function onItemClick(e) {
  if (e.target.parentElement.classList.contains('remove-item')) {
    if (confirm('Are you sure?')) {
      if (
        e.target.parentElement.parentElement.textContent === itemInput.value
      ) {
        editMode = false;
      }
      removeItem(e.target.parentElement.parentElement);
    }
  } else if (e.target.closest('li')) {
    setToEditMode(e.target);
  }
}

// Set item into edit mode
function setToEditMode(item) {
  editMode = true;
  const items = document.querySelectorAll('li');
  items.forEach((item) => {
    item.classList.remove('edit-mode');
  });

  item.classList.add('edit-mode');
  itemInput.value = item.textContent;
  btn.style.backgroundColor = 'green';
  btn.innerHTML = '<i class="fa fa-pen"></i> Update Item';
}

// Remove item
function removeItem(item) {
  item.remove(item);
  removeItemFromLocalStorage(item.textContent);

  updateUI();
}

// Clear items
function clearItems() {
  while (itemList.firstChild) {
    itemList.removeChild(itemList.firstChild);

    clearItemsFromLocalStorage();
    console.log(editMode);
    itemInput.value = '';
    editMode = false;
    updateUI();
  }
}

// Update the UI
function updateUI() {
  const items = document.querySelectorAll('li');

  if (items.length <= 0) {
    filter.style.display = 'none';
    clearBtn.style.display = 'none';
  } else {
    filter.style.display = 'block';
    clearBtn.style.display = 'block';
  }

  btn.innerHTML = '<i class="fa-solid fa-plus"></i> Add Item';
  btn.style.backgroundColor = '#000';
}

// Filter items
function filterItems(e) {
  console.log(e.target);
  const text = e.target.value.toLowerCase();
  console.log(text);
  const items = document.querySelectorAll('li');

  items.forEach((item) => {
    const itemText = item.textContent.toLowerCase();

    if (itemText.indexOf(text) !== -1) {
      item.style.display = 'flex';
    } else {
      item.style.display = 'none';
    }
  });
}

/* —------------------ */
/* Local Storage */
/* ------------------- */

// Get items from local storage
function getItemsFromLocalStorage() {
  let items;

  if (localStorage.getItem('items') === null) {
    items = [];
  } else {
    items = JSON.parse(localStorage.getItem('items'));
  }

  return items;
}

// Add item to local storage
function addItemToLocalStorage(item) {
  let items = getItemsFromLocalStorage();

  items.push(item);

  localStorage.setItem('items', JSON.stringify(items));
}

// Remove item from local storage
function removeItemFromLocalStorage(i) {
  let items = getItemsFromLocalStorage();

  items = items.filter((item) => {
    return item !== i;
  });

  localStorage.setItem('items', JSON.stringify(items));
}

// Clear local storage
function clearItemsFromLocalStorage() {
  localStorage.clear();
}

// Display items from local storage
function displayItemsFromLocalStorage() {
  let items = getItemsFromLocalStorage();

  items.forEach((item) => {
    addToDOM(item);
  });

  updateUI();
}

// Add EventListeners
function init() {
  itemForm.addEventListener('submit', onItemSubmit);
  itemList.addEventListener('click', onItemClick);
  clearBtn.addEventListener('click', clearItems);
  filter.addEventListener('keyup', filterItems);
  window.addEventListener('DOMContentLoaded', displayItemsFromLocalStorage);

  updateUI();
}

init();
