import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { Database } from '../types/supabase';
import BookCard from '../components/BookCard';
import { FaSearch, FaFilter } from 'react-icons/fa';

type Book = Database['public']['Tables']['books']['Row'] & {
  profiles: {
    username: string;
    location: string;
  };
};

export default function BookListing() {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [locationFilter, setLocationFilter] = useState('');
  const [conditionFilter, setConditionFilter] = useState('');
  const [filteredBooks, setFilteredBooks] = useState<Book[]>([]);

  useEffect(() => {
    fetchBooks();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [books, searchTerm, locationFilter, conditionFilter]);

  const fetchBooks = async () => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('books')
        .select(`
          *,
          profiles (
            username,
            location
          )
        `)
        .eq('is_available', true)
        .order('created_at', { ascending: false });
      
      if (error) {
        throw error;
      }
      
      setBooks(data as Book[]);
    } catch (error) {
      console.error('Error fetching books:', error);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...books];
    
    // Apply search term filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        book =>
          book.title.toLowerCase().includes(term) ||
          book.author.toLowerCase().includes(term) ||
          book.description.toLowerCase().includes(term)
      );
    }
    
    // Apply location filter
    if (locationFilter) {
      filtered = filtered.filter(
        book => book.profiles?.location?.toLowerCase().includes(locationFilter.toLowerCase())
      );
    }
    
    // Apply condition filter
    if (conditionFilter) {
      filtered = filtered.filter(book => book.condition === conditionFilter);
    }
    
    setFilteredBooks(filtered);
  };

  const resetFilters = () => {
    setSearchTerm('');
    setLocationFilter('');
    setConditionFilter('');
  };

  const getUniqueLocations = () => {
    const locations = books
      .map(book => book.profiles?.location)
      .filter(location => location) as string[];
    return [...new Set(locations)];
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold mb-8">Available Books</h1>
      
      <div className="mb-8">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-grow">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaSearch className="text-gray-400" />
            </div>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by title, author, or description"
              className="input pl-10"
            />
          </div>
          
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="btn btn-outline flex items-center"
          >
            <FaFilter className="mr-2" />
            {showFilters ? 'Hide Filters' : 'Show Filters'}
          </button>
        </div>
        
        {showFilters && (
          <div className="mt-4 p-4 bg-gray-50 rounded-lg">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="locationFilter" className="block text-sm font-medium text-gray-700 mb-1">
                  Filter by Location
                </label>
                <select
                  id="locationFilter"
                  value={locationFilter}
                  onChange={(e) => setLocationFilter(e.target.value)}
                  className="input"
                >
                  <option value="">All Locations</option>
                  {getUniqueLocations().map((location, index) => (
                    <option key={index} value={location}>
                      {location}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label htmlFor="conditionFilter" className="block text-sm font-medium text-gray-700 mb-1">
                  Filter by Condition
                </label>
                <select
                  id="conditionFilter"
                  value={conditionFilter}
                  onChange={(e) => setConditionFilter(e.target.value)}
                  className="input"
                >
                  <option value="">All Conditions</option>
                  <option value="Like New">Like New</option>
                  <option value="Very Good">Very Good</option>
                  <option value="Good">Good</option>
                  <option value="Fair">Fair</option>
                  <option value="Poor">Poor</option>
                </select>
              </div>
            </div>
            
            <div className="mt-4 flex justify-end">
              <button
                onClick={resetFilters}
                className="btn btn-outline"
              >
                Reset Filters
              </button>
            </div>
          </div>
        )}
      </div>
      
      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      ) : filteredBooks.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredBooks.map((book) => (
            <BookCard key={book.id} book={book} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <p className="text-gray-600 mb-4">No books found matching your criteria.</p>
          <button
            onClick={resetFilters}
            className="btn btn-primary"
          >
            Reset Filters
          </button>
        </div>
      )}
    </div>
  );
}