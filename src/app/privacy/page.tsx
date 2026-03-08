import Link from "next/link"
import { ArrowLeft, ShieldCheck } from "lucide-react"

export default function PrivacyPage() {
    return (
        <div className="container mx-auto px-4 py-12 max-w-3xl flex-1">
            <Link href="/" className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-foreground mb-8">
                <ArrowLeft className="mr-2 size-4" />
                Back to Home
            </Link>

            <div className="space-y-8">
                <div>
                    <div className="inline-flex size-12 items-center justify-center rounded-xl bg-green-500/10 text-green-500 mb-6">
                        <ShieldCheck className="size-6" />
                    </div>
                    <h1 className="text-4xl font-bold tracking-tight mb-4">Privacy Policy</h1>
                    <p className="text-xl text-muted-foreground">
                        A privacy policy that actually respects your privacy.
                    </p>
                </div>

                <div className="prose prose-neutral dark:prose-invert max-w-none space-y-6 text-muted-foreground">
                    <div className="p-6 bg-card border rounded-2xl shadow-sm text-foreground mb-8">
                        <h3 className="text-lg font-semibold mb-2">The Short Version</h3>
                        <p>
                            We do not upload, store, or analyze your files. All PDF processing happens directly on your device inside your web browser.
                            We do not track you, and we do not use cookies.
                        </p>
                    </div>

                    <p>
                        This Privacy Policy describes how your personal information and files are handled when you visit or use pdFahim.
                    </p>

                    <h2 className="text-xl font-semibold text-foreground pt-4">1. Document Processing</h2>
                    <p>
                        pdFahim is designed with a "local-first" architecture. When you select a file to merge, split, compress, or convert, the file is loaded directly into your browser's memory. It is never transmitted across the internet to a backend server. Once you close the tab or refresh the page, the file data used by the application is completely purged from your device's active memory.
                    </p>

                    <h2 className="text-xl font-semibold text-foreground pt-4">2. Data Collection</h2>
                    <p>
                        We do not collect any personal data, usage metrics, or analytics. There are no hidden tracking pixels, no third-party analytics scripts, and no advertising networks embedded in this tool.
                    </p>

                    <h2 className="text-xl font-semibold text-foreground pt-4">3. Local Storage and Cookies</h2>
                    <p>
                        pdFahim does not use internet cookies or your browser's local storage to save any identifiable information.
                    </p>

                    <h2 className="text-xl font-semibold text-foreground pt-4">4. Third-Party Links</h2>
                    <p>
                        Our website may contain links to independent third-party websites (like GitHub). Once you leave our site, this privacy policy no longer applies.
                    </p>

                    <h2 className="text-xl font-semibold text-foreground pt-4">5. Changes to This Policy</h2>
                    <p>
                        We may update our Privacy Policy from time to time. Any changes will be reflected directly on this page. By continuing to use the service, you agree to the revised policy.
                    </p>
                </div>
            </div>
        </div>
    )
}
