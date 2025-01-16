const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require('jsonwebtoken')
// require()
const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please provide name"],
    minlength: 3,
    maxlength: 50,
  },
  email: {
    type: String,
    required: [true, "Please provide email"],
    minlength: 3,
    maxlength: 50,
    match: [
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      "Please Provide a Valid Email Id",
    ],
    unique: true,
  },
  password: {
    type: String,
    required: [true, "Please provide password"],
    minlength: 6,
  },
});

//  always use this keyword for accessing the database value ....
UserSchema.pre("save", async function () {
  console.log("In here  ",this.password);
  // if (this.isModified("password")) {
    // both function returns a promise ....
    const salt = await bcrypt.genSalt(10);
    this.password =  await bcrypt.hash(this.password, salt);
  // }
});

UserSchema.methods.createJWT  = function (JWT_SECRET){
  return jwt.sign({
    userId:this._id,name:this.name
  },JWT_SECRET,{
    expiresIn:'30d',
  });
}

UserSchema.methods.comparePassword = async function (candidatePassword){
    const isMatch = await bcrypt.compare(candidatePassword,this.password);
    return isMatch;
}

module.exports = mongoose.model("User", UserSchema);



