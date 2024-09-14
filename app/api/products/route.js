import mime from "mime";
import { join } from "path";
import { stat, mkdir, writeFile } from "fs/promises";
import * as dateFn from "date-fns";
import { NextResponse } from "next/server";
import sharp from 'sharp';
import { connectToDatabase } from "@/lib/mongodb"; // Adjust path if necessary
import cloudinary from "@/Utils/cloudinary/page";
import { stringify } from "querystring";

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

      // Compress the image using sharp (optional)
      const compressedBuffer = await sharp(buffer)
        .resize(500) // Resize to 500px width
        .toBuffer();

      // Correct path construction with 'join'
      const relativeUploadDir = join("uploads", dateFn.format(Date.now(), "dd-MM-yyyy"));
      const uploadDir = join(process.cwd(), relativeUploadDir); // Full path to uploads directory

      // Ensure the directory exists
      try {
        await stat(uploadDir);
      } catch (e) {
        if (e.code === "ENOENT") {
          // Directory doesn't exist, create it
          await mkdir(uploadDir, { recursive: true });
        } else {
          throw new Error("Error while creating directory: " + e.message);
        }
      }

      // Generate a unique filename
      const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
      const filename = `${file.name.replace(/\.[^/.]+$/, "")}-${uniqueSuffix}.${mime.getExtension(file.type)}`;

      // Save the image to the filesystem
      const filePath = join(uploadDir, filename);
      await writeFile(filePath, compressedBuffer); // Save the compressed image

      return join(relativeUploadDir, filename);
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

    // Upload images to Cloudinary
    let cloudinarySingle = "" ;
    const result2 = await cloudinary.uploader.upload(singleImageUrl, {
      folder: "Main Product Image",
    });
    cloudinarySingle = result2.secure_url;
    // Save the single image URL to Cloudinary
    const cloudinaryUrls = [];
    for (const imageUrl of uploadedImageUrls) {
      const result = await cloudinary.uploader.upload(imageUrl, {
        folder: "Product Images",
      });
      cloudinaryUrls.push(result.secure_url); // Collect Cloudinary URLs
    }

    // Prepare data for MongoDB
    const product = {
      title,
      description,
      price,
      singleImageUrl: cloudinarySingle, // Single image URL
      multipleImageUrls: cloudinaryUrls, // Array of Cloudinary image URLs
      createdAt: new Date(),
    };

    // Save to MongoDB
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
