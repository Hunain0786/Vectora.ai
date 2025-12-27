"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, ArrowLeft } from "lucide-react"
import Image from "next/image"

export default function SignUpPage() {
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(false)

    const [error, setError] = useState("")

    const handleSignUp = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)
        setError("")

        const formData = new FormData(e.currentTarget as HTMLFormElement)
        const email = formData.get("email") as string
        const password = formData.get("password") as string
        const firstName = formData.get("first_name") as string
        const lastName = formData.get("last_name") as string

        try {
            const res = await fetch("http://localhost:8000/auth/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    email,
                    password,
                    first_name: firstName,
                    last_name: lastName
                }),
            })

            const data = await res.json()

            if (!res.ok) {
                throw new Error(data.detail || "Registration failed")
            }

            // Redirect to sign in page on success
            router.push("/signin")
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
                    Back to Home
                </Link>
            </div>

            <div className="flex-1 flex items-center justify-center p-4">
                <Card className="w-full max-w-[400px] shadow-lg border-2">
                    <CardHeader className="text-center space-y-2">
                        <div className="flex justify-center mb-0">
                            <div className="flex items-center justify-center size-12 rounded-md bg-white overflow-hidden relative">
                                <Image src="/V.png" alt="Vectora.ai Logo" fill className="object-contain p-1" />
                            </div>
                        </div>
                        <CardTitle className="text-2xl font-bold">Create an account</CardTitle>
                        <CardDescription>Enter your information to get started</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSignUp} className="space-y-4">
                            {error && (
                                <div className="p-3 text-sm text-red-500 bg-red-50 border border-red-200 rounded-md">
                                    {error}
                                </div>
                            )}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="first-name">First name</Label>
                                    <Input id="first-name" name="first_name" placeholder="John" required />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="last-name">Last name</Label>
                                    <Input id="last-name" name="last_name" placeholder="Doe" required />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="email">Email</Label>
                                <Input id="email" name="email" type="email" placeholder="m@example.com" required />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="password">Password</Label>
                                <Input id="password" name="password" type="password" required />
                            </div>
                            <Button type="submit" className="w-full" disabled={isLoading}>
                                {isLoading ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Creating account...
                                    </>
                                ) : (
                                    "Create Account"
                                )}
                            </Button>
                        </form>
                    </CardContent>
                    <CardFooter className="flex flex-col space-y-4 text-center text-sm text-muted-foreground">
                        <p>
                            Already have an account?{" "}
                            <Link href="/signin" className="text-primary hover:underline font-medium">
                                Sign in
                            </Link>
                        </p>
                    </CardFooter>
                </Card>
            </div>
        </div>
    )
}
