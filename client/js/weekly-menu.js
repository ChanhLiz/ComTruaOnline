const user = JSON.parse(
  localStorage.getItem("user")
);
const isAdmin =
  user && user.role === "admin";
const todayLabel = document.getElementById("today-label");
const weekdayTabs = document.getElementById("weekday-tabs");
const weeklyMenuList = document.getElementById("weekly-menu-list");
const adminActions =
  document.getElementById(
    "admin-actions"
  );
if (isAdmin && adminActions) {
  adminActions.innerHTML = `
    <button
      class="btn btn-success"
      onclick="showAddMenuForm()"
    >
      + Thêm món vào thực đơn
    </button>
  `;


}
const weekdays = [
  "Chủ nhật",
  "Thứ 2",
  "Thứ 3",
  "Thứ 4",
  "Thứ 5",
  "Thứ 6",
  "Thứ 7"
];

// JS: 0 = Chủ nhật
// DB: 1 = Thứ 2 ... 7 = Chủ nhật
function getCurrentDay() {
  const day = new Date().getDay();

  return day === 0 ? 7 : day;
}

const today = getCurrentDay();

let selectedDay = today;

function getTomorrowDay(day){
    return day === 7 ? 1 : day + 1;
}
const tomorrow = getTomorrowDay(today);

let allMenus = [];

async function loadWeeklyMenu() {
  try {
    const res = await fetch(
      "/api/weekly-menu"
    );

    allMenus = await res.json();

    renderTabs();
    renderTodayLabel();
    renderMenu(selectedDay);

  } catch (err) {
    console.error(err);

    weeklyMenuList.innerHTML = `
      <div class="col-12 text-center text-danger">
        Không thể tải thực đơn tuần
      </div>
    `;
  }
}

function renderTodayLabel() {

    const now = new Date();

    const weekdays = [
        "Chủ nhật",
        "Thứ 2",
        "Thứ 3",
        "Thứ 4",
        "Thứ 5",
        "Thứ 6",
        "Thứ 7"
    ];

    const weekday = weekdays[now.getDay()];

    const date =
        String(now.getDate()).padStart(2, "0");

    const month =
        String(now.getMonth() + 1).padStart(2, "0");

    const year = now.getFullYear();

    todayLabel.innerHTML = `
        <span class="badge bg-success fs-6 px-3 py-2">
            Hôm nay là ${weekday} (${date}/${month}/${year})
        </span>
    `;
}

function renderTabs() {
  let html = "";

  for (let day = 1; day <= 7; day++) {

    const text = day === 7
      ? "CN"
      : `T${day + 1}`;

    html += `
  <button
    type="button"
    class="btn ${
      day === selectedDay
        ? "btn-success"
        : "btn-outline-success"
    } weekday-btn"
    data-day="${day}"
  >
    ${text}
  </button>
`;
  }

  weekdayTabs.innerHTML = html;

  document.querySelectorAll(".weekday-btn")
    .forEach(btn => {

      btn.addEventListener("click", () => {

        selectedDay = Number(btn.dataset.day);

            renderTabs();
            renderMenu(selectedDay);
      });

    });
}

