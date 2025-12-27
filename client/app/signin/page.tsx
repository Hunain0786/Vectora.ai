"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Loader2, ArrowLeft } from "lucide-react"
import Image from "next/image"

export default function SignInPage() {
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(false)

    const [error, setError] = useState("")

    const handleSignIn = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)
        setError("")

        const formData = new FormData(e.currentTarget as HTMLFormElement)
        const email = formData.get("email") as string
        const password = formData.get("password") as string

        try {
            const res = await fetch("http://127.0.0.1:8000/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            })

            const data = await res.json()

            if (!res.ok) {
                throw new Error(data.detail || "Login failed")
            }

            // Store user info
            localStorage.setItem("user_id", data.user_id)
            localStorage.setItem("username", data.username)

            router.push("/chat")
        } catch (err: any) {
            setError(err.message)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-grid flex flex-col">
            <div className="container max-w-6xl mx-auto px-4 py-6">
                <Link href="/" className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                    <ArrowLeft className="size-4" />
                    Back to Homed
                </Link>
            </div>

            <div className="flex-1 flex items-center justify-center p-4">
                <Card className="w-full max-w-[400px] shadow-lg border-2">
                    <CardHeader className="text-center space-y-2">
                        <div className="flex justify-center mb-[-1px]">
                            <div className="flex items-center justify-center size-12 rounded-md bg-white overflow-hidden relative">
                                <Image src="/V.png" alt="Vectora.ai Logo" fill className="object-contain p-1" />
                            </div>
                        </div>
                        <CardTitle className="text-2xl font-bold">Welcome back</CardTitle>
                        <CardDescription>Enter your email to sign in to your account</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSignIn} className="space-y-4">
                            {error && (
                                <div className="p-3 text-sm text-red-500 bg-red-50 border border-red-200 rounded-md">
                                    {error}
                                </div>
                            )}
                            <div className="space-y-2">
                                <Label htmlFor="email">Email</Label>
                                <Input id="email" name="email" type="email" placeholder="m@example.com" required />
                            </div>
                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <Label htmlFor="password">Password</Label>
                                    <Link href="#" className="text-xs text-primary hover:underline">
                                        Forgot password?
                                    </Link>
                                </div>
                                <Input id="password" name="password" type="password" required />
                            </div>
                            <div className="flex items-center space-x-2">
                                <Checkbox id="remember" />
                                <Label htmlFor="remember" className="text-sm font-normal text-muted-foreground">
                                    Remember me for 30 days
                                </Label>
                            </div>
                            <Button type="submit" className="w-full" disabled={isLoading}>
                                {isLoading ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Signing in...
                                    </>
                                ) : (
                                    "Sign In"
                                )}
                            </Button>
                        </form>
                    </CardContent>
                    <CardFooter className="flex flex-col space-y-4 text-center text-sm text-muted-foreground">
                        <p>
                            Don&apos;t have an account?{" "}
                            <Link href="/signup" className="text-primary hover:underline font-medium">
                                Sign up
                            </Link>
                        </p>
                    </CardFooter>
                </Card>
            </div>
        </div>
    )
}
