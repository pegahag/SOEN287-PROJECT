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

//loading all the resources
async function loadResources() {
  tableBody.innerHTML = `
    <tr>
      <td colspan="2">Loading resources...</td>
    </tr>
  `;

  try {
    const response = await fetch("/api/resources"); // ✅ uses backend route
    if (!response.ok) {
      throw new Error(` ${response.status}`);
    }

    const resources = await response.json();
    renderResources(resources);
  } 
  catch (error) {
    console.error("Failed to load resources:", error);
    tableBody.innerHTML = `
      <tr>
        <td colspan="2">Could not load resources.</td>
      </tr>
    `;
  }
}

// rendering table rows
function renderResources(resources) {
  tableBody.innerHTML = "";

  if (!Array.isArray(resources) || resources.length === 0) {
    tableBody.innerHTML = `
      <tr>
        <td colspan="2">No resources found.</td>
      </tr>
    `;
    return;
  }

  resources.forEach((resource) => {
    const tr = createResourceRow(resource);
    tableBody.appendChild(tr);
  });
}

// creating the row for each resource
function createResourceRow(resource) {
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
  } 
  else  dateDiv.textContent = "Date range: -";
  
  contentTd.appendChild(dateDiv);

  const timeDiv = document.createElement("div");
  if (resource.startHour && resource.endHour) {
    timeDiv.textContent = `Hours: ${resource.startHour} - ${resource.endHour}`;
  } else {
    timeDiv.textContent = "Hours: -";
  }
  contentTd.appendChild(timeDiv);

  const capacityDiv = document.createElement("div");
  const capacity = resource.capacity ?? "-";
  const taken = resource.seatsTaken ?? 0;
  capacityDiv.textContent = `Capacity: ${taken} / ${capacity}`;
  contentTd.appendChild(capacityDiv);

  const peakDiv = document.createElement("div");
  if (resource.peakTime) {
    peakDiv.textContent = `Peak time: ${resource.peakTime}`;
  } 
  else peakDiv.textContent = "Peak time: -";
  
  contentTd.appendChild(peakDiv);

  const locDiv = document.createElement("div");
  if (resource.street || resource.postalCode) {
    locDiv.textContent = `Location: ${resource.street || ""} ${
      resource.postalCode || ""
    }`.trim();
  } 
  else locDiv.textContent = "Location: -";
  
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

// togglinh open/blocked and save
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
  } 
  catch (error) {
    console.error("Failed to delete the resource:", error);
    alert("Was not delete resource.");
  }
}
