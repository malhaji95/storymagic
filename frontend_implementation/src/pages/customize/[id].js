import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';

// Validation schemas for each step
const stepOneValidationSchema = Yup.object({
  childName: Yup.string().required('Name is required'),
  childAge: Yup.number().required('Age is required').min(0, 'Age must be positive').max(12, 'Age must be 12 or under'),
  childGender: Yup.string().required('Gender is required')
});

const stepTwoValidationSchema = Yup.object({
  hairColor: Yup.string().required('Hair color is required'),
  skinTone: Yup.string().required('Skin tone is required'),
  favoriteAnimal: Yup.string().required('Favorite animal is required'),
  favoriteColor: Yup.string().required('Favorite color is required')
});

const CustomizationWizard = () => {
  const router = useRouter();
  const { id } = router.query;
  const [story, setStory] = useState(null);
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    childName: '',
    childAge: '',
    childGender: '',
    hairColor: '',
    skinTone: '',
    favoriteAnimal: '',
    favoriteColor: ''
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch story data
  useEffect(() => {
    if (!id) return;

    const fetchStory = async () => {
      try {
        setLoading(true);
        // In a real app, this would be an API call
        // For now, we'll simulate it with mock data
        const response = await fetch(`/api/stories/${id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch story');
        }
        const data = await response.json();
        setStory(data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchStory();
  }, [id]);

  // Handle form submission for each step
  const handleStepSubmit = (values) => {
    setFormData({ ...formData, ...values });
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    } else {
      handleFinalSubmit();
    }
  };

  // Handle final form submission
  const handleFinalSubmit = async () => {
    try {
      setLoading(true);
      // In a real app, this would be an API call to save the customization
      // For now, we'll simulate it
      const customizationData = {
        storyId: id,
        ...formData
      };
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Redirect to preview page
      router.push(`/preview/${id}`);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  // Go back to previous step
  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  if (loading && !story) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <p>Error: {error}</p>
          <button 
            onClick={() => router.push('/books')}
            className="mt-4 bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
          >
            Back to Books
          </button>
        </div>
      </div>
    );
  }

  // Mock story data for development
  const mockStory = {
    id: id || '1',
    title: 'Adventure in the Forest',
    description: 'Join your child on an exciting adventure through an enchanted forest!',
    coverImage: '/books/forest-adventure.jpg',
    minAge: 4,
    maxAge: 8,
    gender: 'neutral'
  };

  const storyData = story || mockStory;

  return (
    <div className="min-h-screen bg-gray-50">
      <Head>
        <title>Customize Your Story | StoryMagic</title>
        <meta name="description" content="Customize your personalized storybook" />
      </Head>

      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900">StoryMagic</h1>
            <nav>
              <Link href="/" className="text-gray-600 hover:text-gray-900 mr-4">
                Home
              </Link>
              <Link href="/books" className="text-gray-600 hover:text-gray-900">
                Books
              </Link>
            </nav>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6">
            <h2 className="text-xl font-semibold text-gray-900">
              Customize "{storyData.title}"
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              {storyData.description}
            </p>
          </div>

          <div className="border-t border-gray-200">
            {/* Progress steps */}
            <div className="px-4 py-5 sm:px-6">
              <div className="flex items-center justify-between">
                <div className="w-full">
                  <div className="flex items-center">
                    <div className={`flex items-center justify-center h-10 w-10 rounded-full ${currentStep >= 1 ? 'bg-purple-600' : 'bg-gray-300'} text-white`}>
                      1
                    </div>
                    <div className={`h-1 w-full ${currentStep >= 2 ? 'bg-purple-600' : 'bg-gray-300'}`}></div>
                    <div className={`flex items-center justify-center h-10 w-10 rounded-full ${currentStep >= 2 ? 'bg-purple-600' : 'bg-gray-300'} text-white`}>
                      2
                    </div>
                    <div className={`h-1 w-full ${currentStep >= 3 ? 'bg-purple-600' : 'bg-gray-300'}`}></div>
                    <div className={`flex items-center justify-center h-10 w-10 rounded-full ${currentStep >= 3 ? 'bg-purple-600' : 'bg-gray-300'} text-white`}>
                      3
                    </div>
                  </div>
                  <div className="flex justify-between mt-2">
                    <div className="text-sm text-gray-600">Basic Info</div>
                    <div className="text-sm text-gray-600">Appearance</div>
                    <div className="text-sm text-gray-600">Review</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Step 1: Basic Information */}
            {currentStep === 1 && (
              <div className="px-4 py-5 sm:px-6">
                <h3 className="text-lg font-medium text-gray-900">Step 1: Basic Information</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Tell us about your child so we can personalize the story.
                </p>

                <Formik
                  initialValues={{
                    childName: formData.childName,
                    childAge: formData.childAge,
                    childGender: formData.childGender
                  }}
                  validationSchema={stepOneValidationSchema}
                  onSubmit={handleStepSubmit}
                >
                  {({ isSubmitting }) => (
                    <Form className="mt-6 space-y-6">
                      <div>
                        <label htmlFor="childName" className="block text-sm font-medium text-gray-700">
                          Child's Name
                        </label>
                        <Field
                          type="text"
                          name="childName"
                          id="childName"
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                        />
                        <ErrorMessage name="childName" component="div" className="mt-1 text-sm text-red-600" />
                      </div>

                      <div>
                        <label htmlFor="childAge" className="block text-sm font-medium text-gray-700">
                          Child's Age
                        </label>
                        <Field
                          type="number"
                          name="childAge"
                          id="childAge"
                          min="0"
                          max="12"
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                        />
                        <ErrorMessage name="childAge" component="div" className="mt-1 text-sm text-red-600" />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Child's Gender
                        </label>
                        <div className="mt-2 space-y-2">
                          <div className="flex items-center">
                            <Field
                              type="radio"
                              name="childGender"
                              id="gender-boy"
                              value="boy"
                              className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300"
                            />
                            <label htmlFor="gender-boy" className="ml-3 block text-sm text-gray-700">
                              Boy
                            </label>
                          </div>
                          <div className="flex items-center">
                            <Field
                              type="radio"
                              name="childGender"
                              id="gender-girl"
                              value="girl"
                              className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300"
                            />
                            <label htmlFor="gender-girl" className="ml-3 block text-sm text-gray-700">
                              Girl
                            </label>
                          </div>
                        </div>
                        <ErrorMessage name="childGender" component="div" className="mt-1 text-sm text-red-600" />
                      </div>

                      <div className="flex justify-end">
                        <button
                          type="submit"
                          disabled={isSubmitting}
                          className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                        >
                          Next
                        </button>
                      </div>
                    </Form>
                  )}
                </Formik>
              </div>
            )}

            {/* Step 2: Appearance */}
            {currentStep === 2 && (
              <div className="px-4 py-5 sm:px-6">
                <h3 className="text-lg font-medium text-gray-900">Step 2: Appearance</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Customize how your child will appear in the story.
                </p>

                <Formik
                  initialValues={{
                    hairColor: formData.hairColor,
                    skinTone: formData.skinTone,
                    favoriteAnimal: formData.favoriteAnimal,
                    favoriteColor: formData.favoriteColor
                  }}
                  validationSchema={stepTwoValidationSchema}
                  onSubmit={handleStepSubmit}
                >
                  {({ isSubmitting }) => (
                    <Form className="mt-6 space-y-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Hair Color
                        </label>
                        <div className="mt-2 grid grid-cols-4 gap-2">
                          {['blonde', 'brown', 'black', 'red'].map((color) => (
                            <div key={color} className="relative">
                              <Field
                                type="radio"
                                name="hairColor"
                                id={`hair-${color}`}
                                value={color}
                                className="sr-only"
                              />
                              <label
                                htmlFor={`hair-${color}`}
                                className="cursor-pointer flex flex-col items-center p-2 border rounded-md focus-within:ring-2 focus-within:ring-purple-500"
                              >
                                <div className={`w-8 h-8 rounded-full bg-${color === 'blonde' ? 'yellow' : color}-500`}></div>
                                <span className="mt-1 text-xs capitalize">{color}</span>
                              </label>
                            </div>
                          ))}
                        </div>
                        <ErrorMessage name="hairColor" component="div" className="mt-1 text-sm text-red-600" />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Skin Tone
                        </label>
                        <div className="mt-2 grid grid-cols-3 gap-2">
                          {['light', 'medium', 'dark'].map((tone) => (
                            <div key={tone} className="relative">
                              <Field
                                type="radio"
                                name="skinTone"
                                id={`skin-${tone}`}
                                value={tone}
                                className="sr-only"
                              />
                              <label
                                htmlFor={`skin-${tone}`}
                                className="cursor-pointer flex flex-col items-center p-2 border rounded-md focus-within:ring-2 focus-within:ring-purple-500"
                              >
                                <div className={`w-8 h-8 rounded-full ${
                                  tone === 'light' ? 'bg-yellow-100' : 
                                  tone === 'medium' ? 'bg-yellow-300' : 
                                  'bg-yellow-700'
                                }`}></div>
                                <span className="mt-1 text-xs capitalize">{tone}</span>
                              </label>
                            </div>
                          ))}
                        </div>
                        <ErrorMessage name="skinTone" component="div" className="mt-1 text-sm text-red-600" />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Favorite Animal
                        </label>
                        <Field
                          as="select"
                          name="favoriteAnimal"
                          className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm rounded-md"
                        >
                          <option value="">Select an animal</option>
                          <option value="dog">Dog</option>
                          <option value="cat">Cat</option>
                          <option value="rabbit">Rabbit</option>
                          <option value="fox">Fox</option>
                          <option value="unicorn">Unicorn</option>
                        </Field>
                        <ErrorMessage name="favoriteAnimal" component="div" className="mt-1 text-sm text-red-600" />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Favorite Color
                        </label>
                        <div className="mt-2 grid grid-cols-3 gap-2">
                          {['red', 'blue', 'green', 'purple', 'pink', 'yellow'].map((color) => (
                            <div key={color} className="relative">
                              <Field
                                type="radio"
                                name="favoriteColor"
                                id={`color-${color}`}
                                value={color}
                                className="sr-only"
                              />
                              <label
                                htmlFor={`color-${color}`}
                                className="cursor-pointer flex flex-col items-center p-2 border rounded-md focus-within:ring-2 focus-within:ring-purple-500"
                              >
                                <div className={`w-8 h-8 rounded-full bg-${color}-500`}></div>
                                <span className="mt-1 text-xs capitalize">{color}</span>
                              </label>
                            </div>
                          ))}
                        </div>
                        <ErrorMessage name="favoriteColor" component="div" className="mt-1 text-sm text-red-600" />
                      </div>

                      <div className="flex justify-between">
                        <button
                          type="button"
                          onClick={handleBack}
                          className="inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                        >
                          Back
                        </button>
                        <button
                          type="submit"
                          disabled={isSubmitting}
                          className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                        >
                          Next
                        </button>
                      </div>
                    </Form>
                  )}
                </Formik>
              </div>
            )}

            {/* Step 3: Review */}
            {currentStep === 3 && (
              <div className="px-4 py-5 sm:px-6">
                <h3 className="text-lg font-medium text-gray-900">Step 3: Review Your Customization</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Review your selections before creating your personalized book.
                </p>

                <div className="mt-6 space-y-6">
                  <div className="bg-purple-50 rounded-lg p-4 mb-6">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <h4 className="font-medium text-gray-900">Basic Information</h4>
                        <dl className="mt-2 text-sm text-gray-600">
                          <div className="mt-1">
                            <dt className="inline font-medium">Name:</dt>
                            <dd className="inline ml-1">{formData.childName}</dd>
                          </div>
                          <div className="mt-1">
                            <dt className="inline font-medium">Age:</dt>
                            <dd className="inline ml-1">{formData.childAge}</dd>
                          </div>
                          <div className="mt-1">
                            <dt className="inline font-medium">Gender:</dt>
                            <dd className="inline ml-1 capitalize">{formData.childGender}</dd>
                          </div>
                        </dl>
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900">Appearance</h4>
                        <dl className="mt-2 text-sm text-gray-600">
                          <div className="mt-1">
                            <dt className="inline font-medium">Hair Color:</dt>
                            <dd className="inline ml-1 capitalize">{formData.hairColor}</dd>
                          </div>
                          <div className="mt-1">
                            <dt className="inline font-medium">Skin Tone:</dt>
                            <dd className="inline ml-1 capitalize">{formData.skinTone}</dd>
                          </div>
                          <div className="mt-1">
                            <dt className="inline font-medium">Favorite Animal:</dt>
                            <dd className="inline ml-1 capitalize">{formData.favoriteAnimal}</dd>
                          </div>
                          <div className="mt-1">
                            <dt className="inline font-medium">Favorite Color:</dt>
                            <dd className="inline ml-1 capitalize">{formData.favoriteColor}</dd>
                          </div>
                        </dl>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="font-medium text-gray-900">Book Preview</h4>
                    <p className="mt-1 text-sm text-gray-500">
                      Here's a preview of how your story will look:
                    </p>
                    <div className="mt-4 border rounded-md overflow-hidden">
                      <div className="bg-gray-100 p-4 text-center">
                        <h5 className="text-xl font-bold">
                          {formData.childName}'s Adventure in the Forest
                        </h5>
                        <p className="mt-2 text-sm text-gray-600">
                          A personalized story featuring {formData.childName}
                        </p>
                      </div>
                      <div className="p-4">
                        <p className="text-gray-800">
                          Once upon a time, there was a {formData.childGender === 'boy' ? 'boy' : 'girl'} named {formData.childName} who loved adventures...
                        </p>
                        <p className="mt-2 text-gray-800">
                          {formData.childName} had {formData.hairColor} hair and loved {formData.favoriteColor} things...
                        </p>
                        <p className="mt-2 text-gray-800">
                          One day, {formData.childName} met a friendly {formData.favoriteAnimal} who became their guide...
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="font-medium text-gray-900">Book Format</h4>
                    <p className="mt-1 text-sm text-gray-500">
                      Choose your preferred book format:
                    </p>
                    <div className="mt-4 grid grid-cols-3 gap-4">
                      <div className="border rounded-md p-4 text-center hover:border-purple-500 cursor-pointer">
                        <h5 className="font-medium">Digital</h5>
                        <p className="mt-1 text-sm text-gray-500">$9.99</p>
                        <p className="mt-2 text-xs text-gray-500">
                          Instant access to your personalized story
                        </p>
                      </div>
                      <div className="border rounded-md p-4 text-center hover:border-purple-500 cursor-pointer">
                        <h5 className="font-medium">Paperback</h5>
                        <p className="mt-1 text-sm text-gray-500">$19.99</p>
                        <p className="mt-2 text-xs text-gray-500">
                          Printed and shipped to your door
                        </p>
                      </div>
                      <div className="border rounded-md p-4 text-center hover:border-purple-500 cursor-pointer">
                        <h5 className="font-medium">Hardcover</h5>
                        <p className="mt-1 text-sm text-gray-500">$29.99</p>
                        <p className="mt-2 text-xs text-gray-500">
                          Premium quality with durable binding
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-between">
                    <button
                      type="button"
                      onClick={handleBack}
                      className="inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                    >
                      Back
                    </button>
                    <button
                      type="button"
                      onClick={handleFinalSubmit}
                      className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                    >
                      Create My Book
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      <footer className="bg-white mt-12 border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
          <p className="text-center text-sm text-gray-500">
            &copy; 2025 StoryMagic. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default CustomizationWizard;
