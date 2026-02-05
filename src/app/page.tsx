import Image from "next/image"
import Link from "next/link"
import {
  BookOpen,
  FileText,
  ClipboardList,
  Pill,
  GraduationCap,
  Stethoscope,
  ArrowRight,
  Check,
  Star,
  Users,
  Download,
  Award,
  Sparkles,
  Play,
  Quote,
  ChevronRight,
  Shield,
  Zap,
  Heart,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { RESOURCE_TYPES, SUBSCRIPTION_BENEFITS } from "@/lib/constants"
import { formatPrice, PRICING } from "@/lib/constants"

/* Stats */
const stats = [
  { value: "15K+", label: "Active Students", icon: Users },
  { value: "500+", label: "Study Resources", icon: BookOpen },
  { value: "98%", label: "Pass Rate", icon: Award },
  { value: "4.9", label: "Student Rating", icon: Star },
]

/* Quick links */
const quickLinks = [
  { icon: BookOpen, title: "Study Notes", description: "Exam-focused notes", href: "/resources/notes", color: "from-teal-500 to-cyan-500" },
  { icon: FileText, title: "Practice Exams", description: "NCLEX-style questions", href: "/resources/practice-exams", color: "from-blue-500 to-indigo-500" },
  { icon: ClipboardList, title: "Care Plans", description: "Ready templates", href: "/resources/care-plans", color: "from-purple-500 to-pink-500" },
  { icon: Pill, title: "Drug Guides", description: "Quick reference", href: "/resources/drug-guides", color: "from-orange-500 to-red-500" },
  { icon: GraduationCap, title: "NCLEX Prep", description: "Test strategies", href: "/resources/nclex", color: "from-emerald-500 to-teal-500" },
  { icon: Stethoscope, title: "Clinical Guides", description: "Rotation tips", href: "/resources/clinical", color: "from-rose-500 to-orange-500" },
]

/* Featured resources */
const featuredResources = [
  {
    title: "NCLEX Fundamentals Practice",
    description: "75 NCLEX-style questions with detailed rationales covering safety, infection control, and nursing process.",
    image: "https://images.unsplash.com/photo-1582719471384-894fbb16e074?w=800",
    href: "/resources/practice-exams",
    badge: "Most Popular",
    downloads: "12.5K",
  },
  {
    title: "Care Plan Templates Bundle",
    description: "Ready-to-use care plans for common conditions. Pneumonia, diabetes, CHF and more.",
    image: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=800",
    href: "/resources/care-plans",
    badge: "Best Value",
    downloads: "8.2K",
  },
  {
    title: "Clinical Rotation Survival Guide",
    description: "Everything you need for clinical success: what to bring, documentation tips, instructor strategies.",
    image: "https://images.unsplash.com/photo-1551601651-2a8555f1a136?w=800",
    href: "/resources/clinical",
    badge: "Staff Pick",
    downloads: "6.8K",
  },
]

const resourceTypes = Object.values(RESOURCE_TYPES).map((type, i) => ({
  ...type,
  icon: [BookOpen, FileText, ClipboardList, Pill, GraduationCap, Stethoscope][i],
}))

const painPoints = [
  "Not knowing what to prioritize",
  "Scattered, disorganized PDFs",
  "Outdated hand-me-down notes",
  "No structured study plan",
  "Wasting time hunting for resources",
]

const solutions = [
  { text: "Curated, exam-focused content", icon: Sparkles },
  { text: "Organized by topic and year", icon: BookOpen },
  { text: "Mobile-first design", icon: Zap },
  { text: "Affordable subscription", icon: Heart },
  { text: "One platform for everything", icon: Shield },
]

const howItWorks = [
  { step: 1, title: "Browse", description: "Explore our library of study notes, practice exams, and more", icon: BookOpen },
  { step: 2, title: "Subscribe", description: "Choose monthly or yearly for unlimited access to everything", icon: CreditCard },
  { step: 3, title: "Study", description: "Download and study anywhere, anytime—even offline", icon: GraduationCap },
]

import { CreditCard } from "lucide-react"

const testimonials = [
  { 
    quote: "NurseHub saved me so much time. The study notes are exactly what I need for exams. Passed NCLEX on my first try!", 
    name: "Sarah Mitchell", 
    role: "BSN Graduate",
    school: "State University",
    avatar: "SM",
    rating: 5,
  },
  { 
    quote: "The practice exams with rationales helped me understand my weak areas. This platform is a game-changer.", 
    name: "James Kim", 
    role: "ADN Student",
    school: "Community College",
    avatar: "JK",
    rating: 5,
  },
  { 
    quote: "Best investment I made in nursing school. The care plan templates alone saved me countless hours.", 
    name: "Maria Lopez", 
    role: "BSN Senior",
    school: "University of Nursing",
    avatar: "ML",
    rating: 5,
  },
]

const faqs = [
  { q: "What's included in the subscription?", a: "Everything! All study notes, practice exams, care plans, drug guides, NCLEX prep materials, and clinical guides. New content is added regularly and you get automatic access to all updates." },
  { q: "Can I cancel anytime?", a: "Yes, absolutely. Cancel your subscription at any time with no hidden fees. You'll continue to have access until the end of your billing period." },
  { q: "How do I download resources?", a: "Once subscribed, you can download any resource as a PDF directly from its page. Downloads are available for offline study on any device." },
  { q: "Is there a free trial?", a: "We offer several free resources so you can experience the quality before subscribing. Browse our catalog and download free materials anytime." },
  { q: "What payment methods do you accept?", a: "We accept all major credit cards, debit cards, and PayPal through our secure payment processor, Stripe. All transactions are encrypted and secure." },
]

const trustedBy = ["Johns Hopkins", "UCLA", "NYU", "Duke", "Penn State", "Ohio State"]

export default function HomePage() {
  return (
    <div className="overflow-hidden">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center gradient-hero overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl animate-float" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-float" style={{ animationDelay: "1s" }} />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-radial from-primary/5 to-transparent rounded-full" />
        </div>

        <div className="container relative z-10 py-20 lg:py-32">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            {/* Left content */}
            <div className="text-center lg:text-left">
              <Badge variant="secondary" className="mb-6 px-4 py-1.5 text-sm font-medium bg-white/10 text-white border-white/20 backdrop-blur-sm">
                <Sparkles className="size-3.5 mr-1.5" />
                Trusted by 15,000+ nursing students
              </Badge>
              
              <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold text-white leading-[1.1] tracking-tight">
                Study smarter.
                <br />
                <span className="text-gradient bg-gradient-to-r from-teal-400 to-cyan-300 bg-clip-text text-transparent">
                  Pass faster.
                </span>
              </h1>
              
              <p className="mt-6 text-lg sm:text-xl text-white/70 max-w-xl mx-auto lg:mx-0 leading-relaxed">
                The #1 study platform for nursing students. Exam-focused notes, 
                practice questions, care plans, and NCLEX prep—all in one place.
              </p>

              <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Button
                  asChild
                  size="lg"
                  className="h-14 px-8 text-base font-semibold shadow-2xl shadow-primary/30 hover:shadow-primary/50 transition-all hover:scale-105"
                >
                  <Link href="/pricing">
                    Start Free Trial
                    <ArrowRight className="ml-2 size-5" />
                  </Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  size="lg"
                  className="h-14 px-8 text-base font-semibold border-white/20 text-white hover:bg-white/10 backdrop-blur-sm"
                >
                  <Link href="/resources">
                    <Play className="mr-2 size-5" />
                    Browse Resources
                  </Link>
                </Button>
              </div>

              {/* Trust badges */}
              <div className="mt-12 flex flex-wrap items-center justify-center lg:justify-start gap-6">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="size-5 fill-yellow-400 text-yellow-400" />
                  ))}
                  <span className="ml-2 text-white/70 text-sm">4.9/5 rating</span>
                </div>
                <div className="h-6 w-px bg-white/20" />
                <span className="text-white/70 text-sm">98% pass rate</span>
              </div>
            </div>

            {/* Right - Hero image/card */}
            <div className="relative hidden lg:block">
              <div className="relative">
                {/* Main card */}
                <div className="relative rounded-2xl overflow-hidden shadow-2xl shadow-black/30 border border-white/10">
                  <Image
                    src="https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800"
                    alt="Nursing student studying"
                    width={600}
                    height={450}
                    className="object-cover"
                    priority
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  
                  {/* Floating stats card */}
                  <div className="absolute bottom-6 left-6 right-6 glass-dark rounded-xl p-4 border border-white/10">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-white/60 text-sm">Resources Downloaded</p>
                        <p className="text-white text-2xl font-bold">127,500+</p>
                      </div>
                      <div className="size-12 rounded-full bg-primary/20 flex items-center justify-center">
                        <Download className="size-6 text-primary" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Floating badge top-right */}
                <div className="absolute -top-4 -right-4 glass rounded-xl p-4 shadow-xl border border-white/20 animate-float">
                  <div className="flex items-center gap-3">
                    <div className="size-10 rounded-full bg-emerald-500/20 flex items-center justify-center">
                      <Check className="size-5 text-emerald-500" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-foreground">NCLEX Ready</p>
                      <p className="text-xs text-muted-foreground">Prep materials included</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom wave */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 120L60 105C120 90 240 60 360 45C480 30 600 30 720 37.5C840 45 960 60 1080 67.5C1200 75 1320 75 1380 75L1440 75V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" fill="currentColor" className="text-background" />
          </svg>
        </div>
      </section>

      {/* Stats bar */}
      <section className="py-8 -mt-1 bg-background border-b">
        <div className="container">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 lg:gap-12">
            {stats.map((stat, i) => (
              <div key={stat.label} className="text-center animate-slide-up" style={{ animationDelay: `${i * 100}ms` }}>
                <div className="flex justify-center mb-2">
                  <div className="size-10 rounded-xl bg-primary/10 flex items-center justify-center">
                    <stat.icon className="size-5 text-primary" />
                  </div>
                </div>
                <p className="text-2xl sm:text-3xl font-bold text-foreground">{stat.value}</p>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Quick Links - Resource categories */}
      <section className="py-16 lg:py-24 bg-background">
        <div className="container">
          <div className="text-center mb-12">
            <Badge variant="outline" className="mb-4">Resources</Badge>
            <h2 className="text-3xl sm:text-4xl font-bold">Everything you need to succeed</h2>
            <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
              Six types of study materials designed specifically for nursing students
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 lg:gap-6">
            {quickLinks.map((link, i) => (
              <Link
                key={link.title}
                href={link.href}
                className="group relative bg-card rounded-2xl border p-6 text-center hover-lift overflow-hidden animate-slide-up"
                style={{ animationDelay: `${i * 50}ms` }}
              >
                {/* Gradient background on hover */}
                <div className={`absolute inset-0 bg-gradient-to-br ${link.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`} />
                
                <div className="relative">
                  <div className={`mx-auto size-14 rounded-2xl bg-gradient-to-br ${link.color} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                    <link.icon className="size-7 text-white" />
                  </div>
                  <h3 className="mt-4 font-semibold text-foreground">{link.title}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{link.description}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Resources */}
      <section className="py-16 lg:py-24 gradient-section">
        <div className="container">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-12">
            <div>
              <Badge variant="outline" className="mb-4">Popular</Badge>
              <h2 className="text-3xl sm:text-4xl font-bold">Featured Resources</h2>
            </div>
            <Button asChild variant="outline" className="group">
              <Link href="/resources">
                View all resources
                <ChevronRight className="ml-1 size-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {featuredResources.map((item, i) => (
              <Card
                key={item.title}
                className="group overflow-hidden hover-lift animate-slide-up"
                style={{ animationDelay: `${i * 100}ms` }}
              >
                <div className="relative h-48 overflow-hidden">
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <Badge className="absolute top-4 left-4 bg-primary/90 backdrop-blur-sm">
                    {item.badge}
                  </Badge>
                  <div className="absolute bottom-4 left-4 flex items-center gap-2 text-white/90 text-sm">
                    <Download className="size-4" />
                    {item.downloads} downloads
                  </div>
                </div>
                <CardContent className="p-6">
                  <h3 className="font-semibold text-lg group-hover:text-primary transition-colors">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-sm text-muted-foreground line-clamp-2">
                    {item.description}
                  </p>
                  <Link
                    href={item.href}
                    className="mt-4 inline-flex items-center text-sm font-medium text-primary hover:underline"
                  >
                    Learn more
                    <ArrowRight className="ml-1 size-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Problem / Solution */}
      <section className="py-16 lg:py-24 bg-background">
        <div className="container">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20">
            {/* Problem */}
            <div className="relative">
              <Badge variant="outline" className="mb-4 border-destructive/50 text-destructive">The Problem</Badge>
              <h2 className="text-3xl sm:text-4xl font-bold">Sound familiar?</h2>
              <div className="mt-8 space-y-4">
                {painPoints.map((point, i) => (
                  <div
                    key={point}
                    className="flex items-center gap-4 p-4 rounded-xl bg-destructive/5 border border-destructive/10 animate-slide-up"
                    style={{ animationDelay: `${i * 50}ms` }}
                  >
                    <div className="size-8 rounded-full bg-destructive/10 flex items-center justify-center shrink-0">
                      <span className="text-destructive font-bold">×</span>
                    </div>
                    <span className="text-foreground/80">{point}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Solution */}
            <div className="relative">
              <Badge variant="outline" className="mb-4 border-primary/50 text-primary">The Solution</Badge>
              <h2 className="text-3xl sm:text-4xl font-bold">NurseHub gives you...</h2>
              <div className="mt-8 space-y-4">
                {solutions.map((item, i) => (
                  <div
                    key={item.text}
                    className="flex items-center gap-4 p-4 rounded-xl bg-primary/5 border border-primary/10 animate-slide-up"
                    style={{ animationDelay: `${i * 50}ms` }}
                  >
                    <div className="size-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                      <item.icon className="size-4 text-primary" />
                    </div>
                    <span className="text-foreground/80">{item.text}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 lg:py-24 gradient-section">
        <div className="container">
          <div className="text-center mb-16">
            <Badge variant="outline" className="mb-4">Simple Process</Badge>
            <h2 className="text-3xl sm:text-4xl font-bold">How it works</h2>
            <p className="mt-4 text-lg text-muted-foreground">Get started in three easy steps</p>
          </div>

          <div className="relative max-w-4xl mx-auto">
            {/* Connection line */}
            <div className="absolute top-24 left-1/2 -translate-x-1/2 w-full max-w-2xl h-0.5 bg-gradient-to-r from-transparent via-primary/30 to-transparent hidden md:block" />

            <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
              {howItWorks.map((item, i) => (
                <div
                  key={item.step}
                  className="relative text-center animate-slide-up"
                  style={{ animationDelay: `${i * 150}ms` }}
                >
                  <div className="relative mx-auto size-20 rounded-2xl bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center shadow-xl shadow-primary/30">
                    <span className="text-3xl font-bold text-white">{item.step}</span>
                  </div>
                  <h3 className="mt-6 text-xl font-semibold">{item.title}</h3>
                  <p className="mt-2 text-muted-foreground">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-16 lg:py-24 bg-background">
        <div className="container">
          <div className="text-center mb-12">
            <Badge variant="outline" className="mb-4">Pricing</Badge>
            <h2 className="text-3xl sm:text-4xl font-bold">Simple, transparent pricing</h2>
            <p className="mt-4 text-lg text-muted-foreground">Choose the plan that works for you</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Monthly */}
            <Card className="relative overflow-hidden hover-lift">
              <CardContent className="p-8">
                <h3 className="text-xl font-semibold">Monthly</h3>
                <div className="mt-4 flex items-baseline gap-1">
                  <span className="text-5xl font-bold">{formatPrice(PRICING.MONTHLY)}</span>
                  <span className="text-muted-foreground">/month</span>
                </div>
                <p className="mt-2 text-sm text-muted-foreground">Billed monthly, cancel anytime</p>
                <ul className="mt-8 space-y-4">
                  {SUBSCRIPTION_BENEFITS.slice(0, 5).map((benefit) => (
                    <li key={benefit} className="flex items-center gap-3">
                      <div className="size-5 rounded-full bg-primary/10 flex items-center justify-center">
                        <Check className="size-3 text-primary" />
                      </div>
                      <span className="text-sm">{benefit}</span>
                    </li>
                  ))}
                </ul>
                <Button asChild variant="outline" size="lg" className="w-full mt-8">
                  <Link href="/pricing">Get Started</Link>
                </Button>
              </CardContent>
            </Card>

            {/* Yearly - Featured */}
            <Card className="relative overflow-hidden border-primary shadow-glow hover-lift">
              <div className="absolute top-0 right-0 bg-primary text-primary-foreground px-4 py-1 text-sm font-medium rounded-bl-xl">
                Save 33%
              </div>
              <CardContent className="p-8">
                <h3 className="text-xl font-semibold">Yearly</h3>
                <div className="mt-4 flex items-baseline gap-1">
                  <span className="text-5xl font-bold">{formatPrice(PRICING.YEARLY)}</span>
                  <span className="text-muted-foreground">/year</span>
                </div>
                <p className="mt-2 text-sm text-muted-foreground">Best value • Billed annually</p>
                <ul className="mt-8 space-y-4">
                  {SUBSCRIPTION_BENEFITS.slice(0, 5).map((benefit) => (
                    <li key={benefit} className="flex items-center gap-3">
                      <div className="size-5 rounded-full bg-primary/10 flex items-center justify-center">
                        <Check className="size-3 text-primary" />
                      </div>
                      <span className="text-sm">{benefit}</span>
                    </li>
                  ))}
                </ul>
                <Button asChild size="lg" className="w-full mt-8 shadow-lg shadow-primary/25">
                  <Link href="/pricing">Get Started</Link>
                </Button>
              </CardContent>
            </Card>
          </div>

          <p className="mt-8 text-center text-sm text-muted-foreground">
            All plans include a 30-day money-back guarantee
          </p>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 lg:py-24 gradient-section">
        <div className="container">
          <div className="text-center mb-12">
            <Badge variant="outline" className="mb-4">Testimonials</Badge>
            <h2 className="text-3xl sm:text-4xl font-bold">Loved by nursing students</h2>
            <p className="mt-4 text-lg text-muted-foreground">See what our community has to say</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
            {testimonials.map((t, i) => (
              <Card
                key={t.name}
                className="relative overflow-hidden hover-lift animate-slide-up"
                style={{ animationDelay: `${i * 100}ms` }}
              >
                <CardContent className="p-6">
                  <Quote className="size-8 text-primary/20 mb-4" />
                  <div className="flex gap-1 mb-4">
                    {[...Array(t.rating)].map((_, j) => (
                      <Star key={j} className="size-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <p className="text-foreground/80 leading-relaxed">&ldquo;{t.quote}&rdquo;</p>
                  <div className="mt-6 flex items-center gap-3">
                    <div className="size-12 rounded-full bg-primary/10 flex items-center justify-center font-semibold text-primary">
                      {t.avatar}
                    </div>
                    <div>
                      <p className="font-semibold">{t.name}</p>
                      <p className="text-sm text-muted-foreground">{t.role} • {t.school}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-16 lg:py-24 bg-background">
        <div className="container">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-12">
              <Badge variant="outline" className="mb-4">FAQ</Badge>
              <h2 className="text-3xl sm:text-4xl font-bold">Frequently asked questions</h2>
              <p className="mt-4 text-muted-foreground">Everything you need to know about NurseHub</p>
            </div>

            <Accordion type="single" collapsible className="space-y-4">
              {faqs.map((faq, i) => (
                <AccordionItem
                  key={faq.q}
                  value={faq.q}
                  className="border rounded-xl px-6 data-[state=open]:bg-muted/50 transition-colors"
                >
                  <AccordionTrigger className="text-left hover:no-underline py-5">
                    <span className="font-medium">{faq.q}</span>
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground pb-5">
                    {faq.a}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 lg:py-32 gradient-hero relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-10 left-10 w-64 h-64 bg-primary/10 rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-10 w-80 h-80 bg-primary/5 rounded-full blur-3xl" />
        </div>

        <div className="container relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <Badge variant="secondary" className="mb-6 bg-white/10 text-white border-white/20">
              Start your journey today
            </Badge>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white">
              Ready to ace your nursing exams?
            </h2>
            <p className="mt-6 text-lg text-white/70 max-w-xl mx-auto">
              Join thousands of nursing students who trust NurseHub to help them succeed. 
              Start your free trial today.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                asChild
                size="lg"
                className="h-14 px-10 text-base font-semibold bg-white text-foreground hover:bg-white/90 shadow-2xl"
              >
                <Link href="/pricing">
                  Start Free Trial
                  <ArrowRight className="ml-2 size-5" />
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="h-14 px-10 text-base font-semibold border-white/20 text-white hover:bg-white/10"
              >
                <Link href="/contact">Contact Sales</Link>
              </Button>
            </div>
            <p className="mt-8 text-sm text-white/50">
              No credit card required • 30-day money-back guarantee
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}
