"use client"
import { redirect, usePathname, useRouter } from 'next/navigation'
import React, { useState } from 'react'
import { useEffect } from 'react'
import axios from 'axios'
import { OrbitProgress ,BlinkBlur} from 'react-loading-indicators'
const EditContent = () => {
  const router = useRouter();
  // Data //

      // Form Data //
        const [title, setTitle] = useState("");
        const [description, setDescription] = useState("");
        const [price, setPrice] = useState(0);
        const [singleImage, setSingleImage] = useState(null);
        const [multipleImages, setMultipleImages] = useState([]);
      //-------------------------------------------------------//

      // Local Functions Data //
      const [SingleImageSrc, setSingleImageSrc] = useState();
      const [MultipleImageSrc, setMultipleImageSrc] = useState([]);
      //-------------------------------------------------------//

      // Get Data Data //
      const path = usePathname();
      const pathQeury = path.split("/");
      const id = pathQeury[3];
      const [fetched,setFetched] = useState(false);
      const [products,setProducts] = useState([])
      //-------------------------------------------------------//

      // Other Data //
      const [saving, setSaving] = useState("");
      //-------------------------------------------------------//
      //-------------------------------------------------------//
  //------------------------------------------------------//

  // convert cloudinary url image to blob //
  async function urltoblob(url){
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      return blob;
    } catch (error) {
      console.error(error);
    }
  }

  
  
  




  // Get Data //

    useEffect(() => {
       const fetchData = async () => {
        await axios.get(`/api/OneProductGet/${id}`)
      .then((response) =>
       {setProducts(response.data);

          setFetched(true);
       })
      .catch((error) => console.error(error));

       }
       fetchData();
    },[id])
    console.log(products);

  //-------------------------------------------//


    
    
// Tranforme Single Image Data To src //
    useEffect(() => {
      if(singleImage){
        if(singleImage instanceof Blob){
          const render = new FileReader();
  
          render.onload = (e) => {
            setSingleImageSrc(e.target.result);
          }
          render.readAsDataURL(singleImage);  
        }else{
          urltoblob(singleImage)
          .then((response) =>
          {
            const render = new FileReader();
  
          render.onload = (e) => {
            setSingleImageSrc(e.target.result);
          }
          render.readAsDataURL(response);
          })
        }
        }
      else{
        setSingleImageSrc(products[0]?.images[0]);
      }
    },[singleImage,products[0]])
//-------------------------------------//

// Function Of Handling Multiple Images //



const handleRemoveImage = (index) => {
  setMultipleImageSrc(prevImages => prevImages.filter((image, i) => i !== index));
  setMultipleImages(prevImages => prevImages.filter((image, i) => i !== index));
};


const handleMultipleImages = (files) => {
  const imageArray = Array.from(files).map((file,i) => {
    
    const reader = new FileReader();
    reader.onload = (e) => {
      setMultipleImageSrc((prevImages) => [...prevImages, e.target.result]);
    };
    if(file instanceof Blob){
      reader.readAsDataURL(file);
    }else{
      urltoblob(file)
       .then((blob) => {
          reader.readAsDataURL(blob);
        })
    }
    setMultipleImages((prevImages) => {
      if(prevImages[i] === file){
        return [...prevImages];
      }else{
        return [...prevImages, file];
      }
    } );
    })

    
};
console.log(multipleImages);

function blobToFile(blob, fileName) {
  // Create a new File object from the Blob
  return new File([blob], fileName, { type: blob.type });
}
//--------------------------------------//

