import { useState } from "react";
import { Play, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface VirtualTourProps {
  tourUrl: string;
  propertyTitle: string;
}

export default function VirtualTour({ tourUrl, propertyTitle }: VirtualTourProps) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2">
          <Play className="h-4 w-4" />
          Virtual Tour
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl w-full p-0 overflow-hidden">
        <DialogHeader className="p-4 border-b border-border">
          <DialogTitle>Virtual Tour: {propertyTitle}</DialogTitle>
        </DialogHeader>
        <div className="aspect-video">
          <iframe
            src={tourUrl}
            title={`Virtual tour of ${propertyTitle}`}
            className="w-full h-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
