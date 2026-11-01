import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import { ArrowRightIcon, CheckIcon } from '../ui/Icons.jsx';
import { fadeUp, viewportOnce } from '../../animations/variants.js';

const schema = z.object({
  email: z.string().min(1, 'Email is required').email('Enter a valid email address'),
});

export default function Newsletter() {
  const [submitted, setSubmitted] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(schema) });

  const onSubmit = async () => {
    // No dedicated "subscribers" collection in the current schema — this is
    // wired to validate + submit cleanly and is ready to point at an ESP
    // (Mailchimp/Klaviyo) or a new backend route when one exists.
    await new Promise((resolve) => setTimeout(resolve, 600));
    setSubmitted(true);
    reset();
  };

  return (
    <section className="relative overflow-hidden bg-graphite px-5 py-20 md:px-8 md:py-28">
      <motion.div
        variants={fadeUp}
        initial="hidden"
        whileInView="show"
        viewport={viewportOnce}
        className="mx-auto flex max-w-2xl flex-col items-center gap-6 text-center"
      >
        <span className="eyebrow">Stay in the loop</span>
        <h2 className="font-display text-3xl font-semibold text-chalk md:text-4xl">
          10% off your first order, plus early access to drops.
        </h2>

        {submitted ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex items-center gap-2 rounded-full bg-chalk/10 px-6 py-3 text-chalk"
          >
            <CheckIcon size={18} className="text-ember" /> You're on the list.
          </motion.div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="w-full max-w-md">
            <div className="flex items-center gap-2 rounded-full bg-chalk/10 p-1.5 pl-5">
              <input
                {...register('email')}
                type="email"
                placeholder="you@example.com"
                className="w-full bg-transparent font-body text-sm text-chalk outline-none placeholder:text-chalk/40"
              />
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex shrink-0 items-center gap-1.5 rounded-full bg-ember px-5 py-2.5 font-body text-sm font-semibold text-chalk transition-transform hover:scale-[1.02] disabled:opacity-60"
              >
                {isSubmitting ? 'Joining…' : 'Join'} <ArrowRightIcon size={14} />
              </button>
            </div>
            {errors.email && <p className="mt-2 font-mono text-xs text-ember">{errors.email.message}</p>}
          </form>
        )}
      </motion.div>
    </section>
  );
}
