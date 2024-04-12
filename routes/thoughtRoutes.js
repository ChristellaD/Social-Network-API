import express from 'express';
const router = express.Router();

router.get('/api/thoughts', async (req, res) => {
    try {
        const thoughts = await Thought.find();
        res.json(thoughts);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
});

// a single thought by id
router.get('/api/thoughts/:thoughtId', async (req, res) => {
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

// create a new thought
router.post('/thoughts', async (req, res) => {
    try {
        const { thoughtText, username, userId } = req.body;

        const thought = await Thought.create({ thoughtText, username });

        // pushes the created thought's id to the associated user's thoughts array field
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

// updates a thought by id
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

// remove a thought by its _id
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
// add a reaction to a thought
router.post('/thoughts/:thoughtId/reactions', async (req, res) => {
    try {
        const { thoughtId } = req.params;
        const { reactionBody, username } = req.body;

        // find the thought by its ID
        const thought = await Thought.findById(thoughtId);

        if (!thought) {
            return res.status(404).json({ message: 'Thought not found' });
        }

        // add the reaction to the thought's reactions array
        thought.reactions.push({ reactionBody, username });

        // save the updated thought
        await thought.save();

        res.status(201).json({ message: 'Reaction added successfully', thought });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
});

router.delete('/thoughts/:thoughtId/reactions/:reactionId', async (req, res) => {
    try {
        const { thoughtId, reactionId } = req.params;

        // find the thought by ID
        const thought = await Thought.findById(thoughtId);
        if (!thought) {
            return res.status(404).json({ message: 'Thought not found' });
        }
        const reactionIndex = thought.reactions.findIndex(reaction => reaction.reactionId.toString() === reactionId);
        if (reactionIndex === -1) {
            return res.status(404).json({ message: 'Reaction not found' });
        }
        thought.reactions.pull({ _id: reactionId });
        await thought.save();

        res.json({ message: 'Reaction removed successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
});

export { router as thoughtRoutes };
