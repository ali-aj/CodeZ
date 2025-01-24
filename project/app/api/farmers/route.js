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
 */
export async function POST(request) {
  try {
    await dbConnect();
    const body = await request.json(); // parse JSON from request body

    // Expect body to have { name, cnic, phone, location } at minimum
    const newFarmer = await Farmer.create(body);

    return NextResponse.json({ success: true, data: newFarmer }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}
