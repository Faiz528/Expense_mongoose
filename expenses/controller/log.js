const User = require('../../model/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

exports.VerifyUser = async (req, res, next) => {
  try {
    const { email, pass } = req.body;

    const user = await User.findOne({ Email: email }); // Using Mongoose's findOne

    if (!user) {
      return res.status(404).json("User not found");
    } else {
      // Compare password using bcrypt
      bcrypt.compare(pass, user.Password, (err, result) => {
        if (err) {
          res.status(500).json("Something went wrong");
        } else {
          if (result) {
            const token = jwt.sign({ id: user._id }, 'secret'); // Use _id for Mongoose ObjectId
            return res.status(200).json({ message: "Logged in successfully", premium: user.ispremium, token: token });
          } else {
            return res.status(401).json("Password does not match");
          }
        }
      });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json("Something went wrong");
  }
};
