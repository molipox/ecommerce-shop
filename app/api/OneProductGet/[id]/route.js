import { connectToDatabase } from '@/lib/mongodb'; // Adjust path if necessary
import { ObjectId } from 'mongodb';
export async function GET(req,{params}) {
  try {
    const { db } = await connectToDatabase();
    const collection = db.collection('products');

    const products = await collection.find({_id :new ObjectId(params.id)}).toArray();

    return new Response(JSON.stringify(products), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0',
      },
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    return new Response('Internal Server Error', { status: 500 });
  }
}
