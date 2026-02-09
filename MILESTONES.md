# NurseHub - Development Milestones & Tasks

> Step-by-step implementation guide for the nursing resource platform.

---

## Overview

| Phase | Focus | Duration | Status |
|-------|-------|----------|--------|
| Phase 1 | Foundation & Core UI | Week 1 | In Progress |
| Phase 2 | Authentication & Resources | Week 2 | Not Started |
| Phase 3 | Payments & Subscriptions | Week 3 | Not Started |
| Phase 4 | Polish & Launch | Week 4 | Not Started |

---

## Phase 1: Foundation & Core UI

### 1.1 Project Setup
- [x] Initialize Next.js 14 with TypeScript
- [x] Configure Tailwind CSS
- [x] Install and configure shadcn/ui
- [x] Set up Prisma ORM
- [x] Create database schema
- [x] Set up environment variables
- [ ] Connect to Neon PostgreSQL database
- [ ] Run initial migration (`npm run db:push`)
- [ ] Seed database with sample data (`npm run db:seed`)

### 1.2 Global Layout & Navigation
- [x] Create root layout with metadata
- [x] Build responsive header component
  - [x] Logo/brand
  - [x] Navigation links (Resources, Pricing, Login)
  - [x] Mobile hamburger menu
  - [ ] User dropdown (when logged in) - Phase 2
- [x] Build footer component
  - [x] Links (About, Contact, Terms, Privacy)
  - [x] Social media links
  - [x] Copyright
- [x] Set up global styles and theme
- [x] Add loading states and skeletons
- [x] Create 404 and error pages

### 1.3 Homepage
- [x] **Hero Section**
  - [x] Headline: "Study Smarter, Not Harder"
  - [x] Subheadline explaining the value prop
  - [x] CTA buttons: "Browse Resources" and "Start Free Trial"
  - [x] Hero image/illustration (nursing themed)
  
- [x] **Problem/Solution Section**
  - [x] "Tired of..." pain points
  - [x] "NurseHub gives you..." solutions
  
- [x] **Resource Types Section**
  - [x] 6 cards showing content types:
    - [x] Study Notes
    - [x] Practice Exams
    - [x] Care Plans
    - [x] Drug Guides
    - [x] NCLEX Prep
    - [x] Clinical Guides
  - [x] Icons for each type
  - [x] Brief description
  - [x] "Browse" link
  
- [x] **How It Works Section**
  - [x] Step 1: Browse resources
  - [x] Step 2: Subscribe or buy
  - [x] Step 3: Download & study
  - [x] Simple illustrations/icons
  
- [x] **Pricing Preview Section**
  - [x] Monthly price card
  - [x] Yearly price card (highlight savings)
  - [x] "View full pricing" link
  - [x] List of what's included
  
- [x] **Testimonials Section** (placeholder for now)
  - [x] 3 student testimonial cards
  - [x] Name, program, school
  - [x] Quote about the platform
  
- [x] **FAQ Section**
  - [x] Accordion component
  - [x] Common questions:
    - [x] What's included in subscription?
    - [x] Can I cancel anytime?
    - [x] How do I download resources?
    - [x] Is there a free trial?
    - [x] What payment methods accepted?
  
- [x] **Final CTA Section**
  - [x] "Ready to ace your exams?"
  - [x] Subscribe button
  - [x] "Questions? Contact us" link

### 1.4 Pricing Page
- [x] Create `/pricing` route
- [x] Pricing comparison table
- [x] Monthly plan card
  - [x] Price: $9.99/month
  - [x] Features list
  - [x] "Subscribe" button
- [x] Yearly plan card (recommended badge)
  - [x] Price: $79.99/year
  - [x] "Save 33%" badge
  - [x] Features list
  - [x] "Subscribe" button
- [x] Pay-per-resource section
  - [x] Single resource: $4.99
  - [x] Bundle options
- [x] FAQ specific to pricing
- [x] Money-back guarantee note

### 1.5 Static Pages
- [x] Create `/about` page
- [x] Create `/contact` page (simple form, no email yet)
- [x] Create `/terms` page
- [x] Create `/privacy` page

---

## Phase 2: Authentication & Resources

### 2.1 Authentication Setup
- [ ] Configure NextAuth.js
  - [ ] Create `auth.ts` config file
  - [ ] Set up Credentials provider
  - [ ] Configure session strategy (JWT)
  - [ ] Set up auth callbacks
- [ ] Create auth API routes
  - [ ] `POST /api/auth/register`
  - [ ] NextAuth routes (`/api/auth/[...nextauth]`)

