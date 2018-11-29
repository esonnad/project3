const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const postSchema = new Schema({
  title: { type: String, required: true },
  pictures: [String],
  text: { type: String, required: true },

  location: {
    type: { type: String, required: true },
    coordinates: { type: [Number], required: true }
  },
  _owner: { type: Schema.Types.ObjectId, ref: 'User' }
}, {
    timestamps: {
      createdAt: 'created_at',
      updatedAt: 'updated_at'
    }
  });

const Post = mongoose.model('Post', postSchema);
module.exports = Post;
