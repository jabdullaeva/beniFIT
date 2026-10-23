# beniFIT: Product Architecture & Implementation Guide

> *"Know what you're owed, before, during and after."*

## 1. Overview & Positioning

**beniFIT** replaces clunky benefits screener questionnaires with an assistant (**Beni**) that lives directly in your calendar/planner.
- Users connect their health insurance once (Patient Access API / FHIR) and upload their employee benefits guide (16-page Brightway booklet).
- As users plan their everyday lives (*"MRI Tuesday"*, *"Book Uber to hospital"*, *"Stressed about Mom"*, *"Find a gym"*), Beni speaks up right at the moment it matters with plain words and **one clear action button**.

---

## 2. Meet Beni

Beni is a small, warm helper who sits in your planner and only speaks up when it matters:
- **Friendly:** Talks like a friend (*"Hey Maria, heads up..."*) instead of insurance jargon.
- **Plain:** Explains everything in simple words, with the dollar amount up front.
- **Proactive:** Comes to you inside your day, so you never need to remember to check.
- **On your side:** Works only for you, never for the insurer or the employer.
- **Careful:** Says *"you may be eligible"* and cites the exact page or rule.
- **Action-Oriented:** Every message ends with one clear button: **Call**, **Open app**, **Claim it**, or **Draft dispute**.

---

## 3. The Three Data Sources

| Source | How Beni Gets It | What It Tells Beni |
|---|---|---|
| **Health Insurance** | Patient Access API (FHIR standard / CMS Blue Button) | Plan, member ID, coverage dates, claims and EOBs: billed, allowed, paid, owed. |
| **Benefits Guide** | Uploaded 16-page employer booklet read by Gemini | Buried perks: free rides, $75 wellness claims, counseling, FSA rules, tuition aid. |
| **Planner** | Member adds daily plans as usual (*"Dentist next month"*, *"Find a gym"*) | When each benefit matters so Beni can speak up proactively. |

---

## 4. Demo Story: Maria (Age 38, Brightway Technologies)

1. **Connect:** Maria connects ClearPath PPO and uploads the 16-page Brightway booklet. Beni: *"Got it! I read your plan and your 16-page guide."*
2. **First Summary:** Beni reveals: *"You have 6 benefits you've never used, worth about $1,100 this year."*
3. **Plan the Week:** Maria plans *"MRI Tuesday, book Uber to the hospital"*. Beni: *"City Imaging is in-network, about $180. And your plan covers free rides to appointments. Book one?"*
4. **Life Plan:** Maria plans *"Stressed about Mom, maybe find a gym"*. Beni: *"5 free counseling sessions, backup elder care at $6 an hour, and gyms from $10 a month."*
5. **Alert:** A countdown badge: *"$420 left in your FSA expires Dec 31. Glasses, sunscreen and first aid kits count."*
6. **The Bill:** Maria uploads a $480 hospital bill for her MRI. Beni: *"Your insurance says you owe $180. That's $300 too much. I drafted a message to the billing office."*
7. **Close:** Total on screen: **"This year, Beni found Maria $1,400."**

> **Presenter Line:** *"Maria didn't ask about benefits. She just planned her week. Beni found $1,400 she was already paying for, or about to overpay."*

---

## 5. Medical Bill Rules (Page 4 & 5)

Rule: **Never pay more than the "You Owe" amount on the insurance EOB.**
- **Billed by Hospital:** $2,400 (List price, ignore)
- **Allowed by Plan:** $900 (Negotiated price)
- **Plan Paid (80%):** $720
- **Maria Owes per EOB (20%):** $180
- **Hospital Statement Received:** $480 → **$300 overcharge caught!**
- 1-Click dispute draft automatically cites EOB #CP-99412, No Surprises Act protections, and contractual allowed amounts.
