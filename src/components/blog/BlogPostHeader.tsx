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
        // Use native share if available (mobile devices)
        await navigator.share(shareData);
      } else {
        // Fallback to email share for desktop
        const emailSubject = encodeURIComponent(title);
        const emailBody = encodeURIComponent(`Check out this article: ${window.location.href}\n\n${content.substring(0, 100)}...`);
        window.location.href = `mailto:?subject=${emailSubject}&body=${emailBody}`;
        
        toast({
          title: "Share options opened",
          description: "You can now share this article via email.",
        });
      }
    } catch (error) {
      console.error('Error sharing:', error);
      toast({
        title: "Sharing failed",
        description: "Unable to share the article. Please try again.",
        variant: "destructive",
      });
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
          className="flex items-center gap-2 hover:text-[#9b87f5] transition-colors cursor-pointer"
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