import { Navigation } from "@/components/Navigation";
import { Card } from "@/components/ui/card";
import { DividendFormHeader } from "@/components/dividend/DividendFormHeader";
import { BoardMinutesDetailsForm } from "@/components/dividend/BoardMinutesDetailsForm";

const BoardMinutesForm = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <div className="container mx-auto px-4 py-24">
        <div className="max-w-3xl mx-auto space-y-8">
          <DividendFormHeader
            title="Create Board Minutes"
            description="Record the details of your board meeting."
            progress={100}
          />

          <Card className="p-6">
            <BoardMinutesDetailsForm />
          </Card>
        </div>
      </div>
    </div>
  );
};

export default BoardMinutesForm;