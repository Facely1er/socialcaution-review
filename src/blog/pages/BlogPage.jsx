import React, { useRef, useEffect, useState } from 'react';
import { Calendar, User, ArrowRight, Search } from 'lucide-react';
import PageLayout from '../components/PageLayout';
import Section from '../components/Section';
import Card from '../components/Card';
import { Link } from 'react-router-dom';
import { useToastContext } from '../hooks/useToastContext';

const BlogPage = () => {
  const { success, error: showError } = useToastContext();
  const canvasRef = useRef(null);
  const [displayedPosts, setDisplayedPosts] = useState(6);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [subscribedEmails, setSubscribedEmails] = useState(() => {
    const stored = localStorage.getItem('blog-subscriptions');
    return stored ? JSON.parse(stored) : [];
  });

  // Animation for the background
  useEffect(() => {
    if (!canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = canvas.parentElement?.offsetHeight || 500;
    };
    
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    
    class BlogParticle {
      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 15 + 5;
        this.speedX = (Math.random() - 0.5) * 1;
        this.speedY = (Math.random() - 0.5) * 1;
        this.type = ['book', 'tag', 'calendar', 'user'][Math.floor(Math.random() * 4)];
        this.opacity = Math.random() * 0.3 + 0.1;
        this.rotation = Math.random() * Math.PI * 2;
        this.rotationSpeed = (Math.random() - 0.5) * 0.02;
      }
      
      update() {
        this.x += this.speedX;
        this.y += this.speedY;
        this.rotation += this.rotationSpeed;
        
        if (this.x < 0 || this.x > canvas.width) this.speedX *= -1;
        if (this.y < 0 || this.y > canvas.height) this.speedY *= -1;
        
        if (Math.random() > 0.99) {
          this.speedX = (Math.random() - 0.5) * 1;
          this.speedY = (Math.random() - 0.5) * 1;
        }
      }
      
      draw() {
        if (!ctx) return;
        
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rotation);
        ctx.globalAlpha = this.opacity;
        ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
        
        const size = this.size;
        ctx.beginPath();
        ctx.rect(-size/2, -size/2, size, size);
        ctx.fill();
        
        ctx.restore();
      }
    }
    
    const particles = [];
    for (let i = 0; i < 15; i++) {
      particles.push(new BlogParticle());
    }
    
    function animate() {
      if (!ctx) return;
      
      ctx.fillStyle = 'rgba(10, 25, 41, 0.1)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      particles.forEach(particle => {
        particle.update();
        particle.draw();
      });
      
      requestAnimationFrame(animate);
    }
    
    animate();
    
    return () => {
      window.removeEventListener('resize', resizeCanvas);
    };
  }, []);

  const blogPosts = [
    {
      id: 1,
      title: "The Rising Importance of Digital Privacy",
      excerpt: "In an increasingly connected world, protecting your digital privacy has never been more crucial...",
      author: "Privacy Expert",
      date: "2024-03-15",
      category: "Privacy Trends",
      readTime: "5 min read",
      image: "https://images.pexels.com/photos/4050315/pexels-photo-4050315.jpeg",
      path: "/blog/privacy-importance"
    },
    {
      id: 2,
      title: "Understanding Data Protection Laws in 2026",
      excerpt: "A comprehensive guide to the latest privacy regulations and how they affect you...",
      author: "Legal Analyst",
      date: "2024-03-10",
      category: "Privacy Laws",
      readTime: "8 min read",
      image: "https://images.pexels.com/photos/5380642/pexels-photo-5380642.jpeg",
      path: "/blog/data-protection-laws-2026"
    },
    {
      id: 3,
      title: "Top Privacy Tools for Social Media",
      excerpt: "Essential tools and techniques to enhance your privacy across social platforms...",
      author: "Tech Specialist",
      date: "2024-03-05",
      category: "Tools & Tips",
      readTime: "6 min read",
      image: "https://images.pexels.com/photos/6963944/pexels-photo-6963944.jpeg",
      path: "/blog/privacy-tools-social-media"
    },
    {
      id: 4,
      title: "How to Protect Your Children's Privacy Online",
      excerpt: "Practical strategies for parents to safeguard their children's digital footprint...",
      author: "Family Privacy Advocate",
      date: "2024-02-28",
      category: "Family Protection",
      readTime: "7 min read",
      image: "https://images.pexels.com/photos/5380659/pexels-photo-5380659.jpeg",
      path: "/blog/children-privacy-protection"
    },
    {
      id: 5,
      title: "The Hidden Cost of 'Free' Services",
      excerpt: "Understanding the privacy trade-offs when using free online services and platforms...",
      author: "Digital Rights Researcher",
      date: "2024-02-20",
      category: "Digital Economy",
      readTime: "9 min read",
      image: "https://images.pexels.com/photos/5380674/pexels-photo-5380674.jpeg",
      path: "/blog/hidden-cost-free-services"
    },
    {
      id: 6,
      title: "Privacy-Focused Browsers Compared",
      excerpt: "An in-depth analysis of browsers designed to protect your privacy while surfing the web...",
      author: "Tech Reviewer",
      date: "2024-02-15",
      category: "Tools & Tips",
      readTime: "10 min read",
      image: "https://images.pexels.com/photos/4050303/pexels-photo-4050303.jpeg",
      path: "/blog/privacy-browsers-comparison"
    },
    {
      id: 7,
      title: "Privacy Laws: 2025 Outlook",
      excerpt: "What to expect in the evolving landscape of privacy regulations in the coming year...",
      author: "Privacy Law Expert",
      date: "2024-04-15",
      category: "Privacy Legislation",
      readTime: "8 min read",
      image: "https://images.pexels.com/photos/5380642/pexels-photo-5380642.jpeg",
      path: "/blog/privacy-laws-2025"
    },
    {
      id: 8,
      title: "Workplace Privacy: Your Rights and Protections",
      excerpt: "Understanding your privacy rights as an employee and how to protect your personal data in the workplace...",
      author: "Workplace Privacy Advocate",
      date: "2024-12-15",
      category: "Workplace & Legal",
      readTime: "8 min read",
      image: "https://images.pexels.com/photos/4050315/pexels-photo-4050315.jpeg",
      path: "/blog/workplace-privacy"
    }
  ];

  const categories = [
    { name: "Privacy Trends", count: 12 },
    { name: "Privacy Laws", count: 8 },
    { name: "Tools & Tips", count: 15 },
    { name: "Family Protection", count: 6 },
    { name: "Digital Economy", count: 4 },
    { name: "Privacy Legislation", count: 7 },
    { name: "Workplace & Legal", count: 5 }
  ];

  const filteredPosts = selectedCategory 
    ? blogPosts.filter(post => post.category === selectedCategory)
    : blogPosts;

  const postsToDisplay = filteredPosts.slice(0, displayedPosts);
  const hasMorePosts = displayedPosts < filteredPosts.length;

  const handleLoadMore = () => {
    setDisplayedPosts(prev => Math.min(prev + 6, filteredPosts.length));
  };

  const handleCategoryClick = (categoryName) => {
    setSelectedCategory(prev => prev === categoryName ? null : categoryName);
    setDisplayedPosts(6);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubscribe = (email) => {
    if (email && !subscribedEmails.includes(email.toLowerCase())) {
      const updated = [...subscribedEmails, email.toLowerCase()];
      setSubscribedEmails(updated);
      localStorage.setItem('blog-subscriptions', JSON.stringify(updated));
      success('Thank you for subscribing!');
      return true;
    }
    showError('You are already subscribed with this email.');
    return false;
  };

  return (
    <PageLayout
      title="Privacy Blog"
      subtitle="Stay informed about privacy news, tips, and best practices"
      heroBackground={true}
      backgroundType="blog"
      breadcrumbs={[
        { label: 'Blog', path: '/blog' }
      ]}
    >
      <canvas 
        ref={canvasRef}
        className="absolute inset-0 w-full h-full opacity-20 pointer-events-none"
        style={{ display: 'none' }}
      />

      <Section>
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="lg:w-3/4">
            <div className="mb-8">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  id="blog-search"
                  name="search"
                  placeholder="Search blog posts..."
                  className="w-full py-3 pl-10 pr-4 border border-gray-300 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-slate-800 text-gray-900 dark:text-white"
                />
              </div>
            </div>

            {selectedCategory && (
              <div className="mb-4" role="status" aria-live="polite">
                <button
                  type="button"
                  onClick={() => setSelectedCategory(null)}
                  className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 text-sm font-medium flex items-center"
                  aria-label={`Clear filter: ${selectedCategory}`}
                >
                  ← Clear filter: {selectedCategory}
                </button>
              </div>
            )}
            {postsToDisplay.length === 0 ? (
              <div className="text-center py-12" role="status" aria-live="polite">
                <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h4 className="text-lg font-medium text-gray-600 dark:text-gray-300 mb-2">No posts found</h4>
                <p className="text-gray-500 dark:text-gray-400 mb-4">
                  {selectedCategory 
                    ? `No posts found in the "${selectedCategory}" category.` 
                    : 'No blog posts available at the moment.'}
                </p>
                {selectedCategory && (
                  <button
                    type="button"
                    onClick={() => setSelectedCategory(null)}
                    className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-medium"
                  >
                    View all posts
                  </button>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8" aria-label="Blog posts">
                {postsToDisplay.map((post) => (
                <Card
                  key={post.id}
                  animate
                  className="overflow-hidden flex flex-col h-full"
                >
                  <div className="h-48 overflow-hidden">
                    <img 
                      src={post.image} 
                      alt={post.title} 
                      className="w-full h-full object-cover transition-transform hover:scale-105"
                    />
                  </div>
                  <div className="p-6 flex flex-col flex-grow">
                    <div className="mb-4">
                      <span className="inline-block px-3 py-1 bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-full text-sm font-medium">
                        {post.category}
                      </span>
                    </div>
                    
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                      {post.title}
                    </h3>
                    
                    <p className="text-gray-600 dark:text-gray-300 mb-4 flex-grow">
                      {post.excerpt}
                    </p>
                    
                    <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400 mb-4">
                      <div className="flex items-center">
                        <User className="h-4 w-4 mr-1" />
                        {post.author}
                      </div>
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-1" />
                        {new Date(post.date).toLocaleDateString()}
                      </div>
                    </div>
                    
                    <Link to={post.path} className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-medium flex items-center">
                      Read More
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </div>
                </Card>
                ))}
              </div>
            )}

            {hasMorePosts && (
              <div className="flex justify-center">
                <button 
                  className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white py-2 px-6 rounded-lg transition-colors"
                  onClick={handleLoadMore}
                >
                  Load More Posts
                </button>
              </div>
            )}
          </div>

          <div className="lg:w-1/4">
            <Card className="p-6 mb-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Categories</h3>
              <ul className="space-y-2">
                {categories.map((category, index) => (
                  <li key={index}>
                    <Link 
                      to="/blog" 
                      className={`flex items-center justify-between py-2 transition-colors ${
                        selectedCategory === category.name
                          ? 'text-blue-600 dark:text-blue-400 font-semibold'
                          : 'text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400'
                      }`}
                      onClick={(e) => {
                        e.preventDefault();
                        handleCategoryClick(category.name);
                      }}
                    >
                      <span>{category.name}</span>
                      <span className="bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-gray-300 text-xs px-2 py-1 rounded-full">
                        {category.count}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </Card>

            <Card className="p-6 mb-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Popular Posts</h3>
              <div className="space-y-4">
                {blogPosts.slice(0, 3).map((post) => (
                  <Link key={post.id} to={post.path} className="flex items-start group">
                    <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                      <img 
                        src={post.image} 
                        alt={post.title} 
                        className="w-full h-full object-cover transition-transform group-hover:scale-105"
                      />
                    </div>
                    <div className="ml-3">
                      <h4 className="font-medium text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                        {post.title}
                      </h4>
                      <div className="flex items-center text-xs text-gray-500 dark:text-gray-400 mt-1">
                        <Calendar className="h-3 w-3 mr-1" />
                        {new Date(post.date).toLocaleDateString()}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Subscribe to Our Blog</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                Get the latest privacy news and tips delivered to your inbox.
              </p>
              <div className="space-y-3">
                <input
                  type="email"
                  id="blog-subscribe-email"
                  name="email"
                  placeholder="Enter your email"
                  className="w-full p-2 border border-gray-300 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-slate-800 text-gray-900 dark:text-white"
                  autoComplete="email"
                />
                <button 
                  className="w-full bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white py-2 rounded-lg transition-colors"
                  onClick={(e) => {
                    e.preventDefault();
                    const emailInput = document.getElementById('blog-subscribe-email');
                    const email = emailInput?.value?.trim();
                    if (email) {
                      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                      if (emailRegex.test(email)) {
                        if (handleSubscribe(email)) {
                          emailInput.value = '';
                        }
                      } else {
                        showError('Please enter a valid email address');
                      }
                    } else {
                      showError('Please enter your email address');
                    }
                  }}
                >
                  Subscribe
                </button>
              </div>
            </Card>
          </div>
        </div>
      </Section>
    </PageLayout>
  );
};

export default BlogPage;

