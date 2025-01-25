import { NextResponse } from 'next/server';
import { dbConnect } from '../../lib/mongodb';
import Crop from '../../models/Crop';
import Farmer from '../../models/Farmer'; // Ensure Farmer model is imported

export async function GET() {
  try {
    await dbConnect();

    // Fetch all crops and populate farmer details
    const crops = await Crop.find({}).populate('farmer');

    return NextResponse.json(
      { success: true, data: crops },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    await dbConnect();

    // Parse the incoming request body
    const { farmerId, cropName, quantity, pricePerKg } = await request.json();

    // Create a new crop entry
    const newCrop = await Crop.create({
      farmer: farmerId, // store a reference to the Farmer model
      cropName,
      quantity,
      price: pricePerKg,
    });

    return NextResponse.json(
      { success: true, data: newCrop },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 400 }
    );
  }
}
