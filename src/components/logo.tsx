import Image from "next/image";

export function LogoMark({ className = "w-10 h-10" }: { className?: string }) {
    return (
        <div className={`relative flex items-center justify-center overflow-hidden shrink-0 ${className}`}>
            <Image 
                src="/logo.png" 
                alt="Prime Language Academy Logo" 
                fill
                sizes="(max-width: 768px) 100vw, 512px"
                className="object-contain"
                priority
            />
        </div>
    );
}

export function PrimeLogo({ className = "h-10" }: { className?: string }) {
    return (
        <div className={`flex items-center gap-3 ${className}`}>
            <LogoMark className="h-full w-auto aspect-square" />
            <div className="h-full w-[2px] bg-[var(--foreground)]/20 hidden sm:block"></div>
            <div className="flex flex-col justify-center">
                <span className="font-extrabold text-xs leading-[1.1] tracking-widest text-[var(--foreground)]">PRIME</span>
                <span className="font-medium text-xs leading-[1.1] tracking-widest text-[var(--foreground)]">LANGUAGE</span>
                <span className="font-medium text-xs leading-[1.1] tracking-widest text-[var(--foreground)]">ACADEMY</span>
            </div>
        </div>
    );
}
