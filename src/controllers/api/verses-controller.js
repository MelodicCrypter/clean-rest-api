/**
 * This is where all the logic happens for
 * the /verses endpoint. This is a private endpoint,
 * so it needs the authentication middleware
 * before the user can get to this endpoint.
 *
 * This endpoint is responsible for getting all verses
 * of a certain user
 */

// Verse model
import Verse from '../../model/verse';
// Util
import stat from '../../util/stat';

// Controller for the /verses endpoint
const versesEndpoint = async (req, res) => {
    // Get the user's id from authentication middleware
    const { authId } = req;

    try {
        // Get all verse
        const verses = await Verse.find({ _creator: authId });

        // Send all verses
        res.json(verses);
    } catch (e) {
        res.status(400).send(stat('failed', 'Something went wrong.'));
    }
};

export default versesEndpoint;
