# SOEN287-PROJECT
Group project for SOEN287 - Managing university resources

# Members:
1- Dylan Bourret 40287207
2- Pegah Aghili 40113508
3- Amara Liem 40306263
4- Bowen Yao 40269137

# Installation guide: 
1. Download and extract the compressed folder named *SOEN287-PROJECT* to your computer. 
After extracting it, ensure that the internal folder structure remains intact, avoid moving, renaming, or reorganizing any of the files or directories.

2. To launch the website, start by opening a terminal in the project’s root directory. 
From there, install all required dependencies and start the website server by running the following commands:
* `npm install`
* `npm start`
Once these commands are complete, the website will be available in your browser at [http://localhost:3000].


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
