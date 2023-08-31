const User = require('../../model/user');
const bcrypt = require('bcrypt');

exports.PostUser = async (req, res, next) => {
  try {
    const { name, email, pass } = req.body;
    console.log(name)
    const hashedPassword = await bcrypt.hash(pass, 10);

    const newUser = new User({
      Username: name,
      Email: email,
      Password: hashedPassword,
      ispremium: false // Use a boolean value instead of a string
    });
    console.log(newUser)
    const result = await newUser.save();
    console.log(result)

    // User creation successful
    res.status(200).json(result);
  } catch (err) {
    console.log(err)
    // Check if it's a duplicate key error
    if (err.code === 11000) {
      // Handle duplicate email error
      res.status(409).json({ error: 'Email already exists' });
    } else {
      // Handle other errors
      console.error(err);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
};
