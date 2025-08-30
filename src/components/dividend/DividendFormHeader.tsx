import { Card } from "@/components/ui/card";
interface DividendFormHeaderProps {
  title: string;
  description: string;
  progress: number;
}
export const DividendFormHeader = ({
  title,
  description,
  progress
}: DividendFormHeaderProps) => {
  return <div className="space-y-8">
      <div className="w-full bg-gray-200 rounded-full h-2.5">
        
      </div>
      <div className="space-y-4">
        <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
        <p className="text-gray-600">{description}</p>
      </div>
    </div>;
};