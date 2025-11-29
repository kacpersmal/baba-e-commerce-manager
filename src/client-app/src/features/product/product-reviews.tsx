import mockProductReviews from "./mock-reviews";
import { ProductReviewItem } from "./product-review-item";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
console.log("ŁADUJE SIĘ: product-reviews.tsx");
export default function ProductReviews() {
  console.log("=== EXPORT DZIAŁA: ProductReviews ===");

  return (
    <section className="w-full border rounded-xl bg-background/60 p-6 mt-4 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">Opinie klientów</h2>
        <span className="text-sm text-muted-foreground">
          {mockProductReviews.length} opinii
        </span>
      </div>

      <Separator className="mb-4" />

      <div className="grid gap-4">
        {mockProductReviews.map((review) => (
          <ProductReviewItem key={review.id} review={review} />
        ))}
      </div>

      <div className="mt-6 flex justify-end">
        <Button variant="outline" size="sm">
          Zobacz więcej opinii
        </Button>
      </div>
    </section>
  );
}

