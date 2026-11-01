import { useEffect, useState } from 'react';
import Rating from '../../components/ui/Rating.jsx';
import { TrashIcon } from '../../components/ui/Icons.jsx';
import api from '../../services/axiosInstance.js';

export default function AdminReviews() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = () =>
    api
      .get('/reviews')
      .then((res) => setReviews(res.data.reviews))
      .finally(() => setLoading(false));

  useEffect(() => {
    load();
  }, []);

  const handleDelete = async (review) => {
    if (!window.confirm('Remove this review?')) return;
    await api.delete(`/reviews/${review._id}`);
    load();
  };

  if (loading) return <p className="font-body text-sm text-char/50">Loading reviews…</p>;

  return (
    <div className="rounded-2xl border border-graphite/10 bg-mist">
      {reviews.length === 0 && <p className="p-6 font-body text-sm text-char/50">No reviews yet.</p>}
      <div className="flex flex-col divide-y divide-graphite/10">
        {reviews.map((r) => (
          <div key={r._id} className="flex items-start justify-between gap-4 p-5">
            <div>
              <div className="flex items-center gap-3">
                <p className="font-body text-sm font-medium text-char">{r.user?.name}</p>
                <span className="font-mono text-xs text-char/40">on {r.product?.name}</span>
              </div>
              <Rating value={r.rating} size={12} className="mt-1.5" />
              {r.title && <p className="mt-2 font-body text-sm font-medium text-char">{r.title}</p>}
              <p className="mt-1 font-body text-sm text-char/70">{r.comment}</p>
            </div>
            <button type="button" onClick={() => handleDelete(r)} aria-label="Delete review">
              <TrashIcon size={16} className="text-char/40 hover:text-ember" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
