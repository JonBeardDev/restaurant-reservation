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
    .whereNot({ status: "finished"})
    .orderBy("reservation_time");
}

// Add new reservation, return all columns
function create(reservation) {
  return knex("reservations").insert(reservation).returning("*");
}

function read(reservation_id) {
  return knex("reservations")
    .select("*")
    .where({ reservation_id: reservation_id })
    .first();
}

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
};
