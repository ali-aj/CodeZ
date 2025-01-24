// app/api/farmers/[id]/route.js
import { NextResponse } from 'next/server';
import { dbConnect } from '../../../lib/mongodb';
import Farmer from '../../../models/Farmer.js';


/**
 * GET /api/farmers/[id]
 * Retrieves a single farmer by ID
 */
export async function GET(request, { params }) {
  try {
    await dbConnect();

    const { id } = await params; // dynamic route parameter
    const farmer = await Farmer.findById(id);

    if (!farmer) {
      return NextResponse.json({ success: false, error: 'Farmer not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: farmer }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

/**
 * PUT /api/farmers/[id]
 * Update an existing farmer
 */
export async function PUT(request, { params }) {
  try {
    await dbConnect();

    const { id } = await params;
    const body = await request.json();

    // findByIdAndUpdate returns the *old* doc by default.
    // { new: true } returns the updated doc, runValidators ensures schema rules are applied
    const updatedFarmer = await Farmer.findByIdAndUpdate(id, body, {
      new: true,
      runValidators: true,
    });

    if (!updatedFarmer) {
      return NextResponse.json({ success: false, error: 'Farmer not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: updatedFarmer }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}

/**
 * DELETE /api/farmers/[id]
 * Remove a farmer
 */
export async function DELETE(request, { params }) {
  try {
    await dbConnect();

    const { id } = await params;
    const deletedFarmer = await Farmer.findByIdAndDelete(id);

    if (!deletedFarmer) {
      return NextResponse.json({ success: false, error: 'Farmer not found' }, { status: 404 });
    }

    // Return empty object or you can return the deleted doc if needed
    return NextResponse.json({ success: true, data: {} }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
