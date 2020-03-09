/**
 * This is where all the logic happens for
 * the /verse/:id endpoint. This is a private endpoint,
 * so it needs the authentication middleware
 * before the user can get to this endpoint.
 *
 * This endpoint is responsible for updating specific verse
 */

import _ from 'lodash';
import Joi from '@hapi/joi';

// Verse model
import Verse from '../../model/verse';
// Util
import stat from '../../util/stat';

// Controller for the /verse/:id endpoint => PATCH
const verseUpdateEndpoint = async (req, res) => {
    // Get the user's id from authentication middleware
    const { authId } = req;
    // Get the id parameter
    const { id: paramId } = req.params;
    // Create the new update
    const receivedUpdateVerse = _.pick(req.body, ['text', 'reference', 'version']);
    // query
    const query = { _id: paramId, _creator: authId };

    // JOI Validation Schema: Validate all fields first before sending to Mongoose
    const joiSchema = Joi.object().keys({
        text: Joi.string().trim(),
        reference: Joi.string().trim(),
        version: Joi.string().trim(),
    });

    try {
        // Validate JOI first
        const validatedUpdateVerse = await joiSchema.validateAsync(receivedUpdateVerse);

        // Get the specific verse
        const theUpdatedVerse = await Verse.findOneAndUpdate(query, validatedUpdateVerse, { new: true });
        if (!theUpdatedVerse) throw new Error('Something went wrong');

        // Send back verse
        res.status(200).json(theUpdatedVerse);
    } catch (e) {
        res.status(400).json(stat('failed', 'Please check all values.'));
    }
};

export default verseUpdateEndpoint;
