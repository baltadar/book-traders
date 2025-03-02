import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabaseClient';
import { Database } from '../types/supabase';
import toast from 'react-hot-toast';
import BookCard from '../components/BookCard';
import RequestCard from '../components/RequestCard';
import { FaUser, FaMapMarkerAlt, FaPhone, FaBook, FaSearch } from 'react-icons/fa';

type Profile = Database['public']['Tables']['profiles']['Row'];
type Book = Database['public']['Tables']['books']['Row'] & {
  profiles?: {
    username: string;
    location: string;
  };
};
type BookRequest = Database['public']['Tables']['book_requests']['Row'] & {
  profiles?: {
    username: string;
    location: string;
  };
};

export default function Profile() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [username, setUsername] = useState('');
  const [location, setLocation] = useState('');
  const [contact, setContact] = useState('');
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');
  const [userBooks, setUserBooks] = useState<Book[]>([]);
  const [userRequests, setUserRequests] = useState<BookRequest[]>([]);
  const [loadingBooks, setLoadingBooks] = useState(false);
  const [loadingRequests, setLoadingRequests] = useState(false);

  useEffect(() => {
    if (user) {
      fetchProfile();
    }
  }, [user]);

  useEffect(() => {
    if (activeTab === 'books' && user) {
      fetchUserBooks();
    } else if (activeTab === 'requests' && user) {
      fetchUserRequests();
    }
  }, [activeTab, user]);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      
      if (!user) return;
      
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();
      
      if (error) {
        throw error;
      }
      
      if (data) {
        setProfile(data);
        setUsername(data.username || '');
        setLocation(data.location || '');
        setContact(data.contact || '');
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
      toast.error('Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const fetchUserBooks = async () => {
    if (!user) return;
    
    try {
      setLoadingBooks(true);
      
      const { data, error } = await supabase
        .from('books')
        .select(`
          *,
          profiles (
            username,
            location
          )
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      setUserBooks(data as Book[]);
    } catch (error) {
      console.error('Error fetching user books:', error);
      toast.error('Failed to load books');
    } finally {
      setLoadingBooks(false);
    }
  };

  const fetchUserRequests = async () => {
    if (!user) return;

    try {
      setLoadingRequests(true);

      const { data, error } = await supabase
        .from('book_requests')
        .select(`
          *,
          profiles (
            username,
            location
          )
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      setUserRequests(data as BookRequest[]);
    } catch (error) {
      console.error('Error fetching user requests:', error);
      toast.error('Failed to load requests');
    } finally {
      setLoadingRequests(false);
    }
  };

  return (
    <div>
      <h1>Profile</h1>
      {loading ? (
        <p>Loading profile...</p>
      ) : (
        <div>
          <div>
            <FaUser /> {username}
            <FaMapMarkerAlt /> {location}
            <FaPhone /> {contact}
          </div>
          <div>
            <button onClick={() => setActiveTab('profile')}>Profile</button>
            <button onClick={() => setActiveTab('books')}>Books</button>
            <button onClick={() => setActiveTab('requests')}>Requests</button>
          </div>
          
          {activeTab === 'books' && (
            <div>
              {loadingBooks ? (
                <p>Loading books...</p>
              ) : (
                userBooks.map((book) => <BookCard key={book.id} book={book} />)
              )}
            </div>
          )}
          
          {activeTab === 'requests' && (
            <div>
              {loadingRequests ? (
                <p>Loading requests...</p>
              ) : (
                userRequests.map((request) => <RequestCard key={request.id} request={request} />)
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
