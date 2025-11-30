export type ProductReview = {
  id: number;
  author: string;
  rating: number;
  title: string;
  content: string;
  date: string;
};

export const mockProductReviews: ProductReview[] = [
  {
    id: 1,
    author: "Jan Kowalski",
    rating: 5,
    title: "Super jakość za tę cenę",
    content:
      "Laptop działa mega płynnie, ekran sztos, bateria spokojnie na cały dzień pracy.",
    date: "2025-01-10",
  },
  {
    id: 2,
    author: "Anna Nowak",
    rating: 4,
    title: "Ogólnie spoko, ale...",
    content:
      "Sprzęt bardzo dobry, ale paczka przyszła lekko uszkodzona. Na szczęście nic się nie stało.",
    date: "2025-01-08",
  },
  {
    id: 3,
    author: "Kacper Wiśniewski",
    rating: 5,
    title: "Polecam do pracy i nauki",
    content:
      "Cichy, szybki, idealny do programowania i studiów. Zdecydowanie kupiłbym drugi raz.",
    date: "2025-01-03",
  },
];

export default mockProductReviews;