import { Link } from 'react-router-dom';
import { Database } from '../types/supabase';
import { FaUser, FaMapMarkerAlt, FaCalendarAlt } from 'react-icons/fa';

type Book = Database['public']['Tables']['books']['Row'] & {
  profiles?: {
    username: string;
    location: string;
  };
};

type BookCardProps = {
  book: Book;
};

export default function BookCard({ book }: BookCardProps) {
  const formattedDate = new Date(book.created_at).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

  return (
    <div className="card h-full flex flex-col">
      <div className="relative pb-[56.25%]">
        <img
          src={book.image_url || 'https://via.placeholder.com/300x200?text=No+Image'}
          alt={book.title}
          className="absolute h-full w-full object-cover"
        />
        {!book.is_available && (
          <div className="absolute top-0 right-0 bg-red-500 text-white px-2 py-1 text-sm font-semibold">
            Not Available
          </div>
        )}
      </div>
      
      <div className="p-4 flex-grow flex flex-col">
        <h3 className="text-lg font-semibold mb-1">{book.title}</h3>
        <p className="text-gray-600 mb-2">by {book.author}</p>
        
        <p className="text-gray-700 mb-4 line-clamp-3 flex-grow">
          {book.description}
        </p>
        
        <div className="text-sm text-gray-600 space-y-1 mb-4">
          <div className="flex items-center">
            <FaUser className="mr-2 text-gray-400" />
            <span>{book.profiles?.username || 'Unknown User'}</span>
          </div>
          {book.profiles?.location && (
            <div className="flex items-center">
              <FaMapMarkerAlt className="mr-2 text-gray-400" />
              <span>{book.profiles.location}</span>
            </div>
          )}
          <div className="flex items-center">
            <FaCalendarAlt className="mr-2 text-gray-400" />
            <span>{formattedDate}</span>
          </div>
        </div>
        
        <div className="mt-auto">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium px-2 py-1 bg-gray-100 rounded">
              {book.condition}
            </span>
            <Link
              to={`/books/${book.id}`}
              className="btn btn-primary text-sm"
            >
              View Details
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}