import { Tag } from "lucide-react";

interface TagListProps {
  tags: string[];
}

export const TagList = ({ tags }: TagListProps) => {
  return (
    <div className="flex items-center space-x-2 mt-8 pt-6 border-t">
      <Tag className="w-4 h-4 text-gray-500" />
      <span className="text-sm font-medium text-gray-700">Tags:</span>
      <div className="flex flex-wrap gap-2">
        {tags.map((tag, index) => (
          <span
            key={index}
            className="px-3 py-1 bg-gray-100 hover:bg-[#9b87f5] hover:text-white 
                       text-gray-700 text-sm rounded-full transition-all duration-200 
                       cursor-pointer transform hover:scale-105"
          >
            {tag}
          </span>
        ))}
      </div>
    </div>
  );
};