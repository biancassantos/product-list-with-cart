const productsContainer = document.querySelector(".products-cards-container");
let products;

function showProducts(products) {
  for (const pos in products) {
    const productCard = document.createElement("section");
    productCard.classList.add("product-card")
    productCard.innerHTML = `
      <!-- desktop image -->
      <div class="product-image desktop-img">
        <img src=${products[pos].image.desktop} alt="Picture of a waffle">
      </div>

      <!-- tablet image -->
      <div class="product-image tablet-img">
        <img src=${products[pos].image.tablet} alt="Picture of a waffle">
      </div>

      <!-- mobile image -->
      <div class="product-image mobile-img">
        <img src=${products[pos].image.mobile} alt="Picture of a waffle">
      </div>

      <!-- add to cart button -->
      <button class="add-to-cart-btn">
        <img src="assets/images/icon-add-to-cart.svg" alt=""> Add to cart
      </button>

      <!-- cart quantity control buttons -->
      <div class="cart-quantity-control-btns">
        <button class="decrease-btn">
          <svg xmlns="http://www.w3.org/2000/svg" width="10" height="2" fill="none" viewBox="0 0 10 2"><path fill="#fff" d="M0 .375h10v1.25H0V.375Z"/></svg>
        </button>
        <p>1</p>
        <button class="increase-btn">
          <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" fill="none" viewBox="0 0 10 10"><path fill="#fff" d="M10 4.375H5.625V0h-1.25v4.375H0v1.25h4.375V10h1.25V5.625H10v-1.25Z"/></svg>
        </button>
      </div>
      
      <!-- product info text -->
      <div class="product-info">
        <span>${products[pos].category}</span>
        <h3>${products[pos].name}</h3>
        <p>$${products[pos].price.toFixed(2)}</p>
      </div>
    `;
    productsContainer.appendChild(productCard);
  }
}

async function getProducts() {
  const response = await fetch("../data.json");
  products = await response.json();
  showProducts(products);
}

getProducts();
