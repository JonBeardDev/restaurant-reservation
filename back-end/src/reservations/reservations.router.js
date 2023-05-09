/**
 * Defines the router for reservation resources.
 *
 * @type {Router}
 */

const router = require("express").Router({ mergeParams: true });
const controller = require("./reservations.controller");
const methodNotAllowed = require("../errors/methodNotAllowed");


// Allow only get and post methods for /reservations root
router.route("/").get(controller.list).post(controller.create).all(methodNotAllowed);
router.route("/:reservation_id").get(controller.read).all(methodNotAllowed);

module.exports = router;
