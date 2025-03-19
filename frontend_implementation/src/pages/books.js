import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function Books() {
  const [filter, setFilter] = useState({
    gender: 'all',
    ageRange: 'all'
  });

  const [books, setBooks] = useState([]);
  const [filteredBooks, setFilteredBooks] = useState([]);

  // Simulate fetching books from API
  useEffect(() => {
    // This would be replaced with an actual API call
    const fetchedBooks = [
      {
        id: 1,
        title: 'Adventure in the Forest',
        description: 'Join your child on an exciting adventure through an enchanted forest!',
        coverImage: '/books/forest-adventure.jpg',
        minAge: 4,
        maxAge: 8,
        gender: 'neutral'
      },
      {
        id: 2,
        title: 'The ABC Journey',
        description: 'Learn the alphabet with your child in this fun-filled adventure!',
        coverImage: '/books/abc-journey.jpg',
        minAge: 2,
        maxAge: 6,
        gender: 'neutral'
      },
      {
        id: 3,
        title: 'Space Explorer',
        description: 'Blast off into space with your child as they discover planets and stars!',
        coverImage: '/books/space-explorer.jpg',
        minAge: 6,
        maxAge: 10,
        gender: 'boy'
      },
      {
        id: 4,
        title: 'Ocean Discovery',
        description: 'Dive deep into the ocean and discover amazing sea creatures with your child!',
        coverImage: '/books/ocean-discovery.jpg',
        minAge: 4,
        maxAge: 8,
        gender: 'girl'
      },
      {
        id: 5,
        title: 'Dinosaur Adventure',
        description: 'Travel back in time to meet dinosaurs with your child!',
        coverImage: '/books/dinosaur-adventure.jpg',
        minAge: 4,
        maxAge: 8,
        gender: 'boy'
      },
      {
        id: 6,
        title: 'Fairy Princess',
        description: 'Your child becomes a fairy princess in this magical tale!',
        coverImage: '/books/fairy-princess.jpg',
        minAge: 3,
        maxAge: 7,
        gender: 'girl'
      },
      {
        id: 7,
        title: 'Superhero Academy',
        description: 'Your child learns to be a superhero in this exciting adventure!',
        coverImage: '/books/superhero-academy.jpg',
        minAge: 5,
        maxAge: 9,
        gender: 'boy'
      },
      {
        id: 8,
        title: 'Magical Unicorns',
        description: 'Join your child in a magical world of unicorns and rainbows!',
        coverImage: '/books/magical-unicorns.jpg',
        minAge: 3,
        maxAge: 7,
        gender: 'girl'
      }
    ];
    
    setBooks(fetchedBooks);
    setFilteredBooks(fetchedBooks);
  }, []);

  // Apply filters when filter state changes
  useEffect(() => {
    let result = [...books];
    
    if (filter.gender !== 'all') {
      result = result.filter(book => 
        book.gender === filter.gender || book.gender === 'neutral'
      );
    }
    
    if (filter.ageRange !== 'all') {
      const [min, max] = filter.ageRange.split('-').map(Number);
      result = result.filter(book => 
        (book.minAge <= max && book.maxAge >= min)
      );
    }
    
    setFilteredBooks(result);
  }, [filter, books]);

  const handleFilterChange = (type, value) => {
    setFilter(prev => ({
      ...prev,
      [type]: value
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-100 to-white">
      <Head>
        <title>Books - StoryMagic</title>
        <meta name="description" content="Browse our collection of personalized storybooks" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <header className="container mx-auto px-4 py-6 flex justify-between items-center">
        <div className="flex items-center">
          <img src="/logo.svg" alt="StoryMagic Logo" className="h-12 w-auto" />
          <span className="ml-2 text-2xl font-bold text-purple-800">StoryMagic</span>
        </div>
        <nav>
          <ul className="flex space-x-6">
            <li><Link href="/" className="text-purple-800 hover:text-purple-600 font-medium">Home</Link></li>
            <li><Link href="/books" className="text-purple-800 hover:text-purple-600 font-medium">Books</Link></li>
            <li><Link href="/my-books" className="text-purple-800 hover:text-purple-600 font-medium">My Books</Link></li>
            <li><Link href="/support" className="text-purple-800 hover:text-purple-600 font-medium">Support</Link></li>
          </ul>
        </nav>
      </header>

      <main className="container mx-auto px-4 py-8">
        <motion.h1 
          className="text-3xl font-bold text-purple-900 mb-8 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Personalized Books
        </motion.h1>
        <motion.p 
          className="text-xl text-gray-700 mb-12 text-center max-w-3xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          A Story for Everyone, Tailored Just Right
        </motion.p>

        <div className="bg-white rounded-lg shadow-md p-6 mb-12">
          <h2 className="text-xl font-bold text-purple-900 mb-4">Filter Books</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-gray-700 mb-2">Gender</label>
              <div className="flex space-x-4">
                <FilterButton 
                  label="All" 
                  active={filter.gender === 'all'} 
                  onClick={() => handleFilterChange('gender', 'all')} 
                />
                <FilterButton 
                  label="Boy" 
                  active={filter.gender === 'boy'} 
                  onClick={() => handleFilterChange('gender', 'boy')} 
                />
                <FilterButton 
                  label="Girl" 
                  active={filter.gender === 'girl'} 
                  onClick={() => handleFilterChange('gender', 'girl')} 
                />
              </div>
            </div>
            <div>
              <label className="block text-gray-700 mb-2">Age Range</label>
              <div className="flex flex-wrap gap-2">
                <FilterButton 
                  label="All Ages" 
                  active={filter.ageRange === 'all'} 
                  onClick={() => handleFilterChange('ageRange', 'all')} 
                />
                <FilterButton 
                  label="0-2" 
                  active={filter.ageRange === '0-2'} 
                  onClick={() => handleFilterChange('ageRange', '0-2')} 
                />
                <FilterButton 
                  label="2-4" 
                  active={filter.ageRange === '2-4'} 
                  onClick={() => handleFilterChange('ageRange', '2-4')} 
                />
                <FilterButton 
                  label="4-6" 
                  active={filter.ageRange === '4-6'} 
                  onClick={() => handleFilterChange('ageRange', '4-6')} 
                />
                <FilterButton 
                  label="6-8" 
                  active={filter.ageRange === '6-8'} 
                  onClick={() => handleFilterChange('ageRange', '6-8')} 
                />
                <FilterButton 
                  label="8+" 
                  active={filter.ageRange === '8-99'} 
                  onClick={() => handleFilterChange('ageRange', '8-99')} 
                />
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {filteredBooks.map(book => (
            <BookCard 
              key={book.id}
              id={book.id}
              title={book.title}
              description={book.description}
              coverImage={book.coverImage}
              ageRange={`${book.minAge}-${book.maxAge}`}
            />
          ))}
        </div>

        {filteredBooks.length === 0 && (
          <div className="text-center py-12">
            <p className="text-xl text-gray-700">No books match your current filters. Please try different filter options.</p>
          </div>
        )}
      </main>

      <footer className="bg-purple-900 text-white py-12 mt-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">StoryMagic</h3>
              <p className="text-purple-200">
                Creating magical personalized stories for children around the world.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li><Link href="/" className="text-purple-200 hover:text-white">Home</Link></li>
                <li><Link href="/books" className="text-purple-200 hover:text-white">Books</Link></li>
                <li><Link href="/my-books" className="text-purple-200 hover:text-white">My Books</Link></li>
                <li><Link href="/support" className="text-purple-200 hover:text-white">Support</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-4">Legal</h3>
              <ul className="space-y-2">
                <li><Link href="/privacy" className="text-purple-200 hover:text-white">Privacy Policy</Link></li>
                <li><Link href="/terms" className="text-purple-200 hover:text-white">Terms of Service</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-4">Contact</h3>
              <p className="text-purple-200">
                Email: hello@storymagic.com<br />
                Phone: (123) 456-7890
              </p>
            </div>
          </div>
          <div className="border-t border-purple-800 mt-8 pt-8 text-center text-purple-200">
            <p>&copy; {new Date().getFullYear()} StoryMagic. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

function FilterButton({ label, active, onClick }) {
  return (
    <button
      className={`px-4 py-2 rounded-full text-sm font-medium transition-colors duration-200 ${
        active 
          ? 'bg-purple-600 text-white' 
          : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
      }`}
      onClick={onClick}
    >
      {label}
    </button>
  );
}

function BookCard({ id, title, description, coverImage, ageRange }) {
  return (
    <motion.div 
      className="bg-white rounded-lg shadow-md overflow-hidden transition-transform duration-300 hover:shadow-xl"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      whileHover={{ scale: 1.03 }}
    >
      <img src={coverImage} alt={title} className="w-full h-48 object-cover" />
      <div className="p-4">
        <h3 className="text-lg font-bold text-purple-900 mb-1">{title}</h3>
        <p className="text-sm text-gray-600 mb-2">Age: {ageRange}</p>
        <p className="text-sm text-gray-700 mb-4 line-clamp-2">{description}</p>
        <Link 
          href={`/customize/${id}`} 
          className="block w-full bg-purple-600 hover:bg-purple-700 text-white text-center font-medium py-2 px-4 rounded transition duration-300"
        >
          Personalize
        </Link>
      </div>
    </motion.div>
  );
}
