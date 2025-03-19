// Integration test for frontend and backend communication
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { renderHook, act } from '@testing-library/react-hooks';
import { useStories, useCustomization, useOrder } from '../src/hooks/apiHooks';

// Create mock for axios
const mock = new MockAdapter(axios);

// Mock data
const mockStories = [
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
    title: 'Space Explorer',
    description: 'Blast off into space with your child as they discover planets and stars!',
    coverImage: '/books/space-explorer.jpg',
    minAge: 6,
    maxAge: 10,
    gender: 'boy'
  }
];

const mockCustomization = {
  id: 1,
  storyId: 1,
  name: 'Test Child',
  gender: 'boy',
  age: 5,
  customFields: {
    hairColor: 'brown',
    skinTone: 'medium',
    favoriteAnimal: 'dog'
  }
};

const mockCustomizedBook = {
  id: 1,
  customizationId: 1,
  renderedContent: {
    pages: [
      { pageNumber: 1, text: 'This is the story of Test Child.' },
      { pageNumber: 2, text: 'Test Child went on an adventure.' }
    ]
  },
  coverImage: '/covers/customized/1_1616161616.jpg',
  status: 'final'
};

const mockOrder = {
  id: 1,
  userId: 1,
  totalAmount: 9.99,
  status: 'pending',
  items: [
    {
      id: 1,
      orderId: 1,
      customizedBookId: 1,
      format: 'digital',
      price: 9.99,
      quantity: 1
    }
  ]
};

describe('API Hooks Integration Tests', () => {
  beforeEach(() => {
    mock.reset();
  });

  // Test useStories hook
  describe('useStories Hook', () => {
    test('fetches stories successfully', async () => {
      // Setup mock response
      mock.onGet('/api/stories').reply(200, mockStories);
      
      // Render hook
      const { result, waitForNextUpdate } = renderHook(() => useStories());
      
      // Initial state should be loading with empty stories
      expect(result.current.loading).toBe(true);
      expect(result.current.stories).toEqual([]);
      
      // Wait for update
      await waitForNextUpdate();
      
      // After update, should have stories and not be loading
      expect(result.current.loading).toBe(false);
      expect(result.current.stories).toEqual(mockStories);
      expect(result.current.error).toBe(null);
    });
    
    test('handles error when fetching stories', async () => {
      // Setup mock response with error
      mock.onGet('/api/stories').reply(500, { message: 'Server error' });
      
      // Render hook
      const { result, waitForNextUpdate } = renderHook(() => useStories());
      
      // Wait for update
      await waitForNextUpdate();
      
      // Should have error and not be loading
      expect(result.current.loading).toBe(false);
      expect(result.current.stories).toEqual([]);
      expect(result.current.error).not.toBe(null);
    });
    
    test('filters stories by criteria', async () => {
      // Setup mock responses
      mock.onGet('/api/stories').reply(200, mockStories);
      mock.onGet('/api/stories/filter').reply(200, [mockStories[1]]);
      
      // Render hook
      const { result, waitForNextUpdate } = renderHook(() => useStories());
      
      // Wait for initial stories to load
      await waitForNextUpdate();
      
      // Apply filter
      act(() => {
        result.current.filterStories({ gender: 'boy', minAge: 6 });
      });
      
      // Wait for filtered results
      await waitForNextUpdate();
      
      // Should have filtered stories
      expect(result.current.stories).toEqual([mockStories[1]]);
    });
  });
  
  // Test useCustomization hook
  describe('useCustomization Hook', () => {
    test('creates customization successfully', async () => {
      // Setup mock response
      mock.onPost('/api/customizations').reply(201, mockCustomization);
      
      // Render hook
      const { result, waitForNextUpdate } = renderHook(() => useCustomization());
      
      // Create customization
      act(() => {
        result.current.createCustomization({
          storyId: 1,
          name: 'Test Child',
          gender: 'boy',
          age: 5,
          customFields: {
            hairColor: 'brown',
            skinTone: 'medium',
            favoriteAnimal: 'dog'
          }
        });
      });
      
      // Wait for update
      await waitForNextUpdate();
      
      // Should have customization and not be loading
      expect(result.current.loading).toBe(false);
      expect(result.current.customization).toEqual(mockCustomization);
      expect(result.current.error).toBe(null);
    });
    
    test('generates customized book successfully', async () => {
      // Setup mock responses
      mock.onGet('/api/customizations/1').reply(200, mockCustomization);
      mock.onPost('/api/customizations/1/generate-book').reply(200, mockCustomizedBook);
      
      // Render hook
      const { result, waitForNextUpdate } = renderHook(() => useCustomization());
      
      // Load customization
      act(() => {
        result.current.getCustomization(1);
      });
      
      // Wait for update
      await waitForNextUpdate();
      
      // Generate book
      act(() => {
        result.current.generateBook(1);
      });
      
      // Wait for update
      await waitForNextUpdate();
      
      // Should have customized book and not be loading
      expect(result.current.loading).toBe(false);
      expect(result.current.customizedBook).toEqual(mockCustomizedBook);
      expect(result.current.error).toBe(null);
    });
  });
  
  // Test useOrder hook
  describe('useOrder Hook', () => {
    test('creates order successfully', async () => {
      // Setup mock response
      mock.onPost('/api/orders').reply(201, { order: mockOrder, items: mockOrder.items });
      
      // Render hook
      const { result, waitForNextUpdate } = renderHook(() => useOrder());
      
      // Create order
      act(() => {
        result.current.createOrder({
          customizedBookId: 1,
          format: 'digital',
          quantity: 1
        });
      });
      
      // Wait for update
      await waitForNextUpdate();
      
      // Should have order and not be loading
      expect(result.current.loading).toBe(false);
      expect(result.current.order).toEqual(mockOrder);
      expect(result.current.error).toBe(null);
    });
    
    test('processes payment successfully', async () => {
      // Setup mock responses
      mock.onGet('/api/orders/1').reply(200, mockOrder);
      mock.onPost('/api/orders/1/payment').reply(200, {
        order: { ...mockOrder, status: 'paid' },
        payment: {
          id: 'PAY-123456789',
          amount: 9.99,
          status: 'completed',
          method: 'credit_card'
        }
      });
      
      // Render hook
      const { result, waitForNextUpdate } = renderHook(() => useOrder());
      
      // Load order
      act(() => {
        result.current.getOrder(1);
      });
      
      // Wait for update
      await waitForNextUpdate();
      
      // Process payment
      act(() => {
        result.current.processPayment(1, {
          paymentMethod: 'credit_card',
          paymentDetails: {
            cardNumber: '4242424242424242',
            expiryMonth: 12,
            expiryYear: 2025,
            cvc: '123'
          }
        });
      });
      
      // Wait for update
      await waitForNextUpdate();
      
      // Should have updated order and payment info
      expect(result.current.loading).toBe(false);
      expect(result.current.order.status).toBe('paid');
      expect(result.current.payment).not.toBe(null);
      expect(result.current.error).toBe(null);
    });
  });
});
