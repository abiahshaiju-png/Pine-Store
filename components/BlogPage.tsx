import React from 'react';
import { BLOG_POSTS } from '../constants';
import { BlogPost } from '../types';

const TwitterIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
        <path d="M23.954 4.569c-.885.389-1.83.654-2.825.775 1.014-.611 1.794-1.574 2.163-2.723-.951.555-2.005.959-3.127 1.184-.896-.959-2.173-1.559-3.591-1.559-2.717 0-4.92 2.203-4.92 4.917 0 .39.045.765.127 1.124C7.691 8.094 4.066 6.13 1.64 3.161c-.427.722-.666 1.561-.666 2.475 0 1.71.87 3.213 2.188 4.096-.807-.026-1.566-.248-2.228-.616v.061c0 2.385 1.693 4.374 3.946 4.827-.413.111-.849.171-1.296.171-.314 0-.615-.03-.916-.086.631 1.953 2.445 3.377 4.604 3.417-1.68 1.319-3.809 2.105-6.102 2.105-.39 0-.779-.023-1.17-.067 2.189 1.394 4.768 2.209 7.557 2.209 9.054 0 13.999-7.496 13.999-13.986 0-.21 0-.42-.015-.63.961-.689 1.8-1.56 2.46-2.548l-.047-.02z" />
    </svg>
);

const FacebookIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
        <path d="M22.675 0h-21.35C.59 0 0 .59 0 1.325v21.35C0 23.41.59 24 1.325 24H12.82v-9.294H9.692v-3.622h3.128V8.413c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.313h3.587l-.467 3.622h-3.12V24h6.116c.735 0 1.325-.59 1.325-1.325V1.325C24 .59 23.41 0 22.675 0z" />
    </svg>
);

const ShareButtons: React.FC<{ post: BlogPost }> = ({ post }) => {
    const postUrl = `https://thepinestore.example.com/blog/${post.id}`;
    const encodedUrl = encodeURIComponent(postUrl);
    const encodedTitle = encodeURIComponent(`Check out this article from The Pine Store: ${post.title}`);

    const twitterShareUrl = `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`;
    const facebookShareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`;

    return (
        <div className="flex items-center gap-3">
            <p className="text-sm font-medium text-gray-500 hidden sm:block">Share:</p>
            <a 
                href={twitterShareUrl} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-gray-400 hover:text-sky-500 transition-colors"
                aria-label="Share on Twitter"
            >
                <TwitterIcon className="w-5 h-5" />
            </a>
            <a 
                href={facebookShareUrl} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-gray-400 hover:text-blue-600 transition-colors"
                aria-label="Share on Facebook"
            >
                <FacebookIcon className="w-5 h-5" />
            </a>
        </div>
    );
};

const BlogPostCard: React.FC<{ post: BlogPost }> = ({ post }) => {
    return (
        <div className="bg-white rounded-xl shadow-lg overflow-hidden transform hover:scale-105 transition-transform duration-300 ease-in-out flex flex-col">
            <img className="w-full h-56 object-cover" src={post.imageUrl} alt={post.title} />
            <div className="p-6 flex flex-col flex-grow">
                <p className="text-sm text-green-600 font-semibold">{post.date}</p>
                <h3 className="mt-2 text-2xl font-bold text-gray-800">{post.title}</h3>
                <p className="mt-3 text-gray-600 flex-grow">{post.excerpt}</p>
                <div className="mt-6 pt-4 border-t border-gray-100 flex items-center justify-between">
                    <div className="flex items-center">
                        <img className="h-10 w-10 rounded-full object-cover" src={post.authorImageUrl} alt={post.author} />
                        <div className="ml-3">
                            <p className="text-sm font-medium text-gray-900">{post.author}</p>
                        </div>
                    </div>
                    <ShareButtons post={post} />
                </div>
            </div>
        </div>
    );
};

interface BlogPageProps {
  posts: BlogPost[];
}

const BlogPage: React.FC<BlogPageProps> = ({ posts }) => {
  return (
    <main className="container mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h2 className="text-5xl font-bold text-green-800 font-['Pacifico',_cursive]">The Pineapple Post</h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {posts.map((post) => (
          <BlogPostCard key={post.id} post={post} />
        ))}
      </div>
    </main>
  );
};

export default BlogPage;