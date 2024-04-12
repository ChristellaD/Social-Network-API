import express from 'express';
const router = express.Router();

// GET all users
router.get('/users', async (req, res) => {
    try {
        const users = await User.find();
        res.json(users);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
});

// GET a single user by its _id and populated thought and friend data
router.get('/users/:userId', async (req, res) => {
    try {
        const user = await User.findById(req.params.userId)
            .populate('thoughts')
            .populate('friends');

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json(user);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
});

// POST a new user
router.post('/users', async (req, res) => {
    try {
        const { username, email } = req.body;
        const newUser = await User.create({ username, email });
        res.status(201).json(newUser);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
});

// PUT to update a user by its _id
router.put('/users/:userId', async (req, res) => {
    try {
        const { username, email } = req.body;
        const updatedUser = await User.findByIdAndUpdate(
            req.params.userId,
            { username, email },
            { new: true }
        );
        if (!updatedUser) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(updatedUser);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
});

// DELETE to remove user by its _id
router.delete('/users/:userId', async (req, res) => {
    try {
        const deletedUser = await User.findByIdAndDelete(req.params.userId);
        if (!deletedUser) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json({ message: 'User deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
});

router.post('/users/:userId/friends/:friendId', async (req, res) => {
    try {
        const { userId, friendId } = req.params;

        // Find the user by userId
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Check if the friendId is already in the user's friend list
        if (user.friends.includes(friendId)) {
            return res.status(400).json({ message: 'Friend already exists in the user\'s friend list' });
        }

        // Add the friendId to the user's friend list
        user.friends.push(friendId);
        await user.save();

        res.status(201).json({ message: 'Friend added successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
});

// DELETE to remove a friend from a user's friend list
router.delete('/users/:userId/friends/:friendId', async (req, res) => {
    try {
        const { userId, friendId } = req.params;

        // Find the user by userId
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Check if the friendId exists in the user's friend list
        if (!user.friends.includes(friendId)) {
            return res.status(400).json({ message: 'Friend does not exist in the user\'s friend list' });
        }

        // Remove the friendId from the user's friend list
        user.friends = user.friends.filter(id => id !== friendId);
        await user.save();

        res.json({ message: 'Friend removed successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
});

export { router as userRoutes };
