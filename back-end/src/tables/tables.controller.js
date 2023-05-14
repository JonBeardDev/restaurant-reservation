const service = require("./tables.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");
const hasProperties = require("../errors/hasProperties");

// Valid properties for creating/updating a table
const VALID_PROPERTIES = [
  "table_id",
  "capacity",
  "table_name",
  "reservation_id",
  "created_at",
  "updated_at",
];

// Main function: Return all columns for all tables
async function list(req, res, next) {
  const tables = await service.list();
  res.json({ data: tables });
}

// Middleware: Confirm create request contains only valid properties
// Used in: create and editTable
function hasOnlyValidProperties(req, res, next) {
  const { data = {} } = req.body;
  res.locals.tableData = req.body.data;

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

// Middleware: Use hasProperties function (in errors folder) to confirm req body has all required table properties
// Used in: create and editTable
const hasRequiredProperties = hasProperties("table_name", "capacity");

// Middleware: Validate capacity field as being a number and at least 1
// Used in: create and editTable
function hasValidCapacity(req, res, next) {
  const { capacity } = res.locals.tableData;

  if (capacity <= 0 || typeof capacity !== "number") {
    return next({
      status: 400,
      message: `Invalid table capacity: ${capacity}. Capacity must be at least 1.`,
    });
  }
  next();
}

// Middleware: Validate that table_name field contains at least 2 characters
// Used in: create and editTable
function hasValidName(req, res, next) {
  let { table_name } = res.locals.tableData;
  table_name = table_name.trim();

  if (table_name.length < 2) {
    return next({
      status: 400,
      message: `Invalid table_name: ${table_name}. Table name must have at least 2 characters.`,
    });
  }
  next();
}

// Main function: Following validation, create new table
async function create(req, res) {
  const newTable = await service.create(res.locals.tableData);
  res.status(201).json({ data: newTable[0] });
}

// Middleware: Confirm table ID in req parameters exists in database
// Used in: update, unseat, read, editTable, and delete
async function tableExists(req, res, next) {
  const { table_id } = req.params;
  const table = await service.read(table_id);

  if (table) {
    res.locals.table = table;
    return next();
  }

  next({ status: 404, message: `Table ${table_id} cannot be found.` });
}

// Middleware: Confirm table is not occupied (reservation_id column must be null)
// Used in: update
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

// Middleware: Confirm reservation ID to be seated exists req body and in database
// Used in: update
async function reservationExists(req, res, next) {
  const { data } = req.body;

  if (!data || !data.reservation_id) {
    return next({ status: 400, message: "Missing valid reservation_id" });
  }

  const { reservation_id } = data;
  const reservation = await service.readReservation(reservation_id);

  if (reservation) {
    res.locals.reservation = reservation;
    return next();
  }

  next({
    status: 404,
    message: `Reservation ${reservation_id} cannot be found.`,
  });
}

// Middleware: Confirm status of reservation to be seated is set to "booked"
// Used in: update
function statusIsBooked(req, res, next) {
  const status = res.locals.reservation.status;
  if (status === "seated") {
    return next({
      status: 400,
      message: "Reservation is already seated.",
    });
  }
  if (status === "finished") {
    return next({
      status: 400,
      message: "Reservation is already finished.",
    });
  }
  if (status === "cancelled") {
    return next({
      status: 400,
      message: "Reservation is cancelled."
    })
  }
  next();
}

// Middleware: Confirm table has a high enough capacity to seat all people in reservation
// Used in: update
function hasAvailableCapacity(req, res, next) {
  const { table_name, capacity } = res.locals.table;
  const people = res.locals.reservation.people;

  if (people > capacity) {
    return next({
      status: 400,
      message: `The capacity of table ${table_name} is too small for a reservation of ${people} people.`,
    });
  }
  next();
}

// Main function: Update a table's reservation ID to that of the reservation to be seated
async function update(req, res) {
  const { reservation_id } = req.body.data;
  const updatedTable = { ...res.locals.table, reservation_id: reservation_id };

  await service.statusToSeated(reservation_id);
  const data = await service.update(updatedTable);
  res.status(200).json({ data });
}

// Middleware: Confirm a table's reservation ID is not null and therefore is occupied
// Used in: unseat
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

// Main function: Remove a reservation ID from a table so it is marked as free again
async function unseat(req, res, next) {
  const { table_id, reservation_id } = res.locals.table;
  await service.statusToFinished(reservation_id);
  const data = await service.unseat(table_id);
  res.status(200).json({ data });
}

// Main function: Return all columns of an individual table
function read(req, res) {
  res.json({ data: res.locals.table });
}

// Main function: Update all columns of an existing table
async function editTable(req, res) {
  const updatedTable = {
    ...req.body.data,
    table_id: res.locals.table.table_id,
  };

  const data = await service.editTable(updatedTable);
  res.json({ data });
}

// Main function: Delete a table from the database
async function destroy(req, res) {
  await service.destroy(res.locals.table.table_id);
  res.sendStatus(204);
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
    statusIsBooked,
    hasAvailableCapacity,
    asyncErrorBoundary(update),
  ],
  unseat: [
    asyncErrorBoundary(tableExists),
    notOccupied,
    asyncErrorBoundary(unseat),
  ],
  read: [asyncErrorBoundary(tableExists), read],
  editTable: [
    asyncErrorBoundary(tableExists),
    hasOnlyValidProperties,
    hasRequiredProperties,
    hasValidCapacity,
    hasValidName,
    asyncErrorBoundary(editTable),
  ],
  delete: [asyncErrorBoundary(tableExists), asyncErrorBoundary(destroy)],
};
