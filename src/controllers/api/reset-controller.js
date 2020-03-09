/**
 * This is where all the logic happens for
 * the /reset endpoint
 */

import _ from 'lodash';
import Joi from '@hapi/joi';

// User model
import User from '../../model/user';
// Util
import stat from '../../util/stat';

// Controller for the /reset endpoint
const resetEndpoint = async (req, res) => {
    // Get the token query
    const { token } = req.query;
    // Get all the client's POST values then convert to object
    const body = _.pick(req.body, ['password', 'repeat_password']);

    // JOI Validation Schema: Validate all fields first before sending to Mongoose
    const joiSchema = Joi.object().keys({
        password: Joi.string()
            .pattern(/((?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[\W]).{8})/)
            .trim()
            .required(),
        repeat_password: Joi.string()
            .required()
            .equal(Joi.ref('password')),
    });

    try {
        // 1. JOI validation
        const value = await joiSchema.validateAsync(body);

        // 2. Delete first the repeat_password property
        delete value.repeat_password;

        // 3. Validate token
        const decoded = await User.validateToken(token);

        // 4. Then double check if token still exists
        const user = await User.findOne({ _id: decoded._id });
        if (!user) throw new Error('UNF: Invalid Token!');
        const tokenDeleted = await user.isTokenEmpty('resetToken');

        // 5. It token already used
        if (tokenDeleted) throw new Error('Invalid Token!');

        // 6. If token is valid and existing
        await User.updateHashPassword(decoded._id, value.password);

        // 7. Delete tokens
        await user.removeToken('authToken');
        await user.removeToken('resetToken');

        // 8. Send status
        res.json(stat('success', 'Successfully changed password. Please login.'));
    } catch (e) {
        // These errors belong to JOI ==========================================
        if (e.details) {
            // Get the error label
            const error = e.details[0].context.label;
            // Long error message
            const passErr =
                'Password must be a mixed of numbers, special character, uppercase and lowercase letters, and at least 8 characters long.';
            // Process
            if (error === 'password') res.json(stat('failed', passErr));
            if (error === 'repeat_password') res.json(stat('failed', 'Passwords must match!'));
        }

        // These errors belong to validateToken() ===============================
        // If expired
        if (e.name === 'TokenExpiredError') res.status(400).json(stat('failed', 'Expired Token!'));
        // If invalid token
        if (e.name === 'JsonWebTokenError') res.status(400).json(stat('failed', 'Invalid Token!'));

        // If custom errors ======================================================
        if (e.message) res.status(400).json(stat('failed', e.message));
    }
};

export default resetEndpoint;
