import { Clock, Share2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface BlogPostHeaderProps {
  title: string;
  readingTime: number;
  publishedAt: string;
  content: string;
}

export const BlogPostHeader = ({ title, readingTime, publishedAt, content }: BlogPostHeaderProps) => {
  const { toast } = useToast();

  const handleShare = async () => {
    const shareData = {
      title,
      text: content.substring(0, 100) + '...',
      url: window.location.href,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(window.location.href);
        toast({
          title: "Link copied to clipboard!",
          description: "You can now share this article with others.",
        });
      }
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  return (
    <div>
      <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4" />
          {readingTime} min read
        </div>
        <button 
          onClick={handleShare}
          className="flex items-center gap-2 hover:text-[#9b87f5] transition-colors"
        >
          <Share2 className="w-4 h-4" />
          Share
        </button>
      </div>

      <h1 className="text-4xl font-bold text-[#9b87f5] mb-6 text-left">{title}</h1>
      
      <div className="text-sm text-gray-600 mb-8 text-left">
        Published on {new Date(publishedAt).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        })}
      </div>
    </div>
  );
};