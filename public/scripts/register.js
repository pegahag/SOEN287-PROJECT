document.getElementById("registerForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const formData = new FormData(e.target);

  //Collect required fields for backend
  const data = {
    username: formData.get("username"),
    email: formData.get("email"),
    password: formData.get("password")
  };

  //validation
  const confirmPassword = formData.get("confirmPassword");
  if (data.password !== confirmPassword) {
    alert("Passwords do not match");
    return;
  }

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
