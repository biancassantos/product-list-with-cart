const productsContainer = document.querySelector(".products-cards-container");
const emptyCartInterface = document.querySelector(".empty-cart-interface");
const fullCartInterface = document.querySelector(".full-cart-interface");
const cartItemsList = document.querySelector(".cart-items-list");
const orderTotal = document.querySelector(".order-total-price");
const cartTotalQuantity = document.querySelector(".cart-total-quantity");
let products;
let cart = [];

// renders the products
function renderProducts() {
  products.forEach(product => {
    const productCard = document.createElement("section");
    productCard.classList.add("product-card");
    productCard.setAttribute("id", `${product.id}`);
    productCard.innerHTML = `
      <!-- desktop image -->
      <div class="product-image desktop-img">
        <img src=${product.image.desktop} alt="Picture of ${product.name}">
      </div>

      <!-- tablet image -->
      <div class="product-image tablet-img">
        <img src=${product.image.tablet} alt="Picture of ${product.name}">
      </div>

      <!-- mobile image -->
      <div class="product-image mobile-img">
        <img src=${product.image.mobile} alt="Picture of ${product.name}">
      </div>

      <!-- add to cart button -->
      <button class="add-to-cart-btn">
        <img src="assets/images/icon-add-to-cart.svg" alt=""> Add to cart
      </button>

      <!-- cart quantity control buttons -->
      <div class="cart-quantity-control-btns">
        <button class="decrement-btn">
          <svg xmlns="http://www.w3.org/2000/svg" width="10" height="2" fill="none" viewBox="0 0 10 2"><path fill="#fff" d="M0 .375h10v1.25H0V.375Z"/></svg>
        </button>
        <p class="product-quantity-text"></p>
        <button class="increment-btn">
          <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" fill="none" viewBox="0 0 10 10"><path fill="#fff" d="M10 4.375H5.625V0h-1.25v4.375H0v1.25h4.375V10h1.25V5.625H10v-1.25Z"/></svg>
        </button>
      </div>
      
      <!-- product info text -->
      <div class="product-info">
        <span>${product.category}</span>
        <h3>${product.name}</h3>
        <p>$${product.price.toFixed(2)}</p>
      </div>
    `;
    productsContainer.appendChild(productCard);
  });

  addEventListenerToAddBtn();
  addEventListenerToControlBtns();
}

// fetches the data from data.json and calls render function
async function getProducts() {
  const response = await fetch("../data.json");
  products = await response.json();
  renderProducts();
}

getProducts();

// adds event listener to addToCartBtns after they are created
function addEventListenerToAddBtn() {
  const addToCartBtn = document.querySelectorAll(".add-to-cart-btn");

  addToCartBtn.forEach(btn => {
    const productId = btn.parentNode.id;
    btn.addEventListener("click", () => {
      addToCart(productId);
      switchAddToCartBtns(productId);
    });
  });
}

// checks if the product is in the cart
function checkCart(id) {
  return cart.some(product => product.id === id);
}

// switches the display of the addToCart btn and the cartQuantityControlBtns
function switchAddToCartBtns(productId) {
  const productsCards = document.querySelectorAll(".product-card");
  productsCards.forEach(card => {
    const productId = card.id;
    const addToCartBtn = card.querySelector(".add-to-cart-btn");
    const cartQuantityControlBtns = card.querySelector(".cart-quantity-control-btns");
    const isInCart = checkCart(productId);

    if (isInCart) {
      addToCartBtn.style.display = "none";
      cartQuantityControlBtns.style.display = "flex";
    } else {
      addToCartBtn.style.display = "flex";
      cartQuantityControlBtns.style.display = "none";
    }
  });
}

// shows red border if the product is selected (is in the cart)
function toggleSelectedProduct() {
  const productsCards = document.querySelectorAll(".product-card");
  productsCards.forEach(card => {
    const productId = card.id;
    const productImgs = card.querySelectorAll(".product-image");
    const isInCart = checkCart(productId);

    if (isInCart) {
      productImgs.forEach(img => img.classList.add("selected-product"));
    } else {
      productImgs.forEach(img => img.classList.remove("selected-product"));
    }
  });
}

// adds product to cart
function addToCart(id) {
  products.forEach(product => {
    if (product.id === id) {
      cart.push({...product, quantity: 1});
    }
  });

  updateCartQuantityControlTextValue();
  toggleSelectedProduct();
  updateCartQuantity();
  updateCartTotal();
  toggleCartInterface();
  renderCartItems();
}

