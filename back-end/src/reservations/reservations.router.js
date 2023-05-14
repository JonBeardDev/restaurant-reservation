/**
 * Defines the router for reservation resources.
 *
 * @type {Router}
 */

const router = require("express").Router({ mergeParams: true });
const controller = require("./reservations.controller");
const methodNotAllowed = require("../errors/methodNotAllowed");

// Allow only get and post methods for /reservations root
router
  .route("/")
  .get(controller.list)
  .post(controller.create)
  .all(methodNotAllowed);
// Allow only get and put methods for individual reservation ids
router
  .route("/:reservation_id")
  .get(controller.read)
  .put(controller.update)
  .all(methodNotAllowed);
// Allow only put method for reservation status
router
  .route("/:reservation_id/status")
  .put(controller.updateStatus)
  .all(methodNotAllowed);

module.exports = router;
