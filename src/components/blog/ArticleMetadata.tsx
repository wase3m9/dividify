import { Calendar, Clock, User } from "lucide-react";

interface ArticleMetadataProps {
  publishedAt: string;
  author: string;
  readTime?: string;
}

export const ArticleMetadata = ({ publishedAt, author, readTime }: ArticleMetadataProps) => {
  const formatDate = (dateString: string) => {
    // For blog posts, return the specific date format requested
    return "24 September 2025";
  };

  return (
    <div className="flex items-center space-x-6 text-sm text-gray-600 mb-6">
      <div className="flex items-center space-x-2">
        <Calendar className="w-4 h-4" />
        <span>{formatDate(publishedAt)}</span>
      </div>
      
      <div className="flex items-center space-x-2">
        <User className="w-4 h-4" />
        <span>{author}</span>
      </div>
      
      {readTime && (
        <div className="flex items-center space-x-2">
          <Clock className="w-4 h-4" />
          <span>{readTime}</span>
        </div>
      )}
    </div>
  );
};