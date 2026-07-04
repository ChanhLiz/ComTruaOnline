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

case "delivered":
return "Đã giao";

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
        data-old-status="${order.status}"
        onchange="updateStatus(${order.id},this)">
        

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
        value="delivered"
        ${order.status==="delivered"?"selected":""}
        >
        Đã giao
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
<th>
Ngày giao
</th>
<td>
${new Date(order.delivery_date)
.toLocaleDateString("vi-VN")}
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
SL: ${item.quantity}
</div>

${
item.options
?
renderOptions(item.options)
:
""
}
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

async function updateStatus(id, select){

    const oldStatus =
        select.dataset.oldStatus;

    const newStatus =
        select.value;

    const flow = [
        "waiting_payment",
        "pending",
        "confirmed",
        "shipping",
        "delivered",
        "completed"
    ];

    if(newStatus === "cancelled"){

        showConfirm(
            "Không thể chọn trạng thái này.",
            null,
            "Thông báo"
        );

        select.value = oldStatus;
        return;
    }

    const oldIndex =
        flow.indexOf(oldStatus);

    const newIndex =
        flow.indexOf(newStatus);

    if(newIndex !== oldIndex + 1){

        showConfirm(
            "Không thể chọn trạng thái này.",
            null,
            "Thông báo"
        );

        select.value = oldStatus;
        return;
    }

    showConfirm(
        "Bạn muốn đổi trạng thái đơn hàng này?",
        async()=>{

            const res = await fetch(

                `/api/orders/${id}/status`,
                {
                    method:"PUT",
                    headers:{
                        "Content-Type":"application/json"
                    },
                    body:JSON.stringify({
                        status:newStatus
                    })
                }
            );

            const data =
                await res.json();

            if(!res.ok){
                showConfirm(
                    data.message,
                    null,
                    "Thông báo"
                );
                select.value =
                    oldStatus;
                return;
            }

            await loadOrders();

            showConfirm(
                "Đã cập nhật trạng thái.",
                null,
                "Thành công"
            );
        },
        "Xác nhận"
    );
    select.value = oldStatus;
}


function renderOptions(options){

    if(typeof options === "string"){

        try{
            options = JSON.parse(options);
        }catch(e){
            options = {};
        }

    }

    let html = "";

    if(options.extraRice){

        html += `
        <div class="text-success small">
            Cơm thêm (+5.000đ)
        </div>
        `;

    }

    if(options.extraNoodle){

        html += `
        <div class="text-success small">
            Bún thêm (+5.000đ)
        </div>
        `;

    }

    if(options.extraMi){

        html += `
        <div class="text-success small">
            Mì thêm (+5.000đ)
        </div>
        `;

    }

    if(options.extraIce){

        html += `
        <div class="text-success small">
            Thêm đá
        </div>
        `;

    }

    if(options.spicyLevel){

        html += `
        <div class="small">
            ${options.spicyLevel}
        </div>
        `;

    }


    if(options.note){

        html += `
        <div class="small">
            📝 ${options.note}
        </div>
        `;

    }

    return html;

}

loadOrders();