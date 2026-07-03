const db = require("../config/db");

exports.getAllOrders = async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT
        o.id,
        o.user_id,
        o.receiver_name,
        o.receiver_phone,
        o.delivery_address,
        o.payment_method,
        o.shipping_fee,
        o.delivery_date,
        o.delivery_time,
        o.customer_note,
        o.total_amount,
        o.status,
        o.created_at
      FROM orders o
      ORDER BY o.created_at DESC
    `);
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Lỗi máy chủ"
    });
  }
};


exports.getMyOrders = async (req, res) => {

  try {

    const userId = req.user.id;

    const [rows] = await db.query(
      `
      SELECT
        id,
        receiver_name,
        receiver_phone,
        delivery_address,
        payment_method,
        shipping_fee,
        delivery_date,
        delivery_time,
        customer_note,
        total_amount,
        status,
        created_at

      FROM orders

      WHERE user_id = ?

      ORDER BY created_at DESC
      `,
      [userId]
    );

    res.json(rows);

  } catch (err) {

    console.error(err);

    res.status(500).json({
      message:"Lỗi máy chủ"
    });

  }

};


exports.getMyOrderDetail = async (req, res) => {

  try {

    const userId = req.user.id;

    const orderId = req.params.id;

    // kiểm tra đơn có thuộc user không

    const [orders] = await db.query(`
      SELECT
        id,
        receiver_name,
        receiver_phone,
        delivery_address,
        payment_method,
        shipping_fee,
        delivery_date,
        delivery_time,
        customer_note,
        total_amount,
        status,
        created_at
      FROM orders
      WHERE id = ?
      AND user_id = ?
    `, [orderId, userId]);

    if (!orders.length) {
      return res.status(404).json({
        message: "Không tìm thấy đơn hàng"
      });
    }

    const [items] = await db.query(`
      SELECT
        od.product_id,
        od.quantity,
        od.price,
        od.options,
        p.name,
        p.thumbnail
      FROM order_details od
      JOIN products p
        ON od.product_id = p.id
      WHERE od.order_id = ?
    `, [orderId]);
    res.json({
      order: orders[0],
      items
    });

  } catch (err) {

    console.error(err);

    res.status(500).json({
      message: "Lỗi máy chủ"
    });

  }

};


exports.getOrderDetail = async (req, res) => {

try {

const orderId = req.params.id;

    const [orders] = await db.query(
    `
    SELECT
    id,
    receiver_name,
    receiver_phone,
    delivery_address,
    payment_method,
    shipping_fee,
    delivery_date,
    delivery_time,
    customer_note,
    total_amount,
    status,
    created_at
    FROM orders
    WHERE id = ?
    `,
    [orderId]
    );
    if (!orders.length) {
    return res.status(404).json({
    message:"Không tìm thấy đơn hàng"
    });
}

    const [items] = await db.query(
    `
    SELECT
    od.product_id,
    od.quantity,
    od.price,
    od.options,
    p.name,
    p.thumbnail
    FROM order_details od
    JOIN products p
    ON od.product_id=p.id
    WHERE od.order_id=?
    `,
    [orderId]
    );
    res.json({
    order:orders[0],
    items
});
}

catch(err){

console.error(err);

res.status(500).json({

message:"Lỗi máy chủ"

});

}

};

exports.updateOrderStatus = async (req, res) => {
  try {

    const { id } = req.params;
    const { status } = req.body;

    // Lấy trạng thái hiện tại
    const [orders] = await db.query(
      `
      SELECT status
      FROM orders
      WHERE id = ?
      `,
      [id]
    );

    if (!orders.length) {
      return res.status(404).json({
        message: "Không tìm thấy đơn hàng"
      });
    }

    const oldStatus = orders[0].status;

    // Chỉ trừ kho lần đầu xác nhận
    if (
      oldStatus !== "confirmed" &&
      status === "confirmed"
    ) {

      const [details] = await db.query(
        `
        SELECT
          product_id,
          quantity
        FROM order_details
        WHERE order_id = ?
        `,
        [id]
      );

      for (const item of details) {

        await db.query(
          `
          UPDATE products
          SET stock = GREATEST(
            stock - ?,
            0
          )
          WHERE id = ?
          `,
          [
            item.quantity,
            item.product_id
          ]
        );

      }

    }

    await db.query(
      `
      UPDATE orders
      SET status = ?
      WHERE id = ?
      `,
      [
        status,
        id
      ]
    );

    res.json({
      message: "Cập nhật thành công"
    });

  } catch (err) {

    console.error(err);

    res.status(500).json(err);
  }
};



exports.cancelMyOrder = async (req, res) => {

  try {

    const userId = req.user.id;
    const orderId = req.params.id;

    // kiểm tra đơn thuộc user
    const [orders] = await db.query(
      `
      SELECT status
      FROM orders
      WHERE id = ?
      AND user_id = ?
      `,
      [orderId, userId]
    );

    if (!orders.length) {
      return res.status(404).json({
        message: "Không tìm thấy đơn hàng"
      });
    }

    // chỉ cho hủy khi đang chờ xác nhận
    if (orders[0].status !== "pending") {
      return res.status(400).json({
        message: "Đơn hàng không thể hủy"
      });
    }

    await db.query(
      `
      UPDATE orders
      SET status = 'cancelled'
      WHERE id = ?
      `,
      [orderId]
    );

    res.json({
      message: "Hủy đơn thành công"
    });

  } catch (err) {

    console.error(err);

    res.status(500).json({
      message: "Lỗi máy chủ"
    });

  }

};



exports.createOrder = async (req, res) => {
  try {
    const {

    user_id,
    receiver_name,
    receiver_phone,
    delivery_address,
    payment_method,
    items,
    shipping_fee,
    delivery_date,
    delivery_time,
    customer_note
    } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ message: "Giỏ hàng trống" });
    }

    let total_amount = 0;

    // 1. tính tổng tiền
    for (const item of items) {
        total_amount += item.price * item.quantity;
}
        total_amount += Number(shipping_fee || 0);

    
    // 2. tạo order
    let status = "pending";

if (
  payment_method !== "cod"
) {
  status = "waiting_payment";
}

const [orderResult] = await db.query(`
INSERT INTO orders (
  user_id,
  receiver_name,
  receiver_phone,
  delivery_address,
  payment_method,
  shipping_fee,
  delivery_date,
  delivery_time,
  customer_note,
  total_amount,
  status
)
VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
`, [
  user_id,
  receiver_name,
  receiver_phone,
  delivery_address,
  payment_method,
  shipping_fee,
  delivery_date,
  delivery_time,
  customer_note,
  total_amount,
  status
]);

    const orderId = orderResult.insertId;

    // 3. insert order details
    for (const item of items) {
      await db.query(`
      INSERT INTO order_details (
        order_id,
        product_id,
        quantity,
        price,
        options
      )
      VALUES (?, ?, ?, ?, ?)
      `, [
        orderId,
        item.product_id,
        item.quantity,
        item.price,
        JSON.stringify(item.options || {})
      ]);
    }

    res.json({
      message: "Đặt hàng thành công",
      order_id: orderId
    });

  } catch (err) {
    res.status(500).json(err);
  }
};

