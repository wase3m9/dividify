import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface NavigationPost {
  slug: string;
  title: string;
}

interface BlogPostNavigationProps {
  prev: NavigationPost | null;
  next: NavigationPost | null;
}

export const BlogPostNavigation = ({ prev, next }: BlogPostNavigationProps) => {
  return (
    <div className="mt-12 flex justify-between items-center">
      {prev && (
        <Link to={`/blog/${prev.slug}`} className="flex items-center gap-2 text-[#9b87f5] hover:text-[#7E69AB]">
          <ChevronLeft className="w-4 h-4" />
          Previous Article
        </Link>
      )}
      {next && (
        <Link to={`/blog/${next.slug}`} className="flex items-center gap-2 text-[#9b87f5] hover:text-[#7E69AB] ml-auto">
          Next Article
          <ChevronRight className="w-4 h-4" />
        </Link>
      )}
    </div>
  );
};