async function loadOrders() {

const token =
localStorage.getItem("token");

if (!token) {

location.href =
"/pages/login.html";

return;

}

const res =
await fetch(
"/api/orders/my",
{
headers:{
Authorization:
"Bearer " + token
}
}
);

const orders =
await res.json();

const el =
document.getElementById(
"order-list"
);

if (!orders.length){

el.innerHTML=`
<div class="alert alert-info">
Bạn chưa có đơn hàng nào.
</div>
`;

return;

}

el.innerHTML =
orders.map(order=>`

<div class="card mb-3">

<div class="card-body">

<div class="row">

<div class="col-md-8">

<h5>

Đơn #${order.id}

</h5>

<p>

Ngày đặt:
${new Date(order.created_at)
.toLocaleString("vi-VN")}

</p>

<p>

Khung giờ giao:
<b>

${order.delivery_time || "Chưa chọn"}

</b>

</p>

<p>

Phí ship:
<b>

${
Number(order.shipping_fee) === 0
? "0đ (Miễn phí đơn từ 150k)"
: Number(order.shipping_fee).toLocaleString("vi-VN") + "đ"
}

</b>

</p>

<p>

Thanh toán:

<b>

${order.payment_method}

</b>

</p>

</div>

<div class="col-md-4 text-end">

<h5 class="text-danger">

${Number(order.total_amount)
.toLocaleString("vi-VN")}đ

</h5>

<p>

<b>

${renderStatus(order.status)}

</b>

</p>

<button
class="btn btn-primary"
onclick="viewDetail(${order.id})">

Xem chi tiết

</button>

</div>

</div>

</div>

</div>

`).join("");

}

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

async function viewDetail(id){

const token =
localStorage.getItem("token");

const res =
await fetch(
"/api/orders/my/"+id,
{
headers:{
Authorization:
"Bearer "+token
}
}
);

const data =
await res.json();

const order =
data.order;

const items =
data.items;

let html=`

<h5>

Thông tin giao hàng

</h5>

<table class="table table-bordered">

<tr>

<th>Người nhận</th>

<td>${order.receiver_name}</td>

</tr>

<tr>

<th>SĐT</th>

<td>${order.receiver_phone}</td>

</tr>

<tr>

<th>Địa chỉ</th>

<td>${order.delivery_address}</td>

</tr>

<tr>

<th>Khung giờ</th>

<td>${order.delivery_time}</td>

</tr>

<tr>

<th>Phí ship</th>

<td>

${
Number(order.shipping_fee) === 0
? "0đ (Miễn phí đơn từ 150k)"
: Number(order.shipping_fee).toLocaleString("vi-VN") + "đ"
}

</td>

</tr>

<tr>

<th>Thanh toán</th>

<td>${order.payment_method}</td>

</tr>

<tr>

<th>Trạng thái</th>

<td>

${renderStatus(order.status)}

</td>

</tr>

</table>

<h5>

Danh sách món

</h5>

`;

items.forEach(item=>{

html+=`

<div
class="d-flex
justify-content-between
align-items-center
border-bottom
py-2">

<div class="d-flex">

<img
src="${item.thumbnail}"
style="
width:80px;
height:80px;
object-fit:cover;
margin-right:15px;
">

<div>

<div>

<b>

${item.name}

</b>

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

html+=`

<h4
class="text-end
mt-4
text-danger">

Tổng:

${Number(order.total_amount)
.toLocaleString("vi-VN")}đ

</h4>

`;

document.getElementById(
"order-detail"
).innerHTML=html;

bootstrap.Modal
.getOrCreateInstance(
document.getElementById(
"orderModal"
)
)
.show();

}

loadOrders();