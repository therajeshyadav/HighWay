import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import type { Experience } from "@/services/api";
import { getImageSrc } from "@/hooks/useImageImport";

interface ExperienceCardProps {
  experience: Experience;
}

const ExperienceCard = ({ experience }: ExperienceCardProps) => {
  const navigate = useNavigate();

  const borderColorClass = {
    pink: 'border-pink-border',
    yellow: 'border-yellow-border',
    blue: 'border-blue-border',
    green: 'border-green-border'
  }[experience.border_color];

  return (
    <Card className={`overflow-hidden border-4 ${borderColorClass} hover:shadow-lg transition-shadow`}>
      <div className="aspect-[4/3] overflow-hidden">
        <img
          src={getImageSrc(experience.image)}
          alt={experience.title}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="p-4 space-y-3">
        <div className="flex justify-between items-start">
          <h3 className="font-semibold text-lg">{experience.title}</h3>
          <span className="text-sm text-muted-foreground">{experience.location}</span>
        </div>
        <p className="text-sm text-muted-foreground line-clamp-2">
          {experience.description}
        </p>
        <div className="flex justify-between items-center pt-2">
          <div>
            <span className="text-xs text-muted-foreground">From </span>
            <span className="font-bold text-lg">₹{experience.price}</span>
          </div>
          <Button onClick={() => navigate(`/experience/${experience.id}`)}>
            View Details
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default ExperienceCard;
