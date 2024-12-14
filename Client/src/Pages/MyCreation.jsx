import React, { useState, useEffect } from 'react';
import Card from '../Components/Card';

const MyCreation = () => {
    const [loading, setLoading] = useState(false);
    const [allPosts, setAllPosts] = useState([]);

    useEffect(() => {
        const fetchPosts = async () => {
            setLoading(true);

            try {
                const storedSignupData = JSON.parse(localStorage.getItem("signupData"));
                const token = localStorage.getItem('token'); // Fetch token from localStorage
                if (!token) {
                    alert('Please log in first');
                    return;
                }

                const response = await fetch('https://dall-e-mini-dl1e-git-main-shivam-guptas-projects-f99d138a.vercel.app/api/v1/myimages', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`, // Include token
                    },
                });

                if (response.ok) {
                    const result = await response.json();
                    setAllPosts(result.data); // Update state with user's images
                    console.log("ans", result);
                } else {
                    const error = await response.json();
                    alert(error.message || 'Failed to fetch posts');
                }
            } catch (error) {
                console.error('Error fetching posts:', error);
                alert('An error occurred. Please try again.');
            } finally {
                setLoading(false);
            }
        };

        fetchPosts();
    }, []);

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-3xl font-bold text-center mb-6">My Creations</h1>
            {loading ? (
                <p className="text-center text-gray-500">Loading...</p>
            ) : allPosts.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {allPosts.map((post) => (
                        <Card
                            key={post._id}
                            _id={post._id}
                            name={'Created by you'} // Replace with user's name if available
                            prompt={post.prompt}
                            photo={post.photoUrl}
                        />
                    ))}
                </div>
            ) : (
                <p className="text-center text-gray-500">No creations found.</p>
            )}
        </div>
    );
}

export default MyCreation
