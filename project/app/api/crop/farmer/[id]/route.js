import { NextResponse } from 'next/server';
import { dbConnect } from '../../../../lib/mongodb.js';
import Crop from '../../../../models/Crop.js';


export async function GET(request, { params }) {
  try {
    await dbConnect();
    const { id } = params; // farmer's ID

    // Find all crops belonging to this farmer
    const crops = await Crop.find({ farmer: id }).populate('farmer');

    return NextResponse.json({ success: true, data: crops }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
