// const { Schema, model } = require("mongoose");
// const userProfile = ['visitor', 'Admin'];
// // TODO: Please make sure you edit the User model to whatever makes sense in this case
// const userSchema = new Schema(
//   {
//     role: {enum : userProfile},
//     username: {
//       type: String,
//       trim: true,
//       required: true,
//       unique: true,
      
//     },
//     email: {
//       type: String,
//       required: true,
//       unique: true,
//       lowercase: true,
//       trim: true
//     },
//     password: {
//       type: String,
//       required: true,
//     }
//   },
//   {
//     // this second object adds extra properties: `createdAt` and `updatedAt`    
//     timestamps: true
//   }
// );

// const User = model("User", userSchema);

// module.exports = User;

const { Schema, model } = require("mongoose");

const userProfile = ['visitor', 'admin'];

const userSchema = new Schema(
  {
    role: {
      type: String,
      enum: userProfile,
      default:'visitor',
      
    },
    username: {
      type: String,
      trim: true,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    }
  },
  {
    timestamps: true
  }
);

const User = model("User", userSchema);

module.exports = User;
