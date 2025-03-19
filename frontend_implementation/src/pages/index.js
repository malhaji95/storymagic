import { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-100 to-white">
      <Head>
        <title>StoryMagic - Personalized Stories</title>
        <meta name="description" content="Create personalized stories where your child is the hero" />
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

      <main>
        <section className="container mx-auto px-4 py-16 flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 mb-10 md:mb-0">
            <motion.h1 
              className="text-4xl md:text-5xl font-bold text-purple-900 mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              Craft magical tales where your child is the hero
            </motion.h1>
            <motion.p 
              className="text-xl text-gray-700 mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              Bring your unique storybook to life with personalized adventures tailored just for your little one.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <Link href="/books" className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-8 rounded-full text-lg transition duration-300">
                Explore Books
              </Link>
            </motion.div>
          </div>
          <div className="md:w-1/2">
            <motion.img 
              src="/hero-image.jpg" 
              alt="Child reading a personalized book" 
              className="rounded-lg shadow-xl"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </section>

        <section className="bg-purple-50 py-16">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center text-purple-900 mb-12">Our Books</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {/* Book previews would go here */}
              <BookPreview 
                title="Adventure in the Forest" 
                imageUrl="/books/forest-adventure.jpg"
                ageRange="4-8"
              />
              <BookPreview 
                title="The ABC Journey" 
                imageUrl="/books/abc-journey.jpg"
                ageRange="2-6"
              />
              <BookPreview 
                title="Space Explorer" 
                imageUrl="/books/space-explorer.jpg"
                ageRange="6-10"
              />
              <BookPreview 
                title="Ocean Discovery" 
                imageUrl="/books/ocean-discovery.jpg"
                ageRange="4-8"
              />
            </div>
            <div className="text-center mt-12">
              <Link href="/books" className="text-purple-600 hover:text-purple-800 font-medium text-lg underline">
                View All Books
              </Link>
            </div>
          </div>
        </section>

        <section className="py-16">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center text-purple-900 mb-12">How It Works</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <StepCard 
                number="1"
                title="Choose a Story"
                description="Browse our collection of magical stories and select the perfect adventure for your child."
              />
              <StepCard 
                number="2"
                title="Personalize It"
                description="Add your child's name, appearance, and preferences to make them the star of the story."
              />
              <StepCard 
                number="3"
                title="Enjoy Together"
                description="Receive your personalized story as a digital book or have a physical copy delivered to your door."
              />
            </div>
          </div>
        </section>

        <section className="bg-purple-100 py-16">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold text-purple-900 mb-6">Ready to create a magical story?</h2>
            <p className="text-xl text-gray-700 mb-8 max-w-2xl mx-auto">
              Start your journey today and create a personalized adventure that your child will treasure forever.
            </p>
            <Link href="/books" className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-8 rounded-full text-lg transition duration-300">
              Get Started
            </Link>
          </div>
        </section>
      </main>

      <footer className="bg-purple-900 text-white py-12">
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

function BookPreview({ title, imageUrl, ageRange }) {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden transition-transform duration-300 hover:transform hover:scale-105">
      <img src={imageUrl} alt={title} className="w-full h-48 object-cover" />
      <div className="p-4">
        <h3 className="text-lg font-bold text-purple-900 mb-1">{title}</h3>
        <p className="text-sm text-gray-600 mb-3">Age: {ageRange}</p>
        <Link href={`/books/${title.toLowerCase().replace(/\s+/g, '-')}`} className="text-purple-600 hover:text-purple-800 font-medium">
          Personalize
        </Link>
      </div>
    </div>
  );
}

function StepCard({ number, title, description }) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 text-center">
      <div className="bg-purple-600 text-white w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
        {number}
      </div>
      <h3 className="text-xl font-bold text-purple-900 mb-3">{title}</h3>
      <p className="text-gray-700">{description}</p>
    </div>
  );
}
