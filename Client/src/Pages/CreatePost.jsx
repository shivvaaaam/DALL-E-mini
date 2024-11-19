import React, { useState } from 'react'
import preview from '../assets/preview.png';
import { useNavigate } from 'react-router-dom';
import FormField from '../Components/FormField';
import Loader from '../Components/Loader';
import { getRandomPrompts } from '../Components/utils';
import axios from 'axios'

const CreatePost = () => {

  const BASE_URL = "http://localhost:8080"
  const navigate = useNavigate();
  
  const [form, setForm] = useState({
    name: "",
    prompt: "",
    photo: ""  // Store the generated image URL here
  })
  
  const [generatingImg, setGeneratingImg] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async(e) => {
     
    e.preventDefault();

    if(form.prompt && form.photo){
      setLoading(true);

      try {
        const response = await fetch('http://localhost:8080/api/v1/post',{
          method: 'POST',
          headers:{
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(form)
        })

        await response.json();
        navigate('/');
      } catch (error) {
        alert(error)
      }finally{
        setLoading(false);
      }
    }else{
       alert('Please enter a prompt and generate an image')
    }

  }

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSurpriseMe = () => {
    const randomPrompt = getRandomPrompts(form.prompt);
    setForm({ ...form, prompt: randomPrompt });
  }

  const generateImage = async (prompt) => {
    if (!prompt) {
      alert('Please provide a valid prompt');
      return;
    }

    setGeneratingImg(true); // Show the loader when the image is being generated

    try {
      const response = await fetch('https://api.deepai.org/api/text2img', {
        method: 'POST',
        headers: {
          'api-key': '7c53799d-6c15-4722-b186-df581c0546b5', // Your API key
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text: prompt }),  // Send the prompt to the API
      });

      if (!response.ok) {
        throw new Error(`Failed to generate image. ${response.statusText}`);
      }

      const data = await response.json();
      console.log('Generated Image:', data);
      
      // Update the form state with the generated image URL
      setForm({ ...form, photo: data.output_url });

    } catch (error) {
      console.error('Error generating image:', error);
    } finally {
      setGeneratingImg(false); // Hide the loader once the image is generated
    }
  };

  return (
    <section className='max-w-7xl mx-auto'>
      <div>
        <h1 className='font-extrabold text-[#222328] text-[32px]'>
          Create
        </h1>
        <p className='mt-2 text-[#666e75] text-[16px] max-w-[500px]'>
          Create imaginative and visually stunning images through DALL-E AI and share them with the community
        </p>
      </div>

      <form className='mt-16 max-w-3xl' onSubmit={handleSubmit}>
        <div className='flex flex-col gap-5'>
          <FormField
            LableName="Your name"
            type="text"
            name="name"
            placeholder="Shivam"
            value={form.name}
            handleChange={handleChange}
          />

          <FormField
            LableName="Prompt"
            type="text"
            name="prompt"
            placeholder="A futuristic cyborg dance club, neon lights"
            value={form.prompt}
            handleChange={handleChange}
            isSurpriseMe
            handleSurpriseMe={handleSurpriseMe}
          />

          <div className='relative bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 w-64 p-3 h-64 flex justify-center items-center'>
            {form.photo ? (
              <img src={form.photo} alt={form.prompt} className='w-full h-full object-contain' />
            ) : (
              <img src={preview} alt="preview" className='w-9/12 h-9/12 object-contain opacity-40' />
            )}

            {generatingImg && (
              <div className='absolute inset-0 z-0 flex justify-center items-center bg-[rgba(0,0,0,0.5)] rounded-lg'>
                <Loader />
              </div>
            )}
          </div>
        </div>

        <div className='mt-5 flex gap-5'>
          <button
            type='button'
            onClick={() => generateImage(form.prompt)}  // Pass the prompt state here
            className='text-white bg-green-700 font-medium rounded-md text-sm w-full sm:w-auto px-5 py-2.5 text-center'
          >
            {generatingImg ? "Generating...": "Generate"}
          </button>
        </div>

        <div className='mt-10'>
          <p className='mt-2 text-[#666e75] text-[14px]'>Once you have created the image you want, you can share it with others in the community</p>
          <button
            type='submit'
            className='mt-3 text-white bg-[#6469ff] font-medium rounded-md text-sm w-full sm:w-auto px-5 py-2.5 text-center'
          >
            {loading ? "Sharing..." : "Share with the community"}
          </button>
        </div>
      </form>
    </section>
  );
};

export default CreatePost;
