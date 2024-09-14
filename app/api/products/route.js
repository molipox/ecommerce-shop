import mime from "mime";
import { join } from "path";
import { stat, mkdir, writeFile } from "fs/promises";
import * as dateFn from "date-fns";
import { NextResponse } from "next/server";
import sharp from 'sharp';
import { connectToDatabase } from "@/lib/mongodb"; // Adjust path if necessary

export async function POST(request) {
  try {
    const formData = await request.formData();

    const title = formData.get('title');
    const description = formData.get('description');
    const price = parseFloat(formData.get('price')); // Convert price to a number
    const singleImage = formData.get('singleImage');
    const multipleImages = formData.getAll('images');

    // Validate required fields
    if (!title || !description || isNaN(price) || !singleImage || !multipleImages) {
      return NextResponse.json({ error: "Missing or invalid fields" }, { status: 400 });
    }

    // Function to process and save images
    const processImage = async (file) => {
      const buffer = Buffer.from(await file.arrayBuffer());

      // Compress the image using sharp
      

      const relativeUploadDir = `/uploads/${dateFn.format(Date.now(), "dd-MM-yyyy")}`;
      const uploadDir = join(process.cwd(), "public", relativeUploadDir);

      try {
        await stat(uploadDir);
      } catch (e) {
        // Directory doesn't exist, create it
        if (e.code === "ENOENT") {
          await mkdir(uploadDir, { recursive: true });
        } else {
          throw new Error("Error while creating directory");
        }
      }

      const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
      const filename = `${file.name.replace(/\.[^/.]+$/, "")}-${uniqueSuffix}.${mime.getExtension(file.type)}`;

      await writeFile(`${uploadDir}/${filename}`, buffer);

      return `${relativeUploadDir}/${filename}`;
    };

    // Process single image
    const singleImageUrl = singleImage ? await processImage(singleImage) : null;
    if (singleImageUrl?.error) {
      return NextResponse.json({ error: singleImageUrl.error }, { status: 500 });
    }

    // Process multiple images
    const uploadedImageUrls = [];
    for (const file of multipleImages) {
      const imageUrl = await processImage(file);
      if (imageUrl.error) {
        return NextResponse.json({ error: imageUrl.error }, { status: 500 });
      }
      uploadedImageUrls.push(imageUrl);
    }

    // Prepare data for MongoDB
    const product = {
      title,
      description,
      price,
      singleImageUrl, // Single image URL
      multipleImageUrls: uploadedImageUrls, // Array of multiple image URLs
      createdAt: new Date()
    };

    // Save to MongoDB
    const { db } = await connectToDatabase();
    const collection = db.collection('products');
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
