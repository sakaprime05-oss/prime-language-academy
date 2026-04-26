"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { logoutAction } from "@/app/actions/logout";

const studentLinks = [
    { href: "/dashboard/student", label: "Accueil", icon: HomeIcon, exact: true },
    { href: "/dashboard/student/courses", label: "Mes Cours", icon: BookIcon },
    { href: "/dashboard/student/forum", label: "Forum", icon: ChatIcon },
    { href: "/dashboard/student/club", label: "English Club", icon: ClubIcon },
    { href: "/dashboard/student/appointments", label: "Rendez-vous", icon: ClockIcon },
    { href: "/dashboard/student/messages", label: "Messagerie", icon: MessageIcon },
    { href: "/dashboard/student/profile", label: "Mon Profil", icon: UserIcon },
];

export function StudentSidebarNavClient() {
    const pathname = usePathname();

    return (
        <nav className="flex flex-col gap-2">
            <p className="text-[10px] font-black uppercase tracking-widest text-[var(--foreground)]/30 px-4 mb-2">Navigation</p>
            {studentLinks.map((link) => {
                const isActive = link.exact
                    ? pathname === link.href
                    : pathname === link.href || pathname.startsWith(link.href + "/");
                return (
                    <Link
                        key={link.href}
                        href={link.href}
                        className={`flex items-center gap-4 px-4 py-4 rounded-2xl font-bold transition-all duration-200 group ${isActive
                            ? "bg-gradient-to-r from-primary to-secondary text-white shadow-lg shadow-primary/20"
                            : "text-[var(--foreground)]/50 hover:bg-[var(--surface-hover)] hover:text-[var(--foreground)]"
                            }`}
                    >
                        <link.icon className={`w-5 h-5 flex-shrink-0 transition-transform duration-200 ${isActive ? '' : 'group-hover:scale-110'}`} />
                        {link.label}
                    </Link>
                );
            })}

            {/* Separator */}
            <div className="h-px bg-[var(--foreground)]/5 my-4 mx-2"></div>

            {/* Logout */}
            <form action={logoutAction}>
                <button
                    type="submit"
                    className="flex items-center gap-4 px-4 py-4 rounded-2xl font-bold text-red-500/60 hover:bg-red-500/10 hover:text-red-500 transition-all duration-200 w-full"
                >
                    <LogoutIcon className="w-5 h-5 flex-shrink-0" />
                    Déconnexion
                </button>
            </form>
        </nav>
    );
}

export function StudentMobileNavClient() {
    const pathname = usePathname();

    return (
        <nav className="fixed bottom-0 left-0 right-0 z-50 bg-[var(--surface)]/90 backdrop-blur-3xl border-t border-white/10 dark:border-white/5 flex items-center justify-around px-2 py-3 shadow-2xl shadow-black/20">
            {studentLinks.map((link) => {
                const isActive = link.exact
                    ? pathname === link.href
                    : pathname === link.href || pathname.startsWith(link.href + "/");
                return (
                    <Link
                        key={link.href}
                        href={link.href}
                        className={`flex flex-col flex-1 items-center justify-center gap-1 px-1 py-2 mx-0.5 rounded-2xl transition-all duration-200 min-w-0 ${isActive
                            ? "text-primary"
                            : "text-[var(--foreground)]/40 hover:text-[var(--foreground)]/70 hover:bg-[var(--foreground)]/5"
                            }`}
                    >
                        <link.icon className={`w-5 h-5 sm:w-6 sm:h-6 ${isActive ? 'scale-110' : ''} transition-transform`} />
                        <span className={`text-[8px] sm:text-[10px] font-black tracking-wider truncate max-w-[90%] text-center ${isActive ? '' : 'opacity-60'}`}>
                            {link.label}
                        </span>
                        {isActive && (
                            <div className="w-4 h-1 bg-primary rounded-full mt-0.5 animate-in zoom-in duration-300"></div>
                        )}
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