### 2.2 Registration Flow
- [ ] Create `/register` page
- [ ] Registration form
  - [ ] Name field
  - [ ] Email field
  - [ ] Password field (with strength indicator)
  - [ ] Confirm password field
  - [ ] Program type dropdown (BSN, ADN, etc.)
  - [ ] Year of study (optional)
  - [ ] School name (optional)
  - [ ] Terms acceptance checkbox
- [ ] Form validation with Zod
- [ ] Error handling and display
- [ ] Success redirect to dashboard
- [ ] "Already have an account?" link

### 2.3 Login Flow
- [ ] Create `/login` page
- [ ] Login form
  - [ ] Email field
  - [ ] Password field
  - [ ] "Remember me" checkbox
- [ ] Form validation
- [ ] Error handling (invalid credentials)
- [ ] Success redirect to dashboard
- [ ] "Don't have an account?" link
- [ ] "Forgot password?" link (disabled, coming soon)

### 2.4 User Dashboard
- [ ] Create `/dashboard` page (protected)
- [ ] Welcome message with user name
- [ ] Quick stats
  - [ ] Subscription status
  - [ ] Resources downloaded
  - [ ] Saved resources count
- [ ] Recent downloads list
- [ ] Saved resources preview
- [ ] Quick links to browse resources

### 2.5 Account Settings
- [ ] Create `/account` page (protected)
- [ ] Profile section
  - [ ] Edit name
  - [ ] Edit program type
  - [ ] Edit year of study
  - [ ] Edit school
- [ ] Password change section
- [ ] Subscription status display
- [ ] "Manage Subscription" button (Stripe portal)

### 2.6 Resource Listing Page
- [ ] Create `/resources` page
- [ ] Resource grid layout
- [ ] Filter sidebar
  - [ ] By type (Notes, Exams, etc.)
  - [ ] By category (Fundamentals, Med-Surg, etc.)
  - [ ] By year level
  - [ ] By difficulty
  - [ ] Free only toggle
- [ ] Sort options
  - [ ] Newest first
  - [ ] Most popular
  - [ ] Alphabetical
- [ ] Search bar
- [ ] Pagination or infinite scroll
- [ ] Resource card component
  - [ ] Thumbnail
  - [ ] Title
  - [ ] Type badge
  - [ ] Category
  - [ ] Free/Premium badge
  - [ ] Download count
  - [ ] Preview button

### 2.7 Resource Type Pages
- [ ] Create `/resources/[type]` dynamic route
- [ ] Study Notes page (`/resources/notes`)
- [ ] Practice Exams page (`/resources/practice-exams`)
- [ ] Care Plans page (`/resources/care-plans`)
- [ ] Drug Guides page (`/resources/drug-guides`)
- [ ] NCLEX Prep page (`/resources/nclex`)
- [ ] Clinical Guides page (`/resources/clinical`)
- [ ] Type-specific hero section
- [ ] Filtered resource grid

### 2.8 Single Resource Page
- [ ] Create `/resources/[type]/[slug]` dynamic route
- [ ] Resource header
  - [ ] Title
  - [ ] Type and category badges
  - [ ] Download count
  - [ ] Last updated date
- [ ] Resource description
- [ ] Preview section (for non-subscribers)
  - [ ] First page preview
  - [ ] Blurred content teaser
- [ ] Action buttons
  - [ ] Download (if subscribed or purchased)
  - [ ] Buy single ($X.XX) (if not subscribed)
  - [ ] Subscribe to unlock
  - [ ] Save for later
- [ ] Related resources section
- [ ] Share buttons

### 2.9 My Library Page
- [ ] Create `/my-library` page (protected)
- [ ] Tabs: Purchased | Saved | Downloaded
- [ ] Purchased resources list
- [ ] Saved resources list
- [ ] Download history
- [ ] Empty states for each tab
- [ ] Quick actions (download, remove from saved)

### 2.10 API Routes for Resources
- [ ] `GET /api/resources` - List resources with filters
- [ ] `GET /api/resources/[slug]` - Get single resource
- [ ] `POST /api/resources/save` - Save resource
- [ ] `DELETE /api/resources/save` - Unsave resource
- [ ] `POST /api/resources/download` - Track download

---

## Phase 3: Payments & Subscriptions

### 3.1 Stripe Setup
- [ ] Create Stripe account
- [ ] Get API keys (test mode)
- [ ] Create products in Stripe
  - [ ] Monthly subscription ($9.99)
  - [ ] Yearly subscription ($79.99)
- [ ] Create price IDs
- [ ] Set up webhook endpoint
- [ ] Configure webhook events

### 3.2 Stripe Integration
- [ ] Create `lib/stripe.ts` utility
- [ ] Implement Stripe client initialization
- [ ] Create checkout session helper
- [ ] Create customer portal helper

