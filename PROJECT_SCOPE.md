# NurseHub - Project Scope Document

> A nursing resource platform built for students, by students.

---

## 1. Project Overview

### Vision
A subscription-based platform providing nursing students with curated, exam-focused study materials. No fluff, no 1,000-page textbooks - just what you need to pass.

### Target Audience
- Nursing students (certificate, diploma, BSN, ADN programs)
- Students on clinical rotations
- NCLEX exam candidates
- Students who want structured, efficient study resources

### Core Value Proposition
**One login → everything needed to pass nursing school**

---

## 2. Problem Statement

Students currently:
- Don't know what to prioritize studying
- Get overwhelmed with disorganized PDFs and materials
- Share outdated notes between cohorts
- Panic before exams with no structured revision plan
- Waste time hunting for quality resources
- Pay for expensive textbooks they barely use

NurseHub solves this by providing:
- Curated, exam-focused content
- Organized by topic, year, and exam type
- Mobile-first for studying anywhere
- Affordable subscription model

---

## 3. Business Model

### Primary: Subscription Model

| Plan | Price | Billing |
|------|-------|---------|
| Monthly | $9.99/month | Recurring |
| Yearly | $79.99/year | Best value (~33% savings) |

**Subscription includes:**
- All study notes
- All past exam questions & practice tests
- Care plan templates
- Drug guides
- NCLEX prep materials
- Clinical rotation guides
- New uploads automatically

### Secondary: Pay-Per-Resource

For visitors and last-minute students:

| Item | Price |
|------|-------|
| Single past exam | $4.99 |
| Care plan bundle | $9.99 |
| Exam prep kit | $19.99 |

**Smart Upsell:** After a single purchase, prompt:
> "You've spent $9.99. Get unlimited access for just $9.99/month."

---

## 4. Content Categories

### Study Notes
- Short, scannable format
- Exam-focused content
- Topic-based organization
- Bullet-point style
- Visual aids and diagrams

### Practice Exams & Questions
- NCLEX-style questions
- With rationales/explanations
- Organized by topic and difficulty
- Progress tracking

### Care Plans
- Ready-to-use templates
- Common diagnoses
- Nursing process breakdowns
- Clinical examples

### Drug Guides
- Indications & contraindications
- Side effects
- Nursing considerations
- Dosage calculations
- Drug classifications

### NCLEX Prep
- Test-taking strategies
- Common question types
- High-yield topics
- Practice simulations

### Clinical Rotation Guides
- What to expect by unit
- Documentation tips
- Common procedures
- Survival tips from real nurses

---

## 5. Tech Stack

| Layer | Technology | Rationale |
|-------|------------|-----------|
| Framework | Next.js 14 (App Router) | Full-stack, great SEO, server components |
| Database | PostgreSQL (Neon) | Serverless, scales with Vercel |
| ORM | Prisma | Type-safe, great DX |
| Auth | NextAuth.js v5 | Flexible, supports multiple providers |
| Payments | Stripe | Industry standard, handles subscriptions |
| File Storage | Vercel Blob | Integrated, secure signed URLs |
| Styling | Tailwind CSS + shadcn/ui | Fast development, consistent UI |
| Hosting | Vercel | Optimized for Next.js |

---

## 6. Database Schema

```
Users
├── id, email, password_hash, name
├── role (STUDENT | ADMIN)
├── year_of_study, program_type
├── school (optional)
└── subscription_status, subscription_ends_at

Subscriptions
├── id, user_id, plan (MONTHLY | YEARLY)
├── status (ACTIVE | CANCELLED | EXPIRED)
├── stripe_subscription_id, stripe_customer_id
└── starts_at, ends_at

Resources
├── id, title, description, slug
├── type (NOTES | PRACTICE_EXAM | CARE_PLAN | DRUG_GUIDE | NCLEX | CLINICAL)
├── category_id, difficulty_level
├── file_url, preview_url, thumbnail_url
├── is_free, price (for pay-per-resource)
└── download_count, created_at

Categories
├── id, name, slug, description
└── parent_id (for subcategories)

Purchases (pay-per-resource)
├── id, user_id, resource_id
├── amount, stripe_payment_id
└── created_at

Bundles
├── id, name, description, price
├── resources[] (many-to-many)
└── is_active

Downloads (tracking)
├── id, user_id, resource_id
└── downloaded_at

SavedResources (bookmarks)
├── user_id, resource_id
└── saved_at
```

