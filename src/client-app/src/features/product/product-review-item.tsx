import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Star } from "lucide-react";
import type { ProductReview } from "./mock-reviews";

export function ProductReviewItem({ review }: { review: ProductReview }) {
  return (
    <Card className="shadow-sm border rounded-lg p-3">

      <CardHeader className="p-0 mb-2">
        <div className="flex items-center justify-between">
          <div className="flex flex-col leading-tight">
            <span className=" text-sm pb-1">{review.author}</span>
            <span className="text-xs text-muted-foreground">{review.date}</span>
          </div>

          <div className="flex items-center gap-0.5">
            {Array.from({ length: 5 }).map((_, index) => (
              <Star
                key={index}
                className={
                  index < review.rating
                    ? "h-3.5 w-3.5 text-yellow-400 fill-yellow-400"
                    : "h-3.5 w-3.5 text-gray-300"
                }
              />
            ))}
          </div>
        </div>

<div className="h-px w-full bg-muted my-1" />
        <h3 className="font-semibold text-sm leading-snug">
          {review.title}
        </h3>

        <p className="text-sm text-muted-foreground leading-snug mt-1">
          {review.content}
        </p>
      </CardHeader>
    </Card>
  );
}