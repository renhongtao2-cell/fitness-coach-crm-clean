import type { Metadata } from "next";
import Link from "next/link";
import { Calendar, User, ArrowRight, Brain, TrendingUp, Users } from "lucide-react";

export const metadata: Metadata = {
  title: "Blog - FitCoach CRM | Fitness Coaching Tips & AI Training Insights",
  description: "Expert tips on fitness coaching, AI training plans, client management, and growing your personal training business. Updated weekly.",
  keywords: ["fitness coaching tips", "AI workout plans", "personal trainer business", "client management", "fitness industry trends"],
};

interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  category: string;
  author: string;
  date: string;
  readTime: string;
  image: string;
  tags: string[];
}

const blogPosts: BlogPost[] = [
  {
    id: "ai-training-plans",
    title: "How AI is Revolutionizing Personal Training Programs",
    excerpt: "Discover how artificial intelligence is transforming the way fitness coaches create personalized training programs for their clients.",
    category: "AI in Fitness",
    author: "FitCoach Team",
    date: "2025-01-15",
    readTime: "5 min read",
    image: "/blog/ai-training.jpg",
    tags: ["AI", "Training Plans", "Personal Training"]
  },
  {
    id: "client-management-tips",
    title: "10 Essential Tips for Managing More Clients Effectively",
    excerpt: "Learn proven strategies to scale your coaching business while maintaining personalized attention for each client.",
    category: "Business Growth",
    author: "Sarah Johnson",
    date: "2025-01-12",
    readTime: "7 min read",
    image: "/blog/client-management.jpg",
    tags: ["Client Management", "Business Tips", "Scaling"]
  },
  {
    id: "progress-tracking",
    title: "The Importance of Progress Tracking in Client Results",
    excerpt: "Why data-driven progress tracking leads to better client outcomes and higher retention rates for fitness professionals.",
    category: "Coaching Insights",
    author: "Mike Chen",
    date: "2025-01-10",
    readTime: "6 min read",
    image: "/blog/progress-tracking.jpg",
    tags: ["Progress Tracking", "Client Results", "Analytics"]
  }
];

function BlogPostCard({ post }: { post: BlogPost }) {
  return (
    <Link href={`/blog/${post.id}`} className="group block bg-white rounded-2xl border border-gray-100 hover:border-gray-200 hover:shadow-xl transition-all overflow-hidden">
      <div className="h-48 bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center">
        <div className="text-center">
          <Brain className="w-12 h-12 text-blue-600 mx-auto mb-2" />
          <span className="text-sm font-medium text-blue-600">{post.category}</span>
        </div>
      </div>
      <div className="p-6">
        <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
          <div className="flex items-center gap-1">
            <Calendar className="w-4 h-4" />
            {new Date(post.date).toLocaleDateString()}
          </div>
          <div>{post.readTime}</div>
        </div>
        <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors">
          {post.title}
        </h3>
        <p className="text-gray-600 mb-4 leading-relaxed">
          {post.excerpt}
        </p>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
              {post.author.split(' ').map(n => n[0]).join('')}
            </div>
            <span className="text-sm font-medium text-gray-700">{post.author}</span>
          </div>
          <div className="flex items-center gap-1 text-blue-600 font-medium text-sm group-hover:gap-2 transition-all">
            Read More
            <ArrowRight className="w-4 h-4" />
          </div>
        </div>
      </div>
    </Link>
  );
}

export default function BlogPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-16">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">FitCoach CRM Blog</h1>
          <p className="text-xl text-blue-100 max-w-2xl mx-auto">
            Expert insights on fitness coaching, AI training, and growing your personal training business.
          </p>
        </div>
      </header>

      {/* Blog Content */}
      <main className="max-w-6xl mx-auto px-4 py-16">
        {/* Featured Categories */}
        <section className="mb-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { icon: Brain, title: "AI in Fitness", count: "12 articles", color: "from-purple-500 to-pink-500" },
              { icon: TrendingUp, title: "Business Growth", count: "8 articles", color: "from-green-500 to-emerald-500" },
              { icon: Users, title: "Client Management", count: "15 articles", color: "from-blue-500 to-cyan-500" }
            ].map((category, index) => (
              <div key={index} className={`bg-gradient-to-br ${category.color} rounded-2xl p-6 text-white cursor-pointer hover:shadow-xl transition-shadow`}>
                <category.icon className="w-8 h-8 mb-3" />
                <h3 className="text-xl font-bold mb-1">{category.title}</h3>
                <p className="text-white/80 text-sm">{category.count}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Latest Posts */}
        <section>
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Latest Articles</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogPosts.map((post) => (
              <BlogPostCard key={post.id} post={post} />
            ))}
          </div>
        </section>

        {/* Newsletter Signup */}
        <section className="mt-20 bg-white rounded-3xl p-8 md:p-12 border border-gray-100">
          <div className="text-center max-w-2xl mx-auto">
            <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">Stay Ahead of the Curve</h3>
            <p className="text-gray-600 mb-8">
              Get the latest fitness coaching tips, AI insights, and business growth strategies delivered to your inbox weekly.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <button className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl hover:shadow-lg transition-all">
                Subscribe
              </button>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-12">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center">
              <Brain className="w-5 h-5 text-white" />
            </div>
            <span className="text-white font-bold text-xl">FitCoach</span>
          </div>
          <p className="text-sm">© 2025 FitCoach CRM. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
