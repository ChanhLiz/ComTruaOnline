document.addEventListener("DOMContentLoaded", () => {
  loadProduct();
});

async function loadProduct() {
  const container = document.getElementById("product-detail");

  const params = new URLSearchParams(window.location.search);
  const id = params.get("id");

  if (!id) {
    container.innerHTML = "<h4>Không tìm thấy sản phẩm</h4>";
    return;
  }

  try {
    const res = await fetch(`/api/products/${id}`);
    if (!res.ok) throw new Error("API lỗi");

    const product = await res.json();

    const img = product.thumbnail
      ? product.thumbnail
      : "https://placehold.co/600x400";

    container.innerHTML = `
  <div class="row">

    <div class="col-md-6">
      <img src="${img}" class="img-fluid rounded shadow">
    </div>

    <div class="col-md-6">

      <h2>${product.name}</h2>

      <p>${product.description}</p>

      <h4 class="text-danger">

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

</h4>

<button
  id="addToCartBtn"
  class="btn ${
    product.stock > 0
      ? "btn-success"
      : "btn-secondary"
  } btn-lg mt-3"
  ${product.stock <= 0 ? "disabled" : ""}
>
  ${
    product.stock > 0
      ? "Thêm vào giỏ hàng"
      : "Hết hàng"
  }
</button>

    </div>

  </div>

  <hr class="my-5">

  <div id="review-section">

    <h3>Đánh giá</h3>

    <div
      id="review-stats"
      class="mb-4"
    >
      Đang tải...
    </div>

    <div
      id="review-form-container"
      class="mb-4"
    >
    </div>

    <div id="review-list">
      Đang tải đánh giá...
    </div>

  </div>
`;

    // CHỜ DOM RENDER XONG
    if(product.stock > 0){

  document
    .getElementById("addToCartBtn")
    .addEventListener("click", function(){
    window.addToCart(product);
    });
}

      loadReviewStats(id);
      loadReviews(id);
      renderReviewForm(id);

  } catch (err) {
    console.error(err);
    container.innerHTML = "<h4>Lỗi tải sản phẩm</h4>";
  }
}


async function loadReviewStats(productId) {

  try {

    const res = await fetch(
      `/api/reviews/product/${productId}/stats`
    );

    const data = await res.json();

    document.getElementById("review-stats").innerHTML = `
      <div class="fs-5">
        ⭐ ${data.avg_rating || 0}/5
      </div>

      <div>
        ${data.total_reviews} đánh giá
      </div>
    `;

  } catch (err) {

    console.error(err);

  }

}


async function loadReviews(productId) {

  try {

    const res = await fetch(
      `/api/reviews/product/${productId}`
    );

    const reviews = await res.json();

    const reviewList =
      document.getElementById("review-list");

    if (!reviews.length) {

      reviewList.innerHTML = `
        <div class="alert alert-light">
          Chưa có đánh giá nào
        </div>
      `;

      return;
    }

    reviewList.innerHTML =
reviews.map(review => {

  const avatar =
    review.full_name
      .charAt(0)
      .toUpperCase();

  return `

  <div class="card border-0 shadow-sm mb-3">

    <div class="card-body">

      <div class="d-flex">

        <div
          class="review-avatar me-3"
        >
          ${avatar}
        </div>

        <div class="flex-grow-1">

          <div
            class="fw-bold"
          >
            ${review.full_name}
          </div>

          <div
            class="text-warning mb-2"
          >
            ${"★".repeat(review.rating)}
            ${"☆".repeat(5 - review.rating)}
          </div>

          <p class="mb-2">
            ${review.comment || ""}
          </p>

          <small
            class="text-muted"
          >
            ${new Date(review.created_at)
              .toLocaleString("vi-VN")}
          </small>

        </div>

      </div>

    </div>

  </div>

  `;

}).join("");

  } catch (err) {

    console.error(err);

  }

}