---

## 7. User Flow

```
1. Visit site
2. See "Study Resources for Nursing Students"
3. Browse by:
   - Content type (notes, exams, care plans)
   - Topic/category
   - Year/level
4. Click resource
5. See preview (first page or excerpt)
6. Paywall: Subscribe or buy single resource
7. Complete payment via Stripe
8. Download or view instantly
```

**Key UX Principles:**
- No friction, no confusion
- Mobile-first design
- Fast page loads
- Clear pricing
- Instant access after payment

---

## 8. Feature Roadmap

### Phase 1: MVP (Weeks 1-2)
**Goal: Launch with core functionality**

- [ ] Landing page with value proposition
- [ ] User registration & login (email/password)
- [ ] Resource listing with filters
- [ ] Resource detail page with preview
- [ ] Stripe subscription checkout
- [ ] Basic paywall for premium content
- [ ] Admin: Upload resources
- [ ] Admin: Manage categories

### Phase 2: Payments & Polish (Weeks 3-4)
**Goal: Complete payment flows**

- [ ] Pay-per-resource (single purchases)
- [ ] Subscription management (cancel, upgrade)
- [ ] Download tracking
- [ ] "Save for later" bookmarks
- [ ] Search functionality
- [ ] Mobile optimization pass

### Phase 3: Growth Features (Weeks 5-6)
**Goal: User engagement & growth**

- [ ] Bundle creation and sales
- [ ] Smart upsell prompts
- [ ] Social sharing buttons
- [ ] User progress/history
- [ ] Analytics dashboard (admin)
- [ ] Referral system

### Phase 4: Advanced (Future)
**Goal: Scale and expand**

- [ ] Email notifications (new resources, reminders)
- [ ] Discussion/Q&A per resource
- [ ] Progress tracking ("mark as studied")
- [ ] Institution/group plans
- [ ] Mobile app (React Native)
- [ ] AI-powered study recommendations

---

## 9. Page Structure

```
Public Pages:
├── / (landing)
├── /pricing
├── /resources (browse all)
├── /resources/[type] (notes, practice-exams, etc.)
├── /resources/[type]/[slug] (single resource)
├── /login
├── /register

Protected Pages (logged in):
├── /dashboard (user home)
├── /my-library (purchased + saved)
├── /account (profile, subscription)

Admin Pages:
├── /admin (dashboard)
├── /admin/resources (CRUD)
├── /admin/categories
├── /admin/bundles
├── /admin/users
├── /admin/analytics
```

---

## 10. Project Structure

```
nursing-platform/
├── app/
│   ├── (auth)/
│   │   ├── login/page.tsx
│   │   └── register/page.tsx
│   ├── (main)/
│   │   ├── resources/
│   │   ├── pricing/page.tsx
│   │   ├── dashboard/page.tsx
│   │   ├── my-library/page.tsx
│   │   └── account/page.tsx
│   ├── (admin)/
│   │   └── admin/
│   │       ├── page.tsx
│   │       ├── resources/
│   │       ├── categories/
│   │       └── users/
│   ├── api/
│   │   ├── auth/[...nextauth]/
│   │   ├── webhooks/stripe/
│   │   ├── resources/
│   │   ├── subscriptions/
│   │   └── uploads/
│   ├── layout.tsx
│   └── page.tsx (landing)
├── components/
│   ├── ui/ (shadcn components)
│   ├── layout/
│   │   ├── header.tsx
│   │   ├── footer.tsx
│   │   └── sidebar.tsx
│   ├── resources/
│   │   ├── resource-card.tsx
│   │   ├── resource-grid.tsx
│   │   └── resource-filters.tsx
│   ├── payments/
│   │   ├── pricing-card.tsx
│   │   └── checkout-button.tsx
│   └── auth/
│       ├── login-form.tsx
│       └── register-form.tsx
├── lib/
│   ├── prisma.ts
│   ├── auth.ts
│   ├── stripe.ts
│   ├── utils.ts
│   └── constants.ts
├── prisma/
│   ├── schema.prisma
│   └── seed.ts
├── public/
└── types/
    └── index.ts
```

