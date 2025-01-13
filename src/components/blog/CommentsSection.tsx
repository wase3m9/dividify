import { MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";

export const CommentsSection = () => {
  return (
    <div className="mt-16">
      <h2 className="text-2xl font-bold text-[#9b87f5] mb-6">Comments</h2>
      <div className="bg-gray-50 p-6 rounded-lg">
        <div className="flex items-center gap-4 mb-4">
          <MessageSquare className="w-5 h-5 text-gray-400" />
          <span className="text-gray-600">Be the first to comment</span>
        </div>
        <textarea
          className="w-full p-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#9b87f5]"
          placeholder="Share your thoughts..."
          rows={4}
        />
        <Button className="mt-4 bg-[#9b87f5] hover:bg-[#7E69AB]">
          Post Comment
        </Button>
      </div>
    </div>
  );
};