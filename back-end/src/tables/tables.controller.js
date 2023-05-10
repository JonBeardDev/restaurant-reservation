const service = require("./tables.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");
const hasProperties = require("../errors/hasProperties");

// Valid properties for creating a new table (or updating in future user story)
const VALID_PROPERTIES = [
  "table_id",
  "capacity",
  "table_name",
  "reservation_id",
  "created_at",
  "updated_at",
];

// Return all columns for all tables
async function list(req, res, next) {
  const tables = await service.list();
  res.json({ data: tables });
}

// Confirm create request contains only valid properties
function hasOnlyValidProperties(req, res, next) {
  const { data = {} } = req.body;
  res.locals.table = req.body.data;

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

const hasRequiredProperties = hasProperties("table_name", "capacity");

// Validate capacity field as being a number and at least 1
function hasValidCapacity(req, res, next) {
  const { capacity } = res.locals.table;

  if (capacity <= 0 || typeof capacity !== "number") {
    return next({
      status: 400,
      message: `Invalid table capacity: ${capacity}. Capacity must be at least 1.`,
    });
  }
  next();
}

// Validate that table_name field contains at least 2 characters
function hasValidName(req, res, next) {
  let { table_name } = res.locals.table;
  table_name = table_name.trim();

  if (table_name.length < 2) {
    return next({
      status: 400,
      message: `Invalid table_name: ${table_name}. Table name must have at least 2 characters.`,
    });
  }
  next();
}

// Following validation, create new table
async function create(req, res) {
  const newTable = await service.create(res.locals.table);
  res.status(201).json({ data: newTable[0] });
}

async function tableExists(req, res, next) {
  const { table_id } = req.params;
  const table = await service.read(table_id);

  if (table) {
    res.locals.table = table;
    return next();
  }

  next({ status: 404, message: `Table ${table_id} cannot be found.` });
}

function isAvailable(req, res, next) {
  const { table_name, reservation_id } = res.locals.table;

  if (reservation_id) {
    return next({
      status: 400,
      message: `Reservation cannot be seated at table ${table_name}, as it is already occupied.`,
    });
  }
  next();
}

async function reservationExists(req, res, next) {
  const { data } = req.body;

  if (!data || !data.reservation_id) {
    return next({ status: 400, message: "Missing valid reservation_id" });
  }

  const { reservation_id } = data;
  const reservation = await service.readReservation(reservation_id);

  if (reservation) {
    res.locals.people = reservation.people;
    return next();
  }

  next({
    status: 404,
    message: `Reservation ${reservation_id} cannot be found.`,
  });
}

function hasAvailableCapacity(req, res, next) {
  const { table_name, capacity } = res.locals.table;
  const people = res.locals.people;

  if (people > capacity) {
    return next({
      status: 400,
      message: `The capacity of table ${table_name} is too small for a reservation of ${people} people.`,
    });
  }
  next();
}

async function update(req, res) {
  const { reservation_id } = req.body.data;
  const updatedTable = { ...res.locals.table, reservation_id: reservation_id };

  const data = await service.update(updatedTable);
  res.status(200).json({ data });
}

function notOccupied(req, res, next) {
  const { table_name, reservation_id } = res.locals.table;

  if (!reservation_id) {
    return next({
      status: 400,
      message: `Table ${table_name} is not occupied.`,
    });
  }
  next();
}

async function destroy(req, res, next) {
  const { table_id } = res.locals.table;
  const data = await service.destroy(table_id);
  res.status(200).json({ data });
}

module.exports = {
  list: asyncErrorBoundary(list),
  create: [
    hasOnlyValidProperties,
    hasRequiredProperties,
    hasValidCapacity,
    hasValidName,
    asyncErrorBoundary(create),
  ],
  update: [
    asyncErrorBoundary(tableExists),
    isAvailable,
    asyncErrorBoundary(reservationExists),
    hasAvailableCapacity,
    asyncErrorBoundary(update),
  ],
  delete: [
    asyncErrorBoundary(tableExists),
    notOccupied,
    asyncErrorBoundary(destroy),
  ],
};
