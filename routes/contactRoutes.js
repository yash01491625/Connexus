const express = require("express");
const router = express.Router();
const validateToken = require("../middleware/validateTokenHandler");
const {
    getContacts,
    createContact,
    getContact,
    updateContact,
    deleteContact,
} = require('../controllers/contactController');

// Define routes
router.use(validateToken);
router.route("/")
    .get(getContacts)       // Get all contacts
    .post(createContact);   // Create a new contact

router.route("/:id")
    .get(getContact)        // Get a specific contact
    .put(updateContact)     // Update a specific contact
    .delete(deleteContact); // Delete a specific contact

module.exports = router;