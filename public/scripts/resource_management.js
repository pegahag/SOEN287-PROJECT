// public/scripts/resource_management.js

let tableBody = null;

document.addEventListener("DOMContentLoaded", () => {
  tableBody = document.querySelector("#resourcesTable tbody");

  if (!tableBody) {
    console.error("Could not find #resourcesTable tbody");
    return;
  }

  loadResources();
});

// loading all the resources + bookings
async function loadResources() {
  tableBody.innerHTML = `
    <tr>
      <td colspan="2">Loading resources...</td>
    </tr>
  `;

  try {
    // 🔹 Fetch resources and bookings together
    const [resResources, resBookings] = await Promise.all([
      fetch("/api/resources"),
      fetch("/api/bookings"),
    ]);

    if (!resResources.ok) {
      throw new Error(`Resources HTTP error ${resResources.status}`);
    }
    if (!resBookings.ok) {
      throw new Error(`Bookings HTTP error ${resBookings.status}`);
    }

    const resources = await resResources.json();
    const bookings = await resBookings.json();

    renderResources(resources, bookings);
  } catch (error) {
    console.error("Failed to load resources or bookings:", error);
    tableBody.innerHTML = `
      <tr>
        <td colspan="2">Could not load resources.</td>
      </tr>
    `;
  }
}

// rendering table rows
function renderResources(resources, bookings) {
  tableBody.innerHTML = "";

  if (!Array.isArray(resources) || resources.length === 0) {
    tableBody.innerHTML = `
      <tr>
        <td colspan="2">No resources found.</td>
      </tr>
    `;
    return;
  }

  const allBookings = Array.isArray(bookings) ? bookings : [];

  resources.forEach((resource) => {
    const tr = createResourceRow(resource, allBookings);
    tableBody.appendChild(tr);
  });
}

// helper to compute peak time from bookings of a resource
function computePeakTime(bookingsForResource) {
  if (!Array.isArray(bookingsForResource) || bookingsForResource.length === 0) {
    return null;
  }

  const counts = {};
  bookingsForResource.forEach((b) => {
    const t = b.startTime;
    if (!t) return;
    counts[t] = (counts[t] || 0) + 1;
  });

  const times = Object.keys(counts);
  if (times.length === 0) return null;

  // find time with max count; if tie, pick first
  let peak = times[0];
  let maxCount = counts[peak];

  for (let i = 1; i < times.length; i++) {
    const t = times[i];
    if (counts[t] > maxCount) {
      maxCount = counts[t];
      peak = t;
    }
  }

  return peak; // e.g. "14:00"
}

// creating the row for each resource
function createResourceRow(resource, allBookings) {
  const tr = document.createElement("tr");
  tr.dataset.id = resource.id;

  const imgTd = document.createElement("td");
  const img = document.createElement("img");
  img.src = resource.image;
  img.alt = `${resource.title} image`;
  img.width = 120;
  imgTd.appendChild(img);
  tr.appendChild(imgTd);

  const contentTd = document.createElement("td");

  const statusDiv = document.createElement("div");
  statusDiv.className = "status";
  statusDiv.dataset.status = resource.status || "open";
  statusDiv.textContent = resource.status === "blocked" ? "Blocked" : "Open";
  contentTd.appendChild(statusDiv);

  const title = document.createElement("h3");
  title.textContent = resource.title || `Resource #${resource.id}`;
  contentTd.appendChild(title);

  const dateDiv = document.createElement("div");
  if (resource.startDate && resource.endDate) {
    dateDiv.textContent = `Date range: ${resource.startDate} - ${resource.endDate}`;
  } else {
    dateDiv.textContent = "Date range: -";
  }
  contentTd.appendChild(dateDiv);

  const timeDiv = document.createElement("div");
  if (resource.startHour && resource.endHour) {
    timeDiv.textContent = `Hours: ${resource.startHour} - ${resource.endHour}`;
  } else {
    timeDiv.textContent = "Hours: -";
  }
  contentTd.appendChild(timeDiv);

  // find bookings for this resource and compute dynamic peak time
  const bookingsForResource = allBookings.filter(
    (b) => String(b.resourceId) === String(resource.id)
  );
  const dynamicPeak = computePeakTime(bookingsForResource);
  const peakLabel = dynamicPeak || resource.peakTime || "—";

  const usedSeats = resource.seatsTaken ?? 0;
  const capacity = resource.capacity ?? "-";

  // stats box (Peak time + Capacity used)
  const statsDiv = document.createElement("div");
  statsDiv.className = "stats";
  statsDiv.innerHTML = `
    <div class="stat">
      <span class="label">Peak time:</span>
      <span class="value">${peakLabel}</span>
    </div>
    <div class="stat">
      <span class="label">Capacity used:</span>
      <span class="value">${usedSeats} / ${capacity}</span>
    </div>
  `;
  contentTd.appendChild(statsDiv);

  const locDiv = document.createElement("div");
  if (resource.street || resource.postalCode) {
    locDiv.textContent = `Location: ${resource.street || ""} ${
      resource.postalCode || ""
    }`.trim();
  } else {
    locDiv.textContent = "Location: -";
  }
  contentTd.appendChild(locDiv);

  const desc = document.createElement("p");
  desc.textContent = resource.description || "";
  contentTd.appendChild(desc);

  // actions
  const actions = document.createElement("div");
  actions.className = "resource-actions";

  // edit resource (go to edit page with id)
  const editBtn = document.createElement("button");
  editBtn.type = "button";
  editBtn.textContent = "Edit";
  editBtn.addEventListener("click", () => {
    window.location.href = `edit_resource.html?id=${resource.id}`;
  });
  actions.appendChild(editBtn);

  // block/unblock
  const blockBtn = document.createElement("button");
  blockBtn.type = "button";
  const isBlocked = resource.status === "blocked";
  blockBtn.textContent = isBlocked ? "Unblock" : "Block";
  if (isBlocked) blockBtn.classList.add("blocked");

  blockBtn.addEventListener("click", () => toggleBlockResource(resource));
  actions.appendChild(blockBtn);

  // delete resource
  const deleteBtn = document.createElement("button");
  deleteBtn.type = "button";
  deleteBtn.textContent = "Delete";
  deleteBtn.addEventListener("click", () => deleteResource(resource.id));
  actions.appendChild(deleteBtn);

  // View bookings 
  const viewBookingsLink = document.createElement("a");
  viewBookingsLink.textContent = "View bookings";
  viewBookingsLink.href = `bookings.html?resourceId=${resource.id}`;
  actions.appendChild(viewBookingsLink);

  contentTd.appendChild(actions);
  tr.appendChild(contentTd);

  return tr;
}

// toggling open/blocked and save
async function toggleBlockResource(resource) {
  const newStatus = resource.status === "blocked" ? "open" : "blocked";

  try {
    const response = await fetch(`/api/resources/${resource.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ status: newStatus }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error ${response.status}`);
    }

    // reloading the data to make the change visible
    await loadResources();
  } catch (error) {
    console.error("Failed to update resource status:", error);
    alert("Could not update resource status.");
  }
}

// delete resource 
async function deleteResource(id) {
  const confirmDelete = confirm("Are you sure you want to delete this resource?");
  if (!confirmDelete) return;

  try {
    const response = await fetch(`/api/resources/${id}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      throw new Error(`HTTP error ${response.status}`);
    }

    await loadResources();
  } catch (error) {
    console.error("Failed to delete the resource:", error);
    alert("Was not delete resource.");
  }
}
