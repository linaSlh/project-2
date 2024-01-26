

const { Schema, model } = require("mongoose");
const User = require("./User.model"); // Import the userSchema or user model
const validThemes = ['family', 'product', 'wedding', 'portrait','baby'];

// TODO: Please make sure you edit the User model to whatever makes sense in this case
const sessionSchema = new Schema(
  {
    owner: {
      type: Schema.Types.ObjectId,
      ref: 'User' // Reference to the User model
    },
    theme: {
      type: String,
      required: true,
      unique: true,
      enum: validThemes
    },
    isAvailable: {
      type: Boolean,
      default: true
    },
    client: {
      type: Schema.Types.ObjectId,
      ref: 'User' // Reference to the User model
    }
  },
  {
   timestamps: true
  }
);

const Session = model("Session", sessionSchema);
module.exports = Session;