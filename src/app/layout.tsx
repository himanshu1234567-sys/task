"use client"
import '../app/globals.css'
import React, { useState } from 'react';
import { IoMdLogOut } from 'react-icons/io';

interface LayoutProps {
  children: React.ReactNode;
}     

const Layout = ({ children }: LayoutProps) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false); // Set initial authentication state
  const [username, setUsername] = useState(''); // Set initial username state

  const handleLogout = () => {
    setIsAuthenticated(false);
    setUsername('');
  };

  return (
    <html lang="en">
      <body className="min-h-screen relative">
        <div
          style={{
            backgroundImage: "url('/bg.jpg')",
            backgroundSize: "cover",
            backgroundAttachment: "fixed",
            backgroundPosition: "center",
            filter: "blur(2px)",
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            zIndex: 1,
          }}
        ></div>
        <header className="bg-white shadow-md py-4 p-14 relative z-10 ">
          <div className="container mx-auto flex justify-between items-center">
            <img src="/logo.png" alt="Logo" className="h-10 w-30" />
            <div>
              <a href="#" className="mr-4">Organizations</a>
            </div>
          </div>
        </header>
        <header className="bg-black bg-opacity-35 shadow-md py-4 relative z-10 p-8">
          <div className="container mx-auto flex justify-between items-center">
            <div className="text-2xl text-white font-bold">Task Board</div>
            <div className="flex items-center">
              {isAuthenticated && (
                <>
                  <span className="text-white mr-4">{username}</span>
                  <button onClick={handleLogout} className="text-white">
                    <IoMdLogOut size={24} />
                  </button>
                </>
              )}
            </div>
          </div>
        </header>
        <div className="relative z-10 max-h-screen overflow-y-auto mr-1" style={{ overflowY: 'auto', scrollbarWidth: 'none' }}>
          {React.cloneElement(children as React.ReactElement, { setIsAuthenticated, setUsername })}
        </div>
      </body>
    </html>
  );
};

export default Layout;
