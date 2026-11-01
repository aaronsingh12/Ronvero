const SECTIONS = [
  {
    heading: 'Information we collect',
    body: 'When you create an account or place an order, we collect your name, email, phone number, shipping addresses, and order history. Payment details are processed directly by Stripe — we never store your card number.',
  },
  {
    heading: 'How we use it',
    body: 'We use your information to process orders, provide customer support, send order updates, and — only if you opt in — send marketing emails about new drops and offers.',
  },
  {
    heading: 'Cookies & tracking',
    body: 'We use essential cookies to keep you logged in and remember your cart. We do not sell your data to third-party advertisers.',
  },
  {
    heading: 'Your rights',
    body: 'You can request a copy of your data, ask us to correct it, or request deletion of your account at any time by contacting support@ronvero.com.',
  },
  {
    heading: 'Data retention',
    body: 'We retain order records for as long as required for tax and accounting purposes, even if you delete your account.',
  },
];

export default function PrivacyPolicy() {
  return (
    <div className="mx-auto max-w-2xl px-5 py-16 md:px-8">
      <span className="eyebrow">Legal</span>
      <h1 className="mt-2 font-display text-4xl font-semibold text-char">Privacy policy</h1>
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