async function renderReviewForm(productId) {

  const container =
    document.getElementById(
      "review-form-container"
    );

  const reviewed =
    await hasReviewed(productId);

  if(reviewed){

    container.innerHTML = `
      <div class="review-locked">

        <h5 class="text-success">
          ✓ Bạn đã đánh giá món ăn này
        </h5>

        <p class="mb-0">
          Mỗi khách hàng chỉ được đánh giá
          1 lần cho mỗi món ăn.
        </p>

      </div>
    `;

    return;
  }

  const token =
    localStorage.getItem("token");

  if (!token) {

    container.innerHTML = `
      <div class="alert alert-warning">
        Vui lòng đăng nhập để đánh giá món ăn.
      </div>
    `;

    return;
  }

  container.innerHTML = `
    <div class="card">

      <div class="card-body">

        <h5 class="mb-3">
          Đánh giá món ăn
        </h5>

        <div
          id="star-picker"
          class="fs-2 mb-3"
        >
          <i class="bi bi-star star"
             data-value="1"></i>

          <i class="bi bi-star star"
             data-value="2"></i>

          <i class="bi bi-star star"
             data-value="3"></i>

          <i class="bi bi-star star"
             data-value="4"></i>

          <i class="bi bi-star star"
             data-value="5"></i>
        </div>

        <textarea
          id="review-comment"
          class="form-control mb-3"
          rows="4"
          placeholder="Chia sẻ cảm nhận của bạn..."
        ></textarea>

        <button
          id="submit-review-btn"
          class="btn btn-success"
        >
          Gửi đánh giá
        </button>

      </div>

    </div>
  `;

  initStarPicker(productId);
}


let selectedRating = 0;

function initStarPicker(productId) {

  const stars =
    document.querySelectorAll(".star");

  stars.forEach(star => {

    star.addEventListener(
      "mouseover",
      () => {

        const value =
          Number(star.dataset.value);

        paintStars(value);

      }
    );

    star.addEventListener(
      "mouseout",
      () => {

        paintStars(selectedRating);

      }
    );

    star.addEventListener(
      "click",
      () => {

        selectedRating =
          Number(star.dataset.value);

        paintStars(selectedRating);

      }
    );

  });

  document
    .getElementById("submit-review-btn")
    .addEventListener(
      "click",
      () => submitReview(productId)
    );
}

function paintStars(value) {

  document
    .querySelectorAll(".star")
    .forEach(star => {

      const current =
        Number(star.dataset.value);

      if (current <= value) {

        star.classList.remove(
          "bi-star"
        );

        star.classList.add(
          "bi-star-fill",
          "text-warning"
        );

      } else {

        star.classList.remove(
          "bi-star-fill",
          "text-warning"
        );

        star.classList.add(
          "bi-star"
        );

      }

    });

}



async function submitReview(productId) {

  try {

    if (!selectedRating) {

      alert(
        "Vui lòng chọn số sao"
      );

      return;
    }

    const comment =
      document.getElementById(
        "review-comment"
      ).value;

    const token =
      localStorage.getItem("token");

    const res = await fetch(
      "/api/reviews",
      {
        method: "POST",

        headers: {
          "Content-Type":
            "application/json",

          Authorization:
            `Bearer ${token}`
        },

        body: JSON.stringify({
          product_id: productId,
          rating: selectedRating,
          comment
        })
      }
    );

    const data =
      await res.json();

    if (!res.ok) {

      alert(
        data.message
      );

      return;
    }

    alert(
      "Đánh giá thành công"
    );

    loadReviewStats(productId);

    loadReviews(productId);

    renderReviewForm(productId);

  } catch (err) {

    console.error(err);

    alert(
      "Có lỗi xảy ra"
    );

  }
}


async function hasReviewed(productId){

  const token =
    localStorage.getItem("token");

  if(!token) return false;

  const res = await fetch(
    `/api/reviews/check/${productId}`,
    {
      headers:{
        Authorization:`Bearer ${token}`
      }
    }
  );

  const data =
    await res.json();

  return data.reviewed;
}