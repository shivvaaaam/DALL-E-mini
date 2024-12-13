import React from 'react'
import { useNavigate } from 'react-router-dom'

const Error = () => {

    const navigate = useNavigate();

  return (
    <div className='flex flex-col justify-center'>
    <div className='text-4xl text-black text-center mt-[3rem]'>
      Error!! Page not found
    </div>

      <button className='bg-[#6469ff] p-3 text-white mx-auto mt-[1rem] rounded-md'
      onClick={() => navigate("/login")}
      >
        Back to login page
      </button>

    </div>
  )
}

export default Error
