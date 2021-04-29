// Array of pizzas
const parsedPizzaList = sessionStorage.getItem('pizza') ? JSON.parse(sessionStorage.getItem('pizza')) : [];
let pizzaList = parsedPizzaList && Array.isArray(parsedPizzaList) ? parsedPizzaList : [];
sessionStorage.setItem('pizza', JSON.stringify(pizzaList));

// Foo :D
const ESortBy = {
    NAME: 'name',
    PRICE: 'price',
    HEAT: 'heat'
};

// Kinda helpful variables to track sorting and deleting pizza from the menu
let fooSort = { sortBy: ESortBy.NAME, order: 1 };
let tempPizzaName;

// On load
window.onload = function() {
    const pizzaForm = document.getElementById('pizza_form');
    pizzaForm.addEventListener('submit', SubmitPizzaForm);

    const photoSelection = document.getElementById('photo');
    photoSelection.addEventListener('change', OnPizzaPhotoChange);

    const pizzaSortForm = document.getElementById('pizza_sort_form');
    pizzaSortForm.addEventListener('submit', SubmitPizzaSortForm);

    const pizzaConfirmCancelButton = document.getElementById('cancel_remove');
    pizzaConfirmCancelButton.addEventListener('click', CloseConfirmationWindow);

    const pizzaConfirmRemoveButton = document.getElementById('confirm_remove');
    pizzaConfirmRemoveButton.addEventListener('click', RemovePizza);

    SortPizzaMenu();
    AddAllPizzaToMenu();
};

/**
 * Closes a confirmation window
 */
function CloseConfirmationWindow() {
    document.getElementById('confirm_remove').style.display = 'none';
}

/**
 * Open a confirmation window
 * @param {string} name pizza name
 */
function OpenConfirmationWindow(name) {
    tempPizzaName = name;
    document.getElementById('confirm_remove').style.display = 'block';
}

/**
 * When the photo select dropdown value is changed, it also changes the photo
 */
function OnPizzaPhotoChange() {
    const pizzaPhoto = document.getElementById('pizza_photo');
    pizzaPhoto.src = `images/${this.value}.jpg`
}

/**
 * Submits pizza form
 * @param {Event} event event
 */
function SubmitPizzaForm(event) {
    event.preventDefault();

    const name = event.target.name.value;
    const price = event.target.price.value;
    const heat = typeof parseInt(event.target.heat.value) !== 'number' ? 0 : event.target.heat.value;
    const toppings = Array.from(event.target.toppings.selectedOptions).map(option => option.value);
    const photo = event.target.photo.value;

    // Pizza object
    const pizza = { name, price, heat, toppings, photo };

    // Validates form
    if (!Validate(pizza)) return;
    // Clears form
    if (AddPizza(pizza)) this.reset();
}

/**
 * Validates pizza form
 * @param {{name: string; price: number; heat: number; toppings: string[]; photo: string;}} pizza 
 * @returns whether validation is successful
 */
function Validate(pizza) {
    if (heat > 3 || heat < 1) return false;
    if (pizza.toppings.length < 2) return false;

    return true;
}

/**
 * Adds pizza to the list and updates session storage
 * @param {{name: string; price: number; heat: number; toppings: string[]; photo: string;}} newPizza pizza object
 * @returns 
 */
function AddPizza(newPizza) {
    if (pizzaList.find(pizza => pizza.name === newPizza.name)) return false; // Checking if such a pizza name already exists

    pizzaList.push(newPizza);
    // Making sure the original order stays the same
    const parsedPizzaList = JSON.parse(sessionStorage.getItem('pizza'));
    parsedPizzaList.push(newPizza);
    sessionStorage.setItem('pizza', JSON.stringify(parsedPizzaList));
    
    UpdatePizzaMenu();

    return true;
}

/**
 * Removes the pizza from the list by its name
 * @param {string} pizzaName pizza name
 */
function RemovePizza() {
    pizzaList = pizzaList.filter(pizza => pizza.name !== tempPizzaName);

    // Making sure the original order stays the same
    let parsedPizzaList = JSON.parse(sessionStorage.getItem('pizza'));
    parsedPizzaList = pizzaList.filter(pizza => pizza.name !== tempPizzaName);
    sessionStorage.setItem('pizza', JSON.stringify(parsedPizzaList));
    
    CloseConfirmationWindow();

    UpdatePizzaMenu();
}

/**
 * Submits pizza sort form
 * @param {Event} event 
 */
function SubmitPizzaSortForm(event) {
    event.preventDefault();

    const sortBy = event.target.sortby.value;
   
    SortPizzaMenu(sortBy);
    UpdatePizzaMenu();
}

/**
 * Sorts the pizza list by the selected property
 * @param {string} sortBy sort by name, price or heat
 */
function SortPizzaMenu(sortBy) {
    if (sortBy == fooSort.sortBy) fooSort.order = fooSort.order === 1 ? -1 : 1; // Toggle
    else {
        fooSort.sortBy = sortBy; 
        fooSort.order = 1; // Default
    }

    if (sortBy == ESortBy.NAME && fooSort.order == 1)
        pizzaList.sort((a, b) => a.name.localeCompare(b.name))
    else if (sortBy == ESortBy.NAME && fooSort.order == -1) 
        pizzaList.sort((a, b) => b.name.localeCompare(a.name))

    if (sortBy == ESortBy.PRICE && fooSort.order == 1)
        pizzaList.sort((a, b) => a.price - b.price)
    else if (sortBy == ESortBy.PRICE && fooSort.order == -1) 
        pizzaList.sort((a, b) => b.price - a.price);

    if (sortBy == ESortBy.HEAT && fooSort.order == 1)
        pizzaList.sort((a, b) => a.heat - b.heat)
    else if (sortBy == ESortBy.HEAT && fooSort.order == -1) 
        pizzaList.sort((a, b) => b.heat - a.heat);
}

/**
 * Updates the pizza menu
 */
function UpdatePizzaMenu() {
    RemoveAllPizzaFromMenu();
    AddAllPizzaToMenu();
}

/**
 * Removes all children from the table
 */
function RemoveAllPizzaFromMenu() {
    const pizzaMenu = document.getElementById('pizza_menu');

    while (pizzaMenu.firstChild) pizzaMenu.removeChild(pizzaMenu.firstChild);
}

/**
 * A pizza menu is created from the pizza list (pizzaList)
 */
function AddAllPizzaToMenu() {
    const pizzaMenu = document.getElementById('pizza_menu');

    pizzaList.forEach((pizza, index) => {
        const row = pizzaMenu.insertRow(index); // Inserting a new row

        const cells = []; // Array of row cells 
        for (let cellIndex = 0; cellIndex < 6; cellIndex++) cells.push(row.insertCell(cellIndex)); // 6 cells are inserted in the row

        cells[0].innerHTML = pizza.name;
        cells[1].innerHTML = pizza.price;

        // img elements are created
        for (let h = 0; h < pizza.heat; h++) {
            const image = document.createElement('img');
            image.width = 20;
            image.height = 20;
            image.src = `images/pepper.png`;
            cells[2].appendChild(image);
        }
        
        cells[3].innerHTML = pizza.toppings;
        cells[4].innerHTML = `<img src="images/${pizza.photo}.jpg" width="200px" height="200px" />`;

        const removeButton = document.createElement('button');
        removeButton.innerHTML = 'Remove';
        // Binding an anonymous function
        removeButton.onclick = function() { 
            OpenConfirmationWindow(pizza.name); 
        };
        cells[5].appendChild(removeButton); // Adding a created button to the last cell
    });
}