import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import { Database } from '../types/supabase';
import RequestCard from '../components/RequestCard';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';
import { FaPlus, FaSearch } from 'react-icons/fa';

type BookRequest = Database['public']['Tables']['book_requests']['Row'] & {
  profiles: {
    username: string;
    location: string;
  };
};

export default function BookRequests() {
  const { user } = useAuth();
  const [requests, setRequests] = useState<BookRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [description, setDescription] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('book_requests')
        .select(`
          *,
          profiles (
            username,
            location
          )
        `)
        .eq('is_fulfilled', false)
        .order('created_at', { ascending: false });
      
      if (error) {
        throw error;
      }
      
      setRequests(data as BookRequest[]);
    } catch (error) {
      console.error('Error fetching requests:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast.error('You must be logged in to make a request');
      return;
    }
    
    try {
      setSubmitting(true);
      
      const { error } = await supabase.from('book_requests').insert({
        title,
        author,
        description,
        user_id: user.id,
        is_fulfilled: false,
      });
      
      if (error) {
        throw error;
      }
      
      toast.success('Book request added successfully!');
      setTitle('');
      setAuthor('');
      setDescription('');
      setShowForm(false);
      fetchRequests();
    } catch (error) {
      console.error('Error adding request:', error);
      toast.error('Failed to add request');
    } finally {
      setSubmitting(false);
    }
  };

  const handleFulfill = async (requestId: string) => {
    if (!user) {
      toast.error('You must be logged in to fulfill a request');
      return;
    }
    
    // In a real app, you might want to create a chat or connection between users
    toast.success('Great! Please contact the requester to arrange the exchange.');
  };

  const filteredRequests = requests.filter(request => {
    if (!searchTerm) return true;
    
    const term = searchTerm.toLowerCase();
    return (
      request.title.toLowerCase().includes(term) ||
      (request.author && request.author.toLowerCase().includes(term)) ||
      request.description.toLowerCase().includes(term)
    );
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Book Requests</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="btn btn-primary flex items-center"
        >
          <FaPlus className="mr-2" />
          New Request
        </button>
      </div>
      
      {showForm && (
        <div className="bg-white shadow-md rounded-lg p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Request a Book</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                Book Title *
              </label>
              <input
                type="text"
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="input mt-1"
                required
              />
            </div>
            
            <div>
              <label htmlFor="author" className="block text-sm font-medium text-gray-700">
                Author (if known)
              </label>
              <input
                type="text"
                id="author"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                className="input mt-1"
              />
            </div>
            
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                Description *
              </label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                className="input mt-1"
                placeholder="Describe the book you're looking for and why you want it"
                required
              ></textarea>
            </div>
            
            <div className="flex justify-end space-x-2">
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="btn btn-outline"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="btn btn-primary"
              >
                {submitting ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
                ) : (
                  'Submit Request'
                )}
              </button>
            </div>
          </form>
        </div>
      )}
      
      <div className="mb-8">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FaSearch className="text-gray-400" />
          </div>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search requests by title, author, or description"
            className="input pl-10"
          />
        </div>
      </div>
      
      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      ) : filteredRequests.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRequests.map((request) => (
            <RequestCard
              key={request.id}
              request={request}
              onFulfill={handleFulfill}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <p className="text-gray-600 mb-4">
            {searchTerm
              ? 'No requests found matching your search.'
              : 'No book requests yet.'}
          </p>
          {!searchTerm && (
            <button
              onClick={() => setShowForm(true)}
              className="btn btn-primary"
            >
              Make the First Request
            </button>
          )}
        </div>
      )}
    </div>
  );
}