// public/scripts/edit_resource.js

document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector("form.EditResource");
  const deleteBtn = document.querySelector(".delete-btn");

  if (!form) {
    console.error("EditResource form not found");
    return;
  }

  // getting form elements 
  const textInputs = form.querySelectorAll("input[type='text']");
  const titleInput = textInputs[0];        // resource title
  const streetInput = textInputs[1];       // street (new)
  const postalCodeInput = textInputs[2];   // postal code (new)
  const capacityInput = textInputs[3];     // capacity

  const dateInputs = form.querySelectorAll("input[type='date']");
  const startDateInput = dateInputs[0];
  const endDateInput = dateInputs[1];

  const timeInputs = form.querySelectorAll("input[type='time']");
  const startTimeInput = timeInputs[0];
  const endTimeInput = timeInputs[1];

  const descInput = form.querySelector("#desc");
  const dayCheckboxes = form.querySelectorAll("input[name='days']");

  // getting the id from query string (id of the resource clicked on to be edit)
  const params = new URLSearchParams(window.location.search);
  const resourceId = params.get("id");

  if (!resourceId) {
    alert("Missing resource id in URL.");
    return;
  }

  let originalResource = null;

  // loading the data for the original resource 
  (async () => {
    try {
      const resource = await loadResource(resourceId);
      originalResource = resource;
      fillFormFromResource(resource);
    } 
    catch (err) {
      console.error("Failed to load resource:", err);
      alert("Was not able to load resource.");
    }
  })();

  // handling editing the resouce after form submission
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const updated = buildUpdatedResourceFromForm(
      originalResource,
      titleInput,
      streetInput,
      postalCodeInput,
      startDateInput,
      endDateInput,
      startTimeInput,
      endTimeInput,
      capacityInput,
      descInput,
      dayCheckboxes
    );

    try {
      const res = await fetch(`/api/resources/${resourceId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updated),
      });

      if (!res.ok) {
        throw new Error(`HTTP error ${res.status}`);
      }

      alert("Resource was updated successfully.");
      // after it is updated, it goes back to the management page
      window.location.href = "resource_management.html";
    } catch (error) {
      console.error("Failed to update resource:", error);
      alert("Could not update resource.");
    }
  });

  //handdling deleteing the resource
  if (deleteBtn) {
    deleteBtn.addEventListener("click", async () => {
      const confirmDelete = confirm("Are you sure you want to delete this resource?");
      if (!confirmDelete) return;

      try {
        const res = await fetch(`/api/resources/${resourceId}`, {
          method: "DELETE",
        });

        if (!res.ok) {
          throw new Error(`HTTP error ${res.status}`);
        }

        alert("Resource was deleted.");
        //after deleting the resource we go back to the resource management page
        window.location.href = "resource_management.html";
      } 
      catch (error) {
        console.error("Failed to delete resource:", error);
        alert("Was not able to delete resource.");
      }
    });
  }
});

// helper methods:

async function loadResource(id) {
  const res = await fetch(`/api/resources/${id}`);
  if (!res.ok) {
    throw new Error(`HTTP error ${res.status}`);
  }
  return res.json();
}

function toInputDateFormat(dateStr) {
  if (!dateStr) return "";
  if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) return dateStr;

  const parts = dateStr.split("-");
  if (parts.length !== 3) return "";
  const [dd, mm, yyyy] = parts;
  if (yyyy.length === 4) {
    return `${yyyy}-${mm.padStart(2, "0")}-${dd.padStart(2, "0")}`;
  }
  return "";
}

function fillFormFromResource(resource) {
  const form = document.querySelector("form.EditResource");
  if (!form) return;

  const textInputs = form.querySelectorAll("input[type='text']");
  const titleInput = textInputs[0];
  const streetInput = textInputs[1];
  const postalCodeInput = textInputs[2];
  const capacityInput = textInputs[3];
  const dateInputs = form.querySelectorAll("input[type='date']");
  const startDateInput = dateInputs[0];
  const endDateInput = dateInputs[1];
  const timeInputs = form.querySelectorAll("input[type='time']");
  const startTimeInput = timeInputs[0];
  const endTimeInput = timeInputs[1];
  const descInput = form.querySelector("#desc");
  const dayCheckboxes = form.querySelectorAll("input[name='days']");
  titleInput.value = resource.title || "";
  streetInput.value = resource.street || "";
  postalCodeInput.value = resource.postalCode || "";
  capacityInput.value = resource.capacity ?? "";
  startDateInput.value = toInputDateFormat(resource.startDate);
  endDateInput.value = toInputDateFormat(resource.endDate);

  startTimeInput.value = resource.startHour || "";
  endTimeInput.value = resource.endHour || "";
  descInput.value = resource.description || "";

  if (Array.isArray(resource.weekdaysAvailable)) {
    const dayOrder = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"];
    dayOrder.forEach((dayVal, index) => {
      const cb = Array.from(dayCheckboxes).find(
        (box) => box.value === dayVal
      );
      if (cb) cb.checked = resource.weekdaysAvailable[index] === 1;
    });
  }
}

function buildUpdatedResourceFromForm(
  original,
  titleInput,
  streetInput,
  postalCodeInput,
  startDateInput,
  endDateInput,
  startTimeInput,
  endTimeInput,
  capacityInput,
  descInput,
  dayCheckboxes
) {
  const updated = { ...original }; // initiate with original values

  if (titleInput.value.trim() !== "") {
    updated.title = titleInput.value.trim();
  }
  if (streetInput.value.trim() !== "") {
    updated.street = streetInput.value.trim();
  }
  if (postalCodeInput.value.trim() !== "") {
    updated.postalCode = postalCodeInput.value.trim();
  }
  if (startDateInput.value !== "") {
    updated.startDate = startDateInput.value;
  }
  if (endDateInput.value !== "") {
    updated.endDate = endDateInput.value;
  }
  if (startTimeInput.value !== "") {
    updated.startHour = startTimeInput.value;
  }
  if (endTimeInput.value !== "") {
    updated.endHour = endTimeInput.value;
  }

  const capacityStr = capacityInput.value.trim();
  if (capacityStr !== "" && !isNaN(parseInt(capacityStr))) {
    updated.capacity = parseInt(capacityStr, 10);
  }

  if (descInput.value.trim() !== "") {
    updated.description = descInput.value.trim();
  }

  const anyChecked = Array.from(dayCheckboxes).some(cb => cb.checked);

  if (anyChecked) { // only updates this field if at least one is checked
    const dayOrder = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"];
    updated.weekdaysAvailable = dayOrder.map(dayVal => {
      const cb = Array.from(dayCheckboxes).find(box => box.value === dayVal);
      return cb && cb.checked ? 1 : 0;
    });
  }

  return updated;
}
