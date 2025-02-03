const asyncHandler = require("express-async-handler");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
// @desc Register a User
// @route GET /api/users/register
// @access public
const registerUser = asyncHandler(async (req, res) => {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
        res.status(400);
        throw new Error("All fields are mandatory");
    }
    const userAvailable = await User.findOne({ email });
    if (userAvailable) {
        res.status(400);
        throw new Error("Email already exists!");
    }
    // Since password is a raw password and its not safe to store it raw, we need to decrypt it using hashing and a library called bcrypt
    const hashPassword = await bcrypt.hash(password, 10);
    console.log("Hashed Password: ", hashPassword);
    const user = await User.create({
        username,
        email,
        password: hashPassword,
    });
    console.log(user);
    if (user) {
        res.status(201).json({
            id: user.id,
            email: user.email
        });
    } else {
        res.status(400);
        throw new Error("User data is not valid");
    }
    res.json({ message: "Register the User" });
});

// @desc Login a User
// @route GET /api/users/login
// @access public
const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    // Check if all required fields are provided
    if (!email || !password) {
        res.status(400).json({ error: "All fields are mandatory!" });
        return;
    }

    // Find the user by email
    const user = await User.findOne({ email });
    if (!user) {
        res.status(401).json({ error: "Email or password is incorrect..." });
        return;
    }

    // Compare provided password with stored hashed password
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
        res.status(401).json({ error: "Email or password is incorrect..." });
        return;
    }

    // Generate JWT token
    const accessToken = jwt.sign(
        {
            username: user.username,
            email: user.email,
            id: user.id,
        },
        process.env.SECRET_KEY,
        {
            expiresIn: "1hr",
        }
    );

    // Send access token as response
    res.status(200).json({ accessToken });
});


// @desc Current User Info
// @route GET /api/users/current
// @access private
const currentUser = asyncHandler(async (req, res) => {
    if (!req.user) {
        res.status(401).json({ error: "Not authorized, token missing or invalid" });
        return;
    }
    res.status(200).json({ 
        message: "Current user information", 
        user: req.user, 
    });
});


module.exports = { registerUser, loginUser, currentUser };