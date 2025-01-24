import { NextResponse } from "next/server";
import { dbConnect } from "../../../lib/mongodb";
import Farmer from "../../../models/Farmer.js";

export async function GET(request) {
  try {
    await dbConnect();

    // Extract query parameters from the request URL
    const { searchParams } = new URL(request.url);
    const cnic = searchParams.get("cnic");
    const name = searchParams.get("name");

    if (!cnic || !name) {
      return NextResponse.json(
        { success: false, error: "Missing name or cnic in query params" },
        { status: 400 }
      );
    }

    // Find one farmer matching BOTH name and cnic
    // (exact match on name, case-sensitive by default)
    const farmer = await Farmer.findOne({ cnic, name });

    if (farmer) {
      // Farmer found
      return NextResponse.json({ success: true, data: farmer }, { status: 200 });
    } else {
      // No farmer with that name & cnic
      return NextResponse.json(
        { success: false, error: "Farmer not found" },
        { status: 404 }
      );
    }
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
