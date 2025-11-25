// public/scripts/create_resource.js

document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector("form.CreateResource");
  if (!form) return;

  const textInputs = form.querySelectorAll("input[type='text']");
  const titleInput = textInputs[0];
  const capacityInput = textInputs[1];
  const dateInputs = form.querySelectorAll("input[type='date']");
  const startDateInput = dateInputs[0];
  const endDateInput = dateInputs[1];
  const timeInputs = form.querySelectorAll("input[type='time']");
  const startTimeInput = timeInputs[0];
  const endTimeInput = timeInputs[1];
  const descInput = form.querySelector("#desc");
  const dayCheckboxes = form.querySelectorAll("input[name='days']");
  const typeSelect = document.getElementById("resourceType");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const title = titleInput.value.trim();
    const startDate = startDateInput.value;
    const endDate = endDateInput.value;
    const startHour = startTimeInput.value;
    const endHour = endTimeInput.value;
    const description = descInput.value.trim();
    const capacityStr = capacityInput.value.trim();
    const typeRaw = typeSelect ? typeSelect.value : "";

    if (!title) {
      alert("Please enter a resource title.");
      return;
    }
    if (!typeRaw) {
      alert("Please select a resource type.");
      return;
    }

    let capacity = null;
    if (capacityStr !== "") {
      const num = parseInt(capacityStr, 10);
      if (isNaN(num) || num < 0) {
        alert("Invalid capacity.");
        return;
      }
      capacity = num;
    }

    let type = typeRaw;
    if (typeRaw.toLowerCase() === "sport facility") {
      type = "sport_facility";
    }

    let imagePath = "/images/bookings-event-banner.png";
    if (type === "room") imagePath = "/images/studyroom.jpg";
    else if (type === "sport_facility") imagePath = "/images/sport_facility.jpg";
    else if (type === "lab") imagePath = "/images/computerlab.jpg";
    else if (type === "equipment") imagePath = "/images/equipment.jpg";

    const dayOrder = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"];
    const weekdaysAvailable = dayOrder.map((dayVal) => {
      const cb = Array.from(dayCheckboxes).find((box) => box.value === dayVal);
      return cb && cb.checked ? 1 : 0;
    });

    const newResource = {
      // id will be inserted by backend
      title,
      startDate,
      endDate,
      startHour,
      endHour,
      peakTime: "",             
      weekdaysAvailable,
      street: "",
      postalCode: "",
      description,
      image: imagePath,
      status: "open",
      capacity,
      seatsTaken: 0,
      type
    };

    try {
      const res = await fetch("/api/resources", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newResource),
      });

      if (!res.ok) throw new Error(`HTTP error ${res.status}`);

      alert("Resource created successfully.");
      window.location.href = "resource_management.html";
    } catch (error) {
      console.error("Failed to create resource:", error);
      alert("Could not create resource.");
    }
  });
});
