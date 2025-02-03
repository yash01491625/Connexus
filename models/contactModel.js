const mongoose = require("mongoose");

const contactSchema = mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "User",    
    },
    name: {
        type: String,
        required: [true, "Please add the contact name"],
    },
    email: {
        type: String,
        required: [true, "Please add the email address"],
    },
    phone: {
        type: String,
        required: [true, "Please add Phone Number"],
    },
}, {
    timestamps: true, // Automatically adds createdAt and updatedAt fields, allows to track when a document was updated and created
});

module.exports = mongoose.model("Contact", contactSchema);

/*
When you create a model using mongoose.model("Contact", contactSchema), the "Contact" part is the name of the model.
Mongoose automatically turns the model name into a collection name in the database by making it lowercase and plural.
So, "Contact" becomes "contacts" as the collection name in MongoDB.
*/