import React, { useState, useCallback } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';

const NewContent = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState(0);
  const [singleImage, setSingleImage] = useState(null);
  const [multipleImages, setMultipleImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);

  const router = useRouter(); 

  const handleDrop = useCallback((event) => {
    event.preventDefault();
    event.stopPropagation();

    const files = Array.from(event.dataTransfer.files);
    setMultipleImages(files);

    const previews = files.map(file => URL.createObjectURL(file));
    setImagePreviews(previews);
  }, []);

  const handleDragOver = (event) => {
    event.preventDefault();
    event.stopPropagation();
  };

  const handleFileChange = (event) => {
    const files = Array.from(event.target.files);
    setMultipleImages(files);

    const previews = files.map(file => URL.createObjectURL(file));
    setImagePreviews(previews);
  };

  const handleSingleImageChange = (event) => {
    const file = event.target.files[0];
    setSingleImage(file);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData();
    
    // Append form data
    formData.append("title", title);
    formData.append("description", description);
    formData.append("price", price.toString()); // Convert price to string
  
    // Check if single image exists before appending
    if (singleImage) {
      formData.append("singleImage", singleImage); // Attach single image
    }
  
    // Append multiple images if they exist
    if (multipleImages && multipleImages.length > 0) {
      multipleImages.forEach((file) => formData.append("images", file)); // Attach multiple images
    }
  
    try {
      const response = await axios.post('/api/products', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      console.log('Response:', response.data);
  
      // Redirect after successful form submission
      router.push("/products");
  
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  return (
    <div className='bg-white w-full m-5 rounded-lg ml-0 p-5'>
      <div className='flex flex-col'>
        <h1 className="text-blue-900 px-1 font-semibold text-3xl mb-4">New Product</h1>
        <form className='flex flex-col' onSubmit={handleSubmit}>
          <label className='text-blue-900 px-1'>Product name <span className='text-red-500'>*</span></label>
          <input  
            name="title" // Add name attribute
            value={title} 
            onChange={(e) => setTitle(e.target.value)} 
            type="text" 
            required={true}
            placeholder='Product name' 
            className='mb-3 mt-1 text-blue-900 border border-gray-300 rounded-md focus:border-2 focus:border-blue-900 px-1 py-1' 
          />
          <label className='text-blue-900 px-1'>Description</label>
          <textarea 
            name="description" // Add name attribute
            value={description} 
            onChange={(e) => setDescription(e.target.value)}  
            className='mb-3 mt-1 text-blue-900 border border-gray-300 rounded-md focus:border-2 focus:border-blue-900 px-1 py-1' 
            placeholder='Description'
          />
          <label className='text-blue-900 px-1'>Price (in MAD) <span className='text-red-500'>*</span></label>
          <input 
            name="price" // Add name attribute
            value={price} 
            onChange={(e) => setPrice(parseFloat(e.target.value))} // Convert input to number
            type="number" 
            required={true}
            placeholder='Price' 
            className='mb-3 mt-1 text-blue-900 border border-gray-300 rounded-md focus:border-2 focus:border-blue-900 px-1 py-1'
          />
          
          {/* Single Image Input with Drag & Drop */}
          <label className='text-blue-900 px-1 mb-3'>Main Product Image <span className='text-red-500'>*</span></label>
          <div 
            className='border-2 border-dashed border-gray-300 p-4 text-center rounded-md cursor-pointer mb-4'
            onDrop={(e) => {
              e.preventDefault();
              e.stopPropagation();
              const file = e.dataTransfer.files[0];
              if (file) {
                setSingleImage(file);
                const preview = URL.createObjectURL(file);
                setImagePreviews([preview, ...imagePreviews]);
              }
            }}
            onDragOver={handleDragOver}
            onClick={() => document.getElementById('singleImage').click()} // Trigger file input on click
          >
            <input 
              id='singleImage'
              name="singleImage" // Add name attribute
              type="file" 
              accept="image/*" 
              onChange={handleSingleImageChange}
              className='hidden' // Hide the input
              required={true}
            />
            <p>Drag & Drop image here or click to select image</p>
          </div>
          {singleImage && (
            <img 
              src={URL.createObjectURL(singleImage)} 
              alt="Single Preview main one" 
              className='w-32 h-32 object-cover mt-2  rounded-lg border-2 border-black'
            />
          )}
          
          {/* Multiple Images Drag & Drop */}
          <label className='text-blue-900 px-1 mb-3 mt-3'>Product Images <span className='text-red-500'>*</span></label>
          <div 
            className='border-2 border-dashed border-gray-300 p-4 text-center rounded-md cursor-pointer mb-4'
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onClick={() => document.getElementById('multipleImages').click()} // Trigger file input on click
          >
            <input 
              id='multipleImages'
              name="multipleImages" // Add name attribute
              type="file" 
              accept="image/*" 
              multiple
               // Remove required if not needed
              onChange={handleFileChange}
              className='hidden' // Hide the input
            />
            <p>Drag & Drop images here or click to select images</p>
          </div>
          
          {/* Display multiple images previews if available */}
          <div className='mt-4 flex gap-2 flex-wrap'>
            {imagePreviews.map((src, index) => (
              <img 
                key={index} 
                src={src} 
                alt={`Preview ${index + 1}`} 
                className='w-32 h-32 object-cover mb-2 rounded-lg border-2 border-black'
              />
            ))}
          </div>
          
          <button type='submit' className='bg-blue-900 w-fit text-white rounded-md py-1 px-2 mt-2'>Save</button>
        </form>
      </div>
    </div>
  );
}

export default NewContent;
