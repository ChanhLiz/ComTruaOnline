const user = JSON.parse(localStorage.getItem("user"));

let pendingOrderData = null;
let isSubmitting = false;

let countdownInterval = null;
let timeLeft = 900;

let selectedPayment = null;

if (!user) {
  alert("Vui lòng đăng nhập trước khi thanh toán");

  window.location.href =
    "/pages/login.html";
}

async function loadUser() {
  try {
    const res = await fetch("/api/users/me", {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("token")
      }
    });

    const user = await res.json();

    document.getElementById("full_name").value = user.full_name || "";
    document.getElementById("email").value = user.email || "";
    document.getElementById("phone").value = user.phone || "";
    document.getElementById("address").value = user.address || "";

  } catch (err) {
    console.error("loadUser error:", err);
  }
}

function getCart() {
  const user = JSON.parse(localStorage.getItem("user"));
  const key = user ? `cart_${user.id}` : "cart_guest";
  return JSON.parse(localStorage.getItem(key)) || [];
}

function renderCart() {

  const cart = getCart();

  const el =
    document.getElementById("checkout-cart");

  if (!cart.length) {

    el.innerHTML =
      "<p>Giỏ hàng trống</p>";

    return;
  }

  let subtotal = 0;

  el.innerHTML = cart.map(item => {

    subtotal +=
      item.price * item.quantity;

    let optionHtml = "";

    const opt = item.options || {};

    if(opt.extraRice){
        optionHtml += "Cơm thêm (+5.000đ)<br>";
    }

    if(opt.extraNoodle){
        optionHtml += "Bún thêm (+5.000đ)<br>";
    }

    if(opt.extraMi){
        optionHtml += "Mì thêm (+5.000đ)<br>";
    }

    if(opt.extraIce){
        optionHtml += "Thêm đá<br>";
    }

    if(opt.spicyLevel){
        optionHtml += `${opt.spicyLevel}<br>`;
    }

    if(opt.note){
        optionHtml += `📝 ${opt.note}<br>`;
    }

    return `
    <div class="checkout-item">

    <div class="checkout-item-info">

        <b>${item.name}</b><br>

        ${optionHtml}

        ${
            item.note
            ?
            `<br>📝 ${item.note}`
            :
            ""
        }

        <br>

        ${item.quantity} x
        ${Number(item.price).toLocaleString("vi-VN")}đ

    </div>

    <img
    src="${item.thumbnail}"
    class="checkout-item-img"
    >

    </div>
    `;

  }).join("");


  let shipping = subtotal >= 150000 ? 0 : 15000;



  const total =
    subtotal + shipping;



  let shippingText = "";

if (subtotal >= 150000) {

  shippingText =
    "0đ (Miễn phí đơn từ 150k)";

} else {

  shippingText =
    shipping.toLocaleString("vi-VN") + "đ";

}

el.innerHTML += `

<hr>

<div class="checkout-total">

  <div>
    Tiền món:
    <b>${subtotal.toLocaleString("vi-VN")}đ</b>
  </div>

  <div>
    Phí ship:
    <b>${shippingText}</b>
  </div>

  <div class="mt-2 fs-5">

    Tổng thanh toán:
    <b class="text-danger">
      ${total.toLocaleString("vi-VN")}đ
    </b>

  </div>

</div>

`;
}

async function placeOrder() {
  if (isSubmitting) return;

  const user = JSON.parse(localStorage.getItem("user"));
  const cart = getCart();

if (!cart.length) {
  alert("Giỏ hàng trống");
  return;
}

  const full_name = document.getElementById("full_name").value;
  const phone = document.getElementById("phone").value;
  const address = document.getElementById("address").value;
  const payment_method = selectedPayment;

const deliveryDateOption =
document.getElementById("delivery_date").value;

const today = new Date();

if (deliveryDateOption === "tomorrow") {
  today.setDate(today.getDate() + 1);
}

const delivery_date =
today.toISOString().split("T")[0];

const delivery_time =
document.getElementById("delivery_time").value;

let subtotal = 0;

cart.forEach(item => {
    subtotal += item.price * item.quantity;
});


const shipping_fee = subtotal >= 150000 ? 0 : 15000;

  if (!full_name || !phone || !address) {
    alert("Vui lòng nhập đầy đủ thông tin");
    return;
  }

  // update user
  try {
    await fetch("/api/users/me", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("token")
      },
      body: JSON.stringify({ full_name, phone, address })
    });
  } catch (e) {}

  // lưu dữ liệu tạm
  pendingOrderData = {
    user_id: user.id,
    receiver_name: full_name,
    receiver_phone: phone,
    delivery_address: address,
    payment_method,
    shipping_fee,
    delivery_date,
    delivery_time,
    items: cart.map(i => ({
      product_id: i.id,
      quantity: i.quantity,
      price: i.price,
      options: i.options || {}
    }))
  };

  // COD
  if (payment_method === "cod") {
  if (isSubmitting) return;

  isSubmitting = true;

  try {
    await createOrder(pendingOrderData);
  } finally {
    isSubmitting = false;
  }

  return;
}

  // PAYMENT METHODS
  let title = "";
  let logo = "";
  let qrData = "";


