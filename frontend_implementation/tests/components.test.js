import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MockedProvider } from '@apollo/client/testing';
import BookCard from '../components/BookCard';
import BooksList from '../pages/books';
import CustomizationWizard from '../pages/customize/[id]';

// Mock data
const mockBook = {
  id: '1',
  title: 'Adventure in the Forest',
  description: 'Join your child on an exciting adventure through an enchanted forest!',
  coverImage: '/books/forest-adventure.jpg',
  minAge: 4,
  maxAge: 8,
  gender: 'neutral'
};

// BookCard component tests
describe('BookCard Component', () => {
  test('renders book information correctly', () => {
    render(
      <BookCard 
        id={mockBook.id}
        title={mockBook.title}
        description={mockBook.description}
        coverImage={mockBook.coverImage}
        ageRange={`${mockBook.minAge}-${mockBook.maxAge}`}
      />
    );
    
    expect(screen.getByText(mockBook.title)).toBeInTheDocument();
    expect(screen.getByText(`Age: ${mockBook.minAge}-${mockBook.maxAge}`)).toBeInTheDocument();
    expect(screen.getByText(mockBook.description)).toBeInTheDocument();
    expect(screen.getByRole('img')).toHaveAttribute('src', mockBook.coverImage);
    expect(screen.getByRole('link', { name: /personalize/i })).toHaveAttribute('href', `/customize/${mockBook.id}`);
  });
  
  test('applies hover animation', async () => {
    render(
      <BookCard 
        id={mockBook.id}
        title={mockBook.title}
        description={mockBook.description}
        coverImage={mockBook.coverImage}
        ageRange={`${mockBook.minAge}-${mockBook.maxAge}`}
      />
    );
    
    const card = screen.getByTestId('book-card');
    fireEvent.mouseEnter(card);
    
    // Check for hover class or style changes
    await waitFor(() => {
      expect(card).toHaveStyle('transform: scale(1.03)');
    });
  });
});

// Books page tests
describe('Books Page', () => {
  // Mock API response for books
  const mockBooks = [
    mockBook,
    {
      id: '2',
      title: 'Space Explorer',
      description: 'Blast off into space with your child as they discover planets and stars!',
      coverImage: '/books/space-explorer.jpg',
      minAge: 6,
      maxAge: 10,
      gender: 'boy'
    }
  ];
  
  test('renders books list', async () => {
    // Mock the API call
    global.fetch = jest.fn(() =>
      Promise.resolve({
        json: () => Promise.resolve(mockBooks),
        ok: true
      })
    );
    
    render(<BooksList />);
    
    // Wait for books to load
    await waitFor(() => {
      expect(screen.getByText(mockBooks[0].title)).toBeInTheDocument();
      expect(screen.getByText(mockBooks[1].title)).toBeInTheDocument();
    });
  });
  
  test('filters books by gender', async () => {
    // Mock the API call
    global.fetch = jest.fn(() =>
      Promise.resolve({
        json: () => Promise.resolve([mockBooks[1]]), // Only boy books
        ok: true
      })
    );
    
    render(<BooksList />);
    
    // Click on Boy filter
    fireEvent.click(screen.getByText('Boy'));
    
    // Wait for filtered books to load
    await waitFor(() => {
      expect(screen.queryByText(mockBooks[0].title)).not.toBeInTheDocument();
      expect(screen.getByText(mockBooks[1].title)).toBeInTheDocument();
    });
  });
  
  test('filters books by age range', async () => {
    // Mock the API call
    global.fetch = jest.fn(() =>
      Promise.resolve({
        json: () => Promise.resolve([mockBooks[0]]), // Only books for 4-8 age range
        ok: true
      })
    );
    
    render(<BooksList />);
    
    // Click on 4-6 age range filter
    fireEvent.click(screen.getByText('4-6'));
    
    // Wait for filtered books to load
    await waitFor(() => {
      expect(screen.getByText(mockBooks[0].title)).toBeInTheDocument();
      expect(screen.queryByText(mockBooks[1].title)).not.toBeInTheDocument();
    });
  });
});

