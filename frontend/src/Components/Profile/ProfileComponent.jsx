import React, { useState, useEffect } from 'react';
import axiosInstance from '../../Config/axiosConfig';
import editIcon from './edit.png';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ProfilePage = () => {
    const [isEditing, setIsEditing] = useState(false);
    const [profile, setProfile] = useState({
        name: '',
        email: '',
        phone: '',
        location: '',
        bio: '',
        profileImage: '',
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [file, setFile] = useState(null);

    const fetchProfile = async () => {
        try {
            const response = await axiosInstance.get('/api/profile/');
            const profileData = response.data.profile;
            setProfile({
                name: profileData.user.name,
                email: profileData.user.email,
                phone: profileData.user.phone || '',
                location: profileData.user.address || '',
                bio: profileData.bio || '',
                profileImage: profileData.profileImage || '',
            });
            setLoading(false);
        } catch (err) {
            setError(err.response?.data?.msg || 'Failed to load profile');
            setLoading(false);
            toast.error(err.response?.data?.msg || 'Failed to load profile');
        }
    };

    useEffect(() => {
        fetchProfile();
    }, []);

    const handleEditClick = () => {
        setIsEditing(true);
    };

    const handleSaveChanges = async () => {
        const formData = new FormData();
        formData.append('bio', profile.bio);
        formData.append('name', profile.name);
        formData.append('email', profile.email);
        formData.append('phone', profile.phone);
        formData.append('location', profile.location);

        if (file) {
            formData.append('profileImage', file);
        }

        try {
            const response = await axiosInstance.patch('/api/profile/update', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            const updatedProfile = response.data.profile;
            setProfile({
                name: updatedProfile.user.name,
                email: updatedProfile.user.email,
                phone: updatedProfile.user.phone || '',
                location: updatedProfile.user.address || '',
                bio: updatedProfile.bio || '',
                profileImage: updatedProfile.profileImage || profile.profileImage, // Handle fallback if image is not returned
            });

            setIsEditing(false);
            setFile(null);
            toast.success('Profile updated successfully');
        } catch (err) {
            setError(err.response?.data?.msg || 'Failed to save profile');
            toast.error(err.response?.data?.msg || 'Failed to save profile');
        }
    };

    const handleChange = (e) => {
        setProfile({ ...profile, [e.target.name]: e.target.value });
    };

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        setFile(selectedFile);

        if (selectedFile) {
            const fileReader = new FileReader();
            fileReader.onload = () => {
                setProfile((prevProfile) => ({
                    ...prevProfile,
                    profileImage: fileReader.result, // Preview the image
                }));
            };
            fileReader.readAsDataURL(selectedFile);
        }
    };

    if (loading) {
        return <div className="text-center mt-10 text-gray-600">Loading profile...</div>;
    }

    if (error) {
        return <div className="text-center text-red-500 mt-10">Error: {error}</div>;
    }

    return (
        <div
            className="min-h-screen bg-gradient-to-r from-blue-100 to-purple-200 flex flex-col items-center py-12"
        >
            <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-3xl">
                <div className="flex flex-col items-center">
                    <div className="relative">
                        <img
                            src={profile.profileImage || 'https://via.placeholder.com/150'}
                            alt="Profile"
                            className="w-36 h-36 rounded-full object-cover border-4 border-blue-300"
                        />
                        {isEditing && (
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleFileChange}
                                className="absolute inset-0 opacity-0 cursor-pointer"
                            />
                        )}
                        {!isEditing && (
                            <button
                                onClick={handleEditClick}
                                className="absolute bottom-0 right-0 bg-blue-500 text-white p-2 rounded-full hover:bg-blue-600"
                            >
                                <img src={editIcon} alt="Edit" className="h-6 w-6" />
                            </button>
                        )}
                    </div>

                    {isEditing ? (
                        <input
                            type="text"
                            name="name"
                            value={profile.name}
                            onChange={handleChange}
                            className="mt-4 text-2xl font-semibold text-center border-b border-gray-300 focus:outline-none"
                        />
                    ) : (
                        <h1 className="mt-4 text-3xl font-bold text-gray-800">{profile.name}</h1>
                    )}

                    <div className="mt-4 text-center">
                        {isEditing ? (
                            <textarea
                                name="bio"
                                value={profile.bio}
                                onChange={handleChange}
                                className="w-full bg-gray-100 rounded p-2 text-gray-700 focus:outline-none"
                                rows={3}
                            />
                        ) : (
                            <p className="text-gray-600">{profile.bio}</p>
                        )}
                    </div>
                </div>

                <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-700">
                    <div>
                        <strong>Email:</strong>{' '}
                        {isEditing ? (
                            <input
                                type="email"
                                name="email"
                                value={profile.email}
                                onChange={handleChange}
                                className="border-b focus:outline-none"
                            />
                        ) : (
                            profile.email
                        )}
                    </div>
                    <div>
                        <strong>Phone:</strong>{' '}
                        {isEditing ? (
                            <input
                                type="text"
                                name="phone"
                                value={profile.phone}
                                onChange={handleChange}
                                className="border-b focus:outline-none"
                            />
                        ) : (
                            profile.phone || 'N/A'
                        )}
                    </div>
                    <div className="col-span-1 md:col-span-2">
                        <strong>Location:</strong>{' '}
                        {isEditing ? (
                            <input
                                type="text"
                                name="location"
                                value={profile.location}
                                onChange={handleChange}
                                className="border-b focus:outline-none"
                            />
                        ) : (
                            profile.location || 'N/A'
                        )}
                    </div>
                </div>

                {isEditing && (
                    <div className="mt-6 text-center">
                        <button
                            onClick={handleSaveChanges}
                            className="bg-blue-600 text-white px-6 py-2 rounded-lg mr-2 hover:bg-blue-700"
                        >
                            Save Changes
                        </button>
                        <button
                            onClick={() => setIsEditing(false)}
                            className="bg-gray-400 text-white px-6 py-2 rounded-lg hover:bg-gray-500"
                        >
                            Cancel
                        </button>
                    </div>
                )}
            </div>

            <ToastContainer position="top-right" autoClose={5000} hideProgressBar={false} />
        </div>
    );
};

export default ProfilePage;
