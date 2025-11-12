document.addEventListener("DOMContentLoaded", () => {
  const grid = document.getElementById("booking-grid");
  const resourceCard = document.querySelector(".booking-resource-card");

  // Extract resourceId from URL
  const params = new URLSearchParams(window.location.search);
  const resourceId = parseInt(params.get("resourceId"));

  if (!resourceId) {
    console.error("No resourceId found in URL");
    return;
  }

  // Fetch resource, bookings, and users
  Promise.all([
    fetch(`/api/resources/${resourceId}`).then(res => res.json()),
    fetch("/api/bookings").then(res => res.json()),
    fetch("/api/users").then(res => res.json())
  ])
    .then(([resource, bookings, users]) => {
      // Update Resource Header
      if (resourceCard && resource) {
        resourceCard.innerHTML = `
          <img src="${resource.image || '/images/bookings-event-banner.png'}" alt="Event Banner">
          <p class="resource-name">${resource.title}</p>
          <p class="description">${resource.description}</p>
          <p class="timeslot">${resource.startHour} - ${resource.endHour}</p>
        `;
      }

      // Filter bookings for this resource
      const filteredBookings = bookings.filter(b => b.resourceId === resourceId);

      // If no bookings found, show message
      grid.innerHTML = "";
      if (filteredBookings.length === 0) {
        grid.innerHTML = `<p>No pending bookings</p>`;
        return;
      }

      // Maps user IDs to usernames
      const userMap = {};
      users.forEach(u => (userMap[u.id] = u.username));

      // Dynamically insert each booking
      filteredBookings.forEach(booking => {
        const username = userMap[booking.userId] || "Unknown User";

        const card = document.createElement("article");
        card.className = "booking-card";
        card.innerHTML = `
          <span>
            <p class="date">${booking.date}</p>
            <p class="time">${booking.startTime} - ${booking.endTime}</p>
          </span>

          <span class="user-block">
            <img src="${booking.userImage || '/images/profile-picture.png'}" alt="Profile Picture">
            <span>
              <p class="user-name">${username}</p>
              <p class="purpose">Purpose: ${booking.purpose}</p>
            </span>
          </span>

          <span class="buttons">
            <button class="accept" data-id="${booking.id}">Accept</button>
            <button class="reject" data-id="${booking.id}">Reject</button>
          </span>
        `;
        grid.appendChild(card);
      });

      // Handle accept/reject buttons
      grid.addEventListener("click", e => {
        if (e.target.classList.contains("accept") || e.target.classList.contains("reject")) {
          const bookingId = e.target.dataset.id;
          const action = e.target.classList.contains("accept") ? "accepted" : "rejected";

          fetch(`/api/bookings/${bookingId}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ status: action })
          })
            .then(res => res.json())
            .then(() => {
              e.target.closest(".booking-card").remove();

              // If this removed the last booking, show fallback message
              if (!grid.querySelector(".booking-card")) {
                grid.innerHTML = `<p>No pending bookings</p>`;
              }
            })
            .catch(err => console.error("Failed to update booking:", err));
        }
      });
    })
    .catch(err => console.error("Failed to load data:", err));
});
