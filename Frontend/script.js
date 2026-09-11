// ================= HOME PAGE =================

function login() {

    window.location.href = "login.html";

}


function viewMenu() {

    window.location.href = "menu.html";

}


function trackOrder() {

    const orderId =
        localStorage.getItem("orderId");

    if (!orderId) {

        alert("No active order found.");

        return;
    }

    window.location.href = "order.html";

}


function orderFood(foodName) {

    alert(foodName + " selected!");

}


// ================= CART =================

// Get existing cart from browser storage
let cart =
    JSON.parse(localStorage.getItem("cart")) || [];


// ================= ADD TO CART =================

function addToCart(name, price) {

    const item = {

        name: name,

        price: price

    };


    cart.push(item);


    localStorage.setItem(
        "cart",
        JSON.stringify(cart)
    );


    alert(
        name + " added to cart!"
    );

}


// ================= GO TO CART =================

function goToCart() {

    window.location.href =
        "cart.html";

}


// ================= DISPLAY CART =================

function displayCart() {

    const cartContainer =
        document.getElementById("cartItems");

    const totalElement =
        document.getElementById("total");


    // Not on cart page
    if (!cartContainer) {

        return;

    }


    // Empty cart
    if (cart.length === 0) {

        cartContainer.innerHTML =
            "<p>Your cart is empty.</p>";

        totalElement.innerText = "";

        return;

    }


    let total = 0;


    cartContainer.innerHTML = "";


    cart.forEach(
        function(item, index) {

            total += item.price;


            const itemElement =
                document.createElement("div");


            itemElement.innerHTML = `

                <h3>
                    ${item.name}
                </h3>

                <p>
                    ₹${item.price}
                </p>

                <button
                    onclick="removeFromCart(${index})">

                    Remove

                </button>

                <hr>

            `;


            cartContainer.appendChild(
                itemElement
            );

        }
    );


    totalElement.innerText =
        "Total: ₹" + total;

}


// ================= REMOVE FROM CART =================

function removeFromCart(index) {

    cart.splice(index, 1);


    localStorage.setItem(
        "cart",
        JSON.stringify(cart)
    );


    displayCart();

}


// ================= PLACE ORDER =================

async function placeOrder() {

    // Check empty cart
    if (cart.length === 0) {

        alert(
            "Your cart is empty."
        );

        return;

    }


    // Calculate total
    let total = 0;


    cart.forEach(
        function(item) {

            total += item.price;

        }
    );


    try {

        // Send order to backend
        const response =
            await fetch(
                "http://localhost:3000/api/orders",
                {

                    method: "POST",

                    headers: {

                        "Content-Type":
                            "application/json"

                    },

                    body:
                        JSON.stringify({

                            items: cart,

                            totalAmount: total

                        })

                }
            );


        // Check response
        if (!response.ok) {

            const errorData =
                await response.json();

            throw new Error(
                errorData.message ||
                "Failed to create order"
            );

        }


        // Get order returned by backend
        const order =
            await response.json();


        // Save order information
        localStorage.setItem(
            "orderId",
            order._id
        );


        localStorage.setItem(
            "queueNumber",
            order.queueNumber
        );


        // Clear cart
        localStorage.removeItem(
            "cart"
        );

        cart = [];


        // Go to order page
        window.location.href =
            "order.html";


    } catch (error) {

        console.log(error);


        alert(
            "Could not place order.\n" +
            error.message
        );

    }

}


// ================= INITIALIZE CART =================

displayCart();