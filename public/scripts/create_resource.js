// public/scripts/create_resource.js

document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector("form.CreateResource");
  if (!form) {
    console.error("CreateResource form not found");
    return;
  }

  // getting the form elements
  const textInputs = form.querySelectorAll("input[type='text']");
  const titleInput = textInputs[0];        //title
  const capacityInput = textInputs[1];   // capacity
  const dateInputs = form.querySelectorAll("input[type='date']");
  const startDateInput = dateInputs[0];
  const endDateInput = dateInputs[1];
  const timeInputs = form.querySelectorAll("input[type='time']");
  const startTimeInput = timeInputs[0];
  const endTimeInput = timeInputs[1];
  const descInput = form.querySelector("#desc");
  const dayCheckboxes = form.querySelectorAll("input[name='days']");

  // handling form submission
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const title = titleInput.value.trim();
    const startDate = startDateInput.value;
    const endDate = endDateInput.value;
    const startHour = startTimeInput.value;
    const endHour = endTimeInput.value;
    const description = descInput.value.trim();
    const capacityStr = capacityInput.value.trim();

    // if the title was missing
    if (!title) {
      alert("Please enter a resource title.");
      return;
    }

    let capacity = null;
    if (capacityStr !== "") {
      const num = parseInt(capacityStr, 10);
      if (isNaN(num) || num < 0) {
        alert("Capacity cannot be a negative number.");
        return;
      }
      capacity = num;
    }

   
    const dayOrder = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"];
    const weekdaysAvailable = dayOrder.map((dayVal) => {
      const cb = Array.from(dayCheckboxes).find((box) => box.value === dayVal);
      return cb && cb.checked ? 1 : 0;
    });

    // building resource object 
    const newResource = {
    
      title,
      startDate,
      endDate,
      startHour,
      endHour,
      weekdaysAvailable,
      capacity: capacity,         
      description,
      seatsTaken: 0,               
      status: "open",              
      image: "../images/bookings-event-banner.png", 
      street: "",
      postalCode: "",
      peakTime: ""                
    };

    try {
      const res = await fetch("/api/resources", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newResource),
      });

      if (!res.ok) {
        throw new Error(`HTTP error ${res.status}`);
      }

      const data = await res.json();
      console.log("Created resource:", data);

      alert("Resource created successfully.");
      // Go back to resource management page
      window.location.href = "resource_management.html";
    } catch (error) {
      console.error("Failed to create resource:", error);
      alert("Could not create resource.");
    }
  });
});
