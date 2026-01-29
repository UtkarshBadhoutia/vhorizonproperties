import { Link } from "react-router-dom";
import { Phone, Mail } from "lucide-react";
import { Agent } from "@/lib/types";
import { Button } from "@/components/ui/button";

interface AgentCardProps {
  agent: Agent;
  showContact?: boolean;
}

export default function AgentCard({ agent, showContact = true }: AgentCardProps) {
  return (
    <div className="bg-card rounded-xl overflow-hidden shadow-card">
      <div className="aspect-square overflow-hidden">
        <img
          src={agent.image}
          alt={agent.name}
          className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
        />
      </div>
      <div className="p-4 sm:p-5">
        <h3 className="font-semibold text-base sm:text-lg">{agent.name}</h3>
        <p className="text-primary text-xs sm:text-sm font-medium">{agent.role}</p>
        <p className="text-muted-foreground text-xs sm:text-sm mt-1">{agent.specialty}</p>

        {agent.bio && (
          <p className="text-xs sm:text-sm text-muted-foreground mt-2 sm:mt-3 line-clamp-3">
            {agent.bio}
          </p>
        )}

        {showContact && (
          <div className="flex gap-2 mt-3 sm:mt-4">
            <Button asChild variant="outline" size="sm" className="flex-1 text-xs sm:text-sm">
              <a href={`tel:${agent.phone}`}>
                <Phone className="h-3 w-3 sm:h-3.5 sm:w-3.5 mr-1" />
                Call
              </a>
            </Button>
            <Button asChild variant="outline" size="sm" className="flex-1 text-xs sm:text-sm">
              <a href={`mailto:${agent.email}`}>
                <Mail className="h-3 w-3 sm:h-3.5 sm:w-3.5 mr-1" />
                Email
              </a>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
