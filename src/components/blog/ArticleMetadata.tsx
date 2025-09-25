import { Calendar, Clock, User } from "lucide-react";

interface ArticleMetadataProps {
  publishedAt: string;
  author: string;
  readTime?: string;
}

export const ArticleMetadata = ({ publishedAt, author, readTime }: ArticleMetadataProps) => {
  const formatDate = (dateString: string) => {
    // For the dividend mistakes 2025 post, return specific date
    if (dateString === '2025-09-10T10:00:00Z') {
      return '10th September 2025';
    }
    
    return new Date(dateString).toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
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