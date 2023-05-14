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

// Retrieve all columns of individual reservation
function readReservation(reservation_id) {
  return knex("reservations")
    .select("*")
    .where({ reservation_id: reservation_id })
    .first();
}

// Sets a table's reservation ID to null, freeing it up for re-seating
function unseat(table_id) {
  return knex("tables")
    .select("*")
    .where({ table_id: table_id })
    .update({ reservation_id: null }, "*");
}

// Sets the status of a reservation to seated when added to a table
function statusToSeated(reservation_id) {
  return knex("reservations")
    .select("*")
    .where({ reservation_id: reservation_id })
    .update({ status: "seated" }, "*");
}

// Set the status of a reservation to finished when removed from a table
function statusToFinished(reservation_id) {
  return knex("reservations")
    .select("*")
    .where({ reservation_id: reservation_id })
    .update({ status: "finished" }, "*");
}

// Retrieve all columns of an individual table
function readTable(table_id) {
  return knex("tables").select("*").where({ table_id: table_id }).first();
}

// Update all columns for a specific table ID
function editTable(updatedTable) {
  return knex("tables")
    .select("*")
    .where({ table_id: updatedTable.table_id })
    .update(updatedTable, "*");
}

// Remove a table from the database
function destroy(table_id) {
  return knex("tables").where({ table_id: table_id }).del();
}

module.exports = {
  list,
  create,
  read,
  update,
  readReservation,
  unseat,
  statusToSeated,
  statusToFinished,
  readTable,
  editTable,
  destroy,
};
