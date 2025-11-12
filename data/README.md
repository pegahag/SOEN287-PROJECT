This folder contains all local JSON files used to store user, resource, and booking data for the project.  
Use this file as a reference for data format and field structure.

Below is an example showing how (users, resources, bookings) should look.  
Each type is stored in a separate file (`users.json`, `resources.json`, `bookings.json`)

```json
{
  "users": [
    {
      "id": 1,
      "username": "username",
      "password": "password",
      "role": "admin" or "student",
      "createdEvents": [1,2,3] (array of eventIds),
      "bookedEvents": [1,2,3] (array of eventIds)
    }
  ],

  "resources": [
    {
      "id": 1,
      "title": "title",
      "startDate": "30-12-2025",
      "endDate": "30-12-2025",
      "startHour": "08:00",
      "endHour": "20:00",
      "peakTime": "12:00",
      "weekdaysAvailable": [1, 1, 1, 1, 1, 0, 0] (array of yes/no for MON TUE...),
      "street": "street",
      "postalCode": "H3G 1X4",
      "description": "description",
      "image": "/images/bookings-event-banner.png",
      "status": "open" or "blocked",
      "capacity": 10,
      "seatsTaken": 4
    }
  ],

  "bookings": [
    {
      "id": 1,
      "resourceId": 1,
      "userId": 1,
      "date": "30-12-2025",
      "startTime": "14:00",
      "endTime": "16:00",
      "purpose": "purpose",
      "status": "pending" or "accepted" or "rejected"
    }
  ]
}
