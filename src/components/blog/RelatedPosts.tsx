import { Link } from "react-router-dom";

interface RelatedPost {
  id: string;
  slug: string;
  title: string;
}

interface RelatedPostsProps {
  posts: RelatedPost[];
}

export const RelatedPosts = ({ posts }: RelatedPostsProps) => {
  if (!posts || posts.length === 0) return null;

  return (
    <div className="mt-16">
      <h2 className="text-2xl font-bold text-[#9b87f5] mb-6">Related Articles</h2>
      <div className="grid gap-8 md:grid-cols-3">
        {posts.map((post) => (
          <Link 
            key={post.id} 
            to={`/blog/${post.slug}`}
            className="group"
          >
            <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
              <img
                src="/lovable-uploads/e4cf415e-3cbf-4e3b-9378-b22b2a036b60.png"
                alt="Blog post thumbnail"
                className="w-full h-40 object-cover"
              />
              <div className="p-4">
                <h3 className="font-semibold text-[#9b87f5] group-hover:text-[#7E69AB] transition-colors">
                  {post.title}
                </h3>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};