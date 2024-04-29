var express = require('express');
var router = express.Router();
const user = require('./users')


// GET ALL USER 
router.get('/', (req, res) => {
  user.find({})
    .then(users => {
      res.send(users = users);
    })
    .catch(err => {
      res.status(500).json({ message: 'Internal Server Error', error: err });
    });
});

// insert user into database 
router.post('/add', async (req, res) => {
  try {
    const newUser = new user({
      name: req.body.name,
      email: req.body.email,
      phone: req.body.phone,
    });
    await newUser.save();
    req.session.message = {
      type: 'success',
      message: 'User added successfully.'
    };
    res.send("User Added Successfully");
  } catch (err) {
    console.error('Error adding user:', err);
    res.status(500).json({ message: 'Failed to add user.', type: 'danger' });
  }
}); 

// delete a user 
router.delete('/delete/:id', async (req, res) => {
  const userId = req.params.id;
  try {
    const deletedUser = await user.findByIdAndDelete(userId);
    if (!deletedUser) {
      return res.status(404).json({ message: 'User not found' });
    }
    const updatedUsers = await user.find();
    res.send("User deleted successfully");
  } catch (err) {
    res.status(500).json({ message: 'Internal Server Error', error: err });
  }
});

// edit page route 
router.get('/edit/:id', async (req, res) => {
  try {
    const userId = req.params.id;
    const foundUser = await user.findById(userId);
    if (!foundUser) {
      return res.status(404).send('User not found');
    }
    res.send(foundUser);
  } catch (err) {
    console.error('Error finding user:', err);
    res.status(500).send('Internal Server Error');
  }
});

// update user
router.post('/update/:id', async (req, res) => {
  try {
    const userId = req.params.id;
    const updatedUser = await user.findByIdAndUpdate(
      userId,
      {
        name: req.body.name,
        email: req.body.email,
        phone: req.body.phone
      },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).send('User not found');
    }
    res.send('Error');
  } catch (err) {
    console.error('Error updating user:', err);
    res.status(500).send('Internal Server Error');
  }
});

module.exports = router;
