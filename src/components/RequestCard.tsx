import { Link } from 'react-router-dom';
import { Database } from '../types/supabase';
import { FaUser, FaCalendarAlt } from 'react-icons/fa';

type BookRequest = Database['public']['Tables']['book_requests']['Row'] & {
  profiles?: {
    username: string;
    location: string;
  };
};

type RequestCardProps = {
  request: BookRequest;
  onFulfill?: (id: string) => void;
  showActions?: boolean;
};

export default function RequestCard({ request, onFulfill, showActions = true }: RequestCardProps) {
  const formattedDate = new Date(request.created_at).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

  return (
    <div className="card h-full flex flex-col">
      <div className="p-4 flex-grow flex flex-col">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-semibold">{request.title}</h3>
          {request.is_fulfilled && (
            <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded">
              Fulfilled
            </span>
          )}
        </div>
        
        {request.author && (
          <p className="text-gray-600 mb-2">by {request.author}</p>
        )}
        
        <p className="text-gray-700 mb-4 flex-grow">
          {request.description}
        </p>
        
        <div className="text-sm text-gray-600 space-y-1 mb-4">
          <div className="flex items-center">
            <FaUser className="mr-2 text-gray-400" />
            <span>{request.profiles?.username || 'Unknown User'}</span>
          </div>
          <div className="flex items-center">
            <FaCalendarAlt className="mr-2 text-gray-400" />
            <span>{formattedDate}</span>
          </div>
        </div>
        
        {showActions && (
          <div className="mt-auto">
            <div className="flex items-center justify-between">
              <Link
                to={`/requests/${request.id}`}
                className="btn btn-outline text-sm"
              >
                View Details
              </Link>
              
              {!request.is_fulfilled && onFulfill && (
                <button
                  onClick={() => onFulfill(request.id)}
                  className="btn btn-secondary text-sm"
                >
                  I Have This Book
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}