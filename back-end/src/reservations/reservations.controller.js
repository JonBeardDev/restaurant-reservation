const service = require("./reservations.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");
const hasProperties = require("../errors/hasProperties");

// Valid properties for creating a new reservation (or updating in future user story)
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
];

async function list(req, res) {
  const { date } = req.query;

  // If date query included in request url, use to list all reservations for that date
  if (date) {
    res.json({ data: await service.listByDate(date) });
  }
  // Otherwise list all reservations
  else {
    res.json({ data: await service.list() });
  }
}

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

// Use hasProperties function (in errors folder) to confirm req body has all required properties to create a reservation
const hasRequiredProperties = hasProperties(
  "first_name",
  "last_name",
  "mobile_number",
  "reservation_date",
  "reservation_time",
  "people"
);

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

// When creating a reservation, make sure reservation is not on a Tuesday
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

// When creating a reservation, make sure reservation is not for a past date (or past time for today)
function notInPast(req, res, next) {
  const { reservation_date } = res.locals.reservationData;

  if (Date.parse(reservation_date) < Date.now()) {
    next({
      status: 400,
      message: "Reservations must be made for a future date/time.",
    });
  }

  next();
}

function availableTime(req, res, next) {
  const { reservation_time } = res.locals.reservationData;

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

// With validation complete, create new reservation
async function create(req, res) {
  const newReservation = await service.create(res.locals.reservationData);
  res.status(201).json({ data: newReservation[0] });
}

// Confirm reservation ID exists in DB
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

// Return individual reservation
function read(req, res, next) {
  res.json({ data: res.locals.reservation });
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
    asyncErrorBoundary(create),
  ],
  read: [asyncErrorBoundary(reservationExists), read],
};
