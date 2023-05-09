const knex = require("../db/connection");

// List all tables ordered by name
function list() {
  return knex("tables").select("*").orderBy("table_name");
}

// Add new table, return all columns
function create(table) {
  return knex("tables").insert(table).returning("*");
}

// Retrieve table by its ID
function read(table_id) {
  return knex("tables").select("*").where({ table_id: table_id }).first();
}

// Update the reservation ID to "seat" a reservation at a table.
function update(updatedTable) {
  return knex("tables")
    .select("*")
    .where({ table_id: updatedTable.table_id })
    .update({ reservation_id: updatedTable.reservation_id }, "*");
}

// Return people count from reservation, used to determine if a table can seat them
function readReservation(reservation_id) {
  return knex("reservations")
    .select("people")
    .where({ reservation_id: reservation_id })
    .first();
}

module.exports = {
  list,
  create,
  read,
  update,
  readReservation,
};
