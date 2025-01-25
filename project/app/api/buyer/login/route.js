// app/api/buyers/login/route.js
import { NextResponse } from 'next/server';
import bcrypt from 'bcrypt';
import { dbConnect } from '../../../lib/mongodb';
import Buyer from '../../../models/Buyer';

/**
 * POST /api/buyers/login
 * Body: { email, password }
 */
export async function POST(request) {
  try {
    await dbConnect();

    const { email, password } = await request.json();

    // Basic validation
    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: 'Email and password are required.' },
        { status: 400 }
      );
    }

    // Find buyer by email
    const buyer = await Buyer.findOne({ email });
    if (!buyer) {
      return NextResponse.json(
        { success: false, error: 'Buyer not found.' },
        { status: 404 }
      );
    }

    // Compare hashed passwords
    const passwordMatch = await bcrypt.compare(password, buyer.password);
    if (!passwordMatch) {
      return NextResponse.json(
        { success: false, error: 'Invalid credentials.' },
        { status: 401 }
      );
    }

    // Password matches -> success
    // In production, you'd create a session or JWT token here.
    return NextResponse.json(
      {
        success: true,
        data: {
          id: buyer._id,
          name: buyer.name,
          phone: buyer.phone,
          email: buyer.email,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
