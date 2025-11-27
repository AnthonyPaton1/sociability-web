import { Star, StarHalf } from "lucide-react";

interface StarRatingProps {
  rating: number;
  showNumber?: boolean;
  size?: "sm" | "md" | "lg";
}

export default function StarRating({ 
  rating, 
  showNumber = true,
  size = "md" 
}: StarRatingProps) {
  const sizeClasses = {
    sm: "h-3 w-3",
    md: "h-4 w-4",
    lg: "h-5 w-5",
  };

  const iconSize = sizeClasses[size];

  // Round to nearest 0.5
  const roundedRating = Math.round(rating * 2) / 2;
  const fullStars = Math.floor(roundedRating);
  const hasHalfStar = roundedRating % 1 !== 0;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

  return (
    <div className="flex items-center gap-1">
      <div className="flex items-center">
        {/* Full stars */}
        {[...Array(fullStars)].map((_, i) => (
          <Star
            key={`full-${i}`}
            className={`${iconSize} fill-yellow-400 text-yellow-400`}
          />
        ))}
        
        {/* Half star */}
        {hasHalfStar && (
          <StarHalf className={`${iconSize} fill-yellow-400 text-yellow-400`} />
        )}
        
        {/* Empty stars */}
        {[...Array(emptyStars)].map((_, i) => (
          <Star
            key={`empty-${i}`}
            className={`${iconSize} text-gray-300`}
          />
        ))}
      </div>
      
      {showNumber && (
        <span className="text-sm text-muted-foreground ml-1">
          {rating.toFixed(1)}
        </span>
      )}
    </div>
  );
}