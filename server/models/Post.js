const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const postSchema = new Schema({
  title: { type: String, required: true },
  picture: String,
  public_id: String,
  text: { type: String, required: true },
  category: { type: String, enum: ["Moment", "Warning", "Tip", "Question"]},
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
