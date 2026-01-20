"use client"

import React from "react"
import { useRouter } from "next/navigation"
import { HeaderNav } from "@/components/header-nav"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { XCircle } from "lucide-react"

export default function PaymentCancelledPage() {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-background">
      <HeaderNav />
      <main className="container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto">
          <Card className="border-0 bg-card/50 backdrop-blur-sm shadow-lg">
            <CardHeader>
              <div className="flex items-center gap-3">
                <XCircle className="h-8 w-8 text-orange-500" />
                <div>
                  <CardTitle className="text-2xl font-serif">Payment Cancelled</CardTitle>
                  <CardDescription>You cancelled the payment process</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-orange-50 dark:bg-orange-950/20 border border-orange-200 dark:border-orange-800 rounded-lg p-4">
                <p className="text-sm text-orange-800 dark:text-orange-200">
                  Your registration has been saved but payment was not completed. 
                  You can complete the payment later or contact us for assistance.
                </p>
              </div>

              <div className="space-y-2 pt-2">
                <p className="text-sm text-muted-foreground">
                  Your registration is on hold until payment is completed. 
                  Please contact us if you need help completing your registration.
                </p>
              </div>

              <div className="pt-4 flex gap-3">
                <Button onClick={() => router.push("/events")} className="flex-1">
                  Browse Events
                </Button>
                <Button onClick={() => router.push("/contact")} variant="outline">
                  Contact Support
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  )
}

