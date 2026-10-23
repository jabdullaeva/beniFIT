# beniFIT - AI Health-Benefits Assistant
> **Tagline:** Your benefits. In plain sight.  
> **Essence:** Make your health and benefit information simple, so you can keep more of what you're entitled to.

Built for hackathon demonstration with Google AI Studio and Gemini.

---

## 1. Brand System & Design Tokens
Implemented directly from the official **beniFIT Brand System Board**:
- **Primary Brand:** `#4F46E5` (Bold Cobalt / Indigo)
- **App Canvas Background:** `#F8FAFC` (Clean Cool Slate Cream)
- **Headlines & Text:** `#0F172A` (Deep Navy, 12.6:1 WCAG AAA Contrast)
- **Card Surfaces:** `#FFFFFF` with `#E2E8F0` borders
- **Confirmed Amounts:** `#10B981` (Emerald Green)
- **May Qualify Amounts:** `#F59E0B` (Warm Golden Amber)
- **Warning Indicator:** `#F97316` (Warm Orange)
- **Error / Discrepancy:** `#EF4444` (Crimson Red)
- **Mascot (Beni):** Golden yellow cloud buddy (`#FBBF24` / `#F59E0B`) with 6 distinct emotional poses (`default`, `waving`, `may_qualify`, `confirmed`, `warning`, `thinking`, `not_sure`).

---

## 2. Six Navigable Screens
1. **Connect (`/connect`):** Upload & connect flow for health insurance, employer benefits guide, and medical bills.
2. **Beni Found (`/home`):** Shows separate subtotals for *May Qualify* and *Confirmed*, never combining them without distinct labels. Every amount marked `Demo data • Information, not advice.`
3. **Planner (`/planner`):** Actionable savings plan with category filters (*May Qualify*, *Confirmed*), single primary action per card, deadlines, and smart calendar input.
4. **Bill Check (`/bills`):** Side-by-side audit of medical bill against insurance claim EOBs with duplicate charge detection and an automated dispute letter.
5. **Ask Beni (`/chat`):** Grounded AI chat assistant citing verified document sources, with safety guardrails for clinical refusal and uncertainty routing.
6. **Language Settings (`/language`):** Live multilingual toggle supporting **English**, **Español**, **Français**, and **Українська** with full reactive translations.

---

## 3. Money & Safety Guardrails
- **Strict Separation:** Potential savings (*May Qualify*) and confirmed document findings (*Confirmed*) are kept separate on every card, total, and screen.
- **Unconfirmed Framing:** Never promises guaranteed payouts; clearly framed as *"May Qualify"* and *"Information, not advice."*
- **Uncertainty Deferrals:**
  - For Medicare questions: *"I'm not sure. Call 1-800-MEDICARE."*
  - For Medicaid / Employer plans: *"I'm not sure. Contact [verified contact for this source]."*
- **Clinical Refusal:** Refuses clinical diagnosis, medication dosage, or prescription advice, routing users to licensed physicians or pharmacists.

---

## 4. Setup & Running Locally
```bash
# Install dependencies
npm install

# Run dev server on port 3000
npm run dev

# Run deterministic test suite (36 tests)
npm test

# Type-check and lint
npm run lint
```

---

## 5. Demo Limitations & Outstanding Integrations
- **Simulated Insurer APIs:** Due to CMS/FHIR sandbox access controls, insurer data is pulled from realistic synthetic bundles (`ClearPath PPO`, `HarborCare Medicaid`, and `SilverPath Medicare`).
- **Demo Data Notice:** All beneficiaries (Maria, Ana, Joe) and invoices are fictional demonstrations for presentation purposes.