### 3.3 Subscription Checkout
- [ ] Create `/subscribe` page
- [ ] Plan selection UI
- [ ] "Subscribe" button triggers Stripe Checkout
- [ ] Create `POST /api/checkout/subscription` route
  - [ ] Create Stripe customer (if new)
  - [ ] Create checkout session
  - [ ] Return checkout URL
- [ ] Redirect to Stripe Checkout
- [ ] Create success page (`/subscribe/success`)
- [ ] Create cancel page (`/subscribe/cancel`)

### 3.4 Stripe Webhooks
- [ ] Create `/api/webhooks/stripe` route
- [ ] Verify webhook signature
- [ ] Handle events:
  - [ ] `checkout.session.completed` - Activate subscription
  - [ ] `customer.subscription.updated` - Update status
  - [ ] `customer.subscription.deleted` - Cancel subscription
  - [ ] `invoice.payment_failed` - Handle failed payment

### 3.5 Subscription Management
- [ ] Display subscription status on dashboard
- [ ] Display subscription status on account page
- [ ] "Manage Subscription" button
- [ ] Redirect to Stripe Customer Portal
- [ ] Handle subscription cancellation
- [ ] Handle subscription reactivation

### 3.6 Pay-Per-Resource
- [ ] Create `POST /api/checkout/resource` route
- [ ] Single resource checkout flow
- [ ] Bundle checkout flow
- [ ] Track purchases in database
- [ ] Grant access after payment

### 3.7 Access Control Middleware
- [ ] Create subscription check middleware
- [ ] Protect premium resource downloads
- [ ] Check for:
  - [ ] Active subscription
  - [ ] Individual purchase
  - [ ] Free resource
- [ ] Return appropriate response/redirect

### 3.8 Download System
- [ ] Create `POST /api/download/[resourceId]` route
- [ ] Verify user has access
- [ ] Generate signed URL (Vercel Blob)
- [ ] Track download in database
- [ ] Return download URL
- [ ] Handle download errors

---

## Phase 4: Polish & Launch

### 4.1 Admin Dashboard
- [ ] Create `/admin` layout (protected, admin only)
- [ ] Admin dashboard home
  - [ ] Total users count
  - [ ] Active subscribers count
  - [ ] Total resources
  - [ ] Recent signups
  - [ ] Revenue summary (from Stripe)

### 4.2 Admin: Resource Management
- [ ] Create `/admin/resources` page
- [ ] Resource list table
  - [ ] Title, type, category
  - [ ] Published status
  - [ ] Download count
  - [ ] Actions (edit, delete, unpublish)
- [ ] Create `/admin/resources/new` page
- [ ] Resource upload form
  - [ ] Title
  - [ ] Description (rich text)
  - [ ] Type dropdown
  - [ ] Category dropdown
  - [ ] Year level
  - [ ] Difficulty
  - [ ] File upload (PDF)
  - [ ] Preview file upload
  - [ ] Thumbnail upload
  - [ ] Is free checkbox
  - [ ] Price (if pay-per-resource)
  - [ ] Tags
  - [ ] Publish immediately checkbox
- [ ] Create `/admin/resources/[id]/edit` page
- [ ] Delete confirmation modal

### 4.3 Admin: Category Management
- [ ] Create `/admin/categories` page
- [ ] Category list
- [ ] Add category form
- [ ] Edit category
- [ ] Delete category (with resource check)
- [ ] Reorder categories

### 4.4 Admin: User Management
- [ ] Create `/admin/users` page
- [ ] User list table
  - [ ] Name, email
  - [ ] Role
  - [ ] Subscription status
  - [ ] Join date
- [ ] View user details
- [ ] Change user role
- [ ] Manual subscription grant

### 4.5 Admin: Bundle Management
- [ ] Create `/admin/bundles` page
- [ ] Bundle list
- [ ] Create bundle form
  - [ ] Name
  - [ ] Description
  - [ ] Price
  - [ ] Select resources to include
- [ ] Edit bundle
- [ ] Activate/deactivate bundle

### 4.6 Search Functionality
- [ ] Add search input to header
- [ ] Create `/search` results page
- [ ] Implement search API
- [ ] Search by title
- [ ] Search by description
- [ ] Filter search results
- [ ] Highlight search terms

### 4.7 Mobile Optimization
- [ ] Test all pages on mobile
- [ ] Fix responsive issues
- [ ] Optimize touch targets
- [ ] Test forms on mobile
- [ ] Optimize images
- [ ] Test checkout flow on mobile

### 4.8 Performance Optimization
- [x] Add loading skeletons
- [x] Implement image optimization
- [x] Add proper caching headers
- [x] Lazy load images
- [x] Optimize bundle size
- [ ] Run Lighthouse audit
- [ ] Fix performance issues

