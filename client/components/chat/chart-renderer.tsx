"use client"

import { Bar, BarChart, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"

export function ChartRenderer({ chart }: { chart: any }) {
    if (!chart) return null

    if (chart.type === "bar") {
        return (
            <Card className="w-full mt-4">
                <CardHeader>
                    <CardTitle className="capitalize">{chart.metric} Analysis</CardTitle>
                    <CardDescription>
                        {chart.description?.what?.replace(/_/g, " ")} based on {chart.description?.based_on?.replace(/_/g, " ")}
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={chart.data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="label" />
                                <YAxis />
                                <Tooltip
                                    cursor={{ fill: 'hsl(var(--muted))', opacity: 0.1 }}
                                    contentStyle={{
                                        backgroundColor: 'hsl(var(--card))',
                                        borderRadius: '8px',
                                        border: '1px solid hsl(var(--border))'
                                    }}
                                />
                                <Bar dataKey="value" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </CardContent>
            </Card>
        )
    }

    return (
        <div className="p-4 border rounded-md bg-muted/50 text-sm text-muted-foreground">
            Unsupported chart type: {chart.type}
        </div>
    )
}
