import type { ReactNode } from "react"
import { CheckCircle, AlertCircle, AlertTriangle } from "lucide-react"
import { cn } from "@/lib/utils"

type AlertProps = {
    variant?: "error" | "success" | "warning"
    title?: string
    children: ReactNode
    className?: string
}

export function Alert({ variant = "error", title, children, className }: AlertProps) {
    return (
        <div
            role={variant === "error" ? "alert" : "status"}
            aria-live={variant === "error" ? "assertive" : "polite"}
            className={cn(
                "rounded-xl border p-4 text-sm",
                variant === "error" && "border-destructive/20 bg-destructive/10 text-destructive",
                variant === "success" && "border-green-200 bg-green-50 text-green-800",
                variant === "warning" && "border-amber-200 bg-amber-50 text-amber-900",
                className
            )}
        >
            <div className="flex items-start gap-3">
                {variant === "error" && <AlertCircle className="size-5 shrink-0 mt-0.5" aria-hidden />}
                {variant === "success" && <CheckCircle className="size-5 shrink-0 mt-0.5 text-green-600" aria-hidden />}
                {variant === "warning" && <AlertTriangle className="size-5 shrink-0 mt-0.5 text-amber-600" aria-hidden />}
                <div className="min-w-0">
                    {title && (
                        <p
                            className={cn(
                                "font-semibold mb-1",
                                variant === "success" && "text-green-800",
                                variant === "warning" && "text-amber-900"
                            )}
                        >
                            {title}
                        </p>
                    )}
                    <div
                        className={cn(
                            variant === "success" && "text-green-700",
                            variant === "warning" && "text-amber-800"
                        )}
                    >
                        {children}
                    </div>
                </div>
            </div>
        </div>
    )
}
