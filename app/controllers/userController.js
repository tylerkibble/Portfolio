const User = require("../models/user");
const db = require

exports.registerNewUser = async (req, res) => {
    try {
    console.log("Req Body: ", req.body)
    let isUser = await User.findOne({ email: { $eq: req.body.email } } );
    // let isUser = await User.findOne({ email: req.body.email });
    console.log("isUser: ", isUser)
    
    if (isUser) {
      return res.status(409).json({
        message: "email already in use"
      });
    }

    const user = new User({
      name: req.body.name,      
      password: req.body.password,
      email: req.body.email
    });
    console.log('User: ', user)
    let data = await user.save();
    const token = await user.generateAuthToken(); // here it is calling the method that we created in the model
    res.status(201).json({ data, token });
  } catch (err) {
    res.status(400).json({ err: err });
    console.log(err)
  }
  return res.data
};
exports.loginUser = async (req, res) => {
      try {
    const email = req.body.email;
    const password = req.body.password;
    const user = await User.findByCredentials(email, password);
    if (!user) {
      return res.status(401).json({ error: "Login failed! Check authentication credentials" });
    }
    const token = await user.generateAuthToken();
    res.status(201).json({ user, token });
  } catch (err) {
    res.status(400).json({ err: err });
  }
};

exports.getUserDetails = async (req, res) => {
  await res.json(req.userData);
};