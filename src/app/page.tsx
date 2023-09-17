"use client"
import Link from 'next/link';
import React from 'react';

const HomePage = () => {
  return (
    <>
      <div className="bg-black min-h-screen text-white">
        {/* Hero Section */}
        <div className="bg-hero-image bg-cover bg-center h-screen flex flex-col justify-center items-center relative">
          <h1 className="text-4xl font-bold mb-4 text-white">Welcome Back!</h1>
          <p className="text-lg mb-8 text-white">Explore the power of P2P.</p>
          <Link href="/sr"  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
            
              Go to P2P File Transfer
            
          </Link>
        </div>
        </div>
      </>

    
      );
};

export default HomePage;
