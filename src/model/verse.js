/**
 *   This is the VERSE model.
 *
 */

import _ from 'lodash';

// Mongoose
import Mongoose from './mongo/mongoose';

// Verse Model Method
const verseSchema = new Mongoose.Schema({
    text: {
        type: String,
    },
    reference: {
        type: String,
    },
    version: {
        type: String,
        default: 'ESV',
    },
    _creator: {
        type: Mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
});

// ! OVERRIDE toJSON method
verseSchema.methods.toJSON = function() {
    const verse = this;
    const verseObject = verse.toObject(); // convert mongoose object to standard object
    return _.pick(verseObject, ['_id', 'text', 'reference', 'version']);
};

// Create User model
const Verse = Mongoose.model('Verse', verseSchema);

export default Verse;
