import { Alert } from "@/components/ui/Alert"

export function FileRiskNotice({ message }: { message: string | null | undefined }) {
    if (!message) return null
    return (
        <Alert className="mt-4" variant="warning" title="Large file notice">
            {message}
        </Alert>
    )
}
