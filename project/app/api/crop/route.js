
import { NextResponse } from 'next/server';
import { dbConnect } from '../../lib/mongodb';
import Crop from '../../models/Crop';

export async function GET() {
  try {
    await dbConnect();

    // Fetch all crops from the database
    const crops = await Crop.find({}); 
    // .populate('farmer') will fetch the farmer details if needed

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

    // body should contain at least: farmer, cropName, quantity, price, etc.
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
