/**
 * This is where all the logic happens for
 * the /verse/:id endpoint. This is a private endpoint,
 * so it needs the authentication middleware
 * before the user can get to this endpoint.
 *
 * This endpoint is responsible for getting specific verse
 */

// Verse model
import Verse from '../../model/verse';
// Util
import stat from '../../util/stat';

// Controller for the /verse/:id endpoint => GET
const verseGetEndpoint = async (req, res) => {
    // Get the user's id from authentication middleware
    const { authId } = req;
    // Get the id parameter
    const { id: paramId } = req.params;
    // query
    const query = { _id: paramId, _creator: authId };

    try {
        // Get the specific verse
        const verse = await Verse.findOne(query);

        // Send back verse
        res.json(verse);
    } catch (e) {
        res.status(400).send(stat('failed', 'Something went wrong.'));
    }
};

export default verseGetEndpoint;
