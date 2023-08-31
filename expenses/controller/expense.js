const Expense = require("../../model/expense");
const jwt = require('jsonwebtoken');
const User = require('../../model/user');

exports.PostExpense = async (req, res, next) => {
  try {
    const { expense, purpose, category } = req.body;
    const token = req.header('Authorisation');
    const userid = jwt.verify(token, 'secret').id;
    console.log(userid);

    const newExpense = new Expense({
      Expenses: expense,
      Purpose: purpose,
      Category: category,
      userId: userid
    });

    const result = await newExpense.save();

    console.log(result);
    res.json(result);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: 'Internal server error' });
  }
};


exports.GetExpense = async (req, res, next) => {
  try {
    const result = await Expense.find({ userId: req.user._id });
    res.json(result);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: 'Internal server error' });
  }
};



exports.Getleader = async (req, res, next) => {
  try {
    const result = await User.find({}).sort('-Total').select('Username Total'); // Using Mongoose's find, sort, and select

    console.log(result);
    res.json(result);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: 'Internal server error' });
  }
};


exports.DeleteExpense = async (req, res, next) => {
  try {
    console.log(req.params._id)
    const user = await Expense.findById(req.params.id);
    const result = await user.deleteOne();
    res.json(result);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.EditExpense = async (req, res, next) => {
  try {
    const user = await Expense.findById(req.params.id);
    console.log("happy");
    res.json(user);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: 'Internal server error' });
  }
};


exports.UpdateExpense = async (req, res, next) => {
  try {
    console.log(req.body);
    const data = await Expense.findById(req.params.id);
    data.Expenses = req.body.expense;
    data.Purpose = req.body.purpose;
    data.Category = req.body.category;
    await data.save();
    res.json(data);
    console.log(data);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: 'Internal server error' });
  }
};




exports.Gettotal = async (req, res, next) => {
  try {
    const total = req.params.sum;
    
    // Assuming you have the user's ObjectId or _id available
    const userId = req.user._id; // Adjust this based on your actual user data
    const user = await User.findByIdAndUpdate(userId, { Total: total }, { new: true }); // Using Mongoose's findByIdAndUpdate
    
    res.json(user);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: 'Internal server error' });
  }
};



exports.Download = async (req, res, next) => {
  try {
    const load = await Expense.find({ userId: req.user.id }); // Using Mongoose's find
    console.log(load);

    const userId = req.user._id; // Assuming you have the user's ObjectId or _id
    const Stringify = JSON.stringify(load);
    const fileName = `Expense1${userId}/${new Date()}.txt`;
    const fileUrl = await uploadToS3(Stringify, fileName);
    console.log(fileUrl);

    const newDownload = new Downloaded({
      userId: userId,
      file: fileUrl
    });

    const result = await newDownload.save();
    res.status(200).json({ fileUrl, success: true });
  } catch (err) {
    console.log(err);
    res.status(500).json({ fileUrl: '', success: false, err: err });
  }
};

function uploadToS3(data, filename) {
  const BUCKET_NAME = 'expensestracker1';
  const IAM_USER_KEY = process.env.IAM_USER_KEYS;
  const IAM_USER_SECRET = process.env.IAM_USER_SECRETS;

  let s3bucket = new AWS.S3({
    accessKeyId: IAM_USER_KEY,
    secretAccessKey: IAM_USER_SECRET,
  });

  var params = {
    Bucket: BUCKET_NAME,
    Key: filename,
    Body: data,
    ACL: 'public-read'
  };
  return new Promise((resolve, reject) => {
    s3bucket.upload(params, (err, s3response) => {
      if (err)
        console.log(err);
      else {
        console.log('success', s3response);
        resolve(s3response.Location);
      }
    });
  });
}

const Downloaded = require('../../model/download');

exports.downloadFile = async (req, res, next) => {
  try {
    console.log(req.user._id); // Assuming you have the user's ObjectId or _id
    const files = await Downloaded.find({ userId: req.user._id }); // Using Mongoose's find
    console.log(files);
    res.json(files);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: 'Internal server error' });
  }
};


 /*exports.getPageData = async (req, res, next) => { 
  const itemsPerPage = parseInt(req.header("itemsPerPage")) 
  // console.log('itemsPerPAGE>>>>>', typeof itemsPerPage) 
  const ITEMS_PER_PAGE = itemsPerPage; 
  const page = +req.params.page || 1; 
  let totalItems; 
 
  try { 
    totalItems = await Expense.count({ where: { userId: req.user.id } }); 
    const expenses = await Expense.findAll({ 
      where: { userId: req.user.id }, 
      offset: (page - 1) * ITEMS_PER_PAGE, 
      limit: ITEMS_PER_PAGE, 
    }); 
 
    const pageData = { 
      currentPage: page, 
      hasNextPage: ITEMS_PER_PAGE * page < totalItems, 
      hasPreviousPage: page > 1, 
      nextPage: page + 1, 
      previousPage: page - 1, 
      lastPage: Math.ceil(totalItems / ITEMS_PER_PAGE), 
    }; 
 
    res.json({ expenses, pageData }); 
  } catch (err) { 
    console.log(err); 
    next(err); 
  } 
};*/

exports.getpage= async(req,res,next)=>{
  const page = parseInt(req.query.page)
  const size = parseInt(req.query.limit)

  const startIndex = (page-1)*size
  const lastIndex = page*size
  console.log("Lets begin our show")
  
  const users = await Expense.find({ userId: req.user._id })
  .skip((page - 1) * size)
  .limit(size);

const totalCount = await Expense.countDocuments({ userId: req.user._id });


  console.log(users)
  res.json(users)
  const result ={}
}