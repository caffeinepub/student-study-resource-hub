import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import {
  AlertCircle,
  BookOpen,
  Bookmark,
  BookmarkCheck,
  CheckCircle2,
  Code2,
  Download,
  ExternalLink,
  Globe,
  GraduationCap,
  Loader2,
  Menu,
  Moon,
  Search,
  Sparkles,
  Sun,
  X,
} from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { useActor } from "./hooks/useActor";

// ── Types ────────────────────────────────────────────────
type Category =
  | "All"
  | "Programming Notes"
  | "Useful Websites"
  | "Coding Practice"
  | "Free Courses";

interface Resource {
  id: number;
  category: Exclude<Category, "All">;
  title: string;
  description: string;
  link: string;
  downloadable: boolean;
}

// ── Resource Data ────────────────────────────────────────
const RESOURCES: Resource[] = [
  {
    id: 1,
    category: "Programming Notes",
    title: "JavaScript Cheatsheet",
    description: "Quick reference for JS syntax, methods, and ES6+ features.",
    link: "https://devhints.io/js",
    downloadable: true,
  },
  {
    id: 2,
    category: "Programming Notes",
    title: "Python Basics PDF",
    description:
      "Beginner-friendly Python notes covering data types, loops, and functions.",
    link: "https://www.pythoncheatsheet.org/",
    downloadable: true,
  },
  {
    id: 3,
    category: "Programming Notes",
    title: "CSS Tricks Reference",
    description: "Comprehensive CSS properties and layout techniques.",
    link: "https://css-tricks.com/almanac/",
    downloadable: false,
  },
  {
    id: 4,
    category: "Useful Websites",
    title: "MDN Web Docs",
    description:
      "The go-to reference for HTML, CSS, and JavaScript documentation.",
    link: "https://developer.mozilla.org/",
    downloadable: false,
  },
  {
    id: 5,
    category: "Useful Websites",
    title: "Stack Overflow",
    description: "Community Q&A for programming problems and solutions.",
    link: "https://stackoverflow.com/",
    downloadable: false,
  },
  {
    id: 6,
    category: "Useful Websites",
    title: "GitHub Student Pack",
    description: "Free developer tools and resources for students.",
    link: "https://education.github.com/pack",
    downloadable: false,
  },
  {
    id: 7,
    category: "Coding Practice",
    title: "LeetCode",
    description: "Practice coding interview questions and algorithms.",
    link: "https://leetcode.com/",
    downloadable: false,
  },
  {
    id: 8,
    category: "Coding Practice",
    title: "HackerRank",
    description: "Solve challenges in domains like algorithms, math, and SQL.",
    link: "https://www.hackerrank.com/",
    downloadable: false,
  },
  {
    id: 9,
    category: "Coding Practice",
    title: "Codewars",
    description: "Improve your skills with coding kata challenges.",
    link: "https://www.codewars.com/",
    downloadable: false,
  },
  {
    id: 10,
    category: "Free Courses",
    title: "freeCodeCamp",
    description:
      "Free full-stack web development curriculum with certificates.",
    link: "https://www.freecodecamp.org/",
    downloadable: false,
  },
  {
    id: 11,
    category: "Free Courses",
    title: "The Odin Project",
    description: "Open-source full-stack curriculum for web development.",
    link: "https://www.theodinproject.com/",
    downloadable: false,
  },
  {
    id: 12,
    category: "Free Courses",
    title: "CS50 by Harvard",
    description: "World-famous intro to computer science, completely free.",
    link: "https://cs50.harvard.edu/",
    downloadable: false,
  },
];

const CATEGORIES: Category[] = [
  "All",
  "Programming Notes",
  "Useful Websites",
  "Coding Practice",
  "Free Courses",
];

