import mime from "mime";
import { NextResponse } from "next/server";
import sharp from 'sharp';
import { connectToDatabase } from "@/lib/mongodb"; // Adjust path if necessary
import cloudinary from "@/Utils/cloudinary/page";

export async function POST(request) {
  try {
    const formData = await request.formData();

    const title = formData.get('title');
    const description = formData.get('description');
    const price = parseFloat(formData.get('price')); // Convert price to a number
    const singleImage = formData.get('singleImage');
    const multipleImages = formData.getAll('images');

    // Validate required fields
    if (!title || !description || isNaN(price) || !singleImage || !multipleImages.length) {
      return NextResponse.json({ error: "Missing or invalid fields" }, { status: 400 });
    }

    // Function to process and upload image to Cloudinary
    const uploadToCloudinary = async (file) => {
      const buffer = Buffer.from(await file.arrayBuffer());

      // Compress the image using sharp (optional)
      const compressedBuffer = await sharp(buffer)
        .resize(500) // Resize to 500px width
        .toBuffer();

      // Directly upload to Cloudinary
      const result = await cloudinary.uploader.upload(`data:image/jpeg;base64,${compressedBuffer.toString('base64')}`, {
        folder: "Product Images",
        resource_type: "image" // Auto detect the image type
      });

      return result.secure_url;
    };

    // Process and upload single image
    const singleImageUrl = await uploadToCloudinary(singleImage);

    // Process and upload multiple images
    const uploadedImageUrls = [];
    for (const file of multipleImages) {
      const imageUrl = await uploadToCloudinary(file);
      uploadedImageUrls.push(imageUrl);
    }

    // Prepare product data for MongoDB
    const product = {
      name: title,
      description,
      price,
      images: [singleImageUrl, ...uploadedImageUrls], // Single and multiple images combined
      createdAt: new Date(),
    };

    // Save product to MongoDB
    const { db } = await connectToDatabase();
    const collection = db.collection("products");
    await collection.insertOne(product);

    // Return success response
    return NextResponse.json({
      message: "Product saved successfully",
      product,
    });

  } catch (error) {
    console.error("Error handling file upload and database operation:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
