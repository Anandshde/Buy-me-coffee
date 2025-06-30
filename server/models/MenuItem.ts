import mongoose from 'mongoose';

const menuItemSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    price: { type: Number, required: true },
    image: String,
    active: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.model('MenuItem', menuItemSchema);