const orderCode =
  `DH_${Date.now()}_${user.id}`;

  if (payment_method === "bank_transfer") {
    title = "Chuyển khoản Vietcombank";
    logo = "/images/logo/vietcombank.jpg";
  }

  if (payment_method === "momo") {
    title = "MoMo";
    logo = "/images/logo/momo.png";
  }

  if (payment_method === "zalopay") {
    title = "ZaloPay";
    logo = "/images/logo/zalopay.png";
  }

  if (payment_method === "payment_gateway") {
    title = "VNPay";
    logo = "/images/logo/vnpay.png";
  }

  qrData = orderCode;

  // SET UI
  document.getElementById("paymentTitle").innerText = title;
  document.getElementById("paymentLogo").src = logo;

document.getElementById("transferContent").innerText =
`
Mã đơn: ${orderCode}
Ngân hàng: Vietcombank
STK: 0123456789
Tên TK: CƠM TRƯA ONLINE
`;

  document.getElementById("qrImage").src =
    "https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=" +
    encodeURIComponent(orderCode);

  requestAnimationFrame(() => {
  document.getElementById("paymentLoading").style.display = "none";
  document.getElementById("paymentContent").style.display = "block";
});

const modal = new bootstrap.Modal(
  document.getElementById("bankModal"),
  {
    backdrop: "static",
    keyboard: false
  }
);

  modal.show();

document.getElementById("paymentLoading").style.display = "block";
document.getElementById("paymentContent").style.display = "none";

startCountdown();
}


async function createOrder(orderData) {

  const res = await fetch(
    "/api/orders",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(orderData)
    }
  );

  const data = await res.json();

  if (!res.ok) {
    alert(data.message || "Đặt hàng thất bại");
    return;
  }

  localStorage.setItem(
    "last_order_id",
    data.order_id
  );

  localStorage.removeItem(
    `cart_${user.id}`
  );

  window.location.href =
    "/pages/payment-success.html";
}

async function confirmPayment() {
  if (isSubmitting) return;

  clearInterval(countdownInterval);

  isSubmitting = true;

  await createOrder(pendingOrderData);

  isSubmitting = false;
}


function startCountdown() {
  clearInterval(countdownInterval);

  timeLeft = 900;
  updateCountdown();

  countdownInterval = setInterval(() => {
    timeLeft--;

    updateCountdown();

    if (timeLeft <= 0) {
      clearInterval(countdownInterval);

      alert("Hết thời gian thanh toán");

      const modalEl = document.getElementById("bankModal");
      const modal = bootstrap.Modal.getInstance(modalEl);

      modal.hide();

      pendingOrderData = null;
      isSubmitting = false;
    }
  }, 1000);
}


function updateCountdown() {
  const el = document.getElementById("countdown");
  if (!el) return;

  const min = Math.floor(timeLeft / 60);
  const sec = timeLeft % 60;

  el.innerText =
    String(min).padStart(2, "0") +
    ":" +
    String(sec).padStart(2, "0");
}


document.querySelectorAll(".payment-option").forEach(el => {
  el.addEventListener("click", () => {

    document.querySelectorAll(".payment-option")
      .forEach(x => x.classList.remove("active"));

    el.classList.add("active");

    document.getElementById("payment_method").value =
      el.dataset.method;
  });
});

document.querySelectorAll(".payment-item").forEach(item => {
  item.addEventListener("click", () => {

    const method = item.dataset.method;

    if (selectedPayment === method) {
      selectedPayment = null;
      item.classList.remove("active");
      return;
    }

    selectedPayment = method;

    document.querySelectorAll(".payment-item")
      .forEach(i => i.classList.remove("active"));

    item.classList.add("active");
  });
});

function cancelPayment(){
  clearInterval(countdownInterval);
  const modal = bootstrap.Modal.getInstance(document.getElementById("bankModal"));
  modal.hide();
  pendingOrderData = null;
}




loadUser();
renderCart();