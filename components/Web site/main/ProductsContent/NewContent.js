"use client";
import React, { useState } from 'react';
import axios from 'axios';

const NewContent = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState(0);
  const [singleImage, setSingleImage] = useState(null);

  async function handleSubmit(event) {
    event.preventDefault();
    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("price", price.toString()); // Convert price to string

    if (singleImage) {
      formData.append("singleImage", singleImage); // Ensure image is attached
    }

    try {
      const response = await axios.post('/api/products', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      console.log('Response:', response.data);
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  }

  return (
    <div className='bg-white w-full m-5 rounded-lg ml-0 p-5'>
      <div className='flex flex-col'>
        <h1 className="text-blue-900 px-1 font-semibold text-3xl mb-4">New Product</h1>
        <form className='flex flex-col' onSubmit={handleSubmit}>
          <label className='text-blue-900 px-1'>Product name</label>
          <input 
            value={title} 
            onChange={(e) => setTitle(e.target.value)} 
            type="text" 
            placeholder='product name' 
            className='mb-3 mt-1 text-blue-900 border border-gray-300 rounded-md focus:border-2 focus:border-blue-900 px-1 py-1' 
          />
          <label className='text-blue-900 px-1'>Description</label>
          <textarea 
            value={description} 
            onChange={(e) => setDescription(e.target.value)}  
            className='mb-3 mt-1 text-blue-900 border border-gray-300 rounded-md focus:border-2 focus:border-blue-900 px-1 py-1' 
            placeholder='description'
          />
          <label className='text-blue-900 px-1'>Price (in USD)</label>
          <input 
            value={price} 
            onChange={(e) => setPrice(parseFloat(e.target.value))} // Convert input to number
            type="number" 
            placeholder='price' 
            className='mb-3 mt-1 text-blue-900 border border-gray-300 rounded-md focus:border-2 focus:border-blue-900 px-1 py-1'
          />
          <input 
            type="file" 
            accept="image/*" 
            id='singleImage' 
            onChange={(e) => setSingleImage(e.target.files[0])} // Correctly set the file
          />
          <button type='submit' className='bg-blue-900 w-fit text-white rounded-md py-1 px-2 mt-2'>Save</button>
        </form>
      </div>
    </div>
  );
}

export default NewContent;
