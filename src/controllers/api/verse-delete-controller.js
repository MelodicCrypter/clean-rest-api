/**
 * This is where all the logic happens for
 * the /verse/:id endpoint. This is a private endpoint,
 * so it needs the authentication middleware
 * before the user can get to this endpoint.
 *
 * This endpoint is responsible for deleting specific verse
 */

// Verse model
import Verse from '../../model/verse';
// Util
import stat from '../../util/stat';

// Controller for the /verse/:id endpoint => DELETE
const verseDeleteEndpoint = async (req, res) => {
    // Get the user's id from authentication middleware
    const { authId } = req;
    // Get the id parameter
    const { id: paramId } = req.params;
    // query
    const query = { _id: paramId, _creator: authId };

    try {
        // Delete specific verse
        const { deletedCount } = await Verse.deleteOne(query);
        // If no success
        if (deletedCount === 0) throw new Error('Something is not right.');
        // If successful
        if (deletedCount === 1) res.status(200).json(stat('success', 'Successfully deleted!'));
    } catch (e) {
        res.status(400).json(stat('failed', 'Something is not right.'));
    }
};

export default verseDeleteEndpoint;
