let resource_img;
let resource;
let resource_title;
let userID;
let user
let resource_start;
let resource_end;
let booking_purpose;
let booking_date;
let resource_weekdaysAvailable;
let date_input;
let resource_capacity;
let resource_seats_taken;
let bookingID;
let resourceID;
let event_info;
let booking;

//Extracting parameters
const params = new URLSearchParams(window.location.search);
const mode = params.get("mode");
resourceID = params.get("resource");
if(mode=="create"){
    bookingID = false;
}
if(mode=="modify"){
 bookingID = params.get("booking");
}
//GETTING JSON
document.addEventListener("DOMContentLoaded",()=> {
    const container = document.getElementById("event_page");
    Promise.all([
        fetch("/api/resources").then(r => r.json()),
        fetch("/api/bookings").then(b => b.json()),
        fetch("/api/users").then(u => u.json())
    ]).then(([resources, bookings, users]) => {  
//Extracting data into variables
        if (mode=="modify"){
            booking = bookings.find(b => b.id == bookingID);
            if(booking!=null){
                booking_date = booking.date;
                booking_purpose = booking.purpose;
                resourceID = booking.resourceId;
                console.log(resourceID);
            }}
        console.log(resourceID);
        resource = resources.find(r => r.id == resourceID);
        if(resource != null){
            resource_img = resource.image; 
            resource_title = resource.title;
            resource_weekdaysAvailable =  resource.weekdaysAvailable;
            resource_capacity = resource.capacity;
            resource_seats_taken = resource.seatsTaken;
            resource_start = resource.startHour;
            resource_end = resource.endHour;}

        //checking login info
        fetch("/api/auth/me").then(res => res.json()).then(data =>{
        const user = data.user;    
        console.log(user.id)
            if (user) 
                userID = user.id;
        if(mode=="modify"&&(bookingID==null||booking==null))
            event_info = throw_error("bookingNotFound");
        else if(userID==null)
            event_info = throw_error("userNotFound");
        else if(resourceID==null||resource==null)
            event_info = throw_error("resourceNotFound");
        else{
            event_info = build_page();
        }
        container.appendChild(event_info);
    })});});

//Error if info mismatched
function throw_error(error_type){
    const error_page = document.createElement("div");
    error_page.classList.add("error_page");
    if(error_type == "userNotFound")
        error_page.textContent = "Error: User not found";
    if(error_type == "resourceNotFound")
        error_page.textContent = "Error: Resource not found";
    if(error_type == "bookingNotFound")
        error_page.textContent = "Error: Booking not found";
    return error_page;
}

//BUILD PAGE FUNCTION

