import React, { useState } from 'react';
import preview from '../assets/preview.png';
import { useNavigate } from 'react-router-dom';
import FormField from '../Components/FormField';
import Loader from '../Components/Loader';
import { getRandomPrompts } from '../Components/utils';

const CreatePost = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: '',
    prompt: '',
    photo: '', // Store the generated image URL here
  });

  const [generatingImg, setGeneratingImg] = useState(false);
  const [loading, setLoading] = useState(false); 

  // Generate Image with backend API
  const generateImage = async () => {
    if (!form.prompt) {
      alert('Please provide a valid prompt');
      return;
    }
  
    setGeneratingImg(true);
  
    const token = localStorage.getItem('token');  // Make sure the token is saved correctly in localStorage
    if (!token) {
      alert('Please log in first');
      setGeneratingImg(false);
      return;
    }
  
    try {
      const response = await fetch('https://dall-e-mini.onrender.com/api/v1/dalle', {
        
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,  // Add token in Authorization header
        },
        body: JSON.stringify({
          prompt: form.prompt,
        }),
      });
  
      const data = await response.json();
  
      if (response.ok && data.success) {
        setForm({ ...form, photo: data.photo });
      } else {
        alert(data.message || 'Image generation failed');
      }
    } catch (error) {
      console.error('Error generating image:', error);
      alert('Failed to generate the image. Please try again.');
    } finally {
      setGeneratingImg(false);
    }
  };
  

  // Submit form to backend to save image and prompt
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (form.prompt && form.photo) {
        setLoading(true);

        const token = localStorage.getItem('token');
        console.log('Retrieved Token from localStorage:', token); // Log token for debugging

        if (!token) {
            alert('Please log in first');
            return;
        }

        try {
            const response = await fetch('https://dall-e-mini.onrender.com/api/v1/post', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`, // Add the token here
                },
                body: JSON.stringify({
                    name: form.name, // Add name field
                    prompt: form.prompt,
                    photo: form.photo,
                }),
            });

            const data = await response.json();

            console.log('Post Creation Response:', data); // Log response from the backend

            if (response.ok && data.success) {
                navigate('/dashboard')
            } else {
                alert(data.message || 'Post creation failed');
            }
        } catch (error) {
            console.error('Error creating post:', error);
            alert('Failed to create the post. Please try again.');
        } finally {
            setLoading(false);
        }
    } else {
        alert('Please enter a prompt and generate an image first');
    }
};

  

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSurpriseMe = () => {
    const randomPrompt = getRandomPrompts(form.prompt);
    setForm({ ...form, prompt: randomPrompt });
  };

  return (
    <section className='max-w-7xl mx-auto'>
      <div>
        <h1 className='font-extrabold text-[#222328] text-[32px]'>Create</h1>
        <p className='mt-2 text-[#666e75] text-[16px] max-w-[500px]'>
          Create imaginative and visually stunning images through DALL-E AI and share them with the community.
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
            onClick={generateImage}
            className='text-white bg-green-700 font-medium rounded-md text-sm w-full sm:w-auto px-5 py-2.5 text-center'
          >
            {generatingImg ? 'Generating...' : 'Generate'}
          </button>
        </div>

        <div className='mt-10'>
          <p className='mt-2 text-[#666e75] text-[14px]'>
            Once you have created the image you want, you can share it with others in the community.
          </p>

          <div className='space-x-8 mb-10'>
          <button
            type='submit'
            className='mt-3 text-white bg-[#6469ff] font-medium rounded-md text-sm w-full sm:w-auto px-5 py-2.5 text-center'
            >
            {loading ? 'Sharing...' : 'Share with the community'}
          </button>

          <button onClick={()=> navigate("/your-images")}
          className="mt-6 rounded-[8px] bg-[#22c55e] py-[8px] px-[12px] font-medium text-white mb-10"
          >
            Your Generated Images
          </button>
          </div>

        </div>
      </form>
    </section>
  );
};

export default CreatePost;