---

## 11. Key Implementation Details

### Authentication
- NextAuth.js with Credentials provider
- Email/password login (no social auth in MVP)
- Session-based authentication
- Role-based access (STUDENT vs ADMIN)

### Payments (Stripe)
- Stripe Checkout for subscriptions
- Stripe Payment Links for one-time purchases
- Webhook handling for payment confirmation
- Customer portal for subscription management

### File Security
- Store files in Vercel Blob
- Generate signed URLs with expiration (1 hour)
- Track downloads per user
- Watermark PDFs with user info (future)

### Subscription Checks
- Middleware checks `subscription_ends_at > now()`
- Show preview content to non-subscribers
- Soft paywall: "Subscribe to continue"
- Grace period for failed payments

---

## 12. MVP Checklist

### Week 1: Foundation
- [ ] Project setup (Next.js, Tailwind, Prisma)
- [ ] Database schema and migrations
- [ ] Authentication (register, login, logout)
- [ ] Basic layout (header, footer, navigation)
- [ ] Landing page
- [ ] Admin: Resource upload form

### Week 2: Core Features
- [ ] Resource listing page
- [ ] Resource detail page with preview
- [ ] Category/filter system
- [ ] Stripe subscription integration
- [ ] Paywall implementation
- [ ] User dashboard
- [ ] Seed database with sample content

---

## 13. Success Metrics

### Launch Goals
- 100 registered users in first month
- 10 paying subscribers in first month
- 50+ resources uploaded

### Growth Goals
- 20% conversion from free to paid
- < 5% monthly churn rate
- 4+ resources downloaded per subscriber per month

---

## 14. Deferred Features

The following are explicitly **NOT** in MVP:

1. **Email Integration** - No transactional emails, password reset via email, or marketing emails until Phase 4
2. **Social Login** - Email/password only for MVP
3. **Mobile App** - Web-first, mobile app later
4. **AI Features** - Recommendations, study plans
5. **Institution Plans** - B2B sales
6. **Discussion Forums** - Q&A features
7. **Gamification** - Badges, streaks, leaderboards

---

## 15. Risk Mitigation

| Risk | Mitigation |
|------|------------|
| Low initial content | Seed with 20-30 quality resources before launch |
| Payment issues | Test Stripe thoroughly in test mode |
| File piracy | Signed URLs, download tracking, potential watermarking |
| Scaling costs | Start with Vercel free tier, monitor usage |
| Content quality | Admin review before publishing |

---

## 16. Getting Started

### Prerequisites
- Node.js 18+
- PostgreSQL database (Neon recommended)
- Stripe account
- Vercel account (for hosting and blob storage)

### Environment Variables
```env
DATABASE_URL="postgresql://..."
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="generate-a-secure-secret"
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_PUBLISHABLE_KEY="pk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."
STRIPE_MONTHLY_PRICE_ID="price_..."
STRIPE_YEARLY_PRICE_ID="price_..."
BLOB_READ_WRITE_TOKEN="vercel_blob_..."
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

### Development Commands
```bash
npm run dev          # Start development server
npm run db:push      # Push schema to database
npm run db:seed      # Seed sample data
npm run db:studio    # Open Prisma Studio
npm run build        # Production build
```

---

## 17. Next Steps

1. **Review this scope** - Confirm features and priorities
2. **Set up accounts** - Neon, Stripe, Vercel
3. **Begin Phase 1** - Start with authentication and landing page
4. **Create content** - Gather/create initial study resources
5. **User testing** - Get feedback from nursing students

---

*Last updated: January 2026*
