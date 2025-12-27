"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"

import { Upload, Database, FileText, BarChart3, TrendingUp, Zap } from "lucide-react"
import { Navbar } from "@/components/navbar"
import Image from "next/image"

export default function LandingPage() {

  const router = useRouter()
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [connectionType, setConnectionType] = useState<string>("")


  useEffect(() => {
    if (localStorage.getItem('chat_messages')) {
      localStorage.removeItem("chat_messages")
    }
  }, [])

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0])
    }
  }

  const handleGetStarted = async () => {
    if (selectedFile) {
      const formData = new FormData();
      formData.append("file", selectedFile);

      // Save to localStorage for persistence
      try {
        if (selectedFile.size < 5 * 1024 * 1024) { // Limit to 5MB for localStorage
          const reader = new FileReader();
          reader.onload = (e) => {
            const content = e.target?.result as string;
            localStorage.setItem("cached_csv", content);
            localStorage.setItem("cached_filename", selectedFile.name);
          };
          reader.readAsText(selectedFile);
        } else {
          console.warn("File too large to cache in localStorage");
        }
      } catch (err) {
        console.error("Failed to cache file", err);
      }

      try {
        await fetch(`${process.env.NEXT_PUBLIC_API_URL}/upload`, {
          method: "POST",
          body: formData
        });

        router.push("/chat")

      } catch (e) {
        console.error("Upload failed", e);
      }
    }
  }



  return (
    <div className="min-h-screen bg-grid">
      <Navbar />

      <section className="container max-w-6xl mx-auto px-4 pt-8 pb-12">
        <div className="flex flex-col items-center text-center gap-6 animate-in fade-in slide-in-from-bottom-4 duration-1000">


          <h1 className="text-4xl md:text-5xl font-bold tracking-tight leading-tight text-balance max-w-4xl sm:text-6xl md:text-7xl animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-150">
            Your Data Scientist
            <br />
            <span className="text-primary">Available 24/7</span>
          </h1>

          <p className="text-md md:text-xl text-muted-foreground max-w-2xl text-balance leading-relaxed animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-300">
            Chat with your CSV files, SQL databases, and MongoDB collections. Get instant insights, visualizations, and
            answers to complex data questions.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 mt-4 animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-500">
            <div className="flex items-center gap-2 rounded-full border px-4 py-2 bg-background">
              <FileText className="size-4 text-primary" />
              <span className="text-sm font-medium">CSV Analysis</span>
            </div>
            <div className="flex items-center gap-2 rounded-full border px-4 py-2 bg-background">
              <Database className="size-4 text-primary" />
              <span className="text-sm font-medium">SQL & MongoDB</span>
            </div>
            <div className="flex items-center gap-2 rounded-full border px-4 py-2 bg-background">
              <BarChart3 className="size-4 text-primary" />
              <span className="text-sm font-medium">Smart Visualizations</span>
            </div>
            <div className="flex items-center gap-2 rounded-full border px-4 py-2 bg-background">
              <TrendingUp className="size-4 text-primary" />
              <span className="text-sm font-medium">Trend Analysis</span>
            </div>
          </div>
        </div>
      </section>

      <section className="container max-w-3xl mx-auto px-4 pb-24 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-700">
        <Card className="shadow-lg border-2">
          <CardHeader className="text-center pb-4">
            <CardTitle className="text-2xl">Connect Your Data Source</CardTitle>
            <CardDescription>Upload a CSV file or connect to your database to get started</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="csv" className="w-full">
              <TabsList className="grid w-full grid-cols-1 sm:grid-cols-3 h-auto">
                <TabsTrigger value="csv" className="gap-2">
                  <FileText className="size-4" />
                  CSV File
                </TabsTrigger>
                <TabsTrigger value="sql" className="gap-2">
                  <Database className="size-4" />
                  SQL
                </TabsTrigger>
                <TabsTrigger value="mongodb" className="gap-2">
                  <Database className="size-4" />
                  MongoDB
                </TabsTrigger>
              </TabsList>

              <TabsContent value="csv" className="space-y-4 mt-6">
                <div className="flex flex-col items-center justify-center border-2 border-dashed rounded-lg p-12 hover:border-primary/50 transition-colors cursor-pointer group">
                  <input type="file" accept=".csv" onChange={handleFileUpload} className="hidden" id="csv-upload" />
                  <label htmlFor="csv-upload" className="flex flex-col items-center gap-4 cursor-pointer w-full">
                    <div className="flex items-center justify-center size-16 rounded-full bg-secondary group-hover:bg-primary/10 transition-colors">
                      <Upload className="size-8 text-muted-foreground group-hover:text-primary transition-colors" />
                    </div>
                    <div className="text-center">
                      <p className="text-sm font-medium group-hover:text-primary transition-colors">
                        {selectedFile ? selectedFile.name : "Click to upload or drag and drop"}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">CSV files up to 100MB</p>
                    </div>
                  </label>
                </div>

                <Button onClick={handleGetStarted} className="w-full h-11 text-base" disabled={!selectedFile}>
                  Start Analyzing
                </Button>
              </TabsContent>

              <TabsContent value="sql" className="space-y-4 mt-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="db-type">Database Type</Label>
                    <Select value={connectionType} onValueChange={setConnectionType}>
                      <SelectTrigger id="db-type">
                        <SelectValue placeholder="Select database type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="postgresql">PostgreSQL</SelectItem>
                        <SelectItem value="mysql">MySQL</SelectItem>
                        <SelectItem value="sqlite">SQLite</SelectItem>
                        <SelectItem value="mssql">Microsoft SQL Server</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="host">Host</Label>
                    <Input id="host" placeholder="localhost" />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="port">Port</Label>
                      <Input id="port" placeholder="5432" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="database">Database</Label>
                      <Input id="database" placeholder="mydb" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="username">Username</Label>
                    <Input id="username" placeholder="user" />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <Input id="password" type="password" placeholder="••••••••" />
                  </div>
                </div>

                <Button onClick={handleGetStarted} className="w-full h-11 text-base" disabled={true}>
                  Coming Soon
                </Button>
              </TabsContent>

              <TabsContent value="mongodb" className="space-y-4 mt-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="connection-string">Connection String</Label>
                    <Input
                      id="connection-string"
                      placeholder="mongodb://username:password@host:port/database"
                      className="font-mono text-sm"
                    />
                    <p className="text-xs text-muted-foreground">
                      Your connection string is encrypted and stored securely
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="collection">Collection Name (Optional)</Label>
                    <Input id="collection" placeholder="users" />
                  </div>
                </div>

                <Button onClick={handleGetStarted} className="w-full h-11 text-base" disabled={true}>
                  {/* Connect MongoDB */}
                  Coming Soon
                </Button>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        <div className="flex items-center justify-center gap-8 mt-12 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <div className="size-2 rounded-full bg-green-500" />
            <span>End-to-end encrypted</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="size-2 rounded-full bg-green-500" />
            <span>SOC 2 compliant</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="size-2 rounded-full bg-green-500" />
            <span>GDPR ready</span>
          </div>
        </div>
      </section>

      <footer className="border-t bg-secondary/30">
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
