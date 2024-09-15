import { connectToDatabase } from '@/lib/mongodb'; // Adjust path if necessary

export async function GET() {
  try {
    const { db } = await connectToDatabase();
    const collection = db.collection('products');

    const products = await collection.find({}).toArray();

    return new Response(JSON.stringify(products), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate', // No caching at all
        'Pragma': 'no-cache',  // HTTP 1.0 no-cache directive
        'Expires': '0',  // Expire immediately
      },
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    return new Response('Internal Server Error', { status: 500 });
  }
}