const CATEGORY_ICONS: Record<Category, React.ReactNode> = {
  All: <Sparkles className="h-3.5 w-3.5" />,
  "Programming Notes": <BookOpen className="h-3.5 w-3.5" />,
  "Useful Websites": <Globe className="h-3.5 w-3.5" />,
  "Coding Practice": <Code2 className="h-3.5 w-3.5" />,
  "Free Courses": <GraduationCap className="h-3.5 w-3.5" />,
};

const CATEGORY_CLASS: Record<Exclude<Category, "All">, string> = {
  "Programming Notes": "category-notes",
  "Useful Websites": "category-websites",
  "Coding Practice": "category-practice",
  "Free Courses": "category-courses",
};

// ── Hooks ────────────────────────────────────────────────
function useDarkMode() {
  const [dark, setDark] = useState(() => {
    const stored = localStorage.getItem("studyhub-theme");
    if (stored) return stored === "dark";
    return window.matchMedia("(prefers-color-scheme: dark)").matches;
  });

  useEffect(() => {
    const root = document.documentElement;
    if (dark) {
      root.classList.add("dark");
      localStorage.setItem("studyhub-theme", "dark");
    } else {
      root.classList.remove("dark");
      localStorage.setItem("studyhub-theme", "light");
    }
  }, [dark]);

  return { dark, toggle: () => setDark((d) => !d) };
}

function useBookmarks() {
  const [bookmarks, setBookmarks] = useState<Set<number>>(() => {
    try {
      const stored = localStorage.getItem("studyhub-bookmarks");
      return stored ? new Set(JSON.parse(stored)) : new Set();
    } catch {
      return new Set();
    }
  });

  const toggle = (id: number) => {
    setBookmarks((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      localStorage.setItem("studyhub-bookmarks", JSON.stringify([...next]));
      return next;
    });
  };

  return { bookmarks, toggle };
}

// ── Components ───────────────────────────────────────────
interface ResourceCardProps {
  resource: Resource;
  isBookmarked: boolean;
  onBookmarkToggle: (id: number) => void;
  index: number;
}

function ResourceCard({
  resource,
  isBookmarked,
  onBookmarkToggle,
  index,
}: ResourceCardProps) {
  const catClass = CATEGORY_CLASS[resource.category];

  return (
    <article
      data-ocid={`resource.card.${index}`}
      className="card-hover bg-card border border-border rounded-lg p-5 flex flex-col gap-3 shadow-card relative"
    >
      {/* Category badge */}
      <div className="flex items-start justify-between gap-2">
        <span
          className={`inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full border ${catClass} font-body`}
        >
          {CATEGORY_ICONS[resource.category]}
          {resource.category}
        </span>
        <button
          type="button"
          data-ocid={`resource.bookmark_toggle.${index}`}
          onClick={() => onBookmarkToggle(resource.id)}
          className={`p-1.5 rounded-md transition-colors ${
            isBookmarked
              ? "text-accent-foreground bg-accent/20 hover:bg-accent/30"
              : "text-muted-foreground hover:text-foreground hover:bg-muted"
          }`}
          aria-label={
            isBookmarked ? "Remove bookmark" : "Bookmark this resource"
          }
          title={isBookmarked ? "Remove bookmark" : "Save to bookmarks"}
        >
          {isBookmarked ? (
            <BookmarkCheck className="h-4 w-4" />
          ) : (
            <Bookmark className="h-4 w-4" />
          )}
        </button>
      </div>

      {/* Title + description */}
      <div className="flex-1">
        <h3 className="font-display font-semibold text-base text-foreground leading-snug mb-1.5">
          {resource.title}
        </h3>
        <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2">
          {resource.description}
        </p>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2 pt-1">
        <a
          href={resource.link}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-xs font-medium text-primary hover:text-primary/80 transition-colors"
        >
          <ExternalLink className="h-3.5 w-3.5" />
          Open Resource
        </a>
        {resource.downloadable && (
          <a
            href={resource.link}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full bg-primary/10 text-primary hover:bg-primary/20 transition-colors ml-auto border border-primary/20"
          >
            <Download className="h-3 w-3" />
            Download Notes
          </a>
        )}
      </div>
    </article>
  );
}

