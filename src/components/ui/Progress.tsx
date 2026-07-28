import { cn } from "@/lib/utils"

type ProgressProps = {
    value: number
    label?: string
    className?: string
}

export function Progress({ value, label, className }: ProgressProps) {
    const clamped = Math.max(0, Math.min(100, value))

    return (
        <div className={cn("space-y-2", className)} role="progressbar" aria-valuenow={clamped} aria-valuemin={0} aria-valuemax={100} aria-label={label || "Progress"}>
            {(label || clamped > 0) && (
                <div className="flex items-center justify-between gap-3 text-xs text-muted-foreground">
                    <span className="truncate">{label}</span>
                    <span className="shrink-0 tabular-nums">{Math.round(clamped)}%</span>
                </div>
            )}
            <div className="h-2 overflow-hidden rounded-full bg-muted">
                <div
                    className="h-full rounded-full bg-primary transition-[width] duration-300 ease-out"
                    style={{ width: `${clamped}%` }}
                />
            </div>
        </div>
    )
}
