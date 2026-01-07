export const metadata = {
  title: "Privacy Policy | AI Index Market",
  description:
    "Learn how AI Index Market collects, uses, and protects your personal data.",
};

export default function PrivacyPage() {
  return (
    <main className="container mx-auto max-w-4xl px-4 py-12">
      <div className="prose prose-slate dark:prose-invert max-w-none">
        <h1 className="text-4xl font-bold text-white mb-4">Privacy Policy</h1>
        <p className="text-slate-400 text-sm mb-8">
          Last Updated: January 8, 2026
        </p>

        <section className="mb-8">
          <h2 className="text-2xl font-bold text-white mb-4">Introduction</h2>
          <p className="text-slate-300 leading-relaxed mb-4">
            Welcome to AI Index Market. We respect your privacy and are
            committed to protecting your personal data. This policy explains how
            we handle your information when you use our directory, create an
            account, or vote for tools.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold text-white mb-4">
            Data We Collect
          </h2>
          <ul className="list-disc list-inside text-slate-300 space-y-2 ml-4">
            <li>
              <strong className="text-white">Identity Data:</strong> Email
              address and name (provided via Google/GitHub Auth or Email
              Sign-up).
            </li>
            <li>
              <strong className="text-white">Usage Data:</strong> Information
              about how you use our website, including the tools you view and
              your voting history.
            </li>
            <li>
              <strong className="text-white">Technical Data:</strong> IP
              address, browser type, and device information (collected
              automatically via Supabase/Vercel).
            </li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold text-white mb-4">
            How We Use Your Data
          </h2>
          <ul className="list-disc list-inside text-slate-300 space-y-2 ml-4">
            <li>
              To manage your account and provide access to features like voting
              and submissions.
            </li>
            <li>
              To calculate aggregate "Rank Scores" and "Trending" status for AI
              tools.
            </li>
            <li>To send essential security or account-related emails.</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold text-white mb-4">
            Third-Party Sharing
          </h2>
          <p className="text-slate-300 leading-relaxed mb-4">
            We share data only with essential service providers:
          </p>
          <ul className="list-disc list-inside text-slate-300 space-y-2 ml-4">
            <li>
              <strong className="text-white">Supabase:</strong> For database
              hosting and authentication.
            </li>
            <li>
              <strong className="text-white">Vercel:</strong> For website
              hosting and analytics.
            </li>
          </ul>
          <p className="text-slate-300 leading-relaxed mt-4">
            We do not sell your personal data to third parties.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold text-white mb-4">
            Your Rights (GDPR/CCPA)
          </h2>
          <p className="text-slate-300 leading-relaxed mb-4">
            You have the right to access, correct, or delete your personal data
            at any time via your account settings. For "Right to be Forgotten"
            requests, please contact us at{" "}
            <a
              href="mailto:contact@aimarkets.com"
              className="text-blue-400 hover:text-blue-300 underline"
            >
              contact@aimarkets.com
            </a>
          </p>
        </section>
      </div>
    </main>
  );
}
