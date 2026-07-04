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

  const full_name =
    document.getElementById("full_name").value;

  const phone =
    document.getElementById("phone").value;

  const address =
    document.getElementById("address").value;

  showConfirm(
    "Bạn muốn lưu thay đổi hồ sơ?",
    async () => {

      const res = await fetch("/api/users/me", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization:
            "Bearer " + localStorage.getItem("token")
        },
        body: JSON.stringify({
          full_name,
          phone,
          address
        })
      });

      const data = await res.json();

      if (!res.ok) {
        showConfirm(
          data.message || "Có lỗi xảy ra",
          null,
          "Thông báo"
        );
        return;
      }

      // Cập nhật localStorage
      const user =
        JSON.parse(localStorage.getItem("user"));

      user.full_name = full_name;
      user.phone = phone;
      user.address = address;

      localStorage.setItem(
        "user",
        JSON.stringify(user)
      );

      showConfirm(
        "Cập nhật thành công.",
        () => {
          location.reload();
        },
        "Thành công"
      );
    },
    "Xác nhận"
  );
}

loadProfile();