import mime from "mime";
import { join } from "path";
import { stat, mkdir, writeFile } from "fs/promises";
import * as dateFn from "date-fns";
import { NextResponse } from "next/server";
import sharp from 'sharp';
import { connectToDatabase } from "@/lib/mongodb"; // Adjust path if necessary
import { Collection } from "mongodb";

export async function POST(request) {
  try {
    const formData = await request.formData();

    const title = formData.get('title');
    const description = formData.get('description');
    const price = parseFloat(formData.get('price')); // Convert price to a number
    const file = formData.get('singleImage');

    // Validate required fields
    if (!title || !description || isNaN(price) || !file) {
      return NextResponse.json({ error: "Missing or invalid fields" }, { status: 400 });
    }

    // Convert file to buffer
    const buffer = Buffer.from(await file.arrayBuffer());

    // Compress the image using sharp
    let compressedBuffer;
    try {
      compressedBuffer = await sharp(buffer)
        .resize({ width: 1024 }) // Resize if necessary
        .jpeg({ quality: 80 })   // Adjust quality
        .toBuffer();
    } catch (error) {
      console.error("Error compressing image:", error);
      return NextResponse.json({ error: "Error compressing image" }, { status: 500 });
    }

    // Ensure the compressed image is under 2MB
    if (compressedBuffer.length > 2 * 1024 * 1024) {
      return NextResponse.json({ error: "Compressed image exceeds 2MB" }, { status: 400 });
    }

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

    await writeFile(`${uploadDir}/${filename}`, compressedBuffer);

    // Prepare data for MongoDB
    const product = {
      title,
      description,
      price,
      imageUrl: `${relativeUploadDir}/${filename}`,
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
