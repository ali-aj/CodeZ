
import { NextResponse } from 'next/server';
import { dbConnect } from '../../../lib/mongodb';
import Crop from '../../../models/Crop';

// GET a single crop
export async function GET(request, { params }) {
  try {
    await dbConnect();

    const { id } = await params;
    const crop = await Crop.findById(id).populate('farmer');
    
    if (!crop) {
      return NextResponse.json(
        { success: false, error: 'Crop not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: true, data: crop },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// UPDATE a single crop
export async function PUT(request, { params }) {
  try {
    await dbConnect();

    const { id } = await params;
    const body = await request.json();

    const updatedCrop = await Crop.findByIdAndUpdate(id, body, {
      new: true, // Return the updated document
      runValidators: true,
    });

    if (!updatedCrop) {
      return NextResponse.json(
        { success: false, error: 'Crop not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: true, data: updatedCrop },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 400 }
    );
  }
}

// DELETE a single crop
export async function DELETE(request, { params }) {
  try {
    await dbConnect();

    const { id } = await params;
    const deletedCrop = await Crop.findByIdAndDelete(id);

    if (!deletedCrop) {
      return NextResponse.json(
        { success: false, error: 'Crop not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: true, data: {} },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
