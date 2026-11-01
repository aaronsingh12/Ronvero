import { useEffect, useState } from 'react';
import CategoryCard from '../components/category/CategoryCard.jsx';
import { CategoryGridSkeleton } from '../components/home/sectionSkeletons.jsx';
import { categoryService } from '../services/categoryService.js';
import { useCatalogStore } from '../store/useCatalogStore.js';

export default function Categories() {
  const catalogVersion = useCatalogStore((state) => state.version);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    categoryService
      .list()
      .then((data) => setCategories(data.categories))
      .finally(() => setLoading(false));
  }, [catalogVersion]);

  return (
    <div className="mx-auto max-w-8xl px-5 py-10 md:px-8">
      <span className="eyebrow">Browse</span>
      <h1 className="mt-2 font-display text-3xl font-semibold text-char sm:text-4xl">All categories</h1>

      <div className="mt-10">
        {loading ? (
          <CategoryGridSkeleton />
        ) : (
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
            {categories.map((category) => (
              <CategoryCard key={category._id} category={category} size="lg" />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
