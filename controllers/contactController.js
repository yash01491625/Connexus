const asyncHandler = require("express-async-handler");
const Contact = require("../models/contactModel");
// @desc Get all contacts
// @route GET /api/contacts
// @access private
const getContacts = asyncHandler(async (req, res) => {
    const contacts = await Contact.find({
        user_id: req.user.id
    });
    // res.status(200).json({ message: "Get all contacts" });
    res.status(200).json(contacts);
});

// @desc Create a contact
// @route POST /api/contacts
// @access private
const createContact = asyncHandler(async (req, res) => {
    console.log("The request body is: ", req.body);
    const user = req.body;
    if (!user.name || !user.email || !user.phone) {
        res.status(400);
        throw new Error("All fields are mandatory");
    }
    const contact = await Contact.create({
        user_id: req.user.id,
        name: user.name, 
        email: user.email, 
        phone: user.phone
    });
    // res.status(201).json({ message: "Create contact", user });
    res.status(201).json(contact);
});

// @desc Get a contact
// @route GET /api/contacts/:id
// @access private
const getContact = asyncHandler(async (req, res) => {
    const contact = await Contact.findById(req.params.id);
    if (!contact) {
        res.status(404);
        throw new Error("Contact not found");
    } else {
        // res.status(200).json({ message: `Get contact ${req.params.id}` });
        res.status(200).json(contact);
    }
});

// @desc Update a contact
// @route PUT /api/contacts/:id
// @access private
const updateContact = asyncHandler(async (req, res) => {
    const contact = await Contact.findById(req.params.id);
    if (!contact) {
        res.status(404);
        throw new Error("Contact not found");
    } else {
        if (contact.user_id.toString() !== req.user.id) {
            res.status(403);
            throw new Error("User is not allowed to update other contacts");
        }
        const updatedContact = await Contact.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true } 
            /*
                The option { new: true } makes sure that when you update a document in the database, it returns the updated version of the document, not the old one.
                By default, Mongoose returns the document before it was updated, but when you use { new: true }, it tells Mongoose to return the latest, updated version instead.
            */
        );
        res.status(200).json(updatedContact); // Respond with the updated contact
    }
});
    
// @desc Delete a contact
// @route DELETE /api/contacts/:id
// @access private
const deleteContact = asyncHandler(async (req, res) => {
    const contact = await Contact.findById(req.params.id);
    if (!contact) {
        res.status(404);
        throw new Error("Contact not found");
    }
    if (contact.user_id.toString() !== req.user.id) {
        res.status(403);
        throw new Error("User is not allowed to update other contacts");
    }
    console.log("Deleting contact...");
    await Contact.deleteOne({ _id: req.params.id });
    // await Contact.findByIdAndDelete(req.params.id);
    console.log("Contact deleted");
    // res.status(200).json({ message: `Delete contact ${req.params.id}` });
    res.status(200).json(contact);
});

module.exports = { getContacts, createContact, getContact, updateContact, deleteContact };

/* 
With async error handlers we dont need try catch blocks express himself does that so that if any error occurs an error object gets created and it finds for some custom error handler
custom error handlers always have 4 args
next() -> directs control to next middleware
next(error) -> directs control to custom error handler

const errorHandler = (err, req, res, next) => {
    // Handle the error and send a response
};
*/