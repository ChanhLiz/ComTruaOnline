const cartList = document.getElementById("cart-list");
const cartTotal = document.getElementById("cart-total");

function getToken() {
  return localStorage.getItem("token");
}

async function loadCart() {
  const token = localStorage.getItem("token");

  if (!token) {
    cartList.innerHTML = "<p>Vui lòng đăng nhập</p>";
    return;
  }

  const res = await fetch("/api/cart", {
    headers: {
      "Authorization": "Bearer " + token
    }
  });

  const cart = await res.json();

  if (!Array.isArray(cart)) {
    cartList.innerHTML = "<p>Không load được giỏ hàng</p>";
    return;
  }

  renderCart(cart);
}

function renderCart() {
  let cart = getCart();

  if (!cart.length) {
    cartList.innerHTML = "<p>Giỏ hàng trống</p>";
    cartTotal.innerText = "0";
    return;
  }

  let total = 0;
  cartList.innerHTML = "";

  cart.forEach((item, index) => {
    total += item.price * item.quantity;

    const row = document.createElement("div");
    row.className = "row border p-2 mb-2";

    row.innerHTML = `
      <div class="col-md-2">
        <img src="${item.thumbnail}" class="img-fluid">
      </div>

      <div class="col-md-4">
        <h5>${item.name}</h5>
        <p>${Number(item.price).toLocaleString("vi-VN")}đ</p>
      </div>

      <div class="col-md-3">
        <button class="btn btn-sm btn-outline-secondary btn-minus">-</button>
        <span>${item.quantity}</span>
        <button class="btn btn-sm btn-outline-secondary btn-plus">+</button>
      </div>

      <div class="col-md-2">
        <b>${(item.price * item.quantity).toLocaleString("vi-VN")}đ</b>
      </div>

      <div class="col-md-1">
        <button class="btn btn-danger btn-sm btn-delete">X</button>
      </div>
    `;

    row.querySelector(".btn-minus").onclick = () => {
      if (item.quantity > 1) item.quantity--;
      else cart.splice(index, 1);

      saveCart(cart);
      renderCart();
      updateCartCount();
    };

    row.querySelector(".btn-plus").onclick = () => {
      item.quantity++;
      saveCart(cart);
      renderCart();
      updateCartCount();
    };

    row.querySelector(".btn-delete").onclick = () => {
      cart.splice(index, 1);
      saveCart(cart);
      renderCart();
      updateCartCount();
    };

    cartList.appendChild(row);
  });

  cartTotal.innerText = total.toLocaleString("vi-VN");
}

renderCart();

function getUser() {
  return JSON.parse(localStorage.getItem("user"));
}

function getCartKey() {
  const user = getUser();
  return user ? `cart_${user.id}` : "cart_guest";
}

function getCart() {
  return JSON.parse(localStorage.getItem(getCartKey())) || [];
}

function saveCart(cart) {
  localStorage.setItem(getCartKey(), JSON.stringify(cart));
}