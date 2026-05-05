"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { logoutAction } from "@/app/actions/logout";
import { motion } from "framer-motion";

type StudentMode = "FORMATION" | "CLUB";

export function StudentSidebarNavClient({ dict, mode = "FORMATION" }: { dict?: any; mode?: StudentMode }) {
    const pathname = usePathname();

    const getLabel = (key: string, fallback: string) => dict?.[key] || fallback;

    const studentLinks = mode === "CLUB"
        ? [
            { href: "/dashboard/student", label: "Accueil Club", icon: HomeIcon, exact: true },
            { href: "/dashboard/student/club", label: "Club", icon: ClubIcon },
            { href: "/dashboard/student/appointments", label: "Sessions", icon: ClockIcon },
            { href: "/dashboard/student/forum", label: getLabel("forum", "Forum"), icon: ChatIcon },
            { href: "/dashboard/student/messages", label: getLabel("messages", "Messagerie"), icon: MessageIcon },
            { href: "/dashboard/student/profile", label: getLabel("profile", "Profil"), icon: UserIcon },
        ]
        : [
            { href: "/dashboard/student", label: getLabel("dashboard", "Accueil"), icon: HomeIcon, exact: true },
            { href: "/dashboard/student/courses", label: getLabel("courses", "Cours"), icon: BookIcon },
            { href: "/dashboard/student/payments", label: "Paiements", icon: WalletIcon },
            { href: "/dashboard/student/appointments", label: getLabel("appointments", "Rendez-vous"), icon: ClockIcon },
            { href: "/dashboard/student/messages", label: getLabel("messages", "Messages"), icon: MessageIcon },
            { href: "/dashboard/student/profile", label: getLabel("profile", "Profil"), icon: UserIcon },
        ];

    return (
        <nav className="flex flex-col gap-2">
            <p className="text-[10px] font-black uppercase tracking-widest text-[var(--foreground)]/30 px-4 mb-2">
                {getLabel("navigation", "Navigation")}
            </p>
            {studentLinks.map((link) => {
                const isActive = link.exact
                    ? pathname === link.href
                    : pathname === link.href || pathname.startsWith(link.href + "/");
                return (
                    <Link
                        key={link.href}
                        href={link.href}
                        className={`flex items-center gap-3 px-4 py-3.5 rounded-lg font-bold transition-colors duration-200 group ${isActive
                            ? "bg-primary text-primary-foreground shadow-sm"
                            : "text-[var(--foreground)]/58 hover:bg-[var(--surface-hover)] hover:text-[var(--foreground)]"
                            }`}
                    >
                        <link.icon className={`w-5 h-5 flex-shrink-0 transition-transform duration-200 ${isActive ? '' : 'group-hover:scale-110'}`} />
                        {link.label}
                    </Link>
                );
            })}

            {/* Separator */}
            <div className="h-px bg-[var(--foreground)]/8 my-4 mx-2"></div>

            {/* Logout */}
            <form action={logoutAction}>
                <button
                    type="submit"
                    className="flex items-center gap-3 px-4 py-3.5 rounded-lg font-bold text-red-500/65 hover:bg-red-500/10 hover:text-red-500 transition-colors duration-200 w-full"
                >
                    <LogoutIcon className="w-5 h-5 flex-shrink-0" />
                    {dict?.logout || "Déconnexion"}
                </button>
            </form>
        </nav>
    );
}

export function StudentMobileNavClient({ dict, mode = "FORMATION" }: { dict?: any; mode?: StudentMode }) {
    const pathname = usePathname();

    const getLabel = (key: string, fallback: string) => dict?.[key] || fallback;

    const studentLinks = mode === "CLUB"
        ? [
            { href: "/dashboard/student", label: "Accueil", icon: HomeIcon, exact: true },
            { href: "/dashboard/student/club", label: "Club", icon: ClubIcon },
            { href: "/dashboard/student/appointments", label: "Sessions", icon: ClockIcon },
            { href: "/dashboard/student/forum", label: "Forum", icon: ChatIcon },
            { href: "/dashboard/student/profile", label: "Profil", icon: UserIcon },
        ]
        : [
            { href: "/dashboard/student", label: "Accueil", icon: HomeIcon, exact: true },
            { href: "/dashboard/student/courses", label: "Cours", icon: BookIcon },
            { href: "/dashboard/student/payments", label: "Payer", icon: WalletIcon },
            { href: "/dashboard/student/appointments", label: "RDV", icon: ClockIcon },
            { href: "/dashboard/student/profile", label: "Profil", icon: UserIcon },
        ];

    return (
        <nav className="fixed bottom-0 left-0 right-0 z-50 bg-[var(--surface)]/95 backdrop-blur-2xl border-t border-[var(--glass-border)] grid grid-cols-5 shadow-[0_-10px_28px_rgba(0,0,0,0.08)] px-1 pb-[env(safe-area-inset-bottom)]">
            {studentLinks.map((link) => {
                const isActive = link.exact
                    ? pathname === link.href
                    : pathname === link.href || pathname.startsWith(link.href + "/");
                return (
                    <Link
                        key={link.href}
                        href={link.href}
                        className={`relative flex min-h-[68px] flex-col flex-1 items-center justify-center gap-1 px-1 py-2 mx-0.5 min-w-0 tap-highlight-transparent ${
                            isActive
                            ? "text-primary"
                            : "text-[var(--foreground)]/40 hover:text-[var(--foreground)]/70 active:scale-95 transition-all duration-200"
                        }`}
                    >
                        {isActive && (
                            <motion.div
                                layoutId="mobile-nav-active"
                                className="absolute inset-x-1 inset-y-2 bg-primary/10 rounded-lg -z-10"
                                transition={{ type: "spring", stiffness: 400, damping: 30 }}
                            />
                        )}
                        <link.icon className={`w-5 h-5 flex-shrink-0 transition-transform duration-300 ${isActive ? 'scale-110 drop-shadow-md' : ''}`} />
                        <span className={`text-[9px] font-black tracking-wide leading-tight truncate max-w-[92%] text-center mt-0.5 transition-colors duration-300 ${
                            isActive ? 'text-primary' : 'opacity-60'
                        }`}>
                            {link.label}
                        </span>
                    </Link>
                );
            })}
        </nav>
    );
}

// ====== ICONS ======

function HomeIcon(props: any) {
    return <svg {...props} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>;
}

function BookIcon(props: any) {
    return <svg {...props} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.246.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>;
}

function UserIcon(props: any) {
    return <svg {...props} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>;
}

function LogoutIcon(props: any) {
    return <svg {...props} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>;
}

function ChatIcon(props: any) {
    return <svg {...props} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" /></svg>;
}

function ClockIcon(props: any) {
    return <svg {...props} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
}

function ClubIcon(props: any) {
    return <svg {...props} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>;
}

function MessageIcon(props: any) {
    return <svg {...props} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" /></svg>;
}

function WalletIcon(props: any) {
    return <svg {...props} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 9V7a3 3 0 00-3-3H6a3 3 0 00-3 3v10a3 3 0 003 3h12a3 3 0 003-3v-5a3 3 0 00-3-3H7m10 4h.01" /></svg>;
}
