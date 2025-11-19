-- Insert missing blog posts from sampleBlogPosts array
-- Note: Only inserting 5 posts that are missing from the database

-- Post 1: Dividend Mistakes 2025
INSERT INTO blog_posts (title, content, slug, published_at, meta_description, author)
VALUES (
  '5 Dividend Mistakes UK Directors Still Make in 2025 (and how to fix them)',
  'For limited company directors, dividends can be wonderfully tax-efficient — until they''re not. Here''s how to stay compliant, tidy, and stress-free.

**Table of Contents:**
• Why this matters to UK company directors
• Mistake #1: Paying dividends without distributable profits
• Mistake #2: Missing paperwork (vouchers & board minutes)
• Mistake #3: "What''s in the bank?" withdrawals
• Mistake #4: Forgetting to plan for the personal tax bill
• Mistake #5: Unequal dividends without the right share structure
• Best-practice checklist for 2025/26
• FAQs

** Why this matters to UK company directors **

Dividends are distributions of post-tax profits. Get them right and you''ll usually take home more after tax than via pure salary. Get them wrong and you could face:

- Overdrawn director''s loan account (and potential extra charges/tax).
- Reclassification of drawings as salary by HMRC if records are poor.
- Cashflow shocks when the personal tax bill lands.

Dividify helps you prevent this by producing proper dividend vouchers and board minutes in seconds — branded for your firm or your client''s company.

** Mistake #1: Paying dividends without distributable profits **

The issue: Seeing cash in the bank and assuming a dividend is fine. It isn''t. Dividends must come from accumulated, post-tax profits (per Companies Act rules). Loans, VAT money, or supplier funds ≠ profit.

Symptoms:
- Big drawings during the year; year-end shows profit wasn''t enough.
- Director''s Loan Account (DLA) goes overdrawn.

Risks:
- Extra corporation tax charges/benefit-in-kind complications if treated as a loan.
- You personally owe the company money — messy if the company struggles.

Fix:
- Monthly profit check: Run a quick P&L and confirm retained profits.
- Ring-fence CT: Park an estimate of corporation tax so you don''t overstate profits.
- Only declare what profits genuinely support.

** Mistake #2: Missing paperwork (vouchers & board minutes) **

The issue: HMRC can challenge "dividends" without supporting documentation. Every declaration should have:

- Board minutes authorising the dividend.
- Dividend voucher stating the amount, date, shareholder, and share class.

Fix:
- Use Dividify to generate clean, compliant PDFs (board minutes + vouchers) with your firm''s branding. Store them alongside your management accounts for audit-ready records.

** Mistake #3: "What''s in the bank?" withdrawals **

The issue: Irregular amounts taken ad hoc ("I''ll just transfer £2k this month"). This makes you lose track of what you''ve actually drawn and risks an overdrawn DLA if profits dip.

Fix:
- Set a fixed dividend (monthly or quarterly) that the numbers comfortably support.
- Use a standing order so it''s disciplined and predictable.
- If the year goes brilliantly, pay a separate one-off bonus dividend — with the paperwork — rather than constantly changing your regular amount.

** Mistake #4: Forgetting to plan for the personal tax bill **

The issue: Dividends are paid gross. The personal tax on those dividends usually arrives much later (via Self Assessment and possibly payments on account). If you haven''t planned, you may need an extra dividend at the worst time.

Fix:
- "Tax yourself" on payday: When the dividend lands, move a % into a savings pot for your future tax bill.
- Ask your accountant to estimate your blended effective rate based on your total income and the current dividend allowance/bands.
- Review the pot each quarter and top up if profits — or your drawings — have changed.

** Mistake #5: Unequal dividends without the right share structure **

The issue: Want to pay different amounts to different shareholders (e.g., spouse or co-founder)? With ordinary shares of the same class, dividends must be paid per share, equally. Paying unevenly without the right paperwork/share classes can create problems.

Fix:
- Speak to your accountant about alphabet shares (A, B, etc.) or formal dividend waivers where appropriate — and ensure the minutes reflect the decision.
- Keep company registers and share certificates up to date so your paperwork matches reality.

** Best-practice checklist for 2025/26 **

- ✅ Confirm accumulated, post-tax profits before you declare.
- ✅ Ring-fence CT estimates each month so profits are realistic.
- ✅ Fix a regular dividend; avoid impulse transfers.
- ✅ Generate board minutes + vouchers every time (Dividify makes this 60-second work).
- ✅ Set aside a portion of each dividend for your personal tax.
- ✅ If paying shareholders differently, use the right share structure and record it properly.
- ✅ Store everything neatly — if HMRC asks, you can show the full trail in minutes.

** FAQs **

1) Can I pay a dividend if the bank account is healthy but last year''s accounts show small profits?

