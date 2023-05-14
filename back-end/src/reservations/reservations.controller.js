const service = require("./reservations.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");
const hasProperties = require("../errors/hasProperties");

// Valid properties for creating/updating a reservation
const VALID_PROPERTIES = [
  "first_name",
  "last_name",
  "mobile_number",
  "reservation_date",
  "reservation_time",
  "people",
  "reservation_id",
  "created_at",
  "updated_at",
  "status",
];

// Valid statuses for a reservation
const VALID_STATUS = ["booked", "seated", "finished", "cancelled"];

// Main function: List all reservation for a given date or mobile number
async function list(req, res) {
  const { date, mobile_number } = req.query;

  // If date query included in request url, use to list all reservations for that date
  if (date) {
    res.json({ data: await service.listByDate(date) });
  } else if (mobile_number) {
    res.json({ data: await service.listByMobile(mobile_number) });
  }
  // Otherwise list all reservations
  else {
    res.json({ data: await service.list() });
  }
}

// Middleware: Confirms req.body only has valid reservation properties
// Used in: create and update
function hasOnlyValidProperties(req, res, next) {
  const { data = {} } = req.body;
  res.locals.reservationData = req.body.data;

  // Create array of any fields in the req body that are NOT in the list of valid properties
  const invalidFields = Object.keys(data).filter((field) => {
    !VALID_PROPERTIES.includes(field);
  });
  // If any fields exist in invalid fields array return 400 error
  if (invalidFields.length)
    return next({
      status: 400,
      message: `Invalid field(s): ${invalidFields.join(",")}`,
    });

  next();
}

// Middleware: Use hasProperties function (in errors folder) to confirm req body has all required reservation properties
// Used in: create and update
const hasRequiredProperties = hasProperties(
  "first_name",
  "last_name",
  "mobile_number",
  "reservation_date",
  "reservation_time",
  "people"
);

// Middleware: Confirm "people" property is a valid integer greater than 0
// Used in: create and update
function peopleIsNumber(req, res, next) {
  const { people } = res.locals.reservationData;
  const validNumber = Number.isInteger(people);
  // Check if people is a valid (i.e greater than 0) integer. If not, return 400 error
  if (!validNumber || people <= 0) {
    return next({
      status: 400,
      message:
        "The number of people entered is invalid. Number of people must be at least 1",
    });
  }

  next();
}

