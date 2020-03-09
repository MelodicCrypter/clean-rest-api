/**
 * This is where all the logic happens for
 * the /add endpoint. This is a private endpoint,
 * so it needs the authentication middleware
 * before the user can get to this endpoint.
 *
 * This endpoint is responsible for adding new
 * stuff[s], in this case, verse[s]
 */

import _ from 'lodash';
import Joi from '@hapi/joi';

// Verse model
import Verse from '../../model/verse';
// Util
import stat from '../../util/stat';

// Controller for the /add endpoint
const addEndpoint = async (req, res) => {
    // Get the user's id from authentication middleware
    const { authId } = req;
    // Get all the client's POST values then convert to object
    const body = _.pick(req.body, ['text', 'reference', 'version']);

    // JOI Validation Schema: Validate all fields first before sending to Mongoose
    const joiSchema = Joi.object().keys({
        text: Joi.string()
            .trim()
            .required(),
        reference: Joi.string()
            .trim()
            .required(),
        version: Joi.string()
            .trim()
            .required(),
    });

    try {
        // 1. JOI validation, value === verse {}
        const value = await joiSchema.validateAsync(body);

        // 2. Add the user creator to the verse {}
        const preVerse = {
            ...value,
            _creator: authId,
        };

        // 3. Create new Verse instance
        const verse = await new Verse(preVerse);

        // 4. Save the verse
        try {
            const doc = await verse.save();
            res.send(doc);
        } catch (e) {
            console.log(e);
            res.status(400).json(stat('failed', 'Something went wrong.', 'ADDENDPOINT'));
        }
    } catch (e) {
        res.status(400).json(stat('failed', 'Please check all values.'));
    }
};

export default addEndpoint;
