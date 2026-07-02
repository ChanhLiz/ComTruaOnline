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


async function handleRegister() {

  clearErrors();

  const full_name = document.getElementById("full_name").value.trim();
  const email = document.getElementById("email").value.trim();
  const phone = document.getElementById("phone").value.trim();
  const password = document.getElementById("password").value.trim();

  let valid = true;

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const phoneRegex = /^(01|02|03|04|05|06|07|08|09)[0-9]{8}$/;

  if (!full_name) {
    setError("full_name", "Vui lòng nhập họ tên");
    valid = false;
  }

  if (!emailRegex.test(email)) {
    setError("email", "Email không hợp lệ");
    valid = false;
  }

  if (!phoneRegex.test(phone)) {
    setError("phone", "Số điện thoại không hợp lệ");
    valid = false;
  }

  if (password.length < 8) {
    setError("password", "Mật khẩu phải có ít nhất 8 ký tự");
    valid = false;
  }

  if (!valid) return;

  const res = await fetch("/api/auth/register", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      full_name,
      email,
      phone,
      password
    })
  });

  const data = await res.json();

  if (!res.ok) {
    showToast(data.message || "Đăng ký thất bại");
    return;
  }

  showToast("Đăng ký thành công!", "success");

  setTimeout(() => {
    window.location.href = "/pages/login.html";
  }, 1500);
}