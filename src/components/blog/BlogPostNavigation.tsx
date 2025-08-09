import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface NavigationPost {
  slug: string;
  title: string;
}

interface BlogPostNavigationProps {
  prev: NavigationPost | null;
  next: NavigationPost | null;
  currentTitle: string;
}

export const BlogPostNavigation = ({ prev, next, currentTitle }: BlogPostNavigationProps) => {
  const handleShare = async () => {
    const url = window.location.href;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: currentTitle,
          url,
        });
      } catch (error) {
        // User cancelled or error occurred
        await copyToClipboard(url);
      }
    } else {
      await copyToClipboard(url);
    }
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success("Link copied to clipboard!");
    } catch (error) {
      toast.error("Failed to copy link");
    }
  };

  return (
    <div className="border-t pt-8 mt-12">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="flex-1">
          {prev && (
            <Link 
              to={`/blog/${prev.slug}`}
              className="flex items-center gap-2 text-[#9b87f5] hover:text-[#7E69AB] transition-colors group"
            >
              <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              <div className="text-left">
                <div className="text-sm text-gray-500">Previous Article</div>
                <div className="font-medium text-sm">{prev.title}</div>
              </div>
            </Link>
          )}
        </div>

        <div className="flex-shrink-0">
          <Button
            onClick={handleShare}
            variant="outline"
            size="sm"
            className="flex items-center gap-2"
          >
            <Share2 className="w-4 h-4" />
            Share Article
          </Button>
        </div>

        <div className="flex-1 text-right">
          {next && (
            <Link 
              to={`/blog/${next.slug}`}
              className="flex items-center justify-end gap-2 text-[#9b87f5] hover:text-[#7E69AB] transition-colors group"
            >
              <div className="text-right">
                <div className="text-sm text-gray-500">Next Article</div>
                <div className="font-medium text-sm">{next.title}</div>
              </div>
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};