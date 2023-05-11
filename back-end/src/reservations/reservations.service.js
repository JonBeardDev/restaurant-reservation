const knex = require("../db/connection");

// List all reservations ordered by date then time
// Note: is this needed for final product?
function list() {
  return knex("reservations")
    .select("*")
    .orderBy("reservation_date")
    .orderBy("reservation_time");
}

// List all reservations for given date, ordered by reservation time
function listByDate(date) {
  return knex("reservations")
    .select("*")
    .where({ reservation_date: date })
    .whereNot({ status: "finished" })
    .orderBy("reservation_time");
}

// List all reservations for given mobile number, ordered by date (most recent first)
function listByMobile(mobile_number) {
  return knex("reservations")
    .whereRaw(
      "translate(mobile_number, '() -', '') like ?",
      `%${mobile_number.replace(/\D/g, "")}%`
    )
    .orderBy("reservation_date", "desc");
}

// Add new reservation, return all columns
function create(reservation) {
  return knex("reservations").insert(reservation).returning("*");
}

// Return a single reservation by ID
function read(reservation_id) {
  return knex("reservations")
    .select("*")
    .where({ reservation_id: reservation_id })
    .first();
}

// Update the status of a reservation (when seating or finishing the reservation)
function updateStatus(updatedRes) {
  return knex("reservations")
    .select("*")
    .where({ reservation_id: updatedRes.reservation_id })
    .update({ status: updatedRes.status }, "*")
    .then((data) => data[0]);
}

module.exports = {
  list,
  listByDate,
  create,
  read,
  updateStatus,
  listByMobile,
};
