"use client"
import axios from 'axios'
import React, { useState } from 'react'

const NewContent = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState(0);
  
  async function handleSubmit(event) {
    event.preventDefault();

    try {
      const response = await axios.post('/api/products', {
        title: title,
        description: description,
        price: price,
      });
      console.log('Response:', response.data);
      console.log("Success");
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
            onChange={(e) => console.log(e.target.value)}  
            className='mb-3 mt-1 text-blue-900 border border-gray-300 rounded-md focus:border-2 focus:border-blue-900 px-1 py-1' 
            placeholder='description'
          />
          <label className='text-blue-900 px-1'>Price (in USD)</label>
          <input 
            value={price} 
            onChange={(e) => setPrice(e.target.value)} 
            type="number" 
            placeholder='price' 
            className='mb-3 mt-1 text-blue-900 border border-gray-300 rounded-md focus:border-2 focus:border-blue-900 px-1 py-1'
          />
          <button type='submit' className='bg-blue-900 w-fit text-white rounded-md py-1 px-2 mt-2'>Save</button>
        </form>
      </div>
    </div>
  );
}

export default NewContent;