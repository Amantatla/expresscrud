var express = require('express');
var router = express.Router();
const multer = require('multer');
const user = require('./users')

// imageUpload 
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './uploads')
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + "_" + Date.now() + "_" + file.originalname)
  }
})

var upload = multer({
  storage: storage,
}).single('image');

// insert user into database 
// router.post('/add', upload, (req, res) => {
//   const user = new user({
//     name : req.body.name,
//     email : req.body.email,
//     phone : req.body.phone,
//     image : req.file.filename
//   });
//   user.save((err) =>{
//     if (err) {
//       res.json({message: err.message, type: 'danger'});
//     } else {
//       req.session.message = {
//         type: 'success',
//         message: 'User Added Sucessfully.'
//       };
//       res.redirect("/")
//     }
//   })
// }) 
router.post('/add', upload, async (req, res) => {
  try {
    const { name, email, phone } = req.body;
    const image = req.file.filename;

    const newUser = new user({ name, email, phone, image });
    await newUser.save();
    req.session.message = {
      type: 'success',
      message: 'User added successfully.'
    };
    res.redirect('/');
  } catch (err) {
    // Handle errors
    console.error('Error adding user:', err);
    res.status(500).json({ message: 'Failed to add user.', type: 'danger' });
  }
});

// render add page 
router.get('/add', function (req, res) {
  res.render('add_user.ejs', { title: 'Add New User' });
});

// GET ALL USER 
router.get('/', function (req, res) {
  user.find({})
    .then(users => {
      res.render('index', {
        title: 'Express',
        users: users
      });
    })
    .catch(err => {
      res.status(500).json({ message: 'Internal Server Error', error: err });
    });
});

// delete a user 
router.delete('/delete/:id', async (req, res) => {
  const userId = req.params.id;
  try {
    const deletedUser = await user.findByIdAndDelete(userId);
    if (!deletedUser) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json({ message: 'User deleted successfully' });
    res.redirect('/');
  } catch (err) {
    res.status(500).json({ message: 'Internal Server Error', error: err });
  }
});

router.delete('/delete', function (req, res) {
  res.clearCookie("name")
  res.send("Cleared")
});

module.exports = router;
