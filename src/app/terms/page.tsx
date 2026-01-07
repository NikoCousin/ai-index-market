export const metadata = {
  title: "Terms & Conditions | AI Index Market",
  description:
    "Read the terms and conditions for using AI Index Market's directory and services.",
};

export default function TermsPage() {
  return (
    <main className="container mx-auto max-w-4xl px-4 py-12">
      <div className="prose prose-slate dark:prose-invert max-w-none">
        <h1 className="text-4xl font-bold text-white mb-4">
          Terms and Conditions
        </h1>
        <p className="text-slate-400 text-sm mb-8">
          Last Updated: January 8, 2026
        </p>

        <section className="mb-8">
          <h2 className="text-2xl font-bold text-white mb-4">
            1. Agreement to Terms
          </h2>
          <p className="text-slate-300 leading-relaxed mb-4">
            By accessing or using AI Index Market (the "Service"), you agree to
            be bound by these Terms and Conditions. These terms constitute a
            legally binding agreement between you and AI Index Market. If you do
            not agree, you must cease use of the Service immediately.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold text-white mb-4">
            2. "Index" and "Market Cap" Disclaimer
          </h2>
          <p className="text-slate-300 leading-relaxed mb-4">
            <strong className="text-white">Informational Purposes Only:</strong>{" "}
            The Service uses terminology such as "Market Cap," "Rank Score,"
            "Trending," and "Index" to categorize and rank Artificial
            Intelligence tools. This is for informational and entertainment
            purposes only.
          </p>
          <p className="text-slate-300 leading-relaxed mb-4">
            <strong className="text-white">Not Financial Advice:</strong>{" "}
            Nothing on this site constitutes financial, investment, or
            professional advice. The "Market Cap" shown does not represent the
            actual valuation, stock price, or financial health of any company.
          </p>
          <p className="text-slate-300 leading-relaxed mb-4">
            <strong className="text-white">Accuracy of Data:</strong> Rankings
            are based on a combination of community votes and internal metrics.
            We do not warrant the accuracy or timeliness of any tool's data or
            performance metrics.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold text-white mb-4">
            3. User Accounts and Conduct
          </h2>
          <p className="text-slate-300 leading-relaxed mb-4">
            <strong className="text-white">Account Responsibility:</strong> You
            are responsible for maintaining the confidentiality of your login
            credentials (via Google, GitHub, or Email).
          </p>
          <p className="text-slate-300 leading-relaxed mb-4">
            <strong className="text-white">Anti-Manipulation Policy:</strong>{" "}
            You agree not to manipulate the ranking system. Prohibited actions
            include, but are not limited to:
          </p>
          <ul className="list-disc list-inside text-slate-300 space-y-2 ml-4 mb-4">
            <li>Using bots, scripts, or automated tools to vote.</li>
            <li>
              Creating multiple accounts to "pump" a tool's score.
            </li>
            <li>Selling or trading votes for compensation.</li>
          </ul>
          <p className="text-slate-300 leading-relaxed mb-4">
            <strong className="text-white">Termination:</strong> We reserve the
            right to delete votes, ban accounts, or shadow-ban tools that we
            believe, in our sole discretion, are engaging in "sybil attacks" or
            score manipulation.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold text-white mb-4">
            4. Submissions and User Content
          </h2>
          <p className="text-slate-300 leading-relaxed mb-4">
            <strong className="text-white">Ownership:</strong> You retain
            ownership of any content you submit (tool descriptions, reviews).
            However, by submitting content, you grant us a perpetual,
            worldwide, royalty-free license to display and distribute that
            content.
          </p>
          <p className="text-slate-300 leading-relaxed mb-4">
            <strong className="text-white">Prohibited Content:</strong> You may
            not submit tools that are illegal, promote hate speech, or consist
            of "malware."
          </p>
          <p className="text-slate-300 leading-relaxed mb-4">
            <strong className="text-white">Vetting:</strong> We reserve the
            right to edit tool descriptions for clarity or to remove any tool
            from our directory without prior notice.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold text-white mb-4">
            5. Third-Party Links
          </h2>
          <p className="text-slate-300 leading-relaxed mb-4">
            Our Service contains links to third-party AI tools and websites. We
            do not own, control, or endorse these third parties. Your use of
            any AI tool listed on our index is subject to that tool's specific
            terms and privacy policy.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold text-white mb-4">
            6. Limitation of Liability
          </h2>
          <p className="text-slate-300 leading-relaxed mb-4 font-semibold">
            TO THE MAXIMUM EXTENT PERMITTED BY LAW, AI INDEX MARKET SHALL NOT
            BE LIABLE FOR ANY INDIRECT, INCIDENTAL, OR CONSEQUENTIAL DAMAGES
            ARISING FROM YOUR USE OF THE SERVICE OR THE USE OF ANY AI TOOLS
            LISTED IN OUR DIRECTORY. THE SERVICE IS PROVIDED "AS IS" WITHOUT
            WARRANTIES OF ANY KIND.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold text-white mb-4">
            7. Changes to Terms
          </h2>
          <p className="text-slate-300 leading-relaxed mb-4">
            We may update these terms at any time. Your continued use of the
            site after changes are posted constitutes acceptance of the new
            terms.
          </p>
        </section>
      </div>
    </main>
  );
}