### 4.9 SEO & Metadata
- [x] Add meta tags to all pages
- [x] Create dynamic OG images
- [x] Add sitemap.xml
- [x] Add robots.txt
- [x] Set up canonical URLs
- [x] Add structured data (JSON-LD)

### 4.10 Final Testing
- [ ] Test registration flow
- [ ] Test login/logout flow
- [ ] Test subscription purchase
- [ ] Test single resource purchase
- [ ] Test download flow
- [ ] Test admin functions
- [ ] Test on multiple browsers
- [ ] Test on mobile devices
- [ ] Test error states
- [ ] Test empty states

### 4.11 Launch Prep
- [ ] Set up production database
- [ ] Configure production environment variables
- [ ] Switch Stripe to live mode
- [ ] Set up Vercel production deployment
- [ ] Configure custom domain
- [ ] Set up SSL
- [ ] Create initial content (20+ resources)
- [ ] Final review of all content
- [ ] Announce launch!

---

## Future Phases (Post-Launch)

### Phase 5: Email Integration
- [x] Set up email provider (Resend/SendGrid)
- [x] Welcome email on registration
- [x] Purchase confirmation email
- [ ] Password reset flow
- [ ] New resource notifications
- [ ] Weekly digest (optional)

### Phase 6: Growth Features
- [ ] Referral system
- [ ] Social sharing with previews
- [ ] Student testimonials (real)
- [ ] Progress tracking
- [ ] Study streak gamification
- [ ] Discussion/Q&A per resource

### Phase 7: Advanced Features
- [ ] Mobile app (React Native)
- [ ] AI study recommendations
- [ ] Practice exam simulator
- [ ] Flashcard system
- [ ] Institution/group plans
- [ ] API for partners

---

## Component Checklist

### UI Components (shadcn/ui)
- [x] Button
- [x] Card
- [x] Input
- [x] Label
- [x] Badge
- [x] Dialog
- [x] Dropdown Menu
- [x] Table
- [x] Tabs
- [x] Avatar
- [x] Separator
- [x] Sheet
- [x] Select
- [x] Textarea
- [x] Form
- [x] Sonner (toast)
- [x] Skeleton
- [x] Accordion
- [ ] Progress
- [ ] Checkbox
- [ ] Switch

### Custom Components to Build
- [x] Header
- [x] Footer
- [x] MobileNav (integrated in Header)
- [ ] ResourceCard
- [ ] ResourceGrid
- [ ] ResourceFilters
- [ ] PricingCard
- [ ] TestimonialCard
- [ ] FAQAccordion
- [ ] SearchBar
- [ ] UserDropdown
- [ ] SubscriptionBadge
- [ ] EmptyState
- [ ] LoadingSkeleton
- [ ] PaywallOverlay

---

## API Routes Checklist

### Auth
- [ ] `POST /api/auth/register`
- [ ] `GET/POST /api/auth/[...nextauth]`

### Resources
- [ ] `GET /api/resources`
- [ ] `GET /api/resources/[slug]`
- [ ] `POST /api/resources` (admin)
- [ ] `PUT /api/resources/[id]` (admin)
- [ ] `DELETE /api/resources/[id]` (admin)
- [ ] `POST /api/resources/save`
- [ ] `DELETE /api/resources/save`

### Downloads
- [ ] `POST /api/download/[resourceId]`

### Payments
- [ ] `POST /api/checkout/subscription`
- [ ] `POST /api/checkout/resource`
- [ ] `POST /api/webhooks/stripe`
- [ ] `POST /api/billing/portal`

### Admin
- [ ] `GET /api/admin/stats`
- [ ] `GET /api/admin/users`
- [ ] `POST /api/admin/upload`

---

## Environment Variables Checklist

```env
# Database
DATABASE_URL=

# Auth
NEXTAUTH_URL=
NEXTAUTH_SECRET=

# Stripe
STRIPE_SECRET_KEY=
STRIPE_PUBLISHABLE_KEY=
STRIPE_WEBHOOK_SECRET=
STRIPE_MONTHLY_PRICE_ID=
STRIPE_YEARLY_PRICE_ID=

# Storage
BLOB_READ_WRITE_TOKEN=

# App
NEXT_PUBLIC_APP_URL=
NEXT_PUBLIC_APP_NAME=
```

---

## Quick Start Commands

```bash
# Install dependencies
npm install

# Set up database
npm run db:push
npm run db:seed

# Start development
npm run dev

# Open Prisma Studio
npm run db:studio

# Build for production
npm run build
```

---

*Last updated: January 2026*
