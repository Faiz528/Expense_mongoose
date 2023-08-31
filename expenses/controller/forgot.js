const uuid = require('uuid');
require('dotenv').config();
const sgMail = require('@sendgrid/mail');
const bcrypt = require('bcrypt');
const path = require('path')

const User = require('../../model/user');
const Forgotpassword = require('../../model/forgotpassword');


const sendResetPasswordEmail = async (email, id) => {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);

  const msg = {
    to: email,
    from: 'faizzzuddin40@gmail.com',
    subject: 'Reset Password',
    text: 'Click the link to reset your password',
    html: `<a href="http://localhost:3000/resetpassword/${id}">Reset password</a>`,
  };

  try {
    const response = await sgMail.send(msg);
    return response[0];
  } catch (error) {
    throw new Error(error);
  }
};

exports.ForgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    console.log(email)
    const user = await User.findOne({ where: { Email: email } });

    if (user) {
      const id = uuid.v4();
      await user.createForgotpassword({ id, active: true });

      const response = await sendResetPasswordEmail(email, id);
      return res
        .status(response.statusCode)
        .json({ message: 'Link to reset password sent to your mail', success: true });
    } else {
      alert("User does not exist")
      throw new Error('User does not exist');
    }
  } catch (err) {
    console.error(err);
    return res.json({ message: err.message, success: false });
  }
};

exports.resetpassword = async (req, res) => {
  try {
    const id = req.params.id;
    console.log("happy")
    
    const forgotpasswordrequest = await Forgotpassword.findOne({ where: { id } });
     
    if (forgotpasswordrequest) {
      await forgotpasswordrequest.update({ active: false });
      const filePath =  path.join(__dirname, '../forgot.html');
      return res.status(200).send(`
      <html>
      <script>
      function formsubmitted(e){
          e.preventDefault();
          console.log('called')
      }
  </script>

  <form action="/password/updatepassword/${id}" method="get">
      <label for="newpassword">Enter New password</label>
      <input name="newpassword" type="password" required></input>
      <button>reset password</button>
  </form>
        
      </html>
    `);
    }
  } catch (err) {
    console.error(err);
    return res.status(404).send(err.message);
  }

  return res.status(404).send('Forgot password request not found');
};

exports.updatepassword = async (req, res) => {
  try {
    console.log("Happy")
    const { newpassword } = req.query;
    console.log(newpassword)
    
    const  resetpasswordid  = req.params.resetpasswordid;
    console.log('resetpasswordid:', resetpasswordid)
    const resetpasswordrequest = await Forgotpassword.findOne({ where: { id: resetpasswordid } });

    if (resetpasswordrequest) {
      const user = await User.findOne({ where: { id: resetpasswordrequest.userId } });

      if (user) {
        const saltRounds = 10;
        bcrypt.genSalt(saltRounds, async (err, salt) => {
          if (err) {
            console.log(err);
            throw new Error(err);
          }
          const hash = await bcrypt.hash(newpassword, salt);
          await user.update({ Password: hash });

          return res.status(201).json({ message: 'Successfully updated the new password' });
        });
      } else {
        return res.status(404).json({ error: 'No user exists', success: false });
      }
    } else {
      return res.status(404).json({ error: 'Reset password request not found', success: false });
    }
  } catch (error) {
    return res.status(403).json({ error: error.message, success: false });
  }
};








