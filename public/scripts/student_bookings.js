document.addEventListener("DOMContentLoaded", () => {
    const container = document.getElementById("card_list");
    container.classList.add("card_list");

    Promise.all([
        fetch("/api/auth/me").then(r => r.json()),
        fetch("http://localhost:3000/api/bookings").then(r => r.json()),
        fetch("http://localhost:3000/api/resources").then(r => r.json())
    ])
    .then(([auth, events, resources]) => {
        const userID = auth.user?.id;

        if (!userID) {
            container.textContent = "Not logged in.";
            return;
        }

        events
          .filter(e => e.userId === userID)
          .forEach(eventData => {
              const resource = resources.find(r => r.id === eventData.resourceId);
              const card = createEventCard(eventData, resource);
              container.appendChild(card);
          });
    })
    .catch(err => {
        console.error("Error loading events:", err);
        container.textContent = "Could not load events.";
    });
});

function date_converter(date){
    const months = ["January","February","March","April","May","June",
                    "July","August","September","October","November","December"];
    const [day, month, year] = date.split("-");
    return `${months[Number(month)-1]} ${day}, ${year}`;
}

function createEventCard(event, resource){
    const resource_title = resource ? resource.title : "Unknown resource";
    const resource_img   = resource ? resource.image : "fallback.png";

    // card
    const card = document.createElement("div");
    card.classList.add("card");

    // image
    const card_image = document.createElement("figure");
    card_image.classList.add("card_image");

    const img = document.createElement("img");
    img.src = resource_img;
    img.alt = resource_title;
    card_image.appendChild(img);

    // body
    const card_body = document.createElement("div");
    card_body.classList.add("card_body");

    const card_title = document.createElement("h1");
    card_title.classList.add("card_title");
    card_title.textContent = event.purpose;

    const resourceP = document.createElement("p");
    resourceP.classList.add("card_text");
    resourceP.textContent = resource_title;

    const card_text = document.createElement("p");
    card_text.classList.add("card_text");
    card_text.textContent = date_converter(event.date);

    const card_meta = document.createElement("p");
    card_meta.classList.add("card_meta");
    card_meta.textContent = `${event.startTime} - ${event.endTime}`;

    const card_buttons = document.createElement("div");
    card_buttons.classList.add("card_buttons");

    const modify_link = document.createElement("a");
    modify_link.href = "event_page.html?mode=modify&booking=" + event.id;


    const modify_button = document.createElement("button");
    modify_button.classList.add("card_button");
    modify_button.textContent = "Modify";

    const cancel_button = document.createElement("button");
    cancel_button.classList.add("card_button");
    cancel_button.textContent = "Cancel";

   cancel_button.addEventListener("click", () => {
    fetch("http://localhost:3000/api/bookings/" + event.id, {
        method: "DELETE"
    })
    .then(res => {
        console.log("DELETE status:", res.status);
        if (!res.ok) {
            throw new Error("Delete failed with status " + res.status);
        }
        return res.json();
    })
    .then(data => {
        console.log("Delete response:", data);
        if (data.success) {
            // either just remove the card:
            card.remove();
            // or, if you prefer:
            alert("Your booking has been successfully deleted.")
            location.reload();
        }
    })
    .catch(err => {
        console.error("Delete error:", err);
    });
});

    modify_link.appendChild(modify_button);
    card_buttons.appendChild(modify_link);
    card_buttons.appendChild(cancel_button);

    card.appendChild(card_image);
    card.appendChild(card_body);

    card_body.appendChild(card_title);
    card_body.appendChild(resourceP);
    card_body.appendChild(card_text);
    card_body.appendChild(card_meta);
    card_body.appendChild(card_buttons);

    return card;
}
