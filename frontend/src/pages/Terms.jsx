const SECTIONS = [
  {
    heading: 'Orders & acceptance',
    body: 'Placing an order is an offer to purchase. We reserve the right to refuse or cancel any order, including in cases of suspected fraud or pricing errors.',
  },
  {
    heading: 'Pricing',
    body: 'All prices are listed in INR and include applicable taxes unless stated otherwise. We reserve the right to change prices at any time without notice.',
  },
  {
    heading: 'Shipping & delivery',
    body: 'Estimated delivery times are provided in good faith and are not guaranteed. RONVERO is not liable for delays caused by couriers or events outside our control.',
  },
  {
    heading: 'Returns & refunds',
    body: 'Unworn items with tags attached may be returned within 30 days of delivery. Refunds are issued to the original payment method within 5–7 business days of receiving the return.',
  },
  {
    heading: 'Intellectual property',
    body: 'All content on this site — including designs, photography, and copy — is the property of RONVERO and may not be reproduced without permission.',
  },
  {
    heading: 'Limitation of liability',
    body: 'RONVERO is not liable for indirect or consequential damages arising from the use of our products or this website.',
  },
];

export default function Terms() {
  return (
    <div className="mx-auto max-w-2xl px-5 py-16 md:px-8">
      <span className="eyebrow">Legal</span>
      <h1 className="mt-2 font-display text-4xl font-semibold text-char">Terms of service</h1>
      <p className="mt-3 font-mono text-xs text-char/50">Last updated: July 2026</p>

      <div className="mt-10 flex flex-col gap-8">
        {SECTIONS.map((s) => (
          <div key={s.heading}>
            <h2 className="font-display text-xl font-semibold text-char">{s.heading}</h2>
            <p className="mt-2 font-body text-sm leading-relaxed text-char/70">{s.body}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
