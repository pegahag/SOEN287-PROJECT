document.getElementById("loginForm").addEventListener("submit", async (e) => {
  e.preventDefault(); // prevent normal form submission

  // Get form data
  const formData = new FormData(e.target);
  const data = {
    username: formData.get("username"),
    password: formData.get("password")
  };

  try {
    // Send POST request to server login endpoint
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });

    const result = await res.json();

    if (result.success) {
      alert(`Login in as "${result.user.username}"`);
      // Redirect to another page after login
      window.location.href = "/index.html";
    } else {
      alert("Invalid username or password");
    }
  } catch (err) {
    console.error("Login error:", err);
  }
});
