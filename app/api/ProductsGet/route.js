import { connectToDatabase } from '@/lib/mongodb'; // Adjust path if necessary

export async function GET() {
  try {
    const { db } = await connectToDatabase();
    const collection = db.collection('products'); // Adjust collection name if needed

    // Fetch all products from the collection
    const products = await collection.find({}).toArray();

    return new Response(JSON.stringify(products), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    return new Response('Internal Server Error', { status: 500 });
  }
}