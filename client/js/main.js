// DETAIL PAGE

function goToDetail(id) {
  window.location.href = `/pages/product-detail.html?id=${id}`;
}


// INIT

// loadProducts();
updateCartCount();



function getCartKey() {
  const user = JSON.parse(localStorage.getItem("user"));
  return user ? `cart_${user.id}` : "cart_guest";
}

function getCart() {
  return JSON.parse(localStorage.getItem(getCartKey())) || [];
}

function saveCart(cart) {
  localStorage.setItem(getCartKey(), JSON.stringify(cart));
}


// ADD TO CART (FIX)
function getUser() {
  return JSON.parse(localStorage.getItem("user"));
}

function addToCart(product) {

  const user = getUser();

  if (!user) {
    showLoginPopup();
    return;
  }

  const cart = getCart();

  const existing = cart.find(i => i.id === product.id);

  if (existing) {
    existing.quantity++;
  } else {
    cart.push({
      id: product.id,
      name: product.name,
      price: product.new_price,
      thumbnail: product.thumbnail,
      quantity: 1
    });
  }

  saveCart(cart);
  updateCartCount();

  const modalEl = document.getElementById("cartModal");
  if (modalEl) {
    const modal = bootstrap.Modal.getOrCreateInstance(modalEl);
    modal.show();
  }
}

updateCartCount();