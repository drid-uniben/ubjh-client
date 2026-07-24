import Link from "next/link";
import { Home, BookOpen, FileText, Compass } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const metadata = {
  title: "Page Not Found",
  description:
    "The page you are looking for could not be found. Return to the UNIBEN Journal of Humanities home or browse the current issue.",
};

export default function NotFound() {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Masthead */}
      <header className="bg-journal-maroon text-white shadow-lg sticky top-0 z-50">
        <Header />
      </header>

      {/* 404 Hero */}
      <main className="flex-1 relative bg-gradient-to-br from-journal-maroon to-journal-maroon-dark text-white">
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
          <p className="font-serif text-[6rem] sm:text-[9rem] font-bold leading-none tracking-tight text-white">
            404
          </p>
          <span className="inline-block h-1 w-20 rounded-full bg-journal-rose/70" />

          <h1 className="mt-8 font-serif text-3xl sm:text-4xl font-bold leading-tight">
            This page is not in our archive
          </h1>
          <p className="mt-4 text-lg text-journal-rose leading-relaxed max-w-xl mx-auto">
            The link may be broken or the page may have moved. Let&apos;s get you
            back to the scholarship.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/"
              className="inline-flex items-center gap-2 bg-white text-journal-maroon px-8 py-4 rounded-full font-bold hover:bg-journal-rose transition-all shadow-xl hover:shadow-2xl hover:scale-105"
            >
              <Home className="h-5 w-5" />
              Back to Home
            </Link>
            <Link
              href="/current-issue"
              className="inline-flex items-center gap-2 bg-transparent border-2 border-white text-white px-8 py-4 rounded-full font-bold hover:bg-white hover:text-journal-maroon transition-all"
            >
              <BookOpen className="h-5 w-5" />
              Browse Current Issue
            </Link>
          </div>

          {/* Contextual links */}
          <div className="mt-14 grid sm:grid-cols-3 gap-4 text-left">
            {[
              {
                href: "/archives",
                label: "Archives",
                desc: "Browse past volumes and issues",
                Icon: BookOpen,
              },
              {
                href: "/for-authors",
                label: "For Authors",
                desc: "Submission and author guidelines",
                Icon: FileText,
              },
              {
                href: "/about",
                label: "About the Journal",
                desc: "Scope, mission, and policies",
                Icon: Compass,
              },
            ].map(({ href, label, desc, Icon }) => (
              <Link
                key={href}
                href={href}
                className="group bg-white/10 backdrop-blur-sm border border-white/15 rounded-2xl p-5 transition-all hover:bg-white/15 hover:border-white/30"
              >
                <Icon className="h-6 w-6 text-journal-rose" />
                <p className="mt-3 font-bold">{label}</p>
                <p className="mt-1 text-sm text-journal-rose/90">{desc}</p>
              </Link>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
