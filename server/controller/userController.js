const bcrypt = require("bcrypt");
const { User } = require("../model/userModel");
const jwt = require("jsonwebtoken");

exports.registerUser = async (req, res) => {
  const { name, email, password } = req.body;
  const userFound = await User.findOne({ email: req.body.email });
  if (userFound) {
    res.status(400).send({ message: "User Already Exists", success: false });
  }
  const salt = await bcrypt.genSalt(10);
  const hashPassword = await bcrypt.hash(password, salt);
  const newUser = new User({
    name,
    email,
    password: hashPassword,
  });
  await newUser.save();
  res.status(201).send({ message: "User Registered", success: true });
  try {
  } catch (error) {
    res.status(500).send({ message: "Error Occurred", success: false });
  }
};

exports.loginUser = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      res.status(404).send({ message: "User Not Found", success: false });
    }
    const isCorrect = await bcrypt.compare(req.body.password, user.password);
    if (!isCorrect) {
      res.status(401).send({ message: "Incorrect password", success: false });
    } else {
      const token = jwt.sign({ id: user._id }, process.env.SECERET, {
        expiresIn: "1d",
      });
      res
        .status(200)
        .send({ message: "Login Successful", success: true, token });
    }
  } catch (error) {
    res.status(500).send({ message: "Error Occurred", success: false, error });
  }
};

exports.getCurrentUser = async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.body.userId });
    if (!user) {
      res.status(404).send({ message: "User Not Found", success: false });
    } else {
      res.status(200).send({
        message: "User Fetched",
        success: true,
        data: { id: user._id, name: user.name, email: user.email },
      });
    }
  } catch (error) {
    res.status(500).send({ message: "Error Occurred", success: false, error });
  }
};

exports.getUser = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (user) {
      res.status(501).json({ message: "Email Already Taken" });
    } else {
      res.status(200).json({ message: "Email Not Already Taken" });
    }
  } catch (error) {
    res.status(500).send({ message: "Error Occurred", success: false, error });
  }
};

exports.logoutUser = async (req, res) => {
  try {
  } catch (error) {}
};
