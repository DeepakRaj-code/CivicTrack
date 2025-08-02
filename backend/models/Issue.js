import mongoose from 'mongoose';

const issueSchema = new mongoose.Schema({
  photo: String, // base64 string or URL if using uploads
  name: String,
  category: String,
  title: String,
  description: String,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model('Issue', issueSchema);
