import { NextResponse } from "next/server";
import sharp from 'sharp';
import { connectToDatabase } from "@/lib/mongodb"; // Adjust path if necessary
import cloudinary from "@/Utils/cloudinary/page";
import { ObjectId } from "mongodb";

export async function POST(request, { params }) {
  let title, description, price, singleImage, multipleImages;

  try {
    const formData = await request.formData();

    title = formData.get('title');
    description = formData.get('description');
    price = parseFloat(formData.get('price')); // Convert price to a number
    singleImage = formData.get('singleImage');
    multipleImages = formData.getAll('images');

    // Validate required fields
    if (!title || !description || isNaN(price) || !singleImage || !multipleImages.length) {
      return NextResponse.json({ error: "Missing or invalid fields" ,title,description,price,singleImage,multipleImages}, { status: 400 });
    }

    // Function to process and upload image to Cloudinary
    const uploadToCloudinary = async (file) => {
      const arrayBuffer = await file.arrayBuffer(); // Read the file as an ArrayBuffer
      const buffer = Buffer.from(arrayBuffer); // Convert ArrayBuffer to Buffer

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

    // Save product to MongoDB
    const { db } = await connectToDatabase();
    await db.collection('products').updateOne(
      { _id: new ObjectId(params.id) }, // filter (which document to replace)
      {
        $set: {
          name: title,
          description: description,
          price: price,
          images: [singleImageUrl, ...uploadedImageUrls],
          updatedAt: new Date(),
        }
      } // the new document to replace the existing one
    );

    // Return success response
    return NextResponse.json({
      message: "Product updated successfully",
    });

  } catch (error) {
    console.error("Error handling file upload and database operation:", error);
    return NextResponse.json({ error: "Internal Server Error", details: error.message }, { status: 500 });
  }
}
