const jwt = require('jsonwebtoken');
const User = require('../model/user');

exports.authenticate = async (req, res, next) => {
  try {
    const token = req.header('Authorisation'); // 

    if (!token) {
      return res.status(401).json({ success: false });
    }

    const decodedToken = jwt.verify(token, 'secret');
    const user = await User.findById(decodedToken.id); // Assuming id is the ObjectId in MongoDB
    if (!user) {
      return res.status(401).json({ success: false });
    }

    req.user = user;
    next();
  } catch (err) {
    console.log(err);
    res.status(401).json({ success: false });
  }
};
