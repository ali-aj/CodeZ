import { NextResponse } from 'next/server';
import bcrypt from 'bcrypt';
import { dbConnect } from '../../../lib/mongodb';
import Buyer from '../../../models/Buyer.js';

/**
 * POST /api/buyers/signup
 * Body: { name, phone, email, password, address? }
 */
export async function POST(request) {
  try {
    await dbConnect();

    const { name, phone, email, password, address } = await request.json();

    // Basic validation
    if (!name || !phone || !password) {
      return NextResponse.json(
        { success: false, error: 'Name, phone, and password are required.' },
        { status: 400 }
      );
    }

    // Optional: Check if phone or email already in use
    // If you want strict uniqueness, ensure your schema has unique: true for phone/email
    const existingBuyer = await Buyer.findOne({
      $or: [{ phone }, { email }],
    });

    if (existingBuyer) {
      return NextResponse.json(
        {
          success: false,
          error: 'Phone or email already in use. Please use a different one.',
        },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new buyer
    const newBuyer = await Buyer.create({
      name,
      phone,
      email,
      address: address || '',
      password: hashedPassword,
    });

    return NextResponse.json(
      { success: true, data: { id: newBuyer._id, name: newBuyer.name } },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
