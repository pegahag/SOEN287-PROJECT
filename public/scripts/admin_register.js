document.getElementById("adminRegisterForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const formData = new FormData(e.target);

  // Collect required fields for backend
  const data = {
    username: formData.get("username"),
    email: formData.get("email"),
    password: formData.get("password")
  };

  // validation
  const confirmPassword = formData.get("confirmPassword");
  if (data.password !== confirmPassword) {
    alert("Passwords do not match");
    return;
  }

  try {
    const res = await fetch("/api/auth/admin/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });

    // Check if current user is not admin (backend returns 403)
    if (res.status === 403) {
      const result = await res.json();
      alert(result.message || "Only admins can create admin users.");
      return;
    }

    const result = await res.json();

    if (result.success) {
      alert("Admin account created for " + data.username);
      e.target.reset();
    } else {
      alert(result.message || "Admin registration failed");
    }
  } catch (err) {
    console.error("Admin register error:", err);
  }
});
