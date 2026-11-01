import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDownIcon } from '../components/ui/Icons.jsx';

const FAQS = [
  {
    id: 'shipping',
    heading: 'Shipping & returns',
    items: [
      { q: 'How long does shipping take?', a: 'Standard delivery takes 3–5 business days across India. Orders over ₹2,999 ship free.' },
      { q: 'What is your return policy?', a: 'Unworn items with tags can be returned within 30 days of delivery for a full refund.' },
      { q: 'Do you ship internationally?', a: 'Not yet — we currently ship within India only.' },
    ],
  },
  {
    id: 'sizing',
    heading: 'Size guide',
    items: [
      { q: 'How do RONVERO sizes fit?', a: 'Most styles fit true to size. Compression pieces run slightly snug by design — size up if you\u2019re between sizes.' },
      { q: 'What if I ordered the wrong size?', a: 'Free exchanges within 30 days — just start a return from your order history.' },
    ],
  },
  {
    id: 'orders',
    heading: 'Orders & payment',
    items: [
      { q: 'What payment methods do you accept?', a: 'Cards via Stripe, and Cash on Delivery on eligible orders.' },
      { q: 'Can I change my order after placing it?', a: 'Contact us within an hour of ordering and we\u2019ll do our best to adjust it before it ships.' },
    ],
  },
];

export default function FAQ() {
  const [openId, setOpenId] = useState(null);

  return (
    <div className="mx-auto max-w-3xl px-5 py-16 md:px-8">
      <h1 className="font-display text-4xl font-semibold text-char">Frequently asked questions</h1>

      {FAQS.map((section) => (
        <div key={section.id} id={section.id} className="mt-10 scroll-mt-24">
          <h2 className="mb-4 font-display text-xl font-semibold text-char">{section.heading}</h2>
          <div className="flex flex-col divide-y divide-graphite/10 border-y border-graphite/10">
            {section.items.map((item) => {
              const id = `${section.id}-${item.q}`;
              const isOpen = openId === id;
              return (
                <div key={id}>
                  <button
                    type="button"
                    onClick={() => setOpenId(isOpen ? null : id)}
                    className="flex w-full items-center justify-between py-4 text-left font-body text-sm font-medium text-char"
                  >
                    {item.q}
                    <ChevronDownIcon size={16} className={isOpen ? 'rotate-180 transition-transform' : 'transition-transform'} />
                  </button>
                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                      >
                        <p className="pb-4 font-body text-sm text-char/70">{item.a}</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
