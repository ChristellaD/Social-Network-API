const mongoose = require('mongoose');
const { Schema } = mongoose;

const reactionSchema = new Schema({
    reactionId: {
        type: Schema.Types.ObjectId,
        default: () => new mongoose.Types.ObjectId()
    },
    reactionBody: {
        type: String,
        required: true,
        maxlength: 280
    },
    username: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

reactionSchema.path('createdAt').get(function(value) {
    // Format the date using your preferred format (e.g., ISO string)
    return value.toISOString();
});

module.exports = reactionSchema;

// Thought Schema
const thoughtSchema = new Schema({
    thoughtText: {
        type: String,
        required: true,
        minlength: 1,
        maxlength: 280
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    username: {
        type: String,
        required: true
    },
    reactions: [reactionSchema]
});

// Create a virtual field 'reactionCount' to retrieve the length of the 'reactions' array
thoughtSchema.virtual('reactionCount').get(function() {
    return this.reactions.length;
});

// Create a getter method for 'createdAt' to format the timestamp on query
thoughtSchema.path('createdAt').get(function(value) {
    // Format the date using your preferred format (e.g., ISO string)
    return value.toISOString();
});

const Thought = mongoose.model('Thought', thoughtSchema);

module.exports = Thought;