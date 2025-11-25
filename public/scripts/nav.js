document.addEventListener("DOMContentLoaded", async () => {
    const headerHTML = `
    <div class="header">
      <figure class="concordia_logo">
        <a href="/index.html">
          <img src="../images/concordia_logo.png" alt="The Concordia logo. Stylish!">
        </a>
      </figure>
      <div class="home_button" onclick="location.href='/'">Home</div>
      <div class="navilinks">
        <a href="../pages/catalogue.html" class="navilink">Resources</a>
        <a href="../pages/my_bookings.html" class="navilink user-only">Calendar</a>
        <a href="../pages/bookings.html" class="navilink admin-only">Administrator</a>
        <a href="../pages/event_page.html" class="navilink admin-only">Create</a>
        <a href="../pages/resource_management.html" class="navilink admin-only">Management</a>
      </div>
      <div class="account_buttons" id="accountButtons">
        <button onclick="location.href='/pages/login.html'" class="signin_button">Sign In</button>
        <button onclick="location.href='/pages/register.html'" class="register_button">Register</button>
      </div>
    </div>
  `;

    const container = document.getElementById("navbar-container");
    if (!container) {
        console.warn("Navbar container not found on this page.");
        return;
    }

    const header = document.createElement("header");
    header.innerHTML = headerHTML;
    container.appendChild(header);

    // --- Check login status ---
    try {
        const res = await fetch("/api/auth/me");
        const data = await res.json();
        const user = data.user;

        const accountDiv = document.getElementById("accountButtons");

        if (user) {
            // Logged in → show Profile and Logout
            accountDiv.innerHTML = `
        <button onclick="location.href='/pages/profile.html'" class="profile_button">Profile</button>
        <button id="logoutBtn" class="logout_button">Logout</button>
      `;

            // Show admin links if admin
            if (user.role === "admin") {
                document.querySelectorAll(".admin-only").forEach(el => el.style.display = "inline-block");
            } else {
                document.querySelectorAll(".admin-only").forEach(el => el.style.display = "none");
            }

            // Logout action
            document.getElementById("logoutBtn").addEventListener("click", async () => {
                await fetch("/api/auth/logout", { method: "POST" });
                location.reload();
            });
        } else {
            // Not logged in --> show Sign In and Register
            accountDiv.innerHTML = `
        <button onclick="location.href='/pages/login.html'" class="signin_button">Sign In</button>
        <button onclick="location.href='/pages/register.html'" class="register_button">Register</button>
      `;

            document.querySelectorAll(".user-only").forEach(el => el.style.display = "none");


            // Hide admin links
            document.querySelectorAll(".admin-only").forEach(el => el.style.display = "none");
        }
    } catch (err) {
        console.error("Error checking login state:", err);
    }
});
