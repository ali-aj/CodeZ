// app/api/buyers/route.js

import { NextResponse } from 'next/server';
import { dbConnect } from '../../lib/mongodb';
import Buyer from '../../models/Buyer.js';

/**
 * GET /api/buyers
 * Retrieve all buyers from the database.
 */
export async function GET() {
  try {
    await dbConnect();
    const buyers = await Buyer.find({});

    return NextResponse.json({ success: true, data: buyers }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

/**
 * POST /api/buyers
 * Create a new buyer.
 */
export async function POST(request) {
  try {
    await dbConnect();
    const body = await request.json();

    // Expect at least { name, phone } in the request body.
    const newBuyer = await Buyer.create(body);

    return NextResponse.json({ success: true, data: newBuyer }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 400 }
    );
  }
}
