function renderStatus(status){

switch(status){

case "waiting_payment":
return "Chờ thanh toán";

case "pending":
return "Chờ xác nhận";

case "confirmed":
return "Đã xác nhận";

case "shipping":
return "Đang giao";

case "completed":
return "Hoàn thành";

case "cancelled":
return "Đã hủy";

default:
return status;

}

}


async function loadOrders() {

  const res = await fetch(
    "/api/orders"
  );

  const orders = await res.json();

  const tbody =
    document.getElementById(
      "order-list"
    );

  tbody.innerHTML =
    orders.map(order => `

      <tr>

        <td>${order.id}</td>

        <td>
          ${order.receiver_name}
        </td>

        <td>
          ${order.receiver_phone}
        </td>

        <td>
        ${Number(order.total_amount)
        .toLocaleString("vi-VN")}đ
        </td>

        <td>
        ${
        Number(order.shipping_fee) === 0
        ? "0đ (Miễn phí đơn từ 150k)"
        : Number(order.shipping_fee).toLocaleString("vi-VN") + "đ"
        }
        </td>
        
        <td>
        ${order.delivery_time || ""}
        </td>

        <td>
        ${renderStatus(order.status)}
        </td>

        <td>
          ${new Date(
            order.created_at
          ).toLocaleString("vi-VN")}
        </td>

        <td>

          <button
            class="btn btn-primary btn-sm"
            onclick="
              viewDetail(
                ${order.id}
              )
            "
          >
            Xem
          </button>

        </td>

        <td>

        <select
        class="form-select form-select-sm"
        onchange="updateStatus(${order.id},this.value)"
        >

        <option
        value="waiting_payment"
        ${order.status==="waiting_payment"?"selected":""}
        >
        Chờ thanh toán
        </option>

        <option
        value="pending"
        ${order.status==="pending"?"selected":""}
        >
        Chờ xác nhận
        </option>

        <option
        value="confirmed"
        ${order.status==="confirmed"?"selected":""}
        >
        Đã xác nhận
        </option>

        <option
        value="shipping"
        ${order.status==="shipping"?"selected":""}
        >
        Đang giao
        </option>

        <option
        value="completed"
        ${order.status==="completed"?"selected":""}
        >
        Hoàn thành
        </option>

        <option
        value="cancelled"
        ${order.status==="cancelled"?"selected":""}
        >
        Đã hủy
        </option>

        </select>

        </td>

      </tr>

    `).join("");

}

async function viewDetail(id) {

  const res = await fetch(
    `/api/orders/${id}`
  );

  const data = await res.json();
  const order = data.order;
  const items = data.items;

let html = `

<h5>

Thông tin đơn hàng

</h5>

<table class="table table-bordered">

<tr>

<th>Người nhận</th>

<td>

${order.receiver_name}

</td>

</tr>

<tr>

<th>SĐT</th>

<td>

${order.receiver_phone}

</td>

</tr>

<tr>

<th>Địa chỉ</th>

<td>

${order.delivery_address}

</td>

</tr>

<tr>

<th>Thanh toán</th>

<td>

${order.payment_method}

</td>

</tr>

<tr>

<th>Khung giờ</th>

<td>

${order.delivery_time}

</td>

</tr>

<tr>

<th>Phí ship</th>

<td>

${
Number(order.shipping_fee)===0
?
"0đ (Miễn phí đơn từ 150k)"
:
Number(order.shipping_fee).toLocaleString("vi-VN")+"đ"
}

</td>

</tr>

<tr>

<th>Trạng thái</th>

<td>

${renderStatus(order.status)}

</td>

</tr>

</table>

<hr>

<h5>

Danh sách món

</h5>

`;

items.forEach(item=>{

html += `

<div class="order-item">

<div class="order-left">

<img src="${item.thumbnail}">

<div>

<div class="order-name">

${item.name}

</div>

<div>

SL:

${item.quantity}

</div>

</div>

</div>

<div>

${Number(item.price*item.quantity)

.toLocaleString("vi-VN")}đ

</div>

</div>

`;

});

html += `

<div class="order-total">

Tổng thanh toán:

${Number(order.total_amount)

.toLocaleString("vi-VN")}đ

</div>

`;

document.getElementById(

"order-detail-content"

).innerHTML = html;

bootstrap.Modal

.getOrCreateInstance(

document.getElementById(

"orderDetailModal"

)

).show();

}

async function updateStatus(id,status){

await fetch(
`/api/orders/${id}/status`,
{
method:"PUT",

headers:{
"Content-Type":"application/json"
},

body:JSON.stringify({
status
})
}
);

await loadOrders();

}

loadOrders();