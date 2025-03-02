import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import BookCard from '../components/BookCard';
import RequestCard from '../components/RequestCard';
import { FaBook, FaSearch, FaExchangeAlt } from 'react-icons/fa';
import { Database } from '../types/supabase';

type Book = Database['public']['Tables']['books']['Row'] & {
  profiles: {
    username: string;
    location: string;
  };
};

type BookRequest = Database['public']['Tables']['book_requests']['Row'] & {
  profiles: {
    username: string;
    location: string;
  };
};

export default function Home() {
  const [recentBooks, setRecentBooks] = useState<Book[]>([]);
  const [recentRequests, setRecentRequests] = useState<BookRequest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      
      // Fetch recent books
      const { data: booksData, error: booksError } = await supabase
        .from('books')
        .select(`
          *,
          profiles (
            username,
            location
          )
        `)
        .eq('is_available', true)
        .order('created_at', { ascending: false })
        .limit(4);
      
      if (booksError) {
        console.error('Error fetching books:', booksError);
      } else {
        setRecentBooks(booksData as Book[]);
      }
      
      // Fetch recent requests
      const { data: requestsData, error: requestsError } = await supabase
        .from('book_requests')
        .select(`
          *,
          profiles (
            username,
            location
          )
        `)
        .eq('is_fulfilled', false)
        .order('created_at', { ascending: false })
        .limit(4);
      
      if (requestsError) {
        console.error('Error fetching requests:', requestsError);
      } else {
        setRecentRequests(requestsData as BookRequest[]);
      }
      
      setLoading(false);
    }
    
    fetchData();
  }, []);

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary to-blue-700 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4">
              Share Books, Share Knowledge
            </h1>
            <p className="text-xl mb-8 max-w-3xl mx-auto">
              Nairobi Book Traders is a community platform for book lovers to exchange books
              within Nairobi and its environments.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link to="/books" className="btn bg-white text-primary hover:bg-gray-100">
                Browse Books
              </Link>
              <Link to="/add-book" className="btn bg-secondary text-white hover:bg-secondary/90">
                Share Your Books
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaBook className="text-primary text-2xl" />
              </div>
              <h3 className="text-xl font-semibold mb-2">List Your Books</h3>
              <p className="text-gray-600">
                Add books you're willing to share with others in the community.
              </p>
            </div>
            
            <div className="text-center p-6">
              <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaSearch className="text-primary text-2xl" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Find Books</h3>
              <p className="text-gray-600">
                Browse available books or request specific titles you're looking for.
              </p>
            </div>
            
            <div className="text-center p-6">
              <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaExchangeAlt className="text-primary text-2xl" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Exchange</h3>
              <p className="text-gray-600">
                Connect with other readers and arrange to exchange books.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Recent Books */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold">Recently Added Books</h2>
            <Link to="/books" className="text-primary hover:underline">
              View All Books
            </Link>
          </div>
          
          {loading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
          ) : recentBooks.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {recentBooks.map((book) => (
                <BookCard key={book.id} book={book} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-gray-50 rounded-lg">
              <p className="text-gray-600">No books available yet.</p>
              <Link to="/add-book" className="btn btn-primary mt-4">
                Add the First Book
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Recent Requests */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold">Recent Book Requests</h2>
            <Link to="/requests" className="text-primary hover:underline">
              View All Requests
            </Link>
          </div>
          
          {loading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
          ) : recentRequests.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {recentRequests.map((request) => (
                <RequestCard key={request.id} request={request} showActions={false} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-white rounded-lg">
              <p className="text-gray-600">No book requests yet.</p>
              <Link to="/requests/new" className="btn btn-primary mt-4">
                Make a Request
              </Link>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}