const { Schema, model } = require("mongoose");
const validThemes = ['family', 'product', 'wedding','portrait']
// TODO: Please make sure you edit the User model to whatever makes sense in this case
const sessionSchema = new Schema(
  {
    owner:  {
      type: Schema.Types.ObjectId,
      ref: 'User'  // Reference to the User model
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
        ref: 'User'  // Reference to the User model
      }
    },
  {
    // this second object adds extra properties: `createdAt` and `updatedAt`    
    timestamps: true
  }
);

const User = model("User", userSchema);

module.exports = User;