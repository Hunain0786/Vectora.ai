"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { FileText, BarChart3, TrendingUp, Zap, Menu, MessageSquare, Shield, Sparkles } from "lucide-react"
import Image from "next/image"
import { Sheet, SheetContent, SheetTrigger, SheetTitle, SheetHeader as SheetHeaderComponent } from "@/components/ui/sheet"

export default function FeaturesPage() {

    const userName:String | null= localStorage.getItem("username") 

    const router = useRouter()

    return (
        <div className="min-h-screen bg-grid">
            <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
                <div className="container flex items-center justify-between h-16 max-w-6xl mx-auto px-4">
                    <div className="flex items-center gap-2 cursor-pointer" onClick={() => router.push("/")}>
                        <div className="flex items-center justify-center size-10 rounded-md bg-white overflow-hidden relative">
                            <Image src="/V.png" alt="Vectora.ai Logo" fill className="object-contain p-1" />
                        </div>
                        <span className="font-bold text-xl tracking-tight">Vectora.ai</span>
                    </div>
                    <nav className="hidden md:flex items-center gap-6">
                        <Button variant="ghost" size="sm" onClick={() => router.push("/features")}>
                            Features
                        </Button>
                        <Button variant="ghost" size="sm">
                            Pricing
                        </Button>
                        <Button variant="ghost" size="sm">
                            Docs
                        </Button>
                        <Separator orientation="vertical" className="h-6" />
                        <Button variant="outline" size="sm" onClick={() => router.push("/signin")}>
                            {
                                `${userName}?${userName}:Sign In`
                                }

                        </Button>
                        <Button size="sm" onClick={() => router.push("/signup")}>Get Started</Button>
                    </nav>

                    <div className="md:hidden">
                        <Sheet>
                            <SheetTrigger asChild>
                                <Button variant="ghost" size="icon">
                                    <Menu className="size-5" />
                                    <span className="sr-only">Toggle menu</span>
                                </Button>
                            </SheetTrigger>
                            <SheetContent>
                                <SheetHeaderComponent>
                                    <SheetTitle className="text-left flex items-center gap-2">
                                        <div className="flex items-center justify-center size-8 rounded-md bg-primary/10 overflow-hidden relative">
                                            <Image src="/V.png" alt="Vectora.ai Logo" fill className="object-contain p-1" />
                                        </div>
                                        <span className="font-bold">Vectora.ai</span>
                                    </SheetTitle>
                                </SheetHeaderComponent>
                                <div className="flex flex-col gap-4 mt-8">
                                    <Button variant="ghost" className="justify-start" onClick={() => router.push("/features")}>
                                        Features
                                    </Button>
                                    <Button variant="ghost" className="justify-start">
                                        Pricing
                                    </Button>
                                    <Button variant="ghost" className="justify-start">
                                        Docs
                                    </Button>
                                    <Separator className="my-2" />
                                    <Button variant="outline" className="w-full" onClick={() => router.push("/signin")}>
                                        Sign In
                                    </Button>
                                    <Button className="w-full" onClick={() => router.push("/signup")}>Get Started</Button>
                                </div>
                            </SheetContent>
                        </Sheet>
                    </div>
                </div>
            </header>

            <main className="container max-w-6xl mx-auto px-4 py-16">
                <div className="flex flex-col items-center text-center gap-4 mb-16">

                    <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
                        Everything you need to analyze data
                    </h1>
                    <p className="text-xl text-muted-foreground max-w-2xl">
                        From raw data to actionable insights in seconds. Our AI-powered platform handles the heavy lifting so you can focus on decision making.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <Card className="border-2 hover:border-primary/50 transition-colors">
                        <CardHeader>
                            <div className="size-10 rounded-lg bg-primary/10 flex items-center justify-center mb-2">
                                <FileText className="size-6 text-primary" />
                            </div>
                            <CardTitle>Instant Data Reports</CardTitle>
                            <CardDescription>
                                Generate comprehensive summaries of your datasets automatically. identifying key statistics, missing values, and data distribution.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <ul className="text-sm text-muted-foreground space-y-2 list-disc list-inside">
                                <li>Automated executive summaries</li>
                                <li>Key performance indicator extraction</li>
                                <li>Data quality assessment</li>
                            </ul>
                        </CardContent>
                    </Card>

                    <Card className="border-2 hover:border-primary/50 transition-colors">
                        <CardHeader>
                            <div className="size-10 rounded-lg bg-primary/10 flex items-center justify-center mb-2">
                                <BarChart3 className="size-6 text-primary" />
                            </div>
                            <CardTitle>Interactive Visualizations</CardTitle>
                            <CardDescription>
                                Turn numbers into stunning visuals. Create dynamic charts and graphs that allow you to drill down into the details.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <ul className="text-sm text-muted-foreground space-y-2 list-disc list-inside">
                                <li>Drag-and-drop chart creation</li>
                                <li>Real-time data updates</li>
                                <li>Export to PNG, SVG, or PDF</li>
                            </ul>
                        </CardContent>
                    </Card>

                    <Card className="border-2 hover:border-primary/50 transition-colors">
                        <CardHeader>
                            <div className="size-10 rounded-lg bg-primary/10 flex items-center justify-center mb-2">
                                <MessageSquare className="size-6 text-primary" />
                            </div>
                            <CardTitle>Chat with Your Data</CardTitle>
                            <CardDescription>
                                Ask questions in plain English and get instant answers. No SQL or coding knowledge required.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <ul className="text-sm text-muted-foreground space-y-2 list-disc list-inside">
                                <li>Natural Language Processing (NLP)</li>
                                <li>Context-aware responses</li>
                                <li>Follow-up question support</li>
                            </ul>
                        </CardContent>
                    </Card>

                    <Card className="border-2 hover:border-primary/50 transition-colors">
                        <CardHeader>
                            <div className="size-10 rounded-lg bg-primary/10 flex items-center justify-center mb-2">
                                <TrendingUp className="size-6 text-primary" />
                            </div>
                            <CardTitle>Predictive Analytics</CardTitle>
                            <CardDescription>
                                Forecast future trends based on historical data. Spot opportunities and risks before they happen.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <ul className="text-sm text-muted-foreground space-y-2 list-disc list-inside">
                                <li>Time-series forecasting</li>
                                <li>Anomaly detection</li>
                                <li>Growth projection modeling</li>
                            </ul>
                        </CardContent>
                    </Card>

                    <Card className="border-2 hover:border-primary/50 transition-colors">
                        <CardHeader>
                            <div className="size-10 rounded-lg bg-primary/10 flex items-center justify-center mb-2">
                                <Sparkles className="size-6 text-primary" />
                            </div>
                            <CardTitle>Smart Insights</CardTitle>
                            <CardDescription>
                                Let AI proactively discover hidden patterns and correlations in your data that you might have missed.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <ul className="text-sm text-muted-foreground space-y-2 list-disc list-inside">
                                <li>Correlation analysis</li>
                                <li>Outlier detection</li>
                                <li>Segment identification</li>
                            </ul>
                        </CardContent>
                    </Card>

                    <Card className="border-2 hover:border-primary/50 transition-colors">
                        <CardHeader>
                            <div className="size-10 rounded-lg bg-primary/10 flex items-center justify-center mb-2">
                                <Shield className="size-6 text-primary" />
                            </div>
                            <CardTitle>Enterprise Security</CardTitle>
                            <CardDescription>
                                Your data is safe with us. We use industry-standard encryption and security practices to protect your information.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <ul className="text-sm text-muted-foreground space-y-2 list-disc list-inside">
                                <li>End-to-end encryption</li>
                                <li>SOC 2 Compliant infrastructure</li>
                                <li>Role-based access control</li>
                            </ul>
                        </CardContent>
                    </Card>

                </div>
            </main>

            <footer className="border-t bg-secondary/30">
                <div className="container max-w-6xl mx-auto px-4 py-8">
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                        <div className="flex items-center gap-2">
                            <div className="flex items-center justify-center size-10 rounded-md bg-white overflow-hidden relative">
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
