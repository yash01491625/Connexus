const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");

const validateToken = asyncHandler(async (req, res, next) => {
    let token;
    let authHeader = req.headers.authorization || req.headers.Authorization;
    console.log("Headers:", req.headers);
    console.log(authHeader);
    if (authHeader && authHeader.startsWith("Bearer")) {
        token = authHeader.split(" ")[1]; // Extract the token part
        jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => {
            if (err) {
                res.status(401);
                throw new Error("User is not authorized"); // Better error message
            }
            req.user = decoded; // Store the decoded token data (e.g., user ID) in the request
        });
    } else {
        res.status(401);
        throw new Error("Authorization token is missing");
    }
    next(); // Allow the request to proceed if valid
});

module.exports = validateToken; // Export the middleware function
