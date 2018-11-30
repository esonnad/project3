const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
  username: String,
  email: String,
  emailStatus: {type: String, enum:["VERIFIED","UNVERIFIED"], default: "UNVERIFIED"},
  password: String,
  resetPasswordToken: String,
  resetPasswordExpires: String,
  imageURL: String,
  public_id: String
}, {
    timestamps: {
      createdAt: 'created_at',
      updatedAt: 'updated_at'
    }
  });

const User = mongoose.model('User', userSchema);
module.exports = User;
