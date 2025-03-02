import { FaBook, FaEnvelope, FaPhone, FaMapMarkerAlt } from 'react-icons/fa';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-dark text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center mb-4">
              <FaBook className="h-6 w-6 text-secondary" />
              <span className="ml-2 text-xl font-bold">Nairobi Book Traders</span>
            </div>
            <p className="text-gray-300 mb-4">
              A peer-to-peer platform for exchanging books within Nairobi and its environments.
            </p>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-300 hover:text-white">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/books" className="text-gray-300 hover:text-white">
                  Browse Books
                </Link>
              </li>
              <li>
                <Link to="/requests" className="text-gray-300 hover:text-white">
                  Book Requests
                </Link>
              </li>
              <li>
                <Link to="/add-book" className="text-gray-300 hover:text-white">
                  Add Book
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
            <ul className="space-y-2">
              <li className="flex items-center">
                <FaMapMarkerAlt className="h-5 w-5 mr-2 text-secondary" />
                <span>Nairobi, Kenya</span>
              </li>
              <li className="flex items-center">
                <FaPhone className="h-5 w-5 mr-2 text-secondary" />
                <span>+254 700 000000</span>
              </li>
              <li className="flex items-center">
                <FaEnvelope className="h-5 w-5 mr-2 text-secondary" />
                <span>info@nairobibooktraders.com</span>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-700 mt-8 pt-6 text-center text-gray-300">
          <p>&copy; {new Date().getFullYear()} Nairobi Book Traders. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}