function renderMenu(day) {

  const menus = getFilteredMenus(day);

  if (!menus.length) {
    weeklyMenuList.innerHTML = `
      <div class="col-12 text-center text-muted">
        Không có trong thực đơn
      </div>
    `;
    return;
  }

  let html = "";

  menus.forEach(product => {

    html += `
      <div class="col-md-4 mb-4">
        <div class="card shadow-sm product-card h-100">
          <img
            src="${product.thumbnail}"
            class="card-img-top"
            alt="${product.name}"
          >

          <div class="card-body">

            <h5 class="fw-bold">
              ${product.name}
            </h5>

            <p class="text-muted mb-2">
              ${product.description || ""}
            </p>

            ${
              product.discount_percent > 0
                ? `
                <span class="badge bg-danger mb-2">
                  -${product.discount_percent}%
                </span>
                `
                : ""
            }
            <div>

  ${
    Number(product.discount_percent) > 0
      ? `
      <small class="text-decoration-line-through text-muted">
      ${Number(product.old_price || 0)
      .toLocaleString("vi-VN")}đ
      </small>
      `
      : ""
  }

  <h5 class="text-danger mt-1">
  ${Number(product.new_price).toLocaleString("vi-VN")}đ

  <small class="${
  product.stock > 0
    ? "text-secondary"
    : "text-danger fw-bold"
}">
  |
  ${
    product.stock > 0
      ? `Còn lại ${product.stock} suất`
      : "HẾT HÀNG"
  }
</small>
</h5>
</div>

            <div class="d-grid gap-2 mt-3">

              ${
                isAdmin
                  ? `
                  <button
                    class="btn btn-warning"
                    onclick='editPrice(${JSON.stringify(product)})'
                  >
                    Sửa thông tin món
                  </button>

                  <button
                    class="btn btn-danger"
                    onclick="deleteMenu(${product.weekly_menu_id})"
                  >
                    Xóa khỏi thực đơn
                  </button>
                  `
                  : ""
              }

              <a
                href="/pages/product-detail.html?id=${product.id}"
                class="btn btn-success"
              >
                Xem chi tiết
              </a>

${
  (selectedDay !== today)
  ? `
    <button class="btn btn-secondary" disabled>
      CHƯA BÁN
    </button>
  `
  : product.stock > 0
    ? `
      <button
        class="btn btn-outline-primary"
        onclick="addToCart({
        id:${product.id},
        name:'${product.name.replace(/'/g,"\\'")}',
        new_price:${product.new_price},
        thumbnail:'${product.thumbnail}',
        category_id:${product.category_id}
      })"
      >
        Thêm vào giỏ hàng
      </button>
    `
    : `
      <button class="btn btn-secondary" disabled>
        Hết hàng
      </button>
    `
}
            </div>
          </div>
        </div>
      </div>
    `;
  });

  weeklyMenuList.innerHTML = html;
}

document.addEventListener(
  "DOMContentLoaded",
  loadWeeklyMenu
);

const searchInput = document.getElementById("search-input");
const categoryFilter = document.getElementById("category-filter");
const sortSelect = document.getElementById("sort-select");

function getFilteredMenus(day) {

  let menus = allMenus.filter(
  item => Number(item.day_of_week) === day
  );

  const keyword = searchInput.value.toLowerCase();
  const category = categoryFilter.value;
  const sort = sortSelect.value;

  menus = menus.filter(item =>
    item.name.toLowerCase().includes(keyword)
  );

  if (category) {
    menus = menus.filter(
      item => item.category_name === category
    );
  }

  if (sort === "price-asc") {
    menus.sort((a, b) => a.new_price - b.new_price);
  }

  if (sort === "price-desc") {
    menus.sort((a, b) => b.new_price - a.new_price);
  }

  return menus;
}

searchInput.addEventListener("input", () => {
  renderMenu(selectedDay);
});

categoryFilter.addEventListener("change", () => {
  renderMenu(selectedDay);
});

sortSelect.addEventListener("change", () => {
  renderMenu(selectedDay);
});
  loadWeeklyMenu();

