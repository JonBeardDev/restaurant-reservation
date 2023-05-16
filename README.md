# Periodic Table
## Restaurant Reservation Tracking System

Full PERN stack application for use by restaurant front-of-house/management to keep track of reservation and table seatings.

![image of dashboard, showing cards for booked and seated reservations, and free and occupied tables](/front-end/src/images/Dashboard.png)

## Live demonstration
App can be viewed here: https://restaurant-reservation-app-gamma.vercel.app/
Server located at: https://restaurant-reservation-server-flax.vercel.app/

## Features
### Reservation Management
1. Create new reservations: From the navbar, select "New Reservation", which will prompt a screen that allows the user to enter customer details for the reservation.
    - Dates are automatically limited to only those days the restaurant is open (demo site is closed on Tuesdays)
    - Times are limited to opening hours - up to an hour before closing (demo site is open from 10:30am to 10pm)
    - Contact number field automatically adds and removes dashes for ease of use in correct formatting.

![image of the reservation form, including blank fields for first and last name, contact number, reservation date and time, and number of guests](/front-end/src/images/New-Reservation.png)

2. Edit, seat, and cancel reservation: Once a reservation is made and while its status is "Booked", the reservation can be edited, seated, or cancelled via the buttons on the reservation card on the dashboard.
    - Cancelled reservations are not visible on the dashboard.

3. Search for reservations: Is a customer calling to change their future reservation date, time, or party size? The Search page, accessible via the navbar, allows you to search for reservations by phone number.
    - Revervations will show in latest to earliest date order - no need to scroll through multiple reservations to find the most recent one.
    - Reservations of all statuses (Booked, Seated, Finished, and Cancelled) will show in searches.
    - Try submitting 123-456-7890 for an example.



### Table Management 
1. Create new tables: Add new tables to your dashboard via the New Table page, selectable from the navbar.
    - Tables should be given a 2+ character name and a capacity.
    - Tables will show up in the table section of the dashboard to right of the page (bottom of the page on smaller screens).

![image of the table form, including blank fields for table name and capacity](/front-end/src/images/New-Table.png)

2. Edit and unseat tables: Each table icon is a button whose action will depend on the table's status.
    - Unoccupied (free) tables can be edited or removed. Selecting the table will take you to the Edit Table page.
    - Selecting an occupied table will remove the seated party from the table, freeing it up for the next seating and marking the reservation as finished.
    - Finished reservations are not visible on the dashboard.

![image showing an occupied and unoccupied table along with explanation to select a table to perform unseating or editng actions on it](/front-end/src/images/Tables.png)

## API
### "/reservations" / "/reservations?date=" / "reservations?mobile_number="
- GET: Lists all reservations for specific date, ordered by reservation time (today, if no date provided), OR lists all reservations for specific or partial contact number.
- POST: Creates new reservation. Includes validation for all fields.

### "/reservations/:reservation_id"
- GET: Returns details for the reservation with given reservation_id.
- PUT: Updates all details for the reservation with given reservation_id. Includes validation for all fields.

### "/reservations/:reservation_id/status"
- PUT: Updates the status of the reservation with given reservation_id. Used for seating, finishing, or cancelling a reservation, so the reservation remains searchable in the system.

### "/tables"
- GET: Lists all tables.
- POST: Creates new table. Includes validation for all fields.

### "/tables/:table_id"
- GET: Returns details for the table with given table_id.
- PUT: Updates all details for the table with given table_id. Includes validation for all fields.
- DELETE: Removes the table with given table_id from the dtabase.

### "/tables/:table_id/seat"
- PUT: Adds the reservation_id of the seated reservation to the table's reservation_id field. This then marks the table as occupied on the front-end.
- DELETE: Removes the reservation_id of the seated reservation from the table's reservation_id field. This then marks the table as free on the front-end. NOTE: this method does NOT delete the table from the database.

## Installation

1. Fork and clone this repository.
1. Run `cp ./back-end/.env.sample ./back-end/.env`.
1. Update the `./back-end/.env` file with the connection URL's to your ElephantSQL database instance.
1. Run `cp ./front-end/.env.sample ./front-end/.env`.
1. You should not need to make changes to the `./front-end/.env` file unless you want to connect to a backend at a location other than `http://localhost:5001`.
1. Run `npm install` to install project dependencies.
1. Run `npm run start` to start your server.