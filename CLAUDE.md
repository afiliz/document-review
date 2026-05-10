# CLAUDE.md — HomeVision Document Review Page

## Project Context

You're an engineer at HomeVision, a proptech company that uses AI to validate appraisal and compliance documents submitted by clients. A PM has handed you the following ticket:

---

**From:** Product Manager
**To:** Frontend Engineering
**Subject:** Review Page — MVP Build

Hey! We're launching the Document Review product next quarter and I need the Review Page built out. The backend team is still wrapping up the API, so you'll be working against a mock for now — I've included the shape below.

The core job: after a document gets processed by our AI, reviewers land on this page and need to understand what's wrong with it, navigate to the relevant pages in the PDF, and either fix things and re-upload or (if only minor stuff is flagged) go ahead and submit.

Design is open — we don't have a Figma yet. Use your judgment. It should feel like a professional internal tool, not a consumer app.

One hard constraint: **users cannot submit if there are any critical or major issues outstanding.** Minor issues can be ignored. Make sure that's crystal clear in the UI.

Let me know if you have questions — otherwise, ship it!

— Product Manager

---

## Your Task

Build the **Review Page** for HomeVision's Document Review product as a React + TypeScript application.

## Mock API

The API is not ready. Simulate the fetch by importing or loading the mock response directly. Treat it as if it came from `GET /api/reviews/:id`.

**Mock file:** `review_mock.json` (included in this repo)

**Key response fields:**

| Field | Description |
|---|---|
| `name` | File name of the uploaded document |
| `uploaded_at` | ISO timestamp of the latest version upload |
| `status` | One of: `created`, `processing`, `on_review`, `submitted` |
| `version` | Integer — increments each time a new document is uploaded |
| `user` | `{ id, first_name, last_name }` — the user who uploaded the document |
| `issues` | Array of issues (see below) |
| `document.pdf_url` | URL to the PDF file |
| `document.pages` | Array of `{ page_num, height, width }` |

**Issue object:**

```ts
interface Issue {
  id: string;
  title: string;
  description: string;
  severity: "critical" | "major" | "minor";
  page: number;
}
```

**Local PDF:** Replace `document.pdf_url` with the path to `example_document.pdf` (included in this repo).

## Acceptance Criteria

- [ ] The PDF renders inline and is **searchable via CMD+F / Ctrl+F** (use a native embed or `react-pdf` with text layer enabled)
- [ ] Issues are displayed with their severity (`critical`, `major`, `minor`) clearly distinguished
- [ ] Clicking an issue navigates to the relevant page in the PDF viewer
- [ ] **Submit is disabled** when any `critical` or `major` issues exist
- [ ] The UI clearly communicates what is blocking submission
- [ ] `minor` issues can be acknowledged/ignored — they do not block submission
- [ ] Document metadata is shown: file name, version, upload date, assigned user

## Business Logic

| Severity | Blocks submission? | User action required? |
|---|---|---|
| `critical` | Yes | Must fix in source system and re-upload |
| `major` | Yes | Must fix in source system and re-upload |
| `minor` | No | Can be ignored |

Re-uploads are handled on a separate Upload Page (not in scope). The Submit button on this page should call `POST /api/reviews/:id/submit` — since the endpoint isn't ready, **mock or no-op the call** but keep the handler wired.

## Tech Stack

- **React + TypeScript** (Vite or Next.js preferred)
- Any UI component library is fine (shadcn/ui, Radix, MUI, etc.)
- PDF rendering: `react-pdf`, native `<embed>`, or `<iframe>` — searchability is the hard requirement
- State management: local component state is fine for MVP

## Project Structure (suggested)

```
src/
  components/
    ReviewPage.tsx        # Top-level page component
    IssueList.tsx         # Sidebar or panel listing all issues
    IssueCard.tsx         # Individual issue — severity badge, title, description, page link
    PdfViewer.tsx         # PDF embed with page navigation
    SubmitButton.tsx      # Disabled state + tooltip explaining blockers
    StatusBanner.tsx      # Summary bar: X critical, Y major, Z minor
  data/
    review_mock.json      # Mock API response
  types/
    review.ts             # TypeScript interfaces (Review, Issue, Document, User)
  App.tsx
  main.tsx
```

## UX Notes from PM

- The layout should support working through a list of issues while keeping the PDF visible — a **split-panel layout** (issues list on the left, PDF on the right, or vice versa) is the natural pattern here
- The submit blocking state should be **impossible to miss** — don't just disable a button and leave it at that
- Issue severity should be visually distinct at a glance — color coding is expected
- Users will often have 10–25 issues to work through; the list needs to be scannable

## Out of Scope (for this ticket)

- Authentication / login
- Upload flow (separate page, separate ticket)
- Backend API integration (mock only)
- Multi-user / collaboration features
- Mobile layout (desktop-first is fine)

## Bonus (if time allows)

- Filter issues by severity
- Mark minor issues as "acknowledged"
- Animated transitions when navigating between issue pages in the PDF
- A progress indicator showing how many issues remain

## Running the Project

```bash
npm install
npm run dev
```

PDF and mock data should be served from the `public/` directory or imported directly — no backend required.

---

*This ticket was created by Priya Nair. Questions? Ping #frontend-eng in Slack.*