async function editPrice(product) {
  const oldPrice = prompt(
    "Giá gốc:",
    product.old_price
  );

  if (oldPrice === null) return;

  const discount = prompt(
    "Giảm giá % (0 nếu không giảm):",
    product.discount_percent
  );

  if (discount === null) return;

  const stock = prompt(
    "Số lượng còn lại:",
    product.stock
  );

  if (stock === null) return;

  const description = prompt(
    "Mô tả món ăn:",
    product.description || ""
  );

  if (description === null) return;

  const res = await fetch(
    `/api/products/${product.id}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        old_price: Number(oldPrice),
        discount_percent: Number(discount),
        stock: Number(stock),
        description
      })
    }
  );
  const data = await res.json();
  alert(data.message);
  loadWeeklyMenu();
}


async function deleteMenu(id) {

  const ok = confirm(
    "Xóa món khỏi thực đơn?"
  );

  if (!ok) return;

  const res = await fetch(
    `/api/weekly-menu/${id}`,
    {
      method: "DELETE"
    }
  );

  const data = await res.json();
  alert(data.message);
  loadWeeklyMenu();
}


let allProducts = [];
let selectedProductId = null;

async function showAddMenuForm(){

    const res = await fetch("/api/products");
    allProducts = await res.json();
    renderProductList(allProducts);
    document.getElementById("searchProduct").value="";

    const modal =
        bootstrap.Modal.getOrCreateInstance(
            document.getElementById("addMenuModal")
        );

    modal.show();

}

function renderProductList(products){

    const list =
        document.getElementById("productList");

    list.innerHTML = "";
    products.forEach(product=>{
        list.innerHTML += `
            <div
                class="list-group-item product-item"
                data-id="${product.id}"
            >
                ${product.id} - ${product.name}
            </div>
        `;
    });
}

document.addEventListener("click", function(e){
    if(!e.target.classList.contains("product-item"))
        return;
    document.querySelectorAll(".product-item")
        .forEach(item => item.classList.remove("active"));
    e.target.classList.add("active");
    selectedProductId =
        Number(e.target.dataset.id);
});

document.addEventListener("input",function(e){

    if(e.target.id!=="searchProduct") return;

    const keyword =
        e.target.value.toLowerCase();

    const filtered =
        allProducts.filter(product=>

            product.name
            .toLowerCase()
            .includes(keyword)

        );

    renderProductList(filtered);

});

async function submitAddMenu(){

    const product_id = selectedProductId;

    const day_of_week =
        Number(
            document.getElementById("daySelect").value
        );

    if(!product_id){

        alert("Vui lòng chọn món.");

        return;

    }

    const res =
        await fetch("/api/weekly-menu",{

            method:"POST",

            headers:{
                "Content-Type":"application/json"
            },

            body:JSON.stringify({

                product_id,
                day_of_week

            })

        });

    const data =
        await res.json();

    alert(data.message);

    bootstrap.Modal
        .getInstance(
            document.getElementById("addMenuModal")
        )
        .hide();

    loadWeeklyMenu();

}


async function loadOrders() {

  const container =
    document.getElementById(
      "admin-order-section"
    );

  const res = await fetch(
    "/api/orders"
  );

  const orders =
    await res.json();

  let html = `
    <div class="card shadow">

      <div class="card-header bg-primary text-white">
        <h4 class="mb-0">
          Danh sách đơn hàng
        </h4>
      </div>

      <div class="card-body">

      <table class="table table-bordered">

        <thead>

          <tr>
            <th>ID</th>
            <th>Khách hàng</th>
            <th>Tổng tiền</th>
            <th>Trạng thái</th>
            <th></th>
          </tr>

        </thead>

        <tbody>
  `;

  orders.forEach(order => {

    html += `
      <tr>

        <td>${order.id}</td>

        <td>
          ${order.customer_name}
        </td>

        <td>
          ${Number(order.total_price)
            .toLocaleString("vi-VN")}đ
        </td>

        <td>
          ${order.status}
        </td>

        <td>

          <button
            class="btn btn-success btn-sm"
            onclick="confirmOrder(${order.id})"
          >
            Xác nhận
          </button>

        </td>

      </tr>
    `;
  });

  html += `
        </tbody>
      </table>

      </div>

    </div>
  `;

  container.innerHTML = html;

  container.scrollIntoView({
    behavior: "smooth"
  });
}
async function confirmOrder(id) {

  const res = await fetch(
    `/api/orders/${id}/status`,
    {
      method: "PUT",
      headers: {
        "Content-Type":
          "application/json"
      },
      body: JSON.stringify({
        status: "confirmed"
      })
    }
  );

  const data =
    await res.json();

  alert(data.message);

  loadOrders();
}