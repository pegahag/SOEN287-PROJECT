document.addEventListener("DOMContentLoaded",()=> {
    const container = document.getElementById("card_list");
    fetch("../../data/bookings.json")
    .then(response => {
        if (!response.ok){
            throw new Error("Network response was not ok");
        }
        return response.json();
    })

    .then(events => {
        events.forEach(eventData => {
            const card = createEventCard(eventData);
            container.appendChild(card);
        })
    })
    .catch(err => {
        console.error("Error loading events:", err);
        container.textContent = "Could not load events.";

    });});

    function createEventCard(event){
        //<div class="card">
        const card = document.createElement("div");
        card.classList.add("card");

        //<figure class="card_image">
        const card_image = document.createElement("figure");
        card_image.classList.add("card_image");

        const img = document.createElement("img");
        img.src="../images/test_img.jpg" 
        img.alt="A picture of a bear. Sweet!";
        card_image.appendChild(img);

        //<div class="card_body"></div>
        const card_body = document.createElement("div");
        card_body.classList.add("card_body");

       //<h1 class="card_title">Resource title</h1>
        const card_title = document.createElement("h1");
        card_title.classList.add("card_title");
        card_title.textContent = "placeholder title babyyyyy";

        //<p class="card_meta">Date | 12:00 - 14:00</p>
        const card_meta = document.createElement("p");
        card_meta.classList.add("card_meta");
        card_meta.textContent = event.time;


        //<p class="card_text">card description goes here</p>
        const card_text = document.createElement("p");
        card_text.classList.add("card_text");
        card_text.textContent = event.purpose;

        //<div class="card_buttons">
        const card_buttons = document.createElement("div");
        card_buttons.classList.add("card_buttons");

        //<button class="card_button">Modify / Cancel</button>
        const modify_button = document.createElement("button")
        modify_button.classList.add("card_button");
        modify_button.textContent = "Modify";
        const cancel_button = document.createElement("button")
        cancel_button.classList.add("card_button");
        cancel_button.textContent = "Cancel";
        
        card.appendChild(card_image);
        card.appendChild(card_body);

        card_body.appendChild(card_title);
        card_body.appendChild(card_meta);
        card_body.appendChild(card_text);

        card_buttons.appendChild(modify_button);
        card_buttons.appendChild(cancel_button);

        card_body.appendChild(card_buttons);

        return card;
    }