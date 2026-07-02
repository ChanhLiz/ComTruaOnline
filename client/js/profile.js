async function loadProfile() {
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
}

async function saveProfile() {
  const full_name = document.getElementById("full_name").value;
  const phone = document.getElementById("phone").value;
  const address = document.getElementById("address").value;

  const res = await fetch("/api/users/me", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + localStorage.getItem("token")
    },
    body: JSON.stringify({
      full_name,
      phone,
      address
    })
  });

  const data = await res.json();

  alert(data.message || "Cập nhật thành công");
}

loadProfile();