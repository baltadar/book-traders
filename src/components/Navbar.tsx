import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { FaBook, FaUser, FaBars, FaTimes } from 'react-icons/fa';

export default function Navbar() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <FaBook className="h-8 w-8 text-primary" />
              <span className="ml-2 text-xl font-bold text-gray-900">Nairobi Book Traders</span>
            </Link>
          </div>

          {/* Desktop menu */}
          <div className="hidden md:flex items-center space-x-4">
            <Link to="/books" className="text-gray-700 hover:text-primary px-3 py-2 rounded-md">
              Browse Books
            </Link>
            <Link to="/requests" className="text-gray-700 hover:text-primary px-3 py-2 rounded-md">
              Book Requests
            </Link>
            
            {user ? (
              <>
                <Link to="/add-book" className="btn btn-primary">
                  Add Book
                </Link>
                <div className="relative group">
                  <button className="flex items-center text-gray-700 hover:text-primary px-3 py-2 rounded-md">
                    <FaUser className="mr-1" />
                    <span>Account</span>
                  </button>
                  <div className="absolute right-0 w-48 py-2 mt-2 bg-white rounded-md shadow-xl z-20 hidden group-hover:block">
                    <Link to="/profile" className="block px-4 py-2 text-gray-800 hover:bg-gray-100">
                      Profile
                    </Link>
                    <button
                      onClick={handleSignOut}
                      className="block w-full text-left px-4 py-2 text-gray-800 hover:bg-gray-100"
                    >
                      Sign Out
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <>
                <Link to="/login" className="btn btn-outline">
                  Sign In
                </Link>
                <Link to="/register" className="btn btn-primary">
                  Sign Up
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-primary hover:bg-gray-100 focus:outline-none"
            >
              {isMenuOpen ? <FaTimes className="h-6 w-6" /> : <FaBars className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link
              to="/books"
              className="block text-gray-700 hover:text-primary px-3 py-2 rounded-md"
              onClick={() => setIsMenuOpen(false)}
            >
              Browse Books
            </Link>
            <Link
              to="/requests"
              className="block text-gray-700 hover:text-primary px-3 py-2 rounded-md"
              onClick={() => setIsMenuOpen(false)}
            >
              Book Requests
            </Link>
            
            {user ? (
              <>
                <Link
                  to="/add-book"
                  className="block text-gray-700 hover:text-primary px-3 py-2 rounded-md"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Add Book
                </Link>
                <Link
                  to="/profile"
                  className="block text-gray-700 hover:text-primary px-3 py-2 rounded-md"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Profile
                </Link>
                <button
                  onClick={() => {
                    handleSignOut();
                    setIsMenuOpen(false);
                  }}
                  className="block w-full text-left text-gray-700 hover:text-primary px-3 py-2 rounded-md"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="block text-gray-700 hover:text-primary px-3 py-2 rounded-md"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="block text-gray-700 hover:text-primary px-3 py-2 rounded-md"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}