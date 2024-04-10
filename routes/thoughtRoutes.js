const express = require('express');
const router = express.Router();
const Thought = require('../models/thought');
const User = require('../models/user');

router.get('/thoughts', async (req, res) => {
    try {
        const thoughts = await Thought.find();
        res.json(thoughts);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
});

// GET to get a single thought by its _id
router.get('/thoughts/:thoughtId', async (req, res) => {
    try {
        const thought = await Thought.findById(req.params.thoughtId);
        if (!thought) {
            return res.status(404).json({ message: 'Thought not found' });
        }
        res.json(thought);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
});

// POST to create a new thought
router.post('/thoughts', async (req, res) => {
    try {
        const { thoughtText, username, userId } = req.body;

        // Create the thought
        const thought = await Thought.create({ thoughtText, username });

        // Push the created thought's _id to the associated user's thoughts array field
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        user.thoughts.push(thought._id);
        await user.save();

        res.status(201).json(thought);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
});

// PUT to update a thought by its _id
router.put('/thoughts/:thoughtId', async (req, res) => {
    try {
        const { thoughtText } = req.body;
        const updatedThought = await Thought.findByIdAndUpdate(
            req.params.thoughtId,
            { thoughtText },
            { new: true }
        );
        if (!updatedThought) {
            return res.status(404).json({ message: 'Thought not found' });
        }
        res.json(updatedThought);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
});

// DELETE to remove a thought by its _id
router.delete('/thoughts/:thoughtId', async (req, res) => {
    try {
        const deletedThought = await Thought.findByIdAndDelete(req.params.thoughtId);
        if (!deletedThought) {
            return res.status(404).json({ message: 'Thought not found' });
        }
        res.json({ message: 'Thought deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
});
// Route to add a reaction to a thought
router.post('/thoughts/:thoughtId/reactions', async (req, res) => {
    try {
        const { thoughtId } = req.params;
        const { reactionBody, username } = req.body;

        // Find the thought by its ID
        const thought = await Thought.findById(thoughtId);

        if (!thought) {
            return res.status(404).json({ message: 'Thought not found' });
        }

        // Add the reaction to the thought's reactions array
        thought.reactions.push({ reactionBody, username });

        // Save the updated thought
        await thought.save();

        res.status(201).json({ message: 'Reaction added successfully', thought });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
});

// Other routes for updating/deleting reactions can be defined similarly
router.delete('/thoughts/:thoughtId/reactions/:reactionId', async (req, res) => {
    try {
        const { thoughtId, reactionId } = req.params;

        // Find the thought by its ID
        const thought = await Thought.findById(thoughtId);
        if (!thought) {
            return res.status(404).json({ message: 'Thought not found' });
        }

        // Find the index of the reaction to be removed
        const reactionIndex = thought.reactions.findIndex(reaction => reaction.reactionId.toString() === reactionId);

        // If the reaction is not found, return 404 Not Found
        if (reactionIndex === -1) {
            return res.status(404).json({ message: 'Reaction not found' });
        }

        // Pull and remove the reaction from the reactions array
        thought.reactions.pull({ _id: reactionId });

        // Save the updated thought
        await thought.save();

        res.json({ message: 'Reaction removed successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
});

module.exports = router;
