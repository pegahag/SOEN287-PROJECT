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
      return;
    }

    if (result.user.role !== "admin") {
      alert("You are not an admin");

      
      await fetch("/api/auth/logout", { method: "POST" });
      return;
    }

   
    window.location.href = "/pages/bookings.html";
  } catch (err) {
    console.error("Admin login error:", err);
  }
});