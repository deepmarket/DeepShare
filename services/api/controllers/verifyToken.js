/**
 *
 * @fileoverview this file implements the jwt verification middleware.
 * It expects the user send the token via the `x-access-token` header.
 * It's dependent on the `jsonwebtoken` library.
 *
 */

"use strict";

const config = require('../config/config');
let jwt = require('jsonwebtoken');

function verifyToken(req, res, next) {
    let token = req.headers['x-access-token'];
    if(!token) {
        return res.status(401).json({
            success: false,
            err: null,
            message: 'No token provided.',
        });
    }

    jwt.verify(token, config.JWT_KEY, (err, decoded) => {
        if(err) {
            return res.status(400).json({
                success: false,
                error: err ? err : null,
                message: 'Failed to authenticate with provided token.',
            });
        }
        // TODO: Deprecated.
        if(decoded.id === undefined) {
            return res.status(500).json({
                success: false,
                error: null,
                message: "This token is DEPRECATED. Please dump your db and generate new tokens at `/api/v1/auth/login`.",
            });
        }

        // Save customer's unique id to the request object.
        req.user_id = decoded.id;
        next();
    });
}

module.exports = verifyToken;