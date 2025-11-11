// src/routes/category.$category.tsx

import { createFileRoute, Link } from "@tanstack/react-router";
import { categories } from "@/features/navbar/categories";

export const Route = createFileRoute("/category/$category")({
    component: CategoryPage,
});

function CategoryPage() {
    const { category } = Route.useParams();

    const current = categories.find(
        (c) => c.href === `/category/${category}`
    );

    if (!current) {
        return (
            <div className="container mx-auto py-10 text-xl">
                Kategoria nie istnieje.
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-10">
            <h1 className="text-3xl font-semibold mb-6">{current.title}</h1>

            <ul className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {current.sub.map((item) => (
                    <li key={item.href}>
                        <Link
                            to={item.href}
                            className="block border rounded px-4 py-3 hover:bg-orange-500/10 hover:text-orange-600 transition"
                        >
                            {item.title}
                        </Link>
                    </li>
                ))}
            </ul>
        </div>
    );
}
