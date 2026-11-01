import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import ProductGrid from '../components/product/ProductGrid.jsx';
import { collectionService } from '../services/collectionService.js';
import { fadeUp, viewportOnce } from '../animations/variants.js';

export default function CollectionDetail() {
  const { slug } = useParams();
  const [collection, setCollection] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    collectionService
      .getBySlug(slug)
      .then((data) => setCollection(data.collection))
      .catch(() => setCollection(null))
      .finally(() => setLoading(false));
  }, [slug]);

  if (!loading && !collection) {
    return <div className="mx-auto max-w-8xl px-5 py-24 text-center font-body text-char/60">Collection not found.</div>;
  }

  return (
    <div>
      <section className="relative flex h-[50vh] min-h-[360px] items-end overflow-hidden bg-graphite">
        {collection?.bannerImage?.url && (
          <img src={collection.bannerImage.url} alt={collection.name} className="absolute inset-0 h-full w-full object-cover opacity-80" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-graphite via-graphite/30 to-transparent" />
        <motion.div variants={fadeUp} initial="hidden" animate="show" className="relative z-10 px-5 pb-12 md:px-12">
          <span className="eyebrow text-chalk/80">Collection</span>
          <h1 className="mt-2 font-display text-4xl font-semibold text-chalk md:text-5xl">{collection?.name}</h1>
          {collection?.tagline && <p className="mt-2 max-w-lg font-body text-chalk/70">{collection.tagline}</p>}
        </motion.div>
      </section>

      <div className="mx-auto max-w-8xl px-5 py-14 md:px-8">
        <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={viewportOnce}>
          <ProductGrid products={collection?.products} loading={loading} />
        </motion.div>
      </div>
    </div>
  );
}
