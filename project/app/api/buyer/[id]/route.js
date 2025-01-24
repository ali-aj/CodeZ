// app/api/buyers/[id]/route.js

import { NextResponse } from 'next/server';
import { dbConnect } from '../../../lib/mongodb';
import Buyer from '../../../models/Buyer.js';

/**
 * GET /api/buyers/[id]
 * Retrieve a single buyer by ID.
 */
export async function GET(request, { params }) {
  try {
    await dbConnect();
    const { id } = await params; 

    const buyer = await Buyer.findById(id);
    if (!buyer) {
      return NextResponse.json(
        { success: false, error: 'Buyer not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: buyer }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/buyers/[id]
 * Update a buyer's information.
 */
export async function PUT(request, { params }) {
  try {
    await dbConnect();
    const { id } = await params; 
    const body = await request.json();

    const updatedBuyer = await Buyer.findByIdAndUpdate(id, body, {
      new: true,
      runValidators: true,
    });

    if (!updatedBuyer) {
      return NextResponse.json(
        { success: false, error: 'Buyer not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: updatedBuyer }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 400 }
    );
  }
}

/**
 * DELETE /api/buyers/[id]
 * Remove a buyer from the database.
 */
export async function DELETE(request, { params }) {
  try {
    await dbConnect();
    const { id } = params;
    const deletedBuyer = await Buyer.findByIdAndDelete(id);

    if (!deletedBuyer) {
      return NextResponse.json(
        { success: false, error: 'Buyer not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: {} }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
