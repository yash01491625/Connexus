const express = require("express");
const dotenv = require("dotenv").config();
const port = process.env.PORT || 5000;
const app = express();
const errorHandler = require("./middleware/errorHandler.js");
const { connection } = require("mongoose");
const connectDb = require("./config/dbconnection.js");
// app.get('/api/contacts', (req, res) => {
//     res.status(200).json("Get all contacts");
// });

connectDb();
app.use(express.json());
app.use("/app/contacts", require("./routes/contactRoutes"));
app.use("/api/users", require("./routes/userRoutes"));
app.use(errorHandler);
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
})