// Function Of Handling Data //
async function handleSubmit(e){
    setSaving("saving");
    e.preventDefault();
    const formData = new FormData();
    
    // Append form data
    formData.append("title", title);
    formData.append("description", description);
    formData.append("price", price.toString()); // Convert price to string
    // Check if single image exists before appending
    if (singleImage) {
      if(typeof singleImage === "string"){
        if(singleImage.startsWith("https://res.cloudinary.com")){
          await urltoblob(singleImage).then(blob => {
            const file = blobToFile(blob,"name file");
            formData.append("singleImage", file); // Attach single image
            console.log(file)
          })
        }
      }
      else{
        formData.append("singleImage", singleImage); // Attach single image
      }
    }
  
    // Append multiple images if they exist
    if (multipleImages && multipleImages.length > 0) {
      const uploadpromise = multipleImages.map(async (file) =>{ 
        if(typeof file === "string"){
          if(file.startsWith("https://res.cloudinary.com")){
              await urltoblob(file).then(blob => {
              const file = blobToFile(blob,"multiple name file")
              formData.append("images", file); // Attach multiple images
              console.log(file);
            })
            
          }
        }else{
          formData.append("images", file)
        }// Attach multiple images
        })
        await Promise.all(uploadpromise);
    }
    const response = await axios.post(`/api/ProductUpdate/${id}`,formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    console.log('Response:', response.data);
    router.push("/products");
  } 

  useEffect(() => {
    if(products[0]){
      const dataparse = () => {
        setTitle(products[0]?.name)
        setDescription(products[0]?.description)
        setPrice(products[0]?.price)
        setSingleImage(products[0]?.images[0]);
        setMultipleImages(products[0]?.images.slice(1));
      }
      dataparse();
      handleMultipleImages(multipleImages);
    }else{
      console.log("product empty")

    }
  },[products]);
  console.log(products[0]);

  console.log("title",title)  
  console.log("price",price)  
  console.log("description",description)  
  console.log("image",singleImage)  
  console.log("images",multipleImages)  
  
    if (!fetched){
        return( 
        <div  className='flex justify-center items-center bg-white w-full m-5 rounded-lg ml-0 p-5'>
            <OrbitProgress color="#1e3a8a" size="medium" text="" textColor="" />
        </div>
        );
    }
    
  return (
    <div className=' bg-white w-full m-5 rounded-lg ml-0 p-5'>
      <p>
        {id}
      </p>
      
        <h1 className=' ml-2 text-3xl mb-4 font-semibold text-blue-900'>Edit Product</h1>
      <form className='flex flex-col  gap-1' onSubmit={handleSubmit}>
        <label className='ml-1 text-blue-900 '>
          Product name <span className='text-red-500'>*</span>
        </label>
          <input required={true} value={title} className='mb-2  border p-1 rounded-lg' type="text" name="title" placeholder={products[0]?.name} onChange={(e) => setTitle(e.target.value)}/>
        <label className='ml-1 text-blue-900 '>
          Description 
        </label>
          <textarea className='mb-2  border p-1 rounded-lg' value={description} name="content" rows="4" cols="50" placeholder={products[0]?.description} onChange={(e) => setDescription(e.target.value)}/>
        <label className='ml-1 text-blue-900 '>Price (in MAD) <span className='text-red-500'>*</span></label>
        <input required={true} className='mb-2  border p-1 rounded-lg' value={price} type="number" name="price" placeholder={products[0]?.price} onChange={(e) => setPrice(e.target.value)}/>
        
        <label className='text-blue-900 mt-1'>Main Product Image  <span className='text-red-500'>*</span></label>
        <div className='grid grid-cols-4 gap-3'>
          { SingleImageSrc? (
            <div className='relative group h-full w-full flex rounded-xl overflow-hidden border-2'>
              <img
              
              src={SingleImageSrc}
              
              alt='hello'
              ></img>
              <div className='group-hover:opacity-20 transition-all bg-black h-full absolute opacity-0 w-full'></div>
              <button type="button" className=' absolute right-0' onClick={() => {setSingleImageSrc(undefined)}}>
                <i class='bx bx-x text-red-500 invisible  group-hover:visible absolute m-2 text-[30px] right-0'></i>
              </button>
            </div>
          ) : (<div className='hidden'></div>
          )}
          <div className='flex flex-col justify-center items-center text-center py-14 px-5 overflow-hidden relative border-dashed border-2 rounded-xl h-full '>
            <i class='bx bx-cloud-upload text-blue-900 text-[3em]'></i>
            <p className='w-[80%] '><span className='opacity-60'>Drop your images here or select</span> <span className='text-blue-900 opacity-100'>click to browse</span></p>
            <input type="file" name="singleImage" accept="image/*" className='z-10 w-full h-full absolute opacity-0' onChange={(e) => {setSingleImage(e.target.files[0])}}/>
          </div>
          
        </div>
        <label className='text-blue-900 mt-1'>Product Images <span className='text-red-500'>*</span></label>
        <div className='grid grid-cols-4 gap-3'>
          { MultipleImageSrc.map((image, i) => (
            
            <div key={i} className='relative group h-full w-full flex rounded-xl overflow-hidden border-2'>
              <img src={image}  alt={`image-${i}`} />
              <div className='group-hover:opacity-20 transition-all bg-black h-full absolute opacity-0 w-full'></div>
              <button type="button" className='absolute right-0' onClick={() => handleRemoveImage(i)}>
                <i className='bx bx-x text-red-500 invisible group-hover:visible absolute m-2 text-[30px] right-0'></i>
              </button>
            </div>

          )) }
        
          
          <div className='flex flex-col justify-center items-center text-center py-14 px-5 overflow-hidden relative border h-full rounded-xl'>
            <i class='bx bx-cloud-upload text-blue-900 text-[3em]'></i>
            <p className='w-[80%] '><span className='opacity-60'>Drop your images here or select</span> <span className='text-blue-900 opacity-100'>click to browse</span></p>
            <input type="file" name="MultipleImages" accept="image/*" className='z-10 w-full h-full absolute opacity-0' multiple onChange={(e) => handleMultipleImages(e.target.files)}/>
          </div>
          
        </div>
        <div className='flex gap-2 items-center'>
          <input type="submit" value="save" className='bg-blue-900 w-fit text-white pb-1 px-3 mt-5 rounded-lg hover:bg-blue-950 ' />          
        </div>
      </form>
    </div>
  )
}


export default EditContent
