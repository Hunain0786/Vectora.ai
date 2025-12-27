"use client"

import { useRouter } from "next/navigation"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Sheet, SheetContent, SheetTrigger, SheetTitle, SheetHeader as SheetHeaderComponent } from "@/components/ui/sheet"
import { Menu } from "lucide-react"
import Image from "next/image"

export function Navbar() {
    const [userName, setUserName] = useState<String | null>(null)
    const router = useRouter()

    useEffect(() => {
        setUserName(localStorage.getItem('username'))
    }, [])

    return (
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
                    <Button variant="ghost" size="sm" onClick={() => router.push("/clean")}>
                        Data Cleaning
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => router.push("/chat")}>
                        Chat
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => router.push("/pricing")}>
                        Pricing
                    </Button>
                    <Button variant="ghost" size="sm">
                        Docs
                    </Button>
                    <Separator orientation="vertical" className="h-6" />
                    <Button variant="outline" size="sm" onClick={() => router.push("/signin")} disabled={userName ? true : false}>
                        {userName ? `${userName.split(" ")[0]}` : "sign in"}
                    </Button>
                    {!userName && <Button size="sm" onClick={() => router.push("/signup")}>Get Started</Button>}


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
                                <Button variant="ghost" className="justify-start" onClick={() => router.push("/clean")}>
                                    Data Cleaning
                                </Button>
                                <Button variant="ghost" className="justify-start" onClick={() => router.push("/chat")}>
                                    Chat
                                </Button>
                                <Button variant="ghost" className="justify-start" onClick={() => router.push("/pricing")}>
                                    Pricing
                                </Button>
                                <Button variant="ghost" className="justify-start">
                                    Docs
                                </Button>
                                <Separator className="my-0" />
                                <Button variant="outline" className="w-[85%] mx-auto" onClick={() => router.push("/signin")}>
                                    Sign In
                                </Button>
                                <Button className="w-[85%] mx-auto" onClick={() => router.push("/signup")}>Get Started</Button>


                            </div>
                        </SheetContent>
                    </Sheet>
                </div>
            </div>
        </header>
    )
}
