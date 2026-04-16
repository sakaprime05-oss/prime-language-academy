export function LogoMark({ className = "w-10 h-10", color = "#ed1c24" }: { className?: string, color?: string }) {
    return (
        <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
            <g stroke={color} strokeWidth="18" strokeLinecap="round" strokeLinejoin="round">
                {/* Ligne très inclinée à gauche */}
                <line x1="20" y1="75" x2="45" y2="40" />
                {/* Ligne légèrement inclinée au milieu */}
                <line x1="50" y1="80" x2="70" y2="25" />
                {/* Ligne droite verticale */}
                <line x1="85" y1="80" x2="85" y2="25" />
            </g>
        </svg>
    );
}

export function PrimeLogo({ className = "h-10", color = "#ed1c24" }: { className?: string, color?: string }) {
    return (
        <div className={`flex items-center gap-3 ${className}`}>
            <LogoMark className="h-full w-auto" color={color} />
            <div className="h-full w-[2px] bg-[var(--foreground)]/20 hidden sm:block"></div>
            <div className="flex flex-col justify-center">
                <span className="font-extrabold text-xs leading-[1.1] tracking-widest text-[var(--foreground)]">PRIME</span>
                <span className="font-medium text-xs leading-[1.1] tracking-widest text-[var(--foreground)]">LANGUAGE</span>
                <span className="font-medium text-xs leading-[1.1] tracking-widest text-[var(--foreground)]">ACADEMY</span>
            </div>
        </div>
    );
}
