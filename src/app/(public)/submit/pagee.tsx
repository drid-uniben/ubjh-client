"use client";

import Link from 'next/link';
import Image from 'next/image';
import {
  AlertCircle,
  Clock,
  Calendar,
  ArrowLeft,
  BookOpen,
  Home,
  Info
} from 'lucide-react';
import Footer from '@/components/Footer';

export default function ManuscriptSubmissionPage() {
  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col">
      {/* Header */}
      <header className="bg-journal-maroon text-white shadow-lg sticky top-0 z-50 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-white rounded-lg flex items-center justify-center shadow-inner">
                <Image
                  src="/uniben-logo.png"
                  alt="UNIBEN Logo"
                  width={48}
                  height={48}
                  className="rounded"
                />
              </div>
              <div>
                <h1 className="text-xl font-bold tracking-tight">
                  UNIBEN Journal of Humanities
                </h1>
                <p className="text-sm text-journal-rose font-medium opacity-90">
                  Submit Your Manuscript
                </p>
              </div>
            </div>
            <Link
              href="/"
              className="text-white hover:text-journal-rose font-semibold flex items-center gap-2 transition-colors"
            >
              <ArrowLeft className="h-4 w-4" /> Back to Home
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 container mx-auto px-4 py-16 max-w-4xl flex flex-col items-center justify-center text-center">
        <div className="bg-white rounded-2xl shadow-2xl p-8 md:p-12 w-full border border-gray-100">
          <div className="w-24 h-24 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-8 border-4 border-white shadow-lg">
            <Clock className="h-12 w-12 text-journal-maroon" />
          </div>
          
          <h2 className="text-4xl font-bold text-gray-900 mb-6 font-serif tracking-tight">
            Submission Period Closed
          </h2>
          
          <div className="bg-blue-50/50 border-l-4 border-journal-maroon p-6 mb-10 rounded-r-lg inline-block text-left shadow-sm">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-6 w-6 text-journal-maroon flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-lg text-journal-maroon font-bold mb-2">
                  The deadline for submission for this issue has passed.
                </p>
                <p className="text-gray-700 leading-relaxed">
                  We are currently not accepting new manuscripts for the UNIBEN Journal of Humanities. Please wait until the next call for papers to submit your research.
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-8">
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              We appreciate your interest in publishing with us. You can explore our published research or check the author guidelines to prepare for future submissions.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Link
                href="/"
                className="inline-flex items-center gap-2 bg-journal-maroon text-white px-10 py-4 rounded-full font-bold hover:bg-journal-maroon-dark transition-all shadow-lg hover:shadow-xl hover:scale-105"
              >
                <Home className="h-5 w-5" />
                Return Home
              </Link>
              <Link
                href="/current-issue"
                className="inline-flex items-center gap-2 bg-white border-2 border-journal-maroon text-journal-maroon px-10 py-4 rounded-full font-bold hover:bg-journal-accent-tag transition-all shadow-md hover:shadow-lg"
              >
                <BookOpen className="h-5 w-5" />
                Browse Current Issue
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-12 flex items-center gap-2 text-gray-500 bg-white border border-gray-200 px-6 py-3 rounded-full shadow-sm">
          <Info className="h-4 w-4 text-journal-maroon" />
          <span className="text-sm font-semibold">Follow our announcements for the next call for papers.</span>
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}

/*
ORIGINAL SUBMISSION FORM CODE (COMMENTED OUT)

import { useState, useRef, FormEvent } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Upload,
  AlertCircle,
  CheckCircle,
  Send,
  Loader2,
  X,
  Plus,
  Info,
  FileText,
  Users,
  ExternalLink,
} from 'lucide-react';
import { manuscriptApi } from '@/services/api';
import Footer from '@/components/Footer';
import { toast, Toaster } from 'sonner';

interface CoAuthor {
  id: string;
  name: string;
  email: string;
  faculty: string;
  affiliation: string;
  orcid: string;
}

interface FormErrors {
  [key: string]: string;
}

export function ManuscriptSubmissionPageOriginal() {
  // Form state
  const [formData, setFormData] = useState({
    title: '',
    abstract: '',
    keywords: '',
    submitterName: '',
    submitterEmail: '',
    submitterFaculty: '',
    submitterAffiliation: '',
    submitterOrcid: '',
  });

  const [coAuthors, setCoAuthors] = useState<CoAuthor[]>([]);
  const [showCoAuthorForm, setShowCoAuthorForm] = useState(false);
  const [currentCoAuthor, setCurrentCoAuthor] = useState({
    name: '',
    email: '',
    faculty: '',
    affiliation: '',
    orcid: '',
  });

  // File state
  const [manuscriptFile, setManuscriptFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Submission states
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [formErrors, setFormErrors] = useState<FormErrors>({});

  // Agreement state
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  // ... (rest of the logic)
}
*/
