// app/api/farmers/route.js
import { NextResponse } from 'next/server';
import { dbConnect } from '../../lib/mongodb';
import Farmer from '../../models/Farmer.js';


/**
 * GET /api/farmers
 * Fetch all farmers
 */
export async function GET() {
  try {
    await dbConnect();
    const farmers = await Farmer.find({});
    return NextResponse.json({ success: true, data: farmers }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

/**
 * POST /api/farmers
 * Create a new farmer
 * Check if a farmer with given username and cnic exists
 */
export async function POST(request) {
  try {
    await dbConnect();
    const { username, cnic } = await request.json();

    // Check if a farmer with the given username and cnic exists
    const farmer = await Farmer.findOne({ username, cnic });
    if (farmer) {
      return NextResponse.json({ success: true, exists: true }, { status: 200 });
    } else {
      return NextResponse.json({ success: true, exists: false }, { status: 200 });
    }
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