// Middleware: Confirm reservation date and time have valid date and time structures
// Used in: create and update
function hasValidDateTime(req, res, next) {
  const { reservation_date, reservation_time } = res.locals.reservationData;

  // Convert separate date and time stamps in req body to a Date strucutre
  const reservationDateTime = reservation_date + " " + reservation_time;
  const reservation = new Date(reservationDateTime);

  // RegEx to use to confirm time is valid (1 or 2 digit hours up to 23, separated from minutes by a colon)
  const timeCheck = /^([0-9]|0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/;

  // Use RegEx to confirm valid time. If not, return 400 error
  if (!reservation_time.match(timeCheck)) {
    return next({
      status: 400,
      message: `reservation_time ${reservation_time} is not a valid time`,
    });
  }

  // Confirm date/time is a valid date number. If not, return 400 error
  if (isNaN(reservation.getDate())) {
    return next({
      status: 400,
      message: `reservation_date ${reservation_date} is not a valid date`,
    });
  }

  next();
}

// Middleware: Confirm reservation date is not on a Tuesday
// Used in: create and update
function notTuesday(req, res, next) {
  const { reservation_date } = res.locals.reservationData;
  const resDateObj = new Date(reservation_date);

  // getUTCDay returns a value for each day of the week, where Tuesday = 2
  // If the reservation date's UTC day is 2, it is not valid
  if (resDateObj.getUTCDay() === 2) {
    next({
      status: 400,
      message:
        "Reservations cannot be made for Tuesdays, as the restaurant is closed.",
    });
  }

  next();
}

// Middleware: Confirm reservation is not for a past date (or past time for today)
// Used in: create and update
function notInPast(req, res, next) {
  const { reservation_date, reservation_time } = res.locals.reservationData;

  // Set a date/time that Date.parse can read to ensure reservations for later the same day are possible
  const parsableTime = `${reservation_date}T${reservation_time}:00`;
  if (Date.parse(parsableTime) < Date.now()) {
    next({
      status: 400,
      message: "Reservations must be made for a future date/time.",
    });
  }

  next();
}

// Middleware: Confirm reservation time is during opening hours
// Used in: create and update
function availableTime(req, res, next) {
  const { reservation_time } = res.locals.reservationData;

  // Remove the colon from the time value to compare as an integer
  const timeNoColon = reservation_time.replace(":", "");

  if (timeNoColon < 1030) {
    next({
      status: 400,
      message: "Reservation must be no earlier than 10:30am.",
    });
  }
  if (timeNoColon > 2130) {
    next({ status: 400, message: "Reservation must be no later than 9:30pm." });
  }

  next();
}

// Middleware: Confirm a new reservation's status is set to "booked or is null"
// Used in: create and update
function statusIsBooked(req, res, next) {
  const { status } = res.locals.reservationData;

  if (status && status !== "booked") {
    next({
      status: 400,
      message: `Invalid status: ${status}. Status must be 'booked' for new reservations.`,
    });
  }
  next();
}

// Main function: With validation complete, create new reservation
async function create(req, res) {
  const newReservation = await service.create(res.locals.reservationData);
  res.status(201).json({ data: newReservation[0] });
}

// Middleware: Confirm reservation ID in req parameters exists in DB
// Used in: read, update, and updateStatus
async function reservationExists(req, res, next) {
  const reservation_id = req.params.reservation_id;
  const reservation = await service.read(reservation_id);

  if (reservation) {
    res.locals.reservation = reservation;
    return next();
  }

  next({
    status: 404,
    message: `Reservation ID ${reservation_id} cannot be found.`,
  });
}

// Main function: Return individual reservation
function read(req, res, next) {
  res.json({ data: res.locals.reservation });
}

// Middleware: Confirm update status is a valid string
// Used in : updateStatus
function hasValidStatus(req, res, next) {
  const { data = {} } = req.body;
  if (!VALID_STATUS.includes(data.status)) {
    return next({
      status: 400,
      message: `Invalid status: ${data.status}. Reservation status may only be 'booked', 'seated', 'finished', or 'cancelled.`,
    });
  }
  next();
}

// Middleware: Confirm that current reservation status is not "finished", as finished reservations cannot be updated
// Used in: updateStatus
function isFinished(req, res, next) {
  const status = res.locals.reservation.status;
  if (status === "finished") {
    return next({
      status: 400,
      message: "A 'finished' reservation cannot be updated.",
    });
  }
  next();
}

// Main function: Update status of an existing reservation when seating, finishing, or cancelling a reservation
async function updateStatus(req, res) {
  const updatedRes = {
    ...req.body.data,
    reservation_id: res.locals.reservation.reservation_id,
  };
  const data = await service.updateStatus(updatedRes);
  res.status(200).json({ data });
}

// Main function: Update a reservation with "booked" status
async function update(req, res) {
  const updatedRes = {
    ...req.body.data,
    reservation_id: res.locals.reservation.reservation_id,
  };
  const data = await service.update(updatedRes);
  res.json({ data });
}

module.exports = {
  list: asyncErrorBoundary(list),
  create: [
    hasOnlyValidProperties,
    hasRequiredProperties,
    hasValidDateTime,
    peopleIsNumber,
    notTuesday,
    notInPast,
    availableTime,
    statusIsBooked,
    asyncErrorBoundary(create),
  ],
  read: [asyncErrorBoundary(reservationExists), read],
  updateStatus: [
    asyncErrorBoundary(reservationExists),
    hasValidStatus,
    isFinished,
    asyncErrorBoundary(updateStatus),
  ],
  update: [
    asyncErrorBoundary(reservationExists),
    hasOnlyValidProperties,
    hasRequiredProperties,
    hasValidDateTime,
    peopleIsNumber,
    notTuesday,
    notInPast,
    availableTime,
    statusIsBooked,
    update,
  ],
};
