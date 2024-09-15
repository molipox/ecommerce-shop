import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';
export  async function DELETE(req,{params}) {
  console.log(req.method);
  // Perform your DELETE operation here
  const { db } = await connectToDatabase();
  const collection = db.collection("products");
  await collection.deleteOne({_id :new ObjectId(params.id)})
  return NextResponse.json(params.id);
}