// Utils
import { useState } from "react";
import { cn } from "@/lib/utils";

// Components
import { Star } from "lucide-react";

const StarRating = ({
  maxRating = 5,
  className,
  onSelected,
}: {
  maxRating?: number;
  className?: string;
  onSelected: (rating: number) => void;
}) => {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);

  const handleRating = (rating: number) => {
    setRating(rating);
    onSelected(rating);
  };

  return (
    <div className={cn("flex", className)}>
      {Array.from({ length: maxRating }).map((_, index) => (
        <Star
          key={index}
          className={cn("mr-1 h-4 w-4 cursor-pointer", {
            "fill-main-500 stroke-main-400":
              index < rating || index < hoverRating,
            "text-dog-300": index >= rating || index >= hoverRating,
          })}
          onMouseEnter={() => setHoverRating(index + 1)}
          onMouseLeave={() => setHoverRating(0)}
          onClick={() => handleRating(index + 1)}
        />
      ))}
    </div>
  );
};

export default StarRating;
