import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, Play, Check, Award, Users, Clock, Video, FileText } from 'lucide-react';
import { COURSE_PRODUCTS } from '../../config/stripe';
import { stripeClient } from '../../lib/stripe';

const CoursesPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(null);

  const handlePurchase = async (courseKey) => {
    try {
      setLoading(courseKey);
      const course = COURSE_PRODUCTS[courseKey];
      
      // For one-time products, we'll use a similar checkout flow
      // Note: You'll need to implement getCourseCheckoutConfig similar to getOneTimeCheckoutConfig
      const { url } = await stripeClient.createCheckoutSession({
        priceId: course.priceId,
        successUrl: `${window.location.origin}/courses?success=true&course=${courseKey}`,
        cancelUrl: `${window.location.origin}/courses`,
        metadata: {
          product: courseKey,
          type: 'course',
          source: 'website',
        },
      });
      window.location.href = url;
    } catch (error) {
      console.error('Checkout error:', error);
      alert('Failed to start checkout. Please try again.');
    } finally {
      setLoading(null);
    }
  };

  const courses = [
    {
      key: 'privacyBasics',
      icon: BookOpen,
      color: 'blue',
      gradient: 'from-blue-500 to-blue-600',
    },
    {
      key: 'advancedPrivacy',
      icon: Award,
      color: 'purple',
      gradient: 'from-purple-500 to-purple-600',
    },
    {
      key: 'complianceWorkshop',
      icon: Users,
      color: 'green',
      gradient: 'from-green-500 to-green-600',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <BookOpen className="w-16 h-16 text-blue-600 dark:text-blue-400 mx-auto mb-4" />
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Privacy Education Courses
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400">
            Learn privacy protection strategies from experts
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-12">
          {courses.map(({ key, icon: Icon, color, gradient }) => {
            const course = COURSE_PRODUCTS[key];
            const purchased = localStorage.getItem(`course_${key}_purchased`) === 'true';

            return (
              <div
                key={key}
                className="bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-xl transition-shadow"
              >
                <div className={`bg-gradient-to-r ${gradient} p-6 text-white`}>
                  <Icon className="w-12 h-12 mb-4" />
                  <h3 className="text-2xl font-bold mb-2">{course.name}</h3>
                  <p className="text-white/90 text-sm">{course.description}</p>
                </div>

                <div className="p-6">
                  <div className="text-center mb-6">
                    <div className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
                      ${course.price}
                    </div>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">One-time payment</p>
                  </div>

                  <ul className="space-y-3 mb-6">
                    {course.features.map((feature, index) => (
                      <li key={index} className="flex items-start">
                        <Check className="w-5 h-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                        <span className="text-sm text-gray-700 dark:text-gray-300">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  {purchased ? (
                    <button
                      onClick={() => navigate(`/courses/${key}`)}
                      className="w-full py-3 px-4 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors"
                    >
                      Access Course
                    </button>
                  ) : (
                    <button
                      onClick={() => handlePurchase(key)}
                      disabled={loading === key}
                      className={`w-full py-3 px-4 bg-${color}-600 text-white rounded-lg font-medium hover:bg-${color}-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed`}
                    >
                      {loading === key ? 'Processing...' : `Enroll Now - $${course.price}`}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Course Details Section */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            Why Learn with SocialCaution?
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="flex items-start">
              <Video className="w-6 h-6 text-blue-600 dark:text-blue-400 mr-3 mt-1" />
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                  Expert-Led Content
                </h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  Learn from privacy professionals with years of experience in the field.
                </p>
              </div>
            </div>
            <div className="flex items-start">
              <Award className="w-6 h-6 text-blue-600 dark:text-blue-400 mr-3 mt-1" />
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                  Certificates of Completion
                </h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  Earn certificates to showcase your privacy knowledge.
                </p>
              </div>
            </div>
            <div className="flex items-start">
              <Clock className="w-6 h-6 text-blue-600 dark:text-blue-400 mr-3 mt-1" />
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                  Self-Paced Learning
                </h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  Learn at your own pace with lifetime access to course materials.
                </p>
              </div>
            </div>
            <div className="flex items-start">
              <FileText className="w-6 h-6 text-blue-600 dark:text-blue-400 mr-3 mt-1" />
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                  Practical Resources
                </h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  Download templates, checklists, and guides to apply what you learn.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CoursesPage;

