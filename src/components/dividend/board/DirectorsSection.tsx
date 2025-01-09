import { FC } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users } from "lucide-react";

interface Director {
  id: string;
  full_name: string;
  position: string | null;
}

interface DirectorsSectionProps {
  directors: Director[];
}

export const DirectorsSection: FC<DirectorsSectionProps> = ({ directors }) => {
  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Users className="h-5 w-5 text-[#9b87f5]" />
          <h2 className="text-xl font-semibold">Directors</h2>
        </div>
        <Button 
          variant="outline"
          className="text-[#9b87f5] border-[#9b87f5]"
          onClick={() => {/* TODO: Implement director form */}}
        >
          Add Director
        </Button>
      </div>
      {directors.length > 0 ? (
        <div className="space-y-2">
          {directors.map((director) => (
            <div key={director.id} className="p-4 border rounded-lg">
              <p><span className="font-medium">Name:</span> {director.full_name}</p>
              <p><span className="font-medium">Position:</span> {director.position}</p>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500">No directors added yet.</p>
      )}
    </Card>
  );
};