
document.addEventListener("DOMContentLoaded", async () => {
  try {
    const res = await fetch("/api/auth/me");
    const data = await res.json();
    const user = data.user;

    if (!user) {
      alert("Please log in first");
      window.location.href = "/pages/login.html";
      return;
    }

   
    document.getElementById("username").value = user.username;
    document.getElementById("userId").value = user.id;
  } catch (err) {
    console.error("Error loading profile:", err);
  }
});

document.getElementById("profileForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const id = document.getElementById("userId").value;
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value; // empty == do not change password 

  try {
    const res = await fetch(`/api/users/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password })
    });

    const result = await res.json();

    if (result.success) {
      alert("Profile updated");
    } else {
      alert(result.message || "Update failed");
    }
  } catch (err) {
    console.error("Profile update error:", err);
  }
});
