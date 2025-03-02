import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabaseClient';
import toast from 'react-hot-toast';
import { FaUpload, FaBook } from 'react-icons/fa';

export default function AddBook() {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [description, setDescription] = useState('');
  const [condition, setCondition] = useState('Good');
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImage(file);
      
      // Create a preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const uploadImage = async () => {
    if (!image || !user) return null;
    
    const fileExt = image.name.split('.').pop();
    const fileName = `${user.id}-${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
    const filePath = `book-images/${fileName}`;
    
    const { error: uploadError } = await supabase.storage
      .from('books')
      .upload(filePath, image);
    
    if (uploadError) {
      throw uploadError;
    }
    
    const { data } = supabase.storage.from('books').getPublicUrl(filePath);
    return data.publicUrl;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast.error('You must be logged in to add a book');
      return;
    }
    
    try {
      setLoading(true);
      
      // Upload image if provided
      let imageUrl = null;
      if (image) {
        imageUrl = await uploadImage();
      }
      
      // Add book to database
      const { error } = await supabase.from('books').insert({
        title,
        author,
        description,
        condition,
        image_url: imageUrl,
        user_id: user.id,
        is_available: true,
      });
      
      if (error) {
        throw error;
      }
      
      toast.success('Book added successfully!');
      navigate('/books');
    } catch (error) {
      console.error('Error adding book:', error);
      toast.error('Failed to add book');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white shadow-md rounded-lg p-6">
        <div className="flex items-center mb-6">
          <FaBook className="text-primary text-2xl mr-2" />
          <h1 className="text-2xl font-bold">Add a Book</h1>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
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
              Author *
            </label>
            <input
              type="text"
              id="author"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              className="input mt-1"
              required
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
              rows={4}
              className="input mt-1"
              required
            ></textarea>
            <p className="mt-1 text-sm text-gray-500">
              Provide a brief description of the book, including any notable details.
            </p>
          </div>
          
          <div>
            <label htmlFor="condition" className="block text-sm font-medium text-gray-700">
              Condition *
            </label>
            <select
              id="condition"
              value={condition}
              onChange={(e) => setCondition(e.target.value)}
              className="input mt-1"
              required
            >
              <option value="Like New">Like New</option>
              <option value="Very Good">Very Good</option>
              <option value="Good">Good</option>
              <option value="Fair">Fair</option>
              <option value="Poor">Poor</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Book Image
            </label>
            <div className="mt-1 flex items-center">
              <label className="cursor-pointer btn btn-outline flex items-center">
                <FaUpload className="mr-2" />
                <span>Upload Image</span>
                <input
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={handleImageChange}
                />
              </label>
            </div>
            <p className="mt-1 text-sm text-gray-500">
              Upload a clear image of the book cover.
            </p>
            
            {imagePreview && (
              <div className="mt-4">
                <img
                  src={imagePreview}
                  alt="Book preview"
                  className="h-48 object-contain rounded-md"
                />
              </div>
            )}
          </div>
          
          <div className="pt-4">
            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary w-full"
            >
              {loading ? (
                <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
              ) : (
                'Add Book'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}