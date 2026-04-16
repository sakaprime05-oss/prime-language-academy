"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import ThemeToggle from "./ThemeToggle";

export function Navigation({ role }: { role: string }) {
    const pathname = usePathname();

    const getLinks = () => {
        if (role === "ADMIN") {
            return [
                { href: "/dashboard/admin", label: "Dashboard", icon: HomeIcon },
                { href: "/dashboard/admin/students", label: "Étudiants", icon: UsersIcon },
                { href: "/dashboard/admin/courses", label: "Cours", icon: BookIcon },
                { href: "/dashboard/admin/payments", label: "Retards", icon: WalletIcon },
            ];
        } else if (role === "TEACHER") {
            return [
                { href: "/dashboard/teacher", label: "Dashboard", icon: HomeIcon },
                { href: "/dashboard/teacher/resources", label: "Ressources", icon: BookIcon },
            ];
        } else {
            // STUDENT
            return [
                { href: "/dashboard", label: "Accueil", icon: HomeIcon },
                { href: "/dashboard/student/courses", label: "Mes Cours", icon: BookIcon },
                { href: "/dashboard/student/profile", label: "Profil", icon: UserIcon },
            ];
        }
    };

    const links = getLinks();

    return (
        <>
            {/* Desktop Sidebar */}
            <nav className="hidden md:flex flex-col h-full gap-2 p-4">
                <div className="flex-1 space-y-2">
                    {links.map((link) => {
                        const isActive = pathname === link.href || pathname.startsWith(link.href + "/");
                        return (
                            <Link
                                key={link.href}
                                href={link.href}
                                className={`flex items-center gap-4 px-4 py-4 rounded-2xl font-bold transition-all ${isActive
                                        ? "bg-[var(--primary)] text-white shadow-lg shadow-primary/20"
                                        : "text-[var(--foreground)]/50 hover:bg-[var(--surface-hover)] hover:text-[var(--foreground)]"
                                    }`}
                            >
                                <link.icon className="w-5 h-5 flex-shrink-0" />
                                {link.label}
                            </Link>
                        )
                    })}
                </div>
                
                {/* Theme Toggle at bottom */}
                <div className="pt-4 border-t border-[var(--glass-border)] flex justify-center">
                    <ThemeToggle />
                </div>
            </nav>

            {/* Mobile Bottom Navigation */}
            <nav className="fixed bottom-0 left-0 right-0 h-20 bg-[var(--surface)] backdrop-blur-xl border-t border-[var(--glass-border)] md:hidden flex items-center justify-around px-2 z-50">
                {links.map((link) => {
                    const isActive = pathname === link.href || pathname.startsWith(link.href + "/");
                    return (
                        <Link
                            key={link.href}
                            href={link.href}
                            className={`flex flex-col items-center gap-1 p-2 rounded-xl transition-all ${isActive ? "text-[var(--primary)]" : "text-[var(--foreground)]/40"}`}
                        >
                            <link.icon className={`w-6 h-6 ${isActive ? 'scale-110' : ''}`} />
                            <span className="text-[10px] font-bold uppercase tracking-widest">{link.label}</span>
                        </Link>
                    );
                })}
                <ThemeToggle />
            </nav>
        </>
    );
}

// Icons
function HomeIcon(props: any) {
    return <svg {...props} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>;
}

function BookIcon(props: any) {
    return <svg {...props} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.246.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>;
}

function UsersIcon(props: any) {
    return <svg {...props} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>;
}

function UserIcon(props: any) {
    return <svg {...props} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>;
}

function WalletIcon(props: any) {
    return <svg {...props} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" /></svg>;
}
