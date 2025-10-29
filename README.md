# SOEN287-PROJECT
Group project for SOEN287 - Managing university resources


# Members:
1- Dylan Bourret 40287207
2- Pegah Aghili 40113508
3- Amara Liem 40306263
4- Bowen Yao 40269137

# Installation guide: 
1. Download and extract the compressed folder called SOEN287-PROJECT to your computer
  - Make sure the folder keeps this structure (don’t move files around)

2. Open the Website
  - Open the SOEN287-PROJECT folder
  - Go to the pages sub-folder
  - Double-click catalogue.html — this is the starting page of the website: It will open directly in your web browser

3. Optional: (Using Live Server)
  - If some features like images or JavaScript don’t load correctly, use VS Code’s Live Server extension:
  - Open the project folder in VS Code
  - Right-click on pages/catalogue.html
  - Click “Open with Live Server.”: The site will open automatically in your browser

4. Troubleshooting
  - If pages don’t display correctly, check that you open catalogue.html from the pages folder
  - If styles or scripts don’t load, make sure all folders (styles, scripts, data, images) stay in the same main directory
    

# List of features implemented (front end, mostly hardcoded):
1- Catalogue page with all the available resources, where you can filter different resource types to make looking for one easier.
2- Sign-in and log-in options along with links to different pages in the navigation bar in the header of each page.
3- For administrator:
  a. A page to view requests, with the option to accept/reject them
    i. One page dedicated to editing a resource
    ii. One page to create a resource
  b. A page to manage current resources, such as deleting, blocking, editing, and creating one
    i. For each resource, the admin is also able to see some stats such as the peak hour of usage, and availability percentage
4- For students and professors:
  a. A page to view all their bookings with the options to cancel or modify one
  b. A page to modify the booking
5- The option to manage and modify profile information, such as user and password, for all users of the website
6- Make the statistics to be dynamically updated


# List of features to be implemented:
1- Retrieve information for users, resources, and bookings dynamically
2- Implement basic CRUD operations (create, edit, delete) for all resource and booking data.
3- Implement backend login and signup validation with session management
4- Enable users to create, modify, and cancel bookings dynamically
5- Prevent overlapping bookings and automatically update resource availability
6- Link the admin request page to the database so that accept/reject actions update the system in real time
7- Allow users to update their profile details dynamically through backend routes
8- Display confirmed bookings dynamically on each user’s calendar page
