let resource_img;
let resource;
let booking_purpose;
let resource_weekdaysAvailable;
let date_input;
let resource_start_time;
let resource_end_time;
document.addEventListener("DOMContentLoaded",()=> {
    const container = document.getElementById("event_page");
    Promise.all([
        fetch("/api/resources").then(r => r.json()),
        fetch("/api/bookings").then(b => b.json())
    ]).then(([resources, bookings]) => {       
       // let resource = resources.find(r => r.id == resourceID);
        resource = resources[0];
        resource_img = resource.image; 
        resource_weekdaysAvailable =  resource.weekdaysAvailable;
        resource_start_time = resource.startTime;
        resource_end_time = resource.endTime;

        if (mode=="modify"){
        //let booking = bookings.find(b => b.id == bookingID);
        let booking = bookings[0];
        booking_purpose = booking.purpose;  
    }
    const event_info = build_page();
    container.appendChild(event_info);
 });
});

const params = new URLSearchParams(window.location.search);
const mode = params.get("mode");
const bookingID = params.get("booking");
const resourceID = params.get("resource");


function build_page(){
    const event_info = document.createElement("div");
    event_info.classList.add("event_info");
    console.log("yeahhh we in here boy!");
    //<figure class="event_image">
    const image_container = document.createElement("figure");
    image_container.classList.add("image_container");
    //<img src="../images/test_img.jpg" alt="A picture of a bear. Sweet!">
    const img = document.createElement("img");
    img.classList.add("img");
   // img.src = resource_img;
    img.src = "/images/test_img.jpg"
    console.log(img.src);
    img.alt = "banner image";

     //<input type="date" class="calendar" id="date">
     date_input = document.createElement("input");
     date_input.classList.add("calendar");
     date_input.type = "date";
     date_input.id = "date";


    //<div class="event_title">Location Being Booked</div>
    const event_location = document.createElement("div");
    event_location.classList.add("event_location");
    event_location.textContent = "PLACEHOLDER TEXT COME BACK TO ME PLEASE";

    //<div class="event_availability">Available</div>
    const event_availability = document.createElement("div");
    event_availability.classList.add("event_availability");
    if (checkAvailability(resource)){
        event_availability.classList.add("available");
        event_availability.textContent = "Available"}
    else{
        event_availability.classList.add("unavailable");
        event_availability.textContent = "Unavailable";
    }

    //<div class="subtitle_heading">Date</div>
    const subtitle_heading = document.createElement("div");
    subtitle_heading.classList.add("subtitle_heading");
    subtitle_heading.textContent = "Date";
    
   

   // <label for="time-slot" class="form_label">Time-slot</label>
    const time_slot = document.createElement("label");
    time_slot.HTMLfor = "time-slot";
    time_slot.classList.add("form_label");
    time_slot.textContent = "Time-slot";

    /*
    <select id="time-slot" class="dropdown_input">
                    <option value="">Select a time</option>
                        <option>08:00 - 10:00</option>
                        <option>10:00 - 12:00</option>
                        <option selected>12:00 - 14:00</option>
                        <option>14:00 - 16:00</option>
                    </select>
                    */
    const start_dropdown_input = document.createElement("select");
    const end_dropdown_input = document.createElement("select");
    start_dropdown_input.classList.add("dropdown_input");
    end_dropdown_input.classList.add("dropdown_input");
   // start_dropdown_input.id = "time-slot";
    const start_options = ["10:00", "10:30", "11:00"];
    const end_options = ["10:30", "11:00", "11:30"];
    for(const text of start_options){
        const optEl = document.createElement("option");
        optEl.textContent = text;
        start_dropdown_input.appendChild(optEl);
    }
    for(const text of end_options){
        const optEl = document.createElement("option");
        optEl.textContent = text;
        start_dropdown_input.appendChild(optEl);
    }
    //<label for="purpose" class="form_label">Purpose</label>
    const purpose = document.createElement("label");
    purpose.classList.add("form_label");
    purpose.HTMLFor = "purpose";
    /* <input
                type="text"
                id="purpose"
                class="text_input"
                placeholder="Enter Purpose of Reservation"/>*/
    const purpose_box = document.createElement("input");
    purpose_box.type="text";
    purpose_box.classList.add("text_box")
    purpose_box.id="purpose";
    if(mode=="create")
        purpose_box.placeholder="Enter Purpose of Reservation";
    if(mode=="modify")
        purpose_box.value=booking_purpose

//<div button class="book_reservation">Book Reservation</div>
    const book_reservation = document.createElement("div");
    book_reservation.classList.add("book_reservation");
    if(mode=="modify")
        book_reservation.textContent = "Modify Reservation";
    if(mode=="create")
        book_reservation.textContent = "Book Reservation";

    


//FUNCTIONS

    date_input.addEventListener("change", () => {
    check_date();
    });    

    function check_date(){
        if(!date_input.value){
            return false;
        }
        else{
            const date = new Date(date_input.value);
            return date;
        }

    function checkAvailability(resource)
    {
        const dateIndex = check_date().getDay();;
        if(dateIndex == false)
            return true;
        if (resource_weekdaysAvailable[dateIndex] == 0)
            return false;
        if (resource.capacity == resource.seatsTaken)
            return false;
        return true;
    }

    function submitBooking(booking){
        fetch("http://localhost:3000/api/bookings",{
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(booking)
        })
    }


    book_reservation.addEventListener("click", () => {
        submitBooking({
            resourceId: 1,
            userId: 3,
            date: "18-11-2025",
            startTime: "10:00",
            endTime: "12:00",
            purpose: purpose_box.value,
            status: "pending"
        });
    });

    event_info.appendChild(event_location);
    event_info.appendChild(event_availability);
    event_info.appendChild(subtitle_heading);
    event_info.appendChild(date_input);
    event_info.appendChild(time_slot);
    event_info.append(purpose);
    event_info.appendChild(book_reservation);
    
    
    time_slot.appendChild(dropdown_input);
    purpose.appendChild(purpose_box);

    return event_info;
    }
}