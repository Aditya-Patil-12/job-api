require("dotenv").config();
const User = require("../models/User");
const { StatusCodes } = require("http-status-codes");
const { BadRequestError, UnauthenticatedError } = require("../errors/index");
const jwt = require("jsonwebtoken");

// this was life w/o validators ....
// if( !name || !email || !password ){
//   throw new BadRequestError('Please provide name email password');
//
// }
// From here mongoose Validators are there ....

const register = async (req, res) => {
  console.log(req.body);
  const user = await User.create({ ...req.body });
  console.log("snet");
  console.log(process.env.JWT_SECRET);

  const token = user.createJWT(process.env.JWT_SECRET);
  console.log(token);
  res.status(StatusCodes.CREATED).json({
    user: {
      name: user.name,
    },
    token,
  });
};
const login = async (req, res) => {
  const { email, password } = req.body;
  console.log(email," ",password);
  
  if (!email || !password) {
    throw new BadRequestError("Please provide Email and Password");
  }
  const user = await User.findOne({ email });
  if (!user) {
    console.log("inside errror\n");
    throw new UnauthenticatedError("Please Enter Valid Credentials");
  }
  const isPasswordCorrect = user.comparePassword(password);
  if( !isPasswordCorrect ){
    throw new UnauthenticatedError("Please Enter Valid Password");
  }

  const token = user.createJWT(process.env.JWT_SECRET);
  res.status(StatusCodes.OK).json({
    user: {
      name: user.name,
    },
    token,
  });
};

module.exports = {
  login,
  register,
};
