const request = require('supertest');
const app = require('../src/app');
const { sequelize } = require('../src/models');

// Mock data for testing
const testUser = {
  email: 'test@example.com',
  password: 'password123',
  firstName: 'Test',
  lastName: 'User'
};

let authToken;

// Setup and teardown
beforeAll(async () => {
  // Connect to test database and sync models
  await sequelize.sync({ force: true });
});

afterAll(async () => {
  // Close database connection
  await sequelize.close();
});

// User API tests
describe('User API', () => {
  // Test user registration
  test('Should register a new user', async () => {
    const response = await request(app)
      .post('/api/users/register')
      .send(testUser);
    
    expect(response.statusCode).toBe(201);
    expect(response.body).toHaveProperty('token');
    expect(response.body.email).toBe(testUser.email);
  });

  // Test user login
  test('Should login an existing user', async () => {
    const response = await request(app)
      .post('/api/users/login')
      .send({
        email: testUser.email,
        password: testUser.password
      });
    
    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty('token');
    
    // Save token for subsequent tests
    authToken = response.body.token;
  });

  // Test get user profile
  test('Should get user profile with valid token', async () => {
    const response = await request(app)
      .get('/api/users/profile')
      .set('Authorization', `Bearer ${authToken}`);
    
    expect(response.statusCode).toBe(200);
    expect(response.body.email).toBe(testUser.email);
  });

  // Test profile update
  test('Should update user profile', async () => {
    const updatedData = {
      firstName: 'Updated',
      lastName: 'Name'
    };
    
    const response = await request(app)
      .put('/api/users/profile')
      .set('Authorization', `Bearer ${authToken}`)
      .send(updatedData);
    
    expect(response.statusCode).toBe(200);
    expect(response.body.firstName).toBe(updatedData.firstName);
    expect(response.body.lastName).toBe(updatedData.lastName);
  });
});

// Story API tests
describe('Story API', () => {
  let storyId;
  
  // Test create story (admin only in real app)
  test('Should create a new story', async () => {
    const storyData = {
      title: 'Test Story',
      description: 'A test story for testing',
      baseContent: {
        pages: [
          { page_number: 1, text: 'This is the story of {{name}}.' },
          { page_number: 2, text: '{{name}} went on an adventure.' }
        ]
      },
      coverImage: '/test-cover.jpg',
      minAge: 4,
      maxAge: 8,
      gender: 'neutral'
    };
    
    const response = await request(app)
      .post('/api/stories')
      .set('Authorization', `Bearer ${authToken}`)
      .send(storyData);
    
    expect(response.statusCode).toBe(201);
    expect(response.body.title).toBe(storyData.title);
    
    storyId = response.body.id;
  });

  // Test get all stories
  test('Should get all stories', async () => {
    const response = await request(app)
      .get('/api/stories');
    
    expect(response.statusCode).toBe(200);
    expect(Array.isArray(response.body)).toBeTruthy();
    expect(response.body.length).toBeGreaterThan(0);
  });

  // Test get story by ID
  test('Should get story by ID', async () => {
    const response = await request(app)
      .get(`/api/stories/${storyId}`);
    
    expect(response.statusCode).toBe(200);
    expect(response.body.id).toBe(storyId);
  });

  // Test filter stories
  test('Should filter stories by criteria', async () => {
    const response = await request(app)
      .get('/api/stories/filter')
      .query({ gender: 'neutral', minAge: 4, maxAge: 8 });
    
    expect(response.statusCode).toBe(200);
    expect(Array.isArray(response.body)).toBeTruthy();
    expect(response.body.length).toBeGreaterThan(0);
  });
});

// Customization API tests
describe('Customization API', () => {
  let customizationId;
  let storyId = 1; // Assuming we have a story with ID 1 from previous tests
  
  // Test create customization
  test('Should create a new customization', async () => {
    const customizationData = {
      storyId,
      name: 'Test Child',
      gender: 'boy',
      age: 5,
      customFields: {
        hairColor: 'brown',
        skinTone: 'medium',
        favoriteAnimal: 'dog'
      }
    };
    
    const response = await request(app)
      .post('/api/customizations')
      .set('Authorization', `Bearer ${authToken}`)
      .send(customizationData);
    
    expect(response.statusCode).toBe(201);
    expect(response.body.name).toBe(customizationData.name);
    
    customizationId = response.body.id;
  });

  // Test get customization by ID
  test('Should get customization by ID', async () => {
    const response = await request(app)
      .get(`/api/customizations/${customizationId}`)
      .set('Authorization', `Bearer ${authToken}`);
    
    expect(response.statusCode).toBe(200);
    expect(response.body.id).toBe(customizationId);
  });

  // Test update customization
  test('Should update customization', async () => {
    const updateData = {
      name: 'Updated Name',
      customFields: {
        hairColor: 'blonde',
        skinTone: 'light',
        favoriteAnimal: 'cat'
      }
    };
    
    const response = await request(app)
      .put(`/api/customizations/${customizationId}`)
      .set('Authorization', `Bearer ${authToken}`)
      .send(updateData);
    
    expect(response.statusCode).toBe(200);
    expect(response.body.name).toBe(updateData.name);
  });

  // Test generate customized book
  test('Should generate customized book', async () => {
    const response = await request(app)
      .post(`/api/customizations/${customizationId}/generate-book`)
      .set('Authorization', `Bearer ${authToken}`);
    
    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty('rendered_content');
    expect(response.body).toHaveProperty('cover_image');
  });
});

// Order API tests
describe('Order API', () => {
  let orderId;
  let customizedBookId = 1; // Assuming we have a customized book with ID 1 from previous tests
  
  // Test create order
  test('Should create a new order', async () => {
    const orderData = {
      customizedBookId,
      format: 'digital',
      quantity: 1
    };
    
    const response = await request(app)
      .post('/api/orders')
      .set('Authorization', `Bearer ${authToken}`)
      .send(orderData);
    
    expect(response.statusCode).toBe(201);
    expect(response.body.order).toHaveProperty('id');
    expect(response.body.items).toHaveLength(1);
    
    orderId = response.body.order.id;
  });

  // Test get user orders
  test('Should get all orders for user', async () => {
    const response = await request(app)
      .get('/api/orders')
      .set('Authorization', `Bearer ${authToken}`);
    
    expect(response.statusCode).toBe(200);
    expect(Array.isArray(response.body)).toBeTruthy();
    expect(response.body.length).toBeGreaterThan(0);
  });

  // Test get order by ID
  test('Should get order by ID', async () => {
    const response = await request(app)
      .get(`/api/orders/${orderId}`)
      .set('Authorization', `Bearer ${authToken}`);
    
    expect(response.statusCode).toBe(200);
    expect(response.body.id).toBe(orderId);
  });

  // Test process payment
  test('Should process payment for order', async () => {
    const paymentData = {
      paymentMethod: 'credit_card',
      paymentDetails: {
        cardNumber: '4242424242424242',
        expiryMonth: 12,
        expiryYear: 2025,
        cvc: '123'
      }
    };
    
    const response = await request(app)
      .post(`/api/orders/${orderId}/payment`)
      .set('Authorization', `Bearer ${authToken}`)
      .send(paymentData);
    
    expect(response.statusCode).toBe(200);
    expect(response.body.order.status).toBe('paid');
    expect(response.body.payment).toHaveProperty('id');
  });
});
