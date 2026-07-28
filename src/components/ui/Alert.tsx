import type { ReactNode } from "react"
import { CheckCircle, AlertCircle } from "lucide-react"
import { cn } from "@/lib/utils"

type AlertProps = {
    variant?: "error" | "success"
    title?: string
    children: ReactNode
    className?: string
}

export function Alert({ variant = "error", title, children, className }: AlertProps) {
    const isError = variant === "error"

    return (
        <div
            role={isError ? "alert" : "status"}
            aria-live={isError ? "assertive" : "polite"}
            className={cn(
                "rounded-xl border p-4 text-sm",
                isError
                    ? "border-destructive/20 bg-destructive/10 text-destructive"
                    : "border-green-200 bg-green-50 text-green-800",
                className
            )}
        >
            <div className="flex items-start gap-3">
                {isError ? (
                    <AlertCircle className="size-5 shrink-0 mt-0.5" aria-hidden />
                ) : (
                    <CheckCircle className="size-5 shrink-0 mt-0.5 text-green-600" aria-hidden />
                )}
                <div className="min-w-0">
                    {title && (
                        <p className={cn("font-semibold mb-1", !isError && "text-green-800")}>
                            {title}
                        </p>
                    )}
                    <div className={cn(!isError && "text-green-700")}>{children}</div>
                </div>
            </div>
        </div>
    )
}
