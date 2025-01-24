import mongoose from 'mongoose';

const CropSchema = new mongoose.Schema(
  {
    farmer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Farmer',
      required: true,
    },
    cropName: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      default: '',
      // Additional details about quality, variety, etc.
    },
    quantity: {
      type: Number,
      required: true,
      // e.g., stored in kg
    },
    unit: {
      type: String,
      default: 'kg',
      // Could be "kg", "ton", etc. 
    },
    price: {
      type: Number,
      required: true,
      // Price could be per kg or total. Clarify in your UI.
    },
    status: {
        type: String,
        enum: ['Available', 'Sold'],
        default: 'Available',
      },
    location: {
      type: String,
      default: '',
      // If the crop's actual location differs from farmer's general location
    },
    // If you want to store images for the crop
    images: [
      {
        type: String,
        // URLs to images
      },
    ],
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Crop || mongoose.model('Crop', CropSchema);