Not unless you have current and retained profits to cover it. Bank balance isn''t the test; distributable profits are.

2) Do I need board minutes for every dividend?

Yes — plus a dividend voucher. The admin is light with Dividify and protects you if asked for evidence.

3) How often should I pay dividends — monthly or quarterly?

Either is fine. The key is that the amount is sustainable and supported by profits. Many directors prefer monthly for cashflow predictability.

4) We want different payouts between spouses. Is that allowed?

Only with the correct share structure (e.g., alphabet shares) or a properly executed waiver. Get advice before paying.

5) What if we accidentally over-declared this year?

Speak to your accountant quickly. Options exist (e.g., repaying drawings, reclassifying, or dealing with a DLA), but the earlier you act, the cheaper it is.

** Try Dividify free **

Create branded dividend vouchers and board minutes in under a minute, keep yourself compliant, and save hours of admin each month.',
  'dividend-mistakes-2025',
  '2025-09-24T09:00:00Z',
  'Avoid costly dividend mistakes UK directors make in 2025. Learn about distributable profits, proper documentation, and tax planning.',
  'Dividify Team'
)
ON CONFLICT (slug) DO NOTHING;

-- Post 2: Dividend Tax 2025/26
INSERT INTO blog_posts (title, content, slug, published_at, meta_description, author)
VALUES (
  'Dividend Tax in 2025/26: What UK Directors Need to Know About Rates and Allowances',
  'A comprehensive guide to UK dividend taxation for company directors in the 2025/26 tax year, covering rates, allowances, and planning strategies.',
  'dividend-tax-in-2025-26-what-uk-directors-need-to-know-about-rates-and-allowances',
  '2025-08-15T09:00:00Z',
  'Complete guide to UK dividend tax rates and allowances for 2025/26. Essential reading for limited company directors.',
  'Dividify Team'
)
ON CONFLICT (slug) DO NOTHING;

-- Post 3: Retained Profits vs Dividends
INSERT INTO blog_posts (title, content, slug, published_at, meta_description, author)
VALUES (
  'Retained Profits vs Dividend Payouts: How UK Directors Should Decide in 2025/26',
  'Strategic guidance for UK company directors on balancing retained profits with dividend distributions for optimal business growth and tax efficiency.',
  'retained-profits-vs-dividend-payouts-how-uk-directors-should-decide-in-2025-26',
  '2025-07-20T09:00:00Z',
  'Learn how UK directors should balance retained profits and dividend payouts in 2025/26 for optimal tax efficiency and business growth.',
  'Dividify Team'
)
ON CONFLICT (slug) DO NOTHING;

-- Post 4: Director's Loan Accounts
INSERT INTO blog_posts (title, content, slug, published_at, meta_description, author)
VALUES (
  'Director''s Loan Accounts: Tax Implications and Common Pitfalls in 2025',
  'Essential guide to director''s loan accounts for UK limited company directors, covering tax implications, S455 charges, and common mistakes to avoid.',
  'director-loan-accounts-tax-implications-and-common-pitfalls-in-2025',
  '2025-06-10T09:00:00Z',
  'Understanding director''s loan accounts, S455 tax charges, and avoiding common pitfalls in 2025. Essential guide for UK company directors.',
  'Dividify Team'
)
ON CONFLICT (slug) DO NOTHING;

-- Post 5: Salary vs Dividends
INSERT INTO blog_posts (title, content, slug, published_at, meta_description, author)
VALUES (
  'Salary vs Dividends: What''s the Most Tax-Efficient Mix for UK Directors in 2025/26?',
  'Comprehensive analysis of the optimal salary and dividend mix for UK company directors in 2025/26, considering NIC, income tax, and dividend tax.',
  'salary-vs-dividends-what-s-the-most-tax-efficient-mix-for-uk-directors-in-2025-26',
  '2025-05-05T09:00:00Z',
  'Discover the most tax-efficient salary and dividend mix for UK directors in 2025/26. Detailed breakdown of NIC, income tax, and dividend tax.',
  'Dividify Team'
)
ON CONFLICT (slug) DO NOTHING;

-- Post 6: Dividend Waivers
INSERT INTO blog_posts (title, content, slug, published_at, meta_description, author)
VALUES (
  'Dividend Waivers: When and How to Use Them Effectively',
  'Expert guide on using dividend waivers for UK companies, including legal requirements, tax implications, and when they''re appropriate.',
  'dividend-waivers-when-and-how-to-use-them-effectively',
  '2025-04-12T09:00:00Z',
  'Learn when and how to use dividend waivers effectively. Complete guide to legal requirements and tax implications for UK directors.',
  'Dividify Team'
)
ON CONFLICT (slug) DO NOTHING;