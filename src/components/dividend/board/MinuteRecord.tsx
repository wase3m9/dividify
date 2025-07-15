
import { Button } from "@/components/ui/button";
import { FileText, Trash2 } from "lucide-react";
import type { MinuteRecord } from "./types";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface MinuteRecordProps {
  record: MinuteRecord;
  onDelete: (id: string) => void;
  onDownload: (record: MinuteRecord, format: 'pdf' | 'docx') => void;
}

export const MinuteRecordItem = ({ record, onDelete, onDownload }: MinuteRecordProps) => {
  return (
    <div key={record.id} className="p-4 border rounded-lg">
      <div className="flex justify-between items-start">
        <div className="grid grid-cols-2 gap-x-8 gap-y-2 text-sm">
          <div className="text-gray-500">Meeting Type:</div>
          <div>{record.meeting_type}</div>
          
          <div className="text-gray-500">Meeting Date:</div>
          <div>{new Date(record.meeting_date).toLocaleDateString()}</div>
          
          <div className="text-gray-500">Attendees:</div>
          <div>{record.attendees.join(', ')}</div>
          
          <div className="text-gray-500">Resolutions:</div>
          <div>{record.resolutions.length} resolution(s)</div>
          
          <div className="text-gray-500">Created:</div>
          <div>{new Date(record.created_at).toLocaleDateString()}</div>
        </div>
        <div className="flex gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="text-[#9b87f5] hover:text-[#9b87f5] hover:bg-[#9b87f5]/10"
              >
                <FileText className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => onDownload(record, 'pdf')}>
                Download PDF
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onDownload(record, 'docx')}>
                Download Word
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onDelete(record.id)}
            className="text-red-500 hover:text-red-500 hover:bg-red-500/10"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};
