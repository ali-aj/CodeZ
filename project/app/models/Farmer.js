import mongoose from 'mongoose';

const FarmerSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    cnic: {
      type: String,
      required: true,
      unique: true,
    },
    phone: {
      type: String,
      required: true,
      trim: true,
    },
    location: {
      type: String,
      default: '',
      trim: true,
    }
});

export default mongoose.models.Farmer || mongoose.model('Farmer', FarmerSchema);
