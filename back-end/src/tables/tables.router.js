/**
 * Defines the router for tables resources.
 *
 * @type {Router}
 */

const router = require("express").Router({ mergeParams: true });
const controller = require("./tables.controller");
const methodNotAllowed = require("../errors/methodNotAllowed");

// Allow only get and post methods for /tables root
router
  .route("/")
  .get(controller.list)
  .post(controller.create)
  .all(methodNotAllowed);
// Allow only put and delete methods for seating individual tables
router
  .route("/:table_id/seat")
  .put(controller.update)
  .delete(controller.unseat)
  .all(methodNotAllowed);
// Allow only get, put, and delete methods for individual tables (extra functionality beyond original scope)
router
  .route("/:table_id")
  .get(controller.read)
  .put(controller.editTable)
  .delete(controller.delete)
  .all(methodNotAllowed);

module.exports = router;
