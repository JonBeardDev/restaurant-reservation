/**
 * Defines the router for tables resources.
 *
 * @type {Router}
 */

const router = require("express").Router({ mergeParams: true });
const controller = require("./tables.controller");
const methodNotAllowed = require("../errors/methodNotAllowed");


// Allow only get and post methods for /tables root
router.route("/").get(controller.list).post(controller.create).all(methodNotAllowed);
// Allow only put method for individual tables
router.route("/:table_id/seat").put(controller.update).all(methodNotAllowed);

module.exports = router;