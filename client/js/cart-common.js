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

function updateCartCount() {
  const cart = getCart();

  const total = cart.reduce(
    (sum, item) => sum + item.quantity,
    0
  );

  const el = document.getElementById("cart-count");

  if (el) {
    el.innerText = total;
  }
}

function showLoginPopup() {

  const modalHtml = `
  <div class="modal fade" id="loginRequiredModal" tabindex="-1">
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content text-center p-4">

        <h4 class="text-danger mb-2">Yêu cầu đăng nhập</h4>

        <p class="mb-3">
          Bạn cần đăng nhập để thêm sản phẩm vào giỏ hàng
        </p>

        <div class="d-flex gap-2 justify-content-center">
          <a href="/pages/login.html" class="btn btn-success">
            Đăng nhập
          </a>

          <button class="btn btn-secondary" data-bs-dismiss="modal">
            Đóng
          </button>
        </div>

      </div>
    </div>
  </div>
  `;

  const old = document.getElementById("loginRequiredModal");
  if (old) old.remove();

  document.body.insertAdjacentHTML("beforeend", modalHtml);

  const modal = new bootstrap.Modal(
    document.getElementById("loginRequiredModal")
  );

  modal.show();
}

// GLOBAL HOOK (QUAN TRỌNG)
window.getCart = getCart;
window.saveCart = saveCart;
window.updateCartCount = updateCartCount;

document.addEventListener(
  "DOMContentLoaded",
  updateCartCount
);