// toggles cart interface depending on whether the cart has items or not
function toggleCartInterface() {
  if (cart.length === 0) {
    emptyCartInterface.style.display = "flex";
    fullCartInterface.style.display = "none";
  } else {
    emptyCartInterface.style.display = "none";
    fullCartInterface.style.display = "flex";
  }
}

// adds event listener to the controlCartQuantityBtns after they are created
function addEventListenerToControlBtns() {
  const incrementBtn = document.querySelectorAll(".increment-btn");
  const decrementBtn = document.querySelectorAll(".decrement-btn");

  incrementBtn.forEach(btn => {
    const productId = btn.parentNode.parentNode.id;
    btn.addEventListener("click", () => updateProductQuantity("increment", productId));
  });

  decrementBtn.forEach(btn => {
    const productId = btn.parentNode.parentNode.id;
    btn.addEventListener("click", () => updateProductQuantity("decrement", productId));
  });
}

// increments or decrements the product quantity in the cart
function updateProductQuantity(type, productId) {
  cart.map(product => {
    if (product.id === productId && type === "increment") {
      product.quantity++;
    } else if (product.id === productId && type === "decrement") {
      if (product.quantity >= 2) {
        product.quantity--;
      } else {
        product.quantity--;
        removeFromCart(productId);
        toggleSelectedProduct();
        toggleCartInterface();
        switchAddToCartBtns();
      }
    } else {
      return product;
    }
  });
  updateCartQuantityControlTextValue();
  updateCartQuantity();
  updateCartTotal();
  renderCartItems();
}

// updates the quantity text inside the controlCartQuantityBtns
function updateCartQuantityControlTextValue() {
  const quantityControlBtns = document.querySelectorAll(".cart-quantity-control-btns");

  quantityControlBtns.forEach(btn => {
    const productId = btn.parentNode.id;
    const quantityText = btn.querySelector(".product-quantity-text");

    cart.forEach(product => {
      if (product.id === productId) {
        quantityText.innerText = product.quantity;
      }
    });
  });
}

// updates the cart total price
function updateCartTotal() {
  let cartTotal = 0;
  cart.forEach(product => {
    cartTotal += product.quantity * product.price;
  });
  orderTotal.innerText = `$${cartTotal.toFixed(2)}`;
}

// updates the cart total quantity
function updateCartQuantity() {
  let cartQuantity = 0;
  cart.forEach(product => {
    cartQuantity += product.quantity;
  });
  cartTotalQuantity.innerText = cartQuantity;
}

// adds event listener to the removeFromCartBtns after they are created
function addEventListenerToRemoveBtns() {
  const removeFromCartBtns = document.querySelectorAll(".remove-from-cart-btn");
  removeFromCartBtns.forEach(btn => {
    const productId = btn.parentNode.id;
    btn.addEventListener("click", () => removeFromCart(productId));
  });
}

// removes item from cart
function removeFromCart(productId) {
  cart = cart.filter(product => {
    return product.id !== productId;
  });
  updateCartQuantity();
  updateCartTotal();
  renderCartItems();
  toggleSelectedProduct();
  toggleCartInterface();
  switchAddToCartBtns();
}

// clears the cartItemsList before rendering so the products don't show duplicated
function removeAllChildNodes(parent) {
  while (parent.firstChild) {
    parent.removeChild(parent.firstChild);
  }
}

// renders the cart items list
function renderCartItems() {
  removeAllChildNodes(cartItemsList);
  cart.forEach(product => {
    const cartItem = document.createElement("section");
    cartItem.classList.add("cart-item");
    cartItem.setAttribute("id", product.id)
    cartItem.innerHTML = `
      <section>
        <h4 class="item-name">${product.name}</h4>
        <div class="item-prices-container">
          <span class="item-quantity">${product.quantity}x</span>
          <p class="item-unity-price">@$${product.price.toFixed(2)}</p>
          <p class="item-total-price">$${(product.quantity * product.price).toFixed(2)}</p>
        </div>
      </section>
      <button class="remove-from-cart-btn">
        <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" fill="none" viewBox="0 0 10 10"><path fill="#CAAFA7" d="M8.375 9.375 5 6 1.625 9.375l-1-1L4 5 .625 1.625l1-1L5 4 8.375.625l1 1L6 5l3.375 3.375-1 1Z"/></svg>
      </button>
    `;

    cartItemsList.appendChild(cartItem);
    addEventListenerToRemoveBtns();
  })
}