// Customization Wizard tests
describe('Customization Wizard', () => {
  test('validates form inputs', async () => {
    // Mock router
    const mockRouter = {
      query: { id: '1' },
      push: jest.fn()
    };
    
    jest.mock('next/router', () => ({
      useRouter: () => mockRouter
    }));
    
    // Mock API calls
    global.fetch = jest.fn(() =>
      Promise.resolve({
        json: () => Promise.resolve(mockBook),
        ok: true
      })
    );
    
    render(<CustomizationWizard />);
    
    // Wait for form to load
    await waitFor(() => {
      expect(screen.getByLabelText(/child's name/i)).toBeInTheDocument();
    });
    
    // Try to proceed without filling required fields
    fireEvent.click(screen.getByText('Next'));
    
    // Check for validation errors
    await waitFor(() => {
      expect(screen.getByText(/name is required/i)).toBeInTheDocument();
    });
    
    // Fill in the form
    fireEvent.change(screen.getByLabelText(/child's name/i), {
      target: { value: 'Test Child' }
    });
    
    fireEvent.change(screen.getByLabelText(/child's age/i), {
      target: { value: '5' }
    });
    
    // Try to proceed again
    fireEvent.click(screen.getByText('Next'));
    
    // Should move to next step
    await waitFor(() => {
      expect(screen.getByText(/hair color/i)).toBeInTheDocument();
    });
  });
  
  test('updates preview when customization changes', async () => {
    // Mock router
    const mockRouter = {
      query: { id: '1' },
      push: jest.fn()
    };
    
    jest.mock('next/router', () => ({
      useRouter: () => mockRouter
    }));
    
    // Mock API calls
    global.fetch = jest.fn(() =>
      Promise.resolve({
        json: () => Promise.resolve(mockBook),
        ok: true
      })
    );
    
    render(<CustomizationWizard />);
    
    // Wait for form to load and fill first step
    await waitFor(() => {
      expect(screen.getByLabelText(/child's name/i)).toBeInTheDocument();
    });
    
    fireEvent.change(screen.getByLabelText(/child's name/i), {
      target: { value: 'Test Child' }
    });
    
    fireEvent.change(screen.getByLabelText(/child's age/i), {
      target: { value: '5' }
    });
    
    fireEvent.click(screen.getByText('Next'));
    
    // Wait for second step to load
    await waitFor(() => {
      expect(screen.getByText(/hair color/i)).toBeInTheDocument();
    });
    
    // Select hair color
    fireEvent.click(screen.getByText('blonde'));
    
    // Check if preview updates
    await waitFor(() => {
      const previewImage = screen.getByAltText('Character Preview');
      expect(previewImage.src).toContain('blonde');
    });
  });
  
  test('completes all steps and submits form', async () => {
    // Mock router
    const mockRouter = {
      query: { id: '1' },
      push: jest.fn()
    };
    
    jest.mock('next/router', () => ({
      useRouter: () => mockRouter
    }));
    
    // Mock API calls
    global.fetch = jest.fn(() =>
      Promise.resolve({
        json: () => Promise.resolve(mockBook),
        ok: true
      })
    );
    
    render(<CustomizationWizard />);
    
    // Complete first step
    await waitFor(() => {
      expect(screen.getByLabelText(/child's name/i)).toBeInTheDocument();
    });
    
    fireEvent.change(screen.getByLabelText(/child's name/i), {
      target: { value: 'Test Child' }
    });
    
    fireEvent.change(screen.getByLabelText(/child's age/i), {
      target: { value: '5' }
    });
    
    fireEvent.click(screen.getByText('Next'));
    
    // Complete second step
    await waitFor(() => {
      expect(screen.getByText(/hair color/i)).toBeInTheDocument();
    });
    
    fireEvent.click(screen.getByText('blonde'));
    fireEvent.click(screen.getByText('light'));
    
    fireEvent.click(screen.getByText('Next'));
    
    // Complete third step
    await waitFor(() => {
      expect(screen.getByText(/review your customization/i)).toBeInTheDocument();
    });
    
    // Submit form
    fireEvent.click(screen.getByText('Create My Book'));
    
    // Check if form was submitted and router was called
    await waitFor(() => {
      expect(mockRouter.push).toHaveBeenCalledWith(`/preview/1`);
    });
  });
});
