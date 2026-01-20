"use client"

import React, { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { HeaderNav } from "@/components/header-nav"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle2, Loader2, XCircle, Download, Printer } from "lucide-react"

export default function PaymentSuccessPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading")
  const [registration, setRegistration] = useState<any>(null)
  const [payment, setPayment] = useState<any>(null)
  const [errorMessage, setErrorMessage] = useState("")

  const handlePrint = () => {
    window.print()
  }

  const handleDownload = () => {
    if (!registration || !payment) return

    const receiptText = `
PAYMENT CONFIRMATION
Windmill Events
${"=".repeat(50)}

Registration ID: ${registration.id}
Payment ID: ${payment.captureId}
Transaction ID: ${payment.orderId}

Event: ${registration.event_title}
${registration.event_date ? `Date: ${new Date(registration.event_date).toLocaleDateString()}` : ''}
${registration.venue ? `Venue: ${registration.venue}` : ''}

Attendee: ${registration.full_name}
Email: ${registration.email}
Passes: ${registration.passes}

Amount Paid: $${Number(registration.total_amount).toFixed(2)}
Payment Method: PayPal
Payment Date: ${new Date().toLocaleDateString()}

${"=".repeat(50)}
Thank you for your registration!
Please save this confirmation for your records.

© ${new Date().getFullYear()} Windmill Events
    `.trim()

    const blob = new Blob([receiptText], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `payment-confirmation-${registration.id}.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  useEffect(() => {
    const capturePayment = async () => {
      const token = searchParams.get("token") // PayPal order ID
      
      if (!token) {
        setStatus("error")
        setErrorMessage("No payment information found")
        return
      }

      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || '/api'
        const response = await fetch(`${apiUrl}/paypal/capture`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ orderId: token }),
        })

        const data = await response.json()

        if (response.ok && data.ok) {
          setStatus("success")
          setRegistration(data.registration)
          setPayment(data.payment)
        } else {
          setStatus("error")
          setErrorMessage(data.message || "Payment capture failed")
        }
      } catch (error) {
        console.error("Payment capture error:", error)
        setStatus("error")
        setErrorMessage("Failed to process payment")
      }
    }

    capturePayment()
  }, [searchParams])

  return (
    <>
      <style jsx global>{`
        @media print {
          body * {
            visibility: hidden;
          }
          .print-area, .print-area * {
            visibility: visible;
          }
          .print-area {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
          }
          .no-print {
            display: none !important;
          }
        }
      `}</style>
      <div className="min-h-screen bg-background">
        <HeaderNav />
        <main className="container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto">
          {status === "loading" && (
            <Card className="border-0 bg-card/50 backdrop-blur-sm shadow-lg">
              <CardContent className="pt-6 flex flex-col items-center justify-center py-12">
                <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
                <p className="text-lg font-medium">Processing your payment...</p>
                <p className="text-sm text-muted-foreground mt-2">Please wait while we confirm your payment</p>
              </CardContent>
            </Card>
          )}

          {status === "success" && (
            <Card className="border-0 bg-card/50 backdrop-blur-sm shadow-lg print-area">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="h-8 w-8 text-green-500" />
                  <div>
                    <CardTitle className="text-2xl font-serif">Payment Successful! 🎉</CardTitle>
                    <CardDescription>Your registration is confirmed</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
                  <p className="text-sm text-green-800 dark:text-green-200">
                    ✅ Thank you for your payment! A confirmation email has been sent to <strong>{registration?.email}</strong>
                  </p>
                </div>

                {/* Payment Details Section */}
                {payment && (
                  <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                    <h3 className="font-semibold text-sm text-blue-900 dark:text-blue-100 mb-3">Payment Details</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-blue-700 dark:text-blue-300">Payment ID:</span>
                        <span className="font-mono text-xs text-blue-900 dark:text-blue-100 bg-blue-100 dark:bg-blue-900/30 px-2 py-1 rounded">
                          {payment.captureId}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-blue-700 dark:text-blue-300">Transaction ID:</span>
                        <span className="font-mono text-xs text-blue-900 dark:text-blue-100">
                          {payment.orderId}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-blue-700 dark:text-blue-300">Payment Method:</span>
                        <span className="text-blue-900 dark:text-blue-100 font-medium">PayPal</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-blue-700 dark:text-blue-300">Status:</span>
                        <span className="text-green-600 dark:text-green-400 font-semibold">{payment.status}</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Registration Details Section */}
                {registration && (
                  <div className="space-y-3 pt-2">
                    <h3 className="font-semibold text-sm text-foreground">Registration Details</h3>
                    <div className="flex flex-col gap-1 text-sm">
                      <span className="text-muted-foreground">Registration ID</span>
                      <span className="font-medium font-mono text-xs bg-muted px-2 py-1 rounded inline-block w-fit">
                        {registration.id}
                      </span>
                    </div>
                    <div className="flex flex-col gap-1 text-sm">
                      <span className="text-muted-foreground">Event</span>
                      <span className="font-medium text-base">{registration.event_title}</span>
                    </div>
                    {registration.event_date && (
                      <div className="flex flex-col gap-1 text-sm">
                        <span className="text-muted-foreground">Event Date</span>
                        <span className="font-medium">
                          {new Date(registration.event_date).toLocaleDateString('en-US', {
                            weekday: 'long',
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </span>
                      </div>
                    )}
                    {registration.venue && (
                      <div className="flex flex-col gap-1 text-sm">
                        <span className="text-muted-foreground">Venue</span>
                        <span className="font-medium">{registration.venue}</span>
                      </div>
                    )}
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="flex flex-col gap-1 text-sm">
                        <span className="text-muted-foreground">Attendee Name</span>
                        <span className="font-medium">{registration.full_name}</span>
                      </div>
                      <div className="flex flex-col gap-1 text-sm">
                        <span className="text-muted-foreground">Email</span>
                        <span className="font-medium">{registration.email}</span>
                      </div>
                    </div>
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="flex flex-col gap-1 text-sm">
                        <span className="text-muted-foreground">Number of Passes</span>
                        <span className="font-medium">{registration.passes}</span>
                      </div>
                      <div className="flex flex-col gap-1 text-sm">
                        <span className="text-muted-foreground">Total Paid</span>
                        <span className="font-bold text-lg text-green-600 dark:text-green-400">
                          ${Number(registration.total_amount).toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="pt-4 space-y-3 no-print">
                  <div className="flex gap-3">
                    <Button onClick={handlePrint} variant="outline" className="flex-1 gap-2">
                      <Printer className="h-4 w-4" />
                      Print Receipt
                    </Button>
                    <Button onClick={handleDownload} variant="outline" className="flex-1 gap-2">
                      <Download className="h-4 w-4" />
                      Download
                    </Button>
                  </div>
                  <div className="flex gap-3">
                    <Button onClick={() => router.push("/events")} className="flex-1">
                      Browse More Events
                    </Button>
                    <Button onClick={() => router.push("/")} variant="outline">
                      Go Home
                    </Button>
                  </div>
                </div>

                {/* Save Notice */}
                <div className="pt-2 text-center no-print">
                  <p className="text-xs text-muted-foreground">
                    💡 Please save this confirmation for your records. A copy has been sent to your email.
                  </p>
                </div>
              </CardContent>
            </Card>
          )}

          {status === "error" && (
            <Card className="border-0 bg-card/50 backdrop-blur-sm shadow-lg">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <XCircle className="h-8 w-8 text-red-500" />
                  <div>
                    <CardTitle className="text-2xl font-serif">Payment Failed</CardTitle>
                    <CardDescription>There was a problem processing your payment</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
                  <p className="text-sm text-red-800 dark:text-red-200">{errorMessage}</p>
                </div>

                <div className="pt-2 flex gap-3">
                  <Button onClick={() => router.push("/events")} className="flex-1">
                    Back to Events
                  </Button>
                  <Button onClick={() => router.push("/contact")} variant="outline">
                    Contact Support
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
        </main>
        <Footer />
      </div>
    </>
  )
}

