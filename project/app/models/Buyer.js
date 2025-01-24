import mongoose from 'mongoose';

const BuyerSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    phone: {
      type: String,
      required: true,
      trim: true,
    },
    address: {
      type: String,
      default: '',
      trim: true,
      // e.g. "Lahore, Punjab"
    },
    // If you want to store a buyer's email for notifications (optional)
    email: {
      type: String,
      lowercase: true,
      trim: true,
    },
    // If you want a login system for buyers
    password: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Buyer || mongoose.model('Buyer', BuyerSchema);
