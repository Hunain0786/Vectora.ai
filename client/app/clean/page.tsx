"use client"

import { useState } from "react"
import { Navbar } from "@/components/navbar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Sparkles, Download, FileCheck, AlertCircle, ArrowRight } from "lucide-react"

export default function DataCleaningPage() {
    const [isLoading, setIsLoading] = useState(false)
    const [status, setStatus] = useState<"idle" | "success" | "error">("idle")
    const [errorMessage, setErrorMessage] = useState("")
    const [summary, setSummary] = useState("")

    const [problemType, setProblemType] = useState<"general" | "sentiment_analysis" | "classification" | "binary_classification">("general")
    const [targetCol, setTargetCol] = useState("")

    const handleClean = async () => {
        setIsLoading(true)
        setStatus("idle")
        setErrorMessage("")
        setSummary("")

        try {
            // Build query params
            const params = new URLSearchParams()
            params.append("problem_type", problemType)
            if ((problemType === "classification" || problemType === "binary_classification") && targetCol) {
                params.append("target", targetCol)
            }

            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/clean/advanced?${params.toString()}`, {
                method: "POST",
            })

            const data = await response.json()

            if (!response.ok) {
                throw new Error(data.detail || "Failed to clean data")
            }

            setStatus("success")
            setSummary(data.summary) // Use the AI-generated summary

        } catch (error: any) {
            console.error("Cleaning error:", error)
            setStatus("error")
            setErrorMessage(error.message)
        } finally {
            setIsLoading(false)
        }
    }

    const handleDownload = () => {
        // Trigger download of the last cleaned file
        const link = document.createElement('a');
        link.href = `${process.env.NEXT_PUBLIC_API_URL}/download/advanced`;
        link.download = 'cleaned_data.csv';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    return (
        <div className="min-h-screen bg-background">
            <Navbar />

            <main className="container max-w-4xl mx-auto px-4 py-12">
                <div className="flex flex-col gap-8">
                    <div className="text-center space-y-4">
                        <h1 className="text-4xl font-bold tracking-tight">Data Cleaning Studio</h1>
                        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                            Automatically detect and fix issues in your dataset. Remove duplicates, fill missing values, and standardize formats with one click.
                        </p>
                    </div>

                    <Card className="border-2 shadow-lg">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-2xl">
                                <Sparkles className="size-6 text-primary" />
                                Advanced Cleaning Configuration
                            </CardTitle>
                            <CardDescription>
                                Select the type of problem you are solving to apply specialized cleaning strategies.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">

                            <div className="grid md:grid-cols-2 gap-6">
                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">Problem Type</label>
                                        <select
                                            className="w-full h-10 px-3 rounded-md border bg-background"
                                            value={problemType}
                                            onChange={(e) => setProblemType(e.target.value as any)}
                                        >
                                            <option value="general">General Cleaning</option>
                                            <option value="sentiment_analysis">Sentiment Analysis (NLP)</option>
                                            <option value="classification">Classification (Multi-class)</option>
                                            <option value="binary_classification">Binary Classification</option>
                                        </select>
                                        <p className="text-xs text-muted-foreground">
                                            {problemType === "general" && "Standard cleaning: duplicates, missing values, formatting."}
                                            {problemType === "sentiment_analysis" && "Optimized for text: lowerscasing, punctuation removal."}
                                            {problemType === "classification" && "Analyzes class distribution and handles missing values."}
                                            {problemType === "binary_classification" && "Balances classes via undersampling if imbalance detected."}
                                        </p>
                                    </div>

                                    {(problemType === "classification" || problemType === "binary_classification") && (
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium">Target Column Name</label>
                                            <input
                                                type="text"
                                                className="w-full h-10 px-3 rounded-md border bg-background"
                                                placeholder="e.g. churn, bought, label"
                                                value={targetCol}
                                                onChange={(e) => setTargetCol(e.target.value)}
                                            />
                                            <p className="text-xs text-muted-foreground">
                                                Required for class imbalance checks.
                                            </p>
                                        </div>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <h4 className="font-medium text-sm">Included Steps:</h4>
                                    <ul className="space-y-2 text-sm text-muted-foreground">
                                        <li className="flex items-center gap-2">
                                            <div className="size-1.5 rounded-full bg-blue-500" />
                                            Missing Value Imputation
                                        </li>
                                        <li className="flex items-center gap-2">
                                            <div className="size-1.5 rounded-full bg-green-500" />
                                            Duplicate Removal
                                        </li>
                                        <li className="flex items-center gap-2">
                                            <div className="size-1.5 rounded-full bg-orange-500" />
                                            {problemType === "sentiment_analysis" ? "Text Normalization" : "Format Standardization"}
                                        </li>
                                        {(problemType === "binary_classification") && (
                                            <li className="flex items-center gap-2">
                                                <div className="size-1.5 rounded-full bg-purple-500" />
                                                Class Balancing (Undersampling)
                                            </li>
                                        )}
                                    </ul>
                                </div>
                            </div>

                            {status === "success" && (
                                <div className="p-4 rounded-lg bg-green-500/10 border border-green-500/20 flex items-start gap-3">
                                    <FileCheck className="size-5 text-green-600 mt-0.5" />
                                    <div className="w-full">
                                        <h4 className="font-semibold text-green-900 dark:text-green-100">Cleaning Complete!</h4>
                                        <p className="text-sm text-green-800 dark:text-green-200 mt-1 whitespace-pre-wrap">
                                            {summary}
                                        </p>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className="mt-3 border-green-600 text-green-700 hover:bg-green-100"
                                            onClick={handleDownload}
                                        >
                                            <Download className="size-4 mr-2" />
                                            Download Cleaned Data
                                        </Button>
                                    </div>
                                </div>
                            )}

                            {status === "error" && (
                                <div className="p-4 rounded-lg bg-destructive/10 border border-destructive/20 flex items-start gap-3">
                                    <AlertCircle className="size-5 text-destructive mt-0.5" />
                                    <div>
                                        <h4 className="font-semibold text-destructive">Cleaning Failed</h4>
                                        <p className="text-sm text-destructive/80 mt-1">
                                            {errorMessage}
                                        </p>
                                    </div>
                                </div>
                            )}
                        </CardContent>
                        <CardFooter className="flex justify-between items-center bg-secondary/20 p-6">
                            <p className="text-sm text-muted-foreground">
                                Please ensure you have uploaded a dataset first.
                            </p>
                            <Button
                                size="lg"
                                onClick={handleClean}
                                disabled={isLoading}
                                className="min-w-[150px]"
                            >
                                {isLoading ? (
                                    <>Processing...</>
                                ) : (
                                    <>
                                        Start Cleaning
                                        <ArrowRight className="ml-2 size-4" />
                                    </>
                                )}
                            </Button>
                        </CardFooter>
                    </Card>


                </div>
            </main>
        </div>
    )
}
