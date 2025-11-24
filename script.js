// ==========================
// 1. Preise & Datenmodelle
// ==========================

const basePrices = {
    small: 2.0,
    medium: 3.0,
    large: 4.0
};

const toppings = [
    { id: "sprinkles", label: "Schokostreusel", price: 0.4 },
    { id: "cookies", label: "Keksstücke", price: 0.6 },
    { id: "strawberry", label: "Erdbeersoße", price: 0.5 },
    { id: "cream", label: "Sahne", price: 0.3 }
];


// ==========================
// 2. Klasse IceOrder
// ==========================

class IceOrder {
    constructor(customerName, size, selectedToppings, discountFn) {
        this.customerName = customerName;
        this.size = size; // "small", "medium", "large"
        this.selectedToppings = selectedToppings; // Array von Topping-IDs
        this.discountFn = discountFn; // Funktion, die den Rabatt berechnet (oder null)
    }

    getBasePrice() {
        //* Return Base Preis zu passenden Size
        return basePrices[this.size];
    }

    getToppingsPrice() {
        //* Summiere Toppings
        let total = 0;
        for (const toppingId of this.selectedToppings) {
            const topping = toppings.find(t => t.id === toppingId);
            if (topping) {
                total += topping.price;
            }
        }
        return total;
    }

    getTotalPrice() {
        //* Gesamtpreis berechnen, Doscount-Funktion anwenden
        const basePrice = this.getBasePrice();
        const toppingsPrice = this.getToppingsPrice();
        const totalPrice = basePrice + toppingsPrice;
        if (this.discountFn) {
            return this.discountFn(totalPrice);
        }
        return totalPrice;
    }

    getSummaryText() {
       //Hallo <NAME>, dein Eis kostet <PREIS> €.
         const totalPrice = this.getTotalPrice().toFixed(2);
            return `Hallo ${this.customerName}, dein Eis kostet ${totalPrice} €.`;
    }
}


// ==========================
// 3. Hilfsfunktionen
// ==========================

function getSelectedSize() {
    const sizeRadios = document.querySelectorAll('input[name="size"]');
    //Ausgewählte Größe extrahieren und zurückgeben
    for (const radio of sizeRadios) {
        if (radio.checked) {
            return radio.value;
        }
    }
}

function getSelectedToppings() {
    const selected = [];

   //* Alle selektierten Toppings bzw deren ids in Array legen und zurückgeben
    for (const topping of toppings) {
       const checkbox = document.querySelector(`#${topping.id}`);
       if (checkbox && checkbox.checked) {
           selected.push(topping.id);
       }
    }
    return selected;
}

// Higher-Order + Closure
function createDiscountFunction(code) {
    // Innere Funktion erzeugt eine Rabattfunktion (Closure über percent)
    function makeDiscount(percent) {
       //* return Function (price)
        return function (price) {
            return price * (1 - percent / 100);
        };
    }

    const trimmedCode = code.trim().toUpperCase();

    if (trimmedCode === "STUDENT10") {
        return makeDiscount(10);
    }

    if (trimmedCode === "BIGEIS20") {
        return makeDiscount(20);
    }

    // Kein gültiger Code => Identitätsfunktion
    return function (price) {
        return price;
    };
}


// ==========================
// 4. Event-Handler
// ==========================

const button = document.querySelector("#calculateBtn");
const resultDiv = document.querySelector("#result");

//* Event Listener und IceOrder-Instanz sowie Ausgabe
button.addEventListener("click", function() {
    const size = getSelectedSize();
    const selectedToppings = getSelectedToppings();
    const discountCodeInput = document.querySelector('#discountCode');
    const discountCode = discountCodeInput ? discountCodeInput.value : "";
    const discountFn = createDiscountFunction(discountCode);

    const order = new IceOrder("Kunde", size, selectedToppings, discountFn);
    resultDiv.textContent = order.getSummaryText();
});