function build_page(){
    //main page
    console.log(resource_title);
    const main_page = document.createElement("div");
    main_page.classList.add("main_page");

    const event_page = document.createElement("div");
    event_page.classList.add("event_page");

    //event info container
    const event_info = document.createElement("div");
    event_info.classList.add("event_info");

    //image
    const image_container = document.createElement("figure"); //container
    image_container.classList.add("event_image");
    const img = document.createElement("img");

    img.classList.add("img");                                  //image
    img.src = resource_img;
    img.alt = "banner image";

    //calendar
    const subtitle_heading = document.createElement("div"); //label
    subtitle_heading.classList.add("form_label");
    subtitle_heading.textContent = "Date";

    date_input = document.createElement("input");           //calendar
    date_input.classList.add("calendar");
    date_input.type = "date";
    date_input.id = "date";
    
    if(mode=="modify"){
        date_input.value = jsonToCalenderFormat(booking_date);
    }

    //title
    const event_location = document.createElement("div");
    event_location.classList.add("event_location");
    event_location.textContent = resource_title;

 
    //timeslot   
    const time_slot = document.createElement("label");      //label
    time_slot.HTMLfor = "time-slot";
    time_slot.classList.add("form_label");
    time_slot.textContent = "Time-slot";

    const dropdown_box = document.createElement("div");     //container
    dropdown_box.classList.add("dropdown_box");
    const dropdown_text = document.createElement("label");
    dropdown_text.classList.add("subtitle.heading");
    dropdown_text.textContent = "to"

    const start_dropdown_input = document.createElement("select");      //selectors
    start_dropdown_input.classList.add("dropdown_input");
    const end_dropdown_input = document.createElement("select");
    end_dropdown_input.classList.add("dropdown_input");

    const start_options = getTimeStarts().slice(0, getTimeStarts().length-2);              //options
    const end_options = getTimeStarts().slice(1, getTimeStarts().length);
    for(const text of start_options){
        const optEl = document.createElement("option");
        optEl.textContent = text;
        start_dropdown_input.appendChild(optEl);
    }
    for(const text of end_options){
        const optEl = document.createElement("option");
        optEl.textContent = text;
        end_dropdown_input.appendChild(optEl);
    }

    if (mode === "modify" && booking) {
        start_dropdown_input.value = booking.startTime;
        end_dropdown_input.value   = booking.endTime;
    }

    //purpose
    const purpose = document.createElement("label");    //container
    purpose.classList.add("form_label");
    purpose.HTMLFor = "purpose";

    const purpose_box = document.createElement("input");    //selector
    purpose_box.type="text";
    purpose_box.classList.add("text_box")
    purpose_box.id="purpose";
    if(mode=="create")
        purpose_box.placeholder="Enter Purpose of Reservation";
    if(mode=="modify")
        purpose_box.value=booking_purpose

    //book button
    const book_reservation = document.createElement("div");
    book_reservation.classList.add("book_reservation");
    if(mode=="modify")
        book_reservation.textContent = "Modify Reservation";
    if(mode=="create")
        book_reservation.textContent = "Book Reservation";

    //availability
    const event_availability = document.createElement("div");
    event_availability.classList.add("event_availability");
    checkAvailability();




    //Listeners
    date_input.addEventListener("change", () => {
    check_date();
    checkAvailability();
    });    

    start_dropdown_input.addEventListener("change", () => {
        checkAvailability();
    });

    end_dropdown_input.addEventListener("change", () => {
        checkAvailability();
    });

    //check date 
    function check_date(){
        if(!date_input.value){
            return false;
        }
        else{
            const date = new Date(date_input.value);
            return date;}}

    //convert date to db format
    function getLocalDateFromInput(value) {
            const [year, month, day] = value.split("-").map(Number);
            // month is 0-based in JS Date
            return new Date(year, month - 1, day);
            }

    //convert date out of db format
    function jsonToCalenderFormat(date_string){
        const [day, month, year] = date_string.split("-");
        return year + "-" + month + "-" + day;
    }
     
    //format date  
    function format_date(date){
        if(!date_input.value){
            return false;
        }
        else{
            const date = new Date(getLocalDateFromInput(date_input.value)).toLocaleDateString("en-GB").replace(/\//g, "-");;
            return date;}}

    //check availability
    function checkAvailability()
    {
        event_availability.classList.add("unavailable");
        event_availability.textContent = "Unavailable";
        const dateIndex = check_date().getDay;;
        if (resource_weekdaysAvailable[dateIndex] == 0){
            return false;}
        if (resource_capacity == resource_seats_taken){
            return false;}
        if(!start_dropdown_input||!end_dropdown_input){
            return false;}
        if (Number((start_dropdown_input.value.slice(0,2))>Number(end_dropdown_input.value.slice(0,2))||(start_dropdown_input.value.slice(0,2))==Number(end_dropdown_input.value.slice(0,2))&&Number(start_dropdown_input.value.slice(3,5))>=Number(end_dropdown_input.value.slice(3,5)))){
            return false;
        }
        event_availability.classList.remove("unavailable");
        event_availability.classList.add("available");
        event_availability.textContent = "Available";
        return true;
        
    }

    //submit a booking
    function submitBooking(booking){
        fetch("http://localhost:3000/api/bookings",{
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(booking)
        })
    }
    //update a booking
    function updateBooking(booking){
        fetch("http://localhost:3000/api/bookings/" + bookingID,{
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(booking)
        })
    }

    function addLeadingZero(num){
        if(String(num).length==1)
            return "0" + String(num);
        else{
            return String(num);
        }
    }

    function getTimeStarts(){
        let startTimes = [];
        let inBounds = true;
        let start_hours = Number(resource_start.slice(0,2));
        let start_minutes = Number(resource_start.slice(3,5));
        let end_hours = Number(resource_end.slice(0,2));
        let end_minutes = Number(resource_end.slice(3,5));
        while(inBounds){
            if (start_hours>end_hours||start_hours==end_hours&&start_minutes>end_minutes)
            {
                inBounds = false;
                return startTimes;
            }
            if(start_minutes==0){
                startTimes.push(addLeadingZero(start_hours) + ":00");
                start_minutes = 30;
            }
            if(start_minutes==30){
                startTimes.push(addLeadingZero(start_hours) + ":30")
                start_hours +=1;
                start_minutes = 0;
            }}}
        
    

    //listener to submit
    book_reservation.addEventListener("click", () => {
        if(mode=="create"){
            
            submitBooking({
                resourceId: Number(resourceID),
                userId: Number(userID),
                date: format_date(),
                startTime: start_dropdown_input.value,
                endTime: end_dropdown_input.value,
                purpose: purpose_box.value,
                status: "pending"
         });
         alert("Your booking has been successfully saved.");
         window.location.href = "../pages/my_bookings.html";        }
        if(mode=="modify"){
            updateBooking({
                date: format_date(),
                startTime: start_dropdown_input.value,
                endTime: end_dropdown_input.value,
                purpose: purpose_box.value,
                status: "pending"
            })
            alert("Your booking has been successfully modified.");
            window.location.href = "../pages/my_bookings.html";        }
    });

    //stitch everything together
    main_page.appendChild(event_page);
    event_page.appendChild(image_container);
    image_container.appendChild(img);
    event_page.append(event_info);
    event_info.appendChild(event_location);
    event_info.appendChild(event_availability);
    event_info.appendChild(subtitle_heading);
    event_info.appendChild(date_input);
    event_info.appendChild(time_slot);
    event_info.append(purpose);
    event_info.appendChild(book_reservation);
    
    time_slot.appendChild(dropdown_box);
    dropdown_box.appendChild(start_dropdown_input);
    dropdown_box.appendChild(dropdown_text)
    dropdown_box.appendChild(end_dropdown_input);
    purpose.appendChild(purpose_box);

    return main_page;
}
