import React, { useState, useEffect } from 'react';
import axios from 'axios';

const PostListScreen = () => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Fetch posts data
        const fetchPosts = async () => {
            try {
                const response = await axios.get('/api/auth/posts');
                setPosts(response.data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching posts:', error);
            }
        };

        fetchPosts();
    }, []);

    return (
        <div className="container mx-auto mt-8">
            <h1 className="text-3xl font-bold mb-4">Post List</h1>
            {loading ? (
                <p>Loading...</p>
            ) : (
                <div>
                    {posts.map((post) => (
                        <div key={post.id} className="mb-4">
                            <h2 className="text-xl font-semibold">{post.title}</h2>
                            <p className="text-gray-600">{post.body}</p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default PostListScreen;
