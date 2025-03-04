import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux'; // Import useSelector to access auth state
import Image from './Visa Prep.jpg';

const HomeComponent = () => {
    const navigate = useNavigate();
    const isAuthenticated = useSelector((state) => state.auth.isAuthenticated); // Get auth state from Redux

    const handleMockClick = () => {
        if (!isAuthenticated) {
            navigate('/login'); // Redirect to login if not authenticated
        } else {
            navigate('/qa'); // Redirect to mock page if authenticated
        }
    };

    return (
        <div className="min-h-screen flex flex-col justify-between bg-gray-100" 
             style={{ backgroundImage: 'url(https://via.placeholder.com/1500)', backgroundSize: 'cover', backgroundPosition: 'center' }}>
            <div className="flex flex-col lg:flex-row items-center justify-center flex-grow bg-white bg-opacity-80 p-8">
                <div className="text-center lg:text-left lg:w-1/2">
                    <h1 className="text-green-500 text-4xl md:text-5xl lg:text-6xl font-bold">
                        Hello, Welcome To Visa Interview Prep
                    </h1>
                    <p className="mt-4 text-lg md:text-xl text-gray-600">
                        Here, we pride ourselves on being the go-to destination for students and educators alike, 
                        offering a wide selection of Mock Questions for every country.
                    </p>
                    <div className="mt-8">
                        <button onClick={handleMockClick} className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600">
                            For Mock
                        </button>
                    </div>
                </div>
                <div className="mt-8 lg:mt-0 lg:w-1/2 flex justify-center">
                    <img src={Image} alt="mocks" className="w-full h-auto max-w-md mx-auto" />
                </div>
            </div>
            <footer className="bg-gray-200 text-black py-4">
                <div className="container mx-auto text-center text-lg">
                    <p>&copy; 2024 Visa Interview Prep. All rights reserved.</p>
                </div>
            </footer>
        </div>
    );
};

export default HomeComponent;
