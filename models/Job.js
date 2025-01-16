const mongoose = require("mongoose");
const JobSchema = mongoose.Schema({
    company: {
      type: String,
      required: [true, "Please provide company name"],
      maxlenght: 50,
    },
    position: {
      type: String,
      required: [true, "Please provide Position name"],
      maxlenght: 200,
    },
    status: {
      type: String,
      required: [true, "Please provide company name"],
      enum: ["interview", "declined", "pending"],
      default: "pending",
    },
    createdBy: {
        // is will refere to the user in the database who created it..........
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: [true, "Please Provide User"],
    },
},
{timestamps:true}
);

module.exports = mongoose.model("Job", JobSchema);
