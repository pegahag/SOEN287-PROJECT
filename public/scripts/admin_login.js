document.getElementById("adminLoginForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const formData = new FormData(e.target);
  const data = {
    username: formData.get("username"),
    password: formData.get("password")
  };

  try {
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });

    const result = await res.json();

    if (!result.success) {
      alert("Invalid username or password");
      // 🔹 ensure no login flags remain
      localStorage.removeItem("isLoggedIn");
      localStorage.removeItem("isAdmin");
      return;
    }

    if (result.user.role !== "admin") {
      alert("You are not an admin");

      // pegah: remove login status for catalogue use
      localStorage.removeItem("isLoggedIn");
      localStorage.removeItem("isAdmin");

      // logout from server
      await fetch("/api/auth/logout", { method: "POST" });
      return;
    }

    // Pegah: Mark user as logged in AND admin
    localStorage.setItem("isLoggedIn", "true");
    localStorage.setItem("isAdmin", "true");

    window.location.href = "/pages/bookings.html";
  } catch (err) {
    console.error("Admin login error:", err);
  }
});
