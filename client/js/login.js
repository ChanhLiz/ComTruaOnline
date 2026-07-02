function showToast(message, type = "error") {
  let toast = document.getElementById("toast");

  if (!toast) {
    toast = document.createElement("div");
    toast.id = "toast";
    document.body.appendChild(toast);
  }

  toast.className = `toast-custom ${type} show`;
  toast.innerText = message;

  setTimeout(() => {
    toast.classList.remove("show");
  }, 3000);
}

function setError(id, message) {
  const input = document.getElementById(id);
  const error = document.getElementById(`${id}-error`);

  input.classList.add("is-invalid");
  error.innerText = message;
}

function clearErrors() {
  document.querySelectorAll(".form-error")
    .forEach(el => el.innerText = "");

  document.querySelectorAll(".form-control")
    .forEach(el => el.classList.remove("is-invalid"));
}

function togglePassword(id, btn) {
  const input = document.getElementById(id);

  if (input.type === "password") {
    input.type = "text";
    btn.innerText = "🙈";
  } else {
    input.type = "password";
    btn.innerText = "👁️";
  }
}


async function handleLogin() {

  clearErrors();

  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();

  let valid = true;

  if (!email) {
    setError("email", "Vui lòng nhập email");
    valid = false;
  }

  if (!password) {
    setError("password", "Vui lòng nhập mật khẩu");
    valid = false;
  }

  if (!valid) return;

  const res = await fetch("/api/auth/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      email,
      password
    })
  });

  const data = await res.json();

  if (!res.ok) {
    showToast(data.message || "Đăng nhập thất bại");
    return;
  }

  localStorage.setItem("token", data.token);
  localStorage.setItem("user", JSON.stringify(data.user));

  if (window.mergeCartOnLogin) {
    window.mergeCartOnLogin();
  }

  showToast("Đăng nhập thành công!", "success");

  setTimeout(() => {
    window.location.href = "/";
  }, 1000);
}