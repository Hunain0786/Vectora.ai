"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Check, X } from "lucide-react"
import { Navbar } from "@/components/navbar"
import Image from "next/image"

export default function PricingPage() {
    const router = useRouter()

    return (
        <div className="min-h-screen bg-grid">
            {/* Header - Copy from page.tsx to maintain consistency */}
            <Navbar />

            {/* Main Content */}
            <section className="container max-w-6xl mx-auto px-4 py-16 md:py-24">
                <div className="flex flex-col items-center text-center gap-4 mb-16 animate-in fade-in slide-in-from-bottom-4 duration-1000">
                    <h1 className="text-4xl md:text-5xl font-bold tracking-tight">Simple, Transparent Pricing</h1>
                    <p className="text-lg text-muted-foreground max-w-2xl">
                        Choose the plan that's right for you. No hidden fees.
                    </p>
                </div>

                <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                    {/* Free Pack */}
                    <Card className="flex flex-col relative overflow-hidden border-2 animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-150 hover:border-primary/50 transition-colors">
                        <CardHeader>
                            <CardTitle className="text-2xl">Free Pack</CardTitle>
                            <CardDescription>Perfect for personal use and exploring data.</CardDescription>
                        </CardHeader>
                        <CardContent className="flex-1">
                            <div className="text-3xl font-bold mb-6">$0 <span className="text-lg font-normal text-muted-foreground">/ month</span></div>
                            <ul className="space-y-4 text-sm">
                                <li className="flex items-center gap-3">
                                    <div className="flex items-center justify-center size-5 rounded-full bg-green-100 dark:bg-green-900/30">
                                        <Check className="size-3 text-green-600 dark:text-green-400" />
                                    </div>
                                    <span>7 requests per day</span>
                                </li>
                                <li className="flex items-center gap-3">
                                    <div className="flex items-center justify-center size-5 rounded-full bg-green-100 dark:bg-green-900/30">
                                        <Check className="size-3 text-green-600 dark:text-green-400" />
                                    </div>
                                    <span>1 report generation per day</span>
                                </li>
                                <li className="flex items-center gap-3">
                                    <div className="flex items-center justify-center size-5 rounded-full bg-green-100 dark:bg-green-900/30">
                                        <Check className="size-3 text-green-600 dark:text-green-400" />
                                    </div>
                                    <span>1 chart generation per day</span>
                                </li>
                                <li className="flex items-center gap-3 text-muted-foreground">
                                    <div className="flex items-center justify-center size-5 rounded-full bg-muted">
                                        <X className="size-3" />
                                    </div>
                                    <span>Excel sheet solver</span>
                                </li>
                                <li className="flex items-center gap-3 text-muted-foreground">
                                    <div className="flex items-center justify-center size-5 rounded-full bg-muted">
                                        <X className="size-3" />
                                    </div>
                                    <span>Higher accuracy mode</span>
                                </li>
                            </ul>
                        </CardContent>
                        <CardFooter>
                            <Button className="w-full" variant="outline" onClick={() => router.push('/signup')}>
                                Get Started
                            </Button>
                        </CardFooter>
                    </Card>

                    {/* Pro Pack */}
                    <Card className="flex flex-col relative overflow-hidden border-2 border-primary/20 shadow-lg animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-300">
                        <div className="absolute top-0 right-0 p-0">
                            <div className="bg-primary text-primary-foreground text-xs font-semibold px-3 py-1 rounded-bl-lg">Coming Soon</div>
                        </div>
                        <CardHeader>
                            <CardTitle className="text-2xl">Pro Pack</CardTitle>
                            <CardDescription>For power users who need professional capabilities.</CardDescription>
                        </CardHeader>
                        <CardContent className="flex-1">
                            <div className="flex items-baseline gap-2 mb-6">
                                <div className="text-3xl font-bold blur-[6px] select-none opacity-50">$29</div>
                                <span className="text-lg font-normal text-muted-foreground">/ month</span>
                            </div>

                            <ul className="space-y-4 text-sm">
                                <li className="flex items-center gap-3">
                                    <div className="flex items-center justify-center size-5 rounded-full bg-primary/10">
                                        <Check className="size-3 text-primary" />
                                    </div>
                                    <span>Unlimited requests</span>
                                </li>
                                <li className="flex items-center gap-3">
                                    <div className="flex items-center justify-center size-5 rounded-full bg-primary/10">
                                        <Check className="size-3 text-primary" />
                                    </div>
                                    <span>Unlimited chart generation</span>
                                </li>
                                <li className="flex items-center gap-3">
                                    <div className="flex items-center justify-center size-5 rounded-full bg-primary/10">
                                        <Check className="size-3 text-primary" />
                                    </div>
                                    <span>Unlimited report generation</span>
                                </li>
                                <li className="flex items-center gap-3">
                                    <div className="flex items-center justify-center size-5 rounded-full bg-primary/10">
                                        <Check className="size-3 text-primary" />
                                    </div>
                                    <span>Excel sheet solver</span>
                                </li>
                                <li className="flex items-center gap-3">
                                    <div className="flex items-center justify-center size-5 rounded-full bg-primary/10">
                                        <Check className="size-3 text-primary" />
                                    </div>
                                    <span>Higher accuracy mode</span>
                                </li>
                            </ul>
                        </CardContent>
                        <CardFooter>
                            <Button className="w-full" disabled>
                                Join Waitlist
                            </Button>
                        </CardFooter>
                    </Card>
                </div>

                <div className="mt-16 text-center">
                    <p className="text-muted-foreground">
                        Need a custom enterprise solution? <Button variant="link" className="px-1 h-auto font-normal">Contact Sales</Button>
                    </p>
                </div>
            </section>

            <footer className="border-t bg-secondary/30 mt-auto">
                <div className="container max-w-6xl mx-auto px-4 py-8">
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                        <div className="flex items-center gap-2">
                            <div className="flex items-center justify-center size-8 rounded-md bg-primary/10 overflow-hidden relative">
                                <Image src="/V.png" alt="Vectora.ai Logo" fill className="object-contain p-1" />
                            </div>
                            <span className="font-semibold">Vectora.ai</span>
                        </div>
                        <p className="text-sm text-muted-foreground">© 2025 Vectora.ai. All rights reserved.</p>
                    </div>
                </div>
            </footer>
        </div>
    )
}
