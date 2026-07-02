document.addEventListener("DOMContentLoaded", () => {

  const authArea =
    document.getElementById("auth-area");

  const adminLink =
    document.getElementById("admin-link");

  const token =
    localStorage.getItem("token");

  const user = JSON.parse(
    localStorage.getItem("user")
  );

  if (authArea) {

    if (token && user) {

      authArea.innerHTML = `
        <span class="me-2">
          👋 ${user.full_name}
        </span>

        <button
          class="btn btn-outline-danger btn-sm"
          onclick="logout()"
        >
          Đăng xuất
        </button>
      `;

    } else {

      authArea.innerHTML = `
        <a
          href="/pages/login.html"
          class="btn btn-outline-primary btn-sm"
        >
          Đăng nhập
        </a>
      `;
    }
  }

  if (
    adminLink &&
    user &&
    user.role === "admin"
  ) {
    adminLink.style.display = "block";
  }

});

function logout() {

  localStorage.removeItem("token");
  localStorage.removeItem("user");

  window.location.reload();

}