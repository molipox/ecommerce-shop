// app/api/products/route.js
import { NextResponse } from 'next/server';
import { connectToDatabase } from "@/lib/mongodb";
export async function POST(req , res) {
  try {
    const data = await req.json();
    const {title,description,price} = data;
    
    return NextResponse.json({ title , description , price }, { status: 201 });
  } catch (error) {
    console.error('Error processing request:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
