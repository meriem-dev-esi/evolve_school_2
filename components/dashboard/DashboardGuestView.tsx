import {
  ArrowRight,
  BookOpen,
  GraduationCap,
  Lock,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { Link } from "@/i18n/navigation";

interface DashboardGuestViewProps {
  locale: string;
}

/**
 * DashboardGuestView is rendered for unauthenticated users visiting /dashboard,
 * displaying key platform features and prompting sign in / registration.
 */
export default function DashboardGuestView({
  locale,
}: DashboardGuestViewProps) {
  return (
    <div className="min-h-screen bg-canvas text-ink flex flex-col selection:bg-lime-100 selection:text-lime-900">
      <Navbar />

      <main className="flex-1 px-6 pt-32 pb-20 relative overflow-hidden flex items-center justify-center">
        {/* Decorative background blobs */}
        <div className="pointer-events-none absolute -top-40 left-1/2 -translate-x-1/2 h-[500px] w-[700px] rounded-full bg-lime-200 blur-[130px] opacity-35" />
        <div className="pointer-events-none absolute -bottom-40 right-10 h-[400px] w-[400px] rounded-full bg-emerald-200 blur-[120px] opacity-30" />
        <div className="pointer-events-none absolute inset-0 bg-grid-pattern opacity-50" />

        <div className="relative z-10 mx-auto max-w-xl text-center">
          <div className="mx-auto inline-flex items-center gap-2 rounded-full border border-lime-200 bg-lime-50 px-4 py-1.5 text-xs font-bold text-lime-800 uppercase tracking-widest">
            <Lock className="h-3.5 w-3.5 text-lime-600" />
            Espace Apprenant Evolve
          </div>

          <h1 className="mt-6 text-3xl sm:text-4xl font-black tracking-tight text-gray-900">
            Connectez-vous à votre tableau de bord
          </h1>

          <p className="mt-4 text-sm sm:text-base leading-relaxed text-gray-500">
            Retrouvez vos cours en cours, reprenez vos leçons là où vous vous
            êtes arrêté, suivez votre assiduité et téléchargez vos attestations
            de réussite.
          </p>

          {/* Value proposition perks grid */}
          <div className="mt-8 grid gap-3 text-start sm:grid-cols-2">
            <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
              <div className="flex items-center gap-2.5 text-xs font-semibold text-gray-900">
                <Sparkles className="h-4 w-4 text-lime-600 shrink-0" />
                Reprise fluide des cours
              </div>
              <p className="mt-1 text-[11px] text-gray-500">
                Accès direct à votre dernière vidéo et code source.
              </p>
            </div>

            <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
              <div className="flex items-center gap-2.5 text-xs font-semibold text-gray-900">
                <GraduationCap className="h-4 w-4 text-emerald-600 shrink-0" />
                Attestations certifiées
              </div>
              <p className="mt-1 text-[11px] text-gray-500">
                Certificats officiels à partager sur LinkedIn.
              </p>
            </div>

            <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
              <div className="flex items-center gap-2.5 text-xs font-semibold text-gray-900">
                <ShieldCheck className="h-4 w-4 text-sky-500 shrink-0" />
                Mentorat &amp; Support
              </div>
              <p className="mt-1 text-[11px] text-gray-500">
                Canal direct avec vos instructeurs et formateurs.
              </p>
            </div>

            <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
              <div className="flex items-center gap-2.5 text-xs font-semibold text-gray-900">
                <BookOpen className="h-4 w-4 text-emerald-500 shrink-0" />
                Ateliers du samedi
              </div>
              <p className="mt-1 text-xs text-gray-500">
                Suivi de vos réservations présentielles et visio.
              </p>
            </div>
          </div>

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/sign-in"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-2xl bg-lime-400 px-8 py-3.5 text-sm font-bold text-black shadow-lg shadow-lime-400/30 transition hover:bg-lime-300 active:scale-95"
            >
              <span>Se connecter à mon compte</span>
              <ArrowRight className="h-4 w-4" />
            </Link>

            <Link
              href={`/${locale}/formations`}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-2xl border border-gray-300 bg-white px-6 py-3.5 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition shadow-sm"
            >
              Explorer les formations
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
