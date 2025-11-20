document.getElementById("registerForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const formData = new FormData(e.target);
  const data = {
    username: formData.get("username"),
    password: formData.get("password")
  };

  try {
    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });

    const result = await res.json();

    if (result.success) {
      alert("Registered and logged in as " + result.user.username);
      window.location.href = "/index.html";
    } else {
      alert(result.message || "Registration failed");
    }
  } catch (err) {
    console.error("Register error:", err);
  }
});