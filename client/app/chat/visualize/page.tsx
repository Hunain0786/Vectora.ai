"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import { useRouter } from "next/navigation"
import { ChartRenderer } from "@/components/chat/chart-renderer"

export default function VisualizePage() {
    const [charts, setCharts] = useState<any[] | null>(null)
    const router = useRouter()

    useEffect(() => {
        const storedData = localStorage.getItem("active_chart")
        if (storedData) {
            try {
                setCharts(JSON.parse(storedData))
            } catch (e) {
                console.error("Failed to parse chart data", e)
            }
        }
    }, [])

    return (
        <div className="container mx-auto p-6 max-w-4xl">
            <div className="mb-6 flex items-center gap-4">
                <Button variant="outline" size="icon" onClick={() => router.back()}>
                    <ArrowLeft className="size-4" />
                </Button>
                <h1 className="text-2xl font-bold">Data Visualization</h1>
            </div>

            {!charts ? (
                <Card>
                    <CardContent className="flex h-[300px] items-center justify-center text-muted-foreground">
                        No active visualization data found. Please ask for a chart in the chat first.
                    </CardContent>
                </Card>
            ) : (
                <div className="space-y-6">
                    {charts.map((chart: any, i: number) => (
                        <ChartRenderer key={i} chart={chart} />
                    ))}
                </div>
            )}
        </div>
    )
}
