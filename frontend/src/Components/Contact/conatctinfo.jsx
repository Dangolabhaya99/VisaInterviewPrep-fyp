import React from 'react';

const ContactInfo = () => {
    return (
        <div className="bg-gray-900 text-white p-8 rounded-lg w-full mx-auto text-center">
            <img src="logo.png" alt="Books Land Logo" className="mx-auto mb-4" /> {/* Add your logo path */}
            <h2 className="text-2xl font-bold">BOOKS LAND</h2>
            <p className="text-sm mt-1 mb-4">NEPAL</p>
            <div className="text-left">
                <div className="flex items-center mb-2">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 2a10 10 0 100 20 10 10 0 000-20zM8 12h8m-4-4v8"></path></svg>
                    <p>Chakhupat, Lalitpur, Nepal</p>
                </div>
                <div className="flex items-center mb-2">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10v2a9 9 0 0018 0v-2M7 10a9 9 0 0110 0"></path></svg>
                    <p>Phone: +977 9802029090</p>
                </div>
                <div className="flex items-center">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 12a4 4 0 01-8 0 4 4 0 018 0zm-4-4a2 2 0 01-2-2V7a2 2 0 012 2V8a2 2 0 012 2v1a2 2 0 01-2 2zm-2 4v1h2v1m-1-4h.01"></path></svg>
                    <p>Email: support@bookslandnepal.com</p>
                </div>
            </div>
        </div>
    );
};

export default ContactInfo;
