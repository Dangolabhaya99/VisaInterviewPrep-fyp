import React from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../features/auth/authSlice";
import { toggle } from "../../features/navbar/navbarSlice";
import profile from "./Profile.png";
import logo from "./BookLogo.jpg";

const Navbar = () => {
  const dispatch = useDispatch();
  const isOpen = useSelector((state) => state.navbar.isOpen);
  const authState = useSelector((state) => state.auth);

  return (
    <nav className="bg-white shadow-lg">
      <div className="flex justify-between items-center h-12">
        <div className="flex mx-2 space-x-2 items-center">
          <Link to="/" className="flex items-center">
            <img src={logo} alt="Logo" className="h-5" />
          </Link>
          <Link to="/" className="flex items-center">
            <span className="font-bold text-gray-600 text-xl">
              Visa Interview Prep
            </span>
          </Link>
        </div>
        <div className="flex mx-2 items-center space-x-4">
          <div className="hidden md:flex items-center space-x-1">
            <Link
              to="/"
              className="py-2 px-2 text-gray-500 font-semibold hover:text-blue-500 transition duration-300"
            >
              Home
            </Link>
            <Link
              to="/about"
              className="py-2 px-2 text-gray-500 font-semibold hover:text-blue-500 transition duration-300"
            >
              About Us
            </Link>
            <Link
              to="/contact"
              className="py-2 px-2 text-gray-500 font-semibold hover:text-blue-500 transition duration-300"
            >
              Contact
            </Link>
            {/* Show "Mock" and "Body Language" only if user is authenticated */}
            {authState.isAuthenticated && (
              <>
                <Link
                  to="/qa"
                  className="py-2 px-2 text-gray-500 font-semibold hover:text-blue-500 transition duration-300"
                >
                  Mock
                </Link>
                <Link
                  to="/body-language"
                  className="py-2 px-2 text-gray-500 font-semibold hover:text-blue-500 transition duration-300"
                >
                  Body Language
                </Link>
              </>
            )}
          </div>
          <div className="hidden md:flex items-center space-x-3">
            {authState.isAuthenticated ? (
              <>
                <Link to="/profile" className="mr-2">
                  <img src={profile} alt="Profile" className="h-6" />
                </Link>
                <button
                  onClick={() => dispatch(logout())}
                  className="py-1 px-2 font-medium text-gray-500 rounded hover:bg-gray-200 transition duration-300"
                >
                  Log Out
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="py-1 px-2 font-medium text-gray-500 rounded hover:bg-gray-200 transition duration-300"
                >
                  Log In
                </Link>
                <Link
                  to="/signup"
                  className="py-1 px-2 font-medium text-white bg-blue-500 rounded hover:bg-blue-400 transition duration-300"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
          <div className="md:hidden flex items-center">
            <button
              className="outline-none mobile-menu-button"
              onClick={() => dispatch(toggle())}
            >
              <svg
                className="w-6 h-6 text-gray-500 hover:text-blue-500"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path d="M4 6h16M4 12h16m-7 6h7" />
              </svg>
            </button>
          </div>
        </div>
      </div>
      {isOpen && (
        <div className="md:hidden">
          <ul>
            <li>
              <Link
                to="/"
                className="block text-sm px-2 py-4 text-white bg-blue-500 font-semibold"
              >
                Home
              </Link>
            </li>
            <li>
              <Link
                to="/about"
                className="block text-sm px-2 py-4 hover:bg-blue-500 transition duration-300"
              >
                About Us
              </Link>
            </li>
            <li>
              <Link
                to="/contact"
                className="block text-sm px-2 py-4 hover:bg-blue-500 transition duration-300"
              >
                Contact
              </Link>
            </li>
            {/* Show "Mock" and "Body Language" only if user is authenticated */}
            {authState.isAuthenticated && (
              <>
                <li>
                  <Link
                    to="/qa"
                    className="block text-sm px-2 py-4 hover:bg-blue-500 transition duration-300"
                  >
                    Mock
                  </Link>
                </li>
                <li>
                  <Link
                    to="/body-language"
                    className="block text-sm px-2 py-4 hover:bg-blue-500 transition duration-300"
                  >
                    Body Language
                  </Link>
                </li>
              </>
            )}
            {authState.isAuthenticated ? (
              <li>
                <button
                  onClick={() => dispatch(logout())}
                  className="block text-sm px-2 py-4 hover:bg-blue-500 transition duration-300"
                >
                  Log Out
                </button>
              </li>
            ) : (
              <>
                <li>
                  <Link
                    to="/login"
                    className="block text-sm px-2 py-4 hover:bg-blue-500 transition duration-300"
                  >
                    Log In
                  </Link>
                </li>
                <li>
                  <Link
                    to="/signup"
                    className="block text-sm px-2 py-4 hover:bg-blue-500 transition duration-300"
                  >
                    Sign Up
                  </Link>
                </li>
              </>
            )}
          </ul>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
