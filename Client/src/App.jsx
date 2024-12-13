import React from 'react';
import { BrowserRouter, Link, Route, Routes, useLocation } from 'react-router-dom';
import logo from './assets/logo.svg';
import Home from './Pages/Home';
import CreatePost from './Pages/CreatePost';
import PrivateRoute from '../auth/ProtectedRoutes';
import { Login } from './Pages/Login';
import { Signup } from './Pages/Signup';
import { Landing } from './Pages/Landing';
import MyCreation from './Pages/MyCreation';
import Otp from './Pages/Otp';
import Error from './Pages/Error';

const Header = () => {
  const location = useLocation();
  const currentPath = location.pathname;
  const token = localStorage.getItem('token');

  return (
    <header className="w-full flex justify-between items-center bg-white sm:px-8 px-4 py-4 border-b border-b-[#e6ebf4]">
      <Link to={token ? "/dashboard" : "/"}>
        <img src={logo} alt="logo" className="w-28 object-contain" />
      </Link>

      <div className="flex gap-x-4">
        {/* Conditional Rendering Based on URL */}
        {currentPath === '/' && (
          <>
            {token ? (
              // If token exists, show Create button
              <Link
                to="/create-post"
                className="font-inter font-medium bg-[#22c55e] text-white px-4 py-2 rounded-md"
              >
                Create
              </Link>
            ) : (
              // If token doesn't exist, show Login and Signup buttons
              <>
                <Link
                  to="/login"
                  className="font-inter font-medium bg-[#6469ff] text-white px-4 py-2 rounded-md"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="font-inter font-medium bg-[#22c55e] text-white px-4 py-2 rounded-md"
                >
                  Signup
                </Link>
              </>
            )}
          </>
        )}

        {currentPath === '/dashboard' && (
          <>
            <Link
              to="/create-post"
              className="font-inter font-medium bg-[#6469ff] text-white px-4 py-2 rounded-md"
            >
              Create
            </Link>
            <Link
              to="/"
              onClick={() => localStorage.clear()}
              className="font-inter font-medium bg-[#22c55e] text-white px-4 py-2 rounded-md"
            >
              Log out
            </Link>
          </>
        )}
        {currentPath === '/create-post' && (
          <>
            <Link
              to="/dashboard"
              className="font-inter font-medium bg-[#6469ff] text-white px-4 py-2 rounded-md"
            >
              Back to Dashboard
            </Link>
            <Link
              to="/"
              onClick={() => localStorage.clear()}
              className="font-inter font-medium bg-[#22c55e] text-white px-4 py-2 rounded-md"
            >
              Logout
            </Link>
          </>
        )}
        {currentPath === '/your-images' && (
          <>
            <Link
              to="/create-post"
              className="font-inter font-medium bg-[#6469ff] text-white px-4 py-2 rounded-md"
            >
              Create
            </Link>
            <Link
              to="/"
              onClick={() => localStorage.clear()}
              className="font-inter font-medium bg-[#22c55e] text-white px-4 py-2 rounded-md"
            >
              Logout
            </Link>
          </>
        )}
     
      </div>
    </header>
  );
};

const App = () => {
  return (
    <BrowserRouter>
      <Header />
      <main className="w-full bg-transparent min-h-screen">
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/verify-mail" element={<Otp />} />
          <Route path="/" element={<Landing/>} />
          <Route path='*' element={<Error/>} />

          {/* Private Routes */}
          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <Home />
              </PrivateRoute>
            }
          />

          <Route
            path="/create-post"
            element={
              <PrivateRoute>
                <CreatePost />
              </PrivateRoute>
            }
          />


          <Route
          path='/your-images'
          element={
            <PrivateRoute>
              <MyCreation/>
            </PrivateRoute>
          }
          />
        </Routes>
      </main>
    </BrowserRouter>
  );
};

export default App;