// ── Main App ─────────────────────────────────────────────
export default function App() {
  const { actor } = useActor();
  const { dark, toggle: toggleDark } = useDarkMode();
  const { bookmarks, toggle: toggleBookmark } = useBookmarks();
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState<Category>("All");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Contact form state
  const [formName, setFormName] = useState("");
  const [formEmail, setFormEmail] = useState("");
  const [formMessage, setFormMessage] = useState("");
  const [submitStatus, setSubmitStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");

  // Section refs for smooth scroll
  const heroRef = useRef<HTMLDivElement>(null);
  const resourcesRef = useRef<HTMLDivElement>(null);
  const bookmarksRef = useRef<HTMLDivElement>(null);
  const contactRef = useRef<HTMLDivElement>(null);

  const scrollTo = (ref: React.RefObject<HTMLDivElement | null>) => {
    ref.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    setMobileMenuOpen(false);
  };

  // Filtered resources
  const filteredResources = useMemo(() => {
    const q = search.toLowerCase().trim();
    return RESOURCES.filter((r) => {
      const matchesCategory =
        activeCategory === "All" || r.category === activeCategory;
      const matchesSearch =
        !q ||
        r.title.toLowerCase().includes(q) ||
        r.description.toLowerCase().includes(q);
      return matchesCategory && matchesSearch;
    });
  }, [search, activeCategory]);

  const bookmarkedResources = useMemo(
    () => RESOURCES.filter((r) => bookmarks.has(r.id)),
    [bookmarks],
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim() || !formEmail.trim() || !formMessage.trim()) return;

    setSubmitStatus("loading");
    try {
      if (!actor) throw new Error("Backend not available");
      await actor.addSuggestion(formName, formEmail, formMessage);
      setSubmitStatus("success");
      setFormName("");
      setFormEmail("");
      setFormMessage("");
    } catch {
      setSubmitStatus("error");
    }
  };

  const resetForm = () => setSubmitStatus("idle");

  const year = new Date().getFullYear();
  const hostname = window.location.hostname;
  const footerLink = `https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(hostname)}`;

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* ── Navbar ── */}
      <header className="sticky top-0 z-50 bg-background/90 backdrop-blur-md border-b border-border">
        <nav className="container mx-auto px-4 sm:px-6 flex items-center justify-between h-14">
          {/* Logo */}
          <button
            type="button"
            onClick={() => scrollTo(heroRef)}
            className="flex items-center gap-2 font-display font-bold text-lg tracking-tight text-foreground hover:text-primary transition-colors"
          >
            <span className="inline-flex items-center justify-center h-7 w-7 rounded-md bg-primary text-primary-foreground text-xs font-bold">
              S
            </span>
            StudyHub
          </button>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-1">
            <button
              type="button"
              data-ocid="nav.home_link"
              onClick={() => scrollTo(heroRef)}
              className="px-3 py-1.5 text-sm text-muted-foreground hover:text-foreground rounded-md hover:bg-muted transition-colors"
            >
              Home
            </button>
            <button
              type="button"
              data-ocid="nav.resources_link"
              onClick={() => scrollTo(resourcesRef)}
              className="px-3 py-1.5 text-sm text-muted-foreground hover:text-foreground rounded-md hover:bg-muted transition-colors"
            >
              Resources
            </button>
            <button
              type="button"
              data-ocid="nav.bookmarks_link"
              onClick={() => scrollTo(bookmarksRef)}
              className="px-3 py-1.5 text-sm text-muted-foreground hover:text-foreground rounded-md hover:bg-muted transition-colors"
            >
              Bookmarks
              {bookmarks.size > 0 && (
                <span className="ml-1.5 inline-flex items-center justify-center h-4 min-w-4 px-1 rounded-full bg-primary/20 text-primary text-[10px] font-semibold">
                  {bookmarks.size}
                </span>
              )}
            </button>
            <button
              type="button"
              data-ocid="nav.contact_link"
              onClick={() => scrollTo(contactRef)}
              className="px-3 py-1.5 text-sm text-muted-foreground hover:text-foreground rounded-md hover:bg-muted transition-colors"
            >
              Contact
            </button>
          </div>

          <div className="flex items-center gap-2">
            {/* Dark mode toggle */}
            <button
              type="button"
              data-ocid="nav.toggle"
              onClick={toggleDark}
              className="p-2 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
              aria-label={dark ? "Switch to light mode" : "Switch to dark mode"}
              title={dark ? "Light mode" : "Dark mode"}
            >
              {dark ? (
                <Sun className="h-4 w-4" />
              ) : (
                <Moon className="h-4 w-4" />
              )}
            </button>

            {/* Mobile menu */}
            <button
              type="button"
              className="md:hidden p-2 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
              onClick={() => setMobileMenuOpen((v) => !v)}
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? (
                <X className="h-4 w-4" />
              ) : (
                <Menu className="h-4 w-4" />
              )}
            </button>
          </div>
        </nav>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-border bg-background/95 backdrop-blur-md animate-fade-in-fast">
            <div className="container mx-auto px-4 py-3 flex flex-col gap-1">
              {[
                { label: "Home", ref: heroRef, ocid: "nav.home_link" },
                {
                  label: "Resources",
                  ref: resourcesRef,
                  ocid: "nav.resources_link",
                },
                {
                  label: "Bookmarks",
                  ref: bookmarksRef,
                  ocid: "nav.bookmarks_link",
                },
                { label: "Contact", ref: contactRef, ocid: "nav.contact_link" },
              ].map(({ label, ref, ocid }) => (
                <button
                  type="button"
                  key={label}
                  data-ocid={ocid}
                  onClick={() => scrollTo(ref)}
                  className="w-full text-left px-3 py-2.5 text-sm text-muted-foreground hover:text-foreground rounded-md hover:bg-muted transition-colors"
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        )}
      </header>

      <main className="flex-1">
        {/* ── Hero Section ── */}
        <section
          ref={heroRef}
          id="home"
          className="hero-grid py-16 sm:py-24 border-b border-border"
        >
          <div className="container mx-auto px-4 sm:px-6 max-w-3xl text-center">
            <div className="inline-flex items-center gap-2 text-xs font-medium px-3 py-1.5 rounded-full bg-primary/10 text-primary border border-primary/20 mb-6 font-body">
              <Sparkles className="h-3.5 w-3.5" />
              Your go-to student resource hub
            </div>
            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground mb-4 leading-tight">
              Study smarter, <span className="text-primary">not harder.</span>
            </h1>
            <p className="text-muted-foreground text-lg sm:text-xl mb-10 leading-relaxed">
              Curated programming notes, useful websites, practice platforms,
              and free courses — everything a student needs in one place.
            </p>

            {/* Search bar */}
            <div className="relative max-w-xl mx-auto">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
              <Input
                data-ocid="hero.search_input"
                type="search"
                placeholder="Search resources by title or description…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10 h-11 text-sm bg-card border-border focus-visible:ring-primary/30"
              />
            </div>
          </div>
        </section>

        {/* ── Resources Section ── */}
        <section ref={resourcesRef} id="resources" className="py-12 sm:py-16">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="mb-8">
              <h2 className="font-display text-2xl sm:text-3xl font-bold text-foreground mb-2">
                Resources
              </h2>
              <p className="text-muted-foreground text-sm">
                {filteredResources.length} resource
                {filteredResources.length !== 1 ? "s" : ""} found
                {search && ` for "${search}"`}
              </p>
            </div>

            {/* Category tabs */}
            <Tabs
              value={activeCategory}
              onValueChange={(v) => setActiveCategory(v as Category)}
              className="mb-8"
            >
              <TabsList className="flex flex-wrap h-auto gap-1 bg-muted/50 p-1 rounded-lg">
                {CATEGORIES.map((cat) => (
                  <TabsTrigger
                    key={cat}
                    value={cat}
                    data-ocid="resources.tab"
                    className="inline-flex items-center gap-1.5 text-xs font-medium rounded-md data-[state=active]:bg-card data-[state=active]:text-foreground data-[state=active]:shadow-xs"
                  >
                    {CATEGORY_ICONS[cat]}
                    <span className="hidden sm:inline">{cat}</span>
                    <span className="sm:hidden">
                      {cat === "Programming Notes"
                        ? "Notes"
                        : cat === "Useful Websites"
                          ? "Sites"
                          : cat === "Coding Practice"
                            ? "Practice"
                            : cat === "Free Courses"
                              ? "Courses"
                              : cat}
                    </span>
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>

            {/* Resource grid */}
            {filteredResources.length === 0 ? (
              <div
                data-ocid="resources.empty_state"
                className="text-center py-16 text-muted-foreground"
              >
                <Search className="h-10 w-10 mx-auto mb-4 opacity-30" />
                <p className="font-medium text-foreground mb-1">
                  No resources found
                </p>
                <p className="text-sm">
                  Try a different search term or category.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 animate-fade-in">
                {filteredResources.map((resource, i) => (
                  <ResourceCard
                    key={resource.id}
                    resource={resource}
                    isBookmarked={bookmarks.has(resource.id)}
                    onBookmarkToggle={toggleBookmark}
                    index={i + 1}
                  />
                ))}
              </div>
            )}
          </div>
        </section>

        {/* ── Bookmarks Section ── */}
        <section
          ref={bookmarksRef}
          id="bookmarks"
          className="py-12 sm:py-16 bg-muted/30 border-y border-border"
        >
          <div className="container mx-auto px-4 sm:px-6">
            <div className="mb-8 flex items-center justify-between">
              <div>
                <h2 className="font-display text-2xl sm:text-3xl font-bold text-foreground mb-2 flex items-center gap-2">
                  <BookmarkCheck className="h-6 w-6 text-primary" />
                  Bookmarks
                </h2>
                <p className="text-muted-foreground text-sm">
                  {bookmarkedResources.length} saved resource
                  {bookmarkedResources.length !== 1 ? "s" : ""}
                </p>
              </div>
            </div>

            {bookmarkedResources.length === 0 ? (
              <div
                data-ocid="bookmarks.empty_state"
                className="text-center py-16 text-muted-foreground"
              >
                <Bookmark className="h-10 w-10 mx-auto mb-4 opacity-30" />
                <p className="font-medium text-foreground mb-1">
                  No bookmarks yet
                </p>
                <p className="text-sm">
                  Click the bookmark icon on any resource card to save it here.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 animate-fade-in">
                {bookmarkedResources.map((resource, i) => (
                  <ResourceCard
                    key={resource.id}
                    resource={resource}
                    isBookmarked={true}
                    onBookmarkToggle={toggleBookmark}
                    index={i + 1}
                  />
                ))}
              </div>
            )}
          </div>
        </section>

        {/* ── Contact Section ── */}
        <section ref={contactRef} id="contact" className="py-12 sm:py-16">
          <div className="container mx-auto px-4 sm:px-6 max-w-2xl">
            <div className="mb-8 text-center">
              <h2 className="font-display text-2xl sm:text-3xl font-bold text-foreground mb-2">
                Suggest a Resource
              </h2>
              <p className="text-muted-foreground text-sm">
                Know a great resource that should be listed here? Let us know!
              </p>
            </div>

            <div className="bg-card border border-border rounded-xl p-6 sm:p-8 shadow-card">
              {submitStatus === "success" ? (
                <div
                  data-ocid="contact.success_state"
                  className="text-center py-8 animate-fade-in"
                >
                  <CheckCircle2 className="h-12 w-12 text-green-500 mx-auto mb-4" />
                  <h3 className="font-display font-semibold text-lg text-foreground mb-2">
                    Thanks for your suggestion!
                  </h3>
                  <p className="text-muted-foreground text-sm mb-6">
                    We'll review your suggestion and add it if it's a good fit.
                  </p>
                  <Button
                    variant="outline"
                    onClick={resetForm}
                    className="text-sm"
                  >
                    Submit another
                  </Button>
                </div>
              ) : submitStatus === "error" ? (
                <div
                  data-ocid="contact.error_state"
                  className="text-center py-8 animate-fade-in"
                >
                  <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
                  <h3 className="font-display font-semibold text-lg text-foreground mb-2">
                    Something went wrong
                  </h3>
                  <p className="text-muted-foreground text-sm mb-6">
                    We couldn't send your suggestion. Please try again.
                  </p>
                  <Button
                    variant="outline"
                    onClick={resetForm}
                    className="text-sm"
                  >
                    Try again
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1.5">
                      <Label
                        htmlFor="contact-name"
                        className="text-sm font-medium"
                      >
                        Name
                      </Label>
                      <Input
                        id="contact-name"
                        data-ocid="contact.input"
                        type="text"
                        placeholder="Your name"
                        value={formName}
                        onChange={(e) => setFormName(e.target.value)}
                        required
                        autoComplete="name"
                        className="text-sm"
                        disabled={submitStatus === "loading"}
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <Label
                        htmlFor="contact-email"
                        className="text-sm font-medium"
                      >
                        Email
                      </Label>
                      <Input
                        id="contact-email"
                        data-ocid="contact.email_input"
                        type="email"
                        placeholder="you@example.com"
                        value={formEmail}
                        onChange={(e) => setFormEmail(e.target.value)}
                        required
                        autoComplete="email"
                        className="text-sm"
                        disabled={submitStatus === "loading"}
                      />
                    </div>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <Label
                      htmlFor="contact-message"
                      className="text-sm font-medium"
                    >
                      Resource suggestion
                    </Label>
                    <Textarea
                      id="contact-message"
                      data-ocid="contact.textarea"
                      placeholder="Share the resource name, URL, and why it's useful for students…"
                      value={formMessage}
                      onChange={(e) => setFormMessage(e.target.value)}
                      required
                      rows={4}
                      className="text-sm resize-none"
                      disabled={submitStatus === "loading"}
                    />
                  </div>
                  <Button
                    data-ocid="contact.submit_button"
                    type="submit"
                    disabled={
                      submitStatus === "loading" ||
                      !formName.trim() ||
                      !formEmail.trim() ||
                      !formMessage.trim()
                    }
                    className="w-full sm:w-auto sm:ml-auto bg-primary text-primary-foreground hover:bg-primary/90"
                  >
                    {submitStatus === "loading" ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Sending…
                      </>
                    ) : (
                      "Send Suggestion"
                    )}
                  </Button>
                  {submitStatus === "loading" && (
                    <div
                      data-ocid="contact.loading_state"
                      className="sr-only"
                      aria-live="polite"
                    >
                      Sending your suggestion…
                    </div>
                  )}
                </form>
              )}
            </div>
          </div>
        </section>
      </main>

      {/* ── Footer ── */}
      <footer className="border-t border-border py-6 text-center text-sm text-muted-foreground">
        <p>
          © {year}. Built with{" "}
          <span className="text-destructive" aria-label="love">
            ♥
          </span>{" "}
          using{" "}
          <a
            href={footerLink}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:underline font-medium"
          >
            caffeine.ai
          </a>
        </p>
      </footer>
    </div>
  );
}
