/**
 * This is where all the logic happens for
 * the /reset/request endpoint
 */

// User model
import User from '../../model/user';
// Util
import stat from '../../util/stat';
// Email
import transport from '../../util/email/config';
import emailTemplate from '../../util/email/email-template';

// Controller for the /reset/request endpoint
const resetRequestEndpoint = async (req, res) => {
    // Get client's email from POST values then convert to object
    const { email } = req.body;

    try {
        // 1. Check if user exists and is verified
        // if no user found send an error message, else, proceed
        const user = await User.findOne({ email });
        if (!user) throw new Error('Check your credentials!');
        const verified = await user.isTokenEmpty('verifyToken');

        // 2.
        if (verified) {
            // If validated then generate token that expires in 1 hour
            // but no need to add it in generateToken('reset'), because
            // the default expiration is 1 hour
            const token = await user.generateToken('reset');

            // Send an email
            await transport.sendMail({
                from: process.env.SITE_EMAIL,
                to: email,
                subject: `Password Reset Link | ${process.env.SITE_NAME}`,
                html: emailTemplate(`${process.env.SITE_URI}/reset?token=${token}`),
            });

            // Send response
            res.json(stat('success', 'Please check email for the password reset link.'));
        } else {
            throw new Error('Please verify your account first.');
        }
    } catch (e) {
        res.json(stat('failed', e.message));
    }
};

export default resetRequestEndpoint;
