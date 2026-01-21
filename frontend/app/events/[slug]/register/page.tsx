"use client"

import React, { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { HeaderNav } from "@/components/header-nav"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { useToast } from "@/hooks/use-toast"
import { ArrowLeft, Calendar, Mail, MapPin, Phone, Ticket } from "lucide-react"

interface EventData {
  id: string
  title: string
  slug: string
  description: string
  eventDate: string
  venue: string
  venueAddress: string
  pricing: {
    currentPrice: number
    regularPrice: number
    earlyBirdPrice: number | null
    isEarlyBird: boolean
  }
  banner: {
    url: string | null
    altText: string
  }
  contact: {
    name: string | null
    email: string | null
    phone: string | null
  }
}

const RELEASE_OF_LIABILITY_TEXT = `On behalf of myself and my family and friends, I acknowledge with my signature that the Participant wishes to participate in event(s) organized by Windmill Entertainments. I understand that by participating in this event there is an inherent risk of potential exposure to infectious diseases, including but not limited to COVID-19/Coronavirus. The risk of potential exposure cannot be eliminated. On behalf of myself, the Participant, my heirs and dependents, personal representatives, assigns and insurers,   Although the safety of all activities is the primary concern, indoor/outdoor activities injuries and/or death. I expressly assume the risk of injury, death, and/or illness arising from any cause, and agree to waive the right to pursue any claim against the Windmill Entertainments and the persons in charge. I now voluntarily and knowingly release and hold harmless/not liable the Windmill Entertainments, its officers, employees, volunteers with which/whom the Windmill Entertainments, from any and all liability, lawsuits, or claims for injuries, death, or property damage resulting from, arising out of, or in any way connected with Participant’s participation in the event.

This event is Photographed and Video graphed. Attendence at this event represents your permission for the host to use the Videos & Photos. I/we have read this waiver and release in its entirety. i/we fully understand it and recognize that this waiver and release is a legally binding document. i/we understand that by executing this waiver and release, we are voluntary assuming the risks described herein, and waiving our legal rights associated therewith.`

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  })
}

function formatUSD(amount: number) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(amount)
}

export default function RegisterPage() {
  const { toast } = useToast()
  const router = useRouter()
  const params = useParams() as { slug?: string }

  const slug = params?.slug ?? ""

  // Event data from API
  const [event, setEvent] = useState<EventData | null>(null)
  const [loading, setLoading] = useState(true)
  const [eventError, setEventError] = useState<string | null>(null)

  // Fetch event data
  useEffect(() => {
    async function fetchEvent() {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || '/api'
        const response = await fetch(`${apiUrl}/events/${slug}`)
        const data = await response.json()

        if (data.ok) {
          setEvent(data.event)
        } else {
          setEventError(data.message || 'Event not found')
        }
      } catch (err) {
        console.error('Error fetching event:', err)
        setEventError('Failed to load event')
      } finally {
        setLoading(false)
      }
    }

    if (slug) {
      fetchEvent()
    }
  }, [slug])

  const pricePerPass = event?.pricing.currentPrice ?? 0

  // Form state
  const [fullName, setFullName] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [passes, setPasses] = useState<string>("1")
  const [acceptedLiability, setAcceptedLiability] = useState(false)
  const [termsOpen, setTermsOpen] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [registrationId, setRegistrationId] = useState<string | null>(null)
  const [serverTotalAmount, setServerTotalAmount] = useState<number | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const [errors, setErrors] = useState<Record<string, string>>({})

  const passesNum = Math.max(1, Math.min(10, Number(passes) || 1))
  const totalAmount = passesNum * pricePerPass

  // Prevent non-digit key input and cap to 10 digits (respecting selection)
  const handlePhoneKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const allowedKeys = [
      "Backspace",
      "Delete",
      "ArrowLeft",
      "ArrowRight",
      "ArrowUp",
      "ArrowDown",
      "Tab",
      "Home",
      "End",
    ]
    if (allowedKeys.includes(e.key)) return
    if (e.ctrlKey || e.metaKey) return
    if (!/^[0-9]$/.test(e.key)) {
      e.preventDefault()
      return
    }
    const target = e.currentTarget
    const selectionLength = (target.selectionEnd || 0) - (target.selectionStart || 0)
    if (phone.length - selectionLength >= 10) e.preventDefault()
  }

  const handlePhonePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault()
    const paste = e.clipboardData.getData("text") || ""
    const digits = paste.replace(/\D/g, "")
    const target = e.currentTarget
    const start = target.selectionStart || 0
    const end = target.selectionEnd || 0
    const before = phone.slice(0, start)
    const after = phone.slice(end)
    const available = 10 - (before.length + after.length)
    const toInsert = digits.slice(0, Math.max(0, available))
    const newVal = (before + toInsert + after).slice(0, 10)
    setPhone(newVal)
  }

  const handlePhoneChange = (val: string) => {
    const digits = val.replace(/\D/g, "")
    setPhone(digits.slice(0, 10))
  }

  const validate = () => {
    const next: Record<string, string> = {}

    if (!fullName || fullName.trim().length < 2) next.fullName = "Please enter your full name"
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) next.email = "Please enter a valid email address"
    if (!phone || !/^\d{10}$/.test(phone)) next.phone = "Phone number must be exactly 10 digits"
    if (!passesNum || passesNum < 1 || passesNum > 10) next.passes = "Please select 1 to 10 passes"
    if (!acceptedLiability) next.acceptedLiability = "You must accept the terms to continue"

    return next
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    const nextErrors = validate()
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length) {
      toast({
        title: "Validation error",
        description: "Please fix the highlighted fields and try again.",
        variant: "destructive",
      })
      setIsSubmitting(false)
      return
    }

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || '/api'
      const resp = await fetch(`${apiUrl}/event-registrations`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          eventTitle: event?.title ?? "",
          fullName,
          email,
          phone,
          passes: passesNum,
          acceptedLiability,
        }),
      })

      if (resp.status === 201) {
        const body = await resp.json().catch(() => ({}))
        const totalFromServer = Number(body?.totalAmount)
        const approvalUrl = body?.approvalUrl

        setRegistrationId(body?.id || null)
        setServerTotalAmount(Number.isFinite(totalFromServer) ? totalFromServer : totalAmount)

        // Redirect to PayPal payment page
        if (approvalUrl) {
          toast({
            title: "✅ Registration created",
            description: "Redirecting to payment...",
          })

          // Redirect to PayPal for payment
          window.location.href = approvalUrl
          return
        }

        // Fallback if no approval URL (shouldn't happen)
        setSubmitted(true)
        toast({
          title: "✅ Registration received",
          description: `We’ve received your registration for ${event?.title ?? ""}.`,
        })
        return
      }

      if (resp.status === 400) {
        const body = await resp.json().catch(() => ({}))
        const parsedErrors: Record<string, string> = {}
        if (body && body.errors && typeof body.errors === "object") {
          Object.keys(body.errors).forEach((k) => {
            parsedErrors[k] = body.errors[k] || ""
          })
        }
        setErrors((prev) => ({ ...prev, ...parsedErrors }))
        toast({
          title: "Validation error",
          description: body?.message || "Please check the form fields and try again.",
          variant: "destructive",
        })
        return
      }

      if (resp.status === 429) {
        toast({
          title: "Too many requests",
          description: "Please try again later.",
          variant: "destructive",
        })
        return
      }

      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      })
    } catch (err) {
      toast({
        title: "Error",
        description: "Unable to submit right now. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <HeaderNav />
        <main className="container mx-auto px-4 py-16">
          <div className="text-center py-12">
            <p className="text-muted-foreground">Loading event details...</p>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  if (eventError || !event) {
    return (
      <div className="min-h-screen bg-background">
        <HeaderNav />
        <main className="container mx-auto px-4 py-16">
          <Button variant="ghost" className="gap-2" onClick={() => router.push("/events")}> 
            <ArrowLeft className="h-4 w-4" />
            Return to Events page
          </Button>
          <div className="mt-10 max-w-2xl">
            <h1 className="text-3xl font-serif font-semibold">Event not found</h1>
            <p className="text-muted-foreground mt-2">
              {eventError || "We couldn't find the requested event. Please go back to the Events page and try again."}
            </p>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-background">
        <HeaderNav />
        <main className="container mx-auto px-4 py-16">
          <div className="mb-6">
            <Button variant="ghost" className="gap-2" onClick={() => router.push("/events")}> 
              <ArrowLeft className="h-4 w-4" />
              Return to Events page
            </Button>
          </div>

          <Card className="max-w-2xl border-0 bg-card/50 backdrop-blur-sm shadow-lg">
            <CardHeader>
              <CardTitle className="text-2xl font-serif">Registration received 🎉</CardTitle>
              <CardDescription>
                We’ve received your registration for <span className="font-medium text-foreground">{event.title}</span>.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {registrationId ? (
                <div className="flex flex-col gap-1 text-sm">
                  <span className="text-muted-foreground">Registration ID</span>
                  <span className="font-medium">{registrationId}</span>
                </div>
              ) : null}
              <div className="flex flex-col gap-1 text-sm">
                <span className="text-muted-foreground">Name</span>
                <span className="font-medium">{fullName}</span>
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1 text-sm">
                  <span className="text-muted-foreground">Email</span>
                  <span className="font-medium">{email}</span>
                </div>
                <div className="flex flex-col gap-1 text-sm">
                  <span className="text-muted-foreground">Phone</span>
                  <span className="font-medium">{phone}</span>
                </div>
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1 text-sm">
                  <span className="text-muted-foreground">Passes</span>
                  <span className="font-medium">{passesNum}</span>
                </div>
                <div className="flex flex-col gap-1 text-sm">
                  <span className="text-muted-foreground">Total amount</span>
                  <span className="font-medium">{formatUSD(serverTotalAmount ?? totalAmount)}</span>
                </div>
              </div>

              <div className="pt-2">
                <Button className="bg-primary hover:bg-primary/90 text-primary-foreground" onClick={() => router.push("/events")}> 
                  Back to Events
                </Button>
              </div>
            </CardContent>
          </Card>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <HeaderNav />

      <main className="container mx-auto px-4 py-16">
        {/* Top-left return button */}
        <div className="mb-8">
          <Button variant="ghost" className="gap-2" onClick={() => router.push("/events")}> 
            <ArrowLeft className="h-4 w-4" />
            Return to Events page
          </Button>
        </div>

        <div className="grid lg:grid-cols-5 gap-10 items-start">
          {/* Event details */}
          <div className="lg:col-span-2">
            <Card className="overflow-hidden border-border/50 shadow-lg">
              <div className="aspect-[4/3] bg-gradient-to-br from-primary/10 to-secondary/10">
                {event.banner?.url ? (
                  <img
                    src={event.banner.url}
                    alt={event.banner.altText}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="h-full w-full flex items-center justify-center bg-gradient-to-br from-pink-500 to-rose-600">
                    <div className="text-center text-white p-6">
                      <h3 className="text-2xl font-bold">{event.title}</h3>
                    </div>
                  </div>
                )}
              </div>
            </Card>
          </div>

          {/* Registration form */}
          <div className="lg:col-span-3">
            <Card className="border-0 bg-card/50 backdrop-blur-sm shadow-lg">
              <CardHeader>
                <CardTitle className="font-serif text-2xl">{event.title}</CardTitle>
                <CardDescription>Event details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-start gap-3 text-sm">
                  <Calendar className="h-4 w-4 mt-0.5 text-primary" />
                  <div>
                    <p className="font-medium">{formatDate(event.eventDate)}</p>
                    <p className="text-muted-foreground">Date</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 text-sm">
                  <MapPin className="h-4 w-4 mt-0.5 text-primary" />
                  <div>
                    <p className="font-medium">{event.venue}</p>
                    <p className="text-muted-foreground">Venue</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 text-sm">
                  <Ticket className="h-4 w-4 mt-0.5 text-primary" />
                  <div>
                    <p className="font-medium">{pricePerPass ? formatUSD(pricePerPass) : "TBD"} / pass</p>
                    <p className="text-muted-foreground">(1 pass = 1 couple)</p>
                  </div>
                </div>

                <div className="pt-2 border-t border-border/50">
                  <p className="text-sm font-medium mb-2">Contact</p>
                  <div className="space-y-2">
                    {event.contact.name ? (
                      <p className="text-sm text-muted-foreground">{event.contact.name}</p>
                    ) : null}
                    {event.contact.phone ? (
                      <div className="flex items-center gap-2 text-sm">
                        <Phone className="h-4 w-4 text-primary" />
                        <span>{event.contact.phone}</span>
                      </div>
                    ) : null}
                    {event.contact.email ? (
                      <div className="flex items-center gap-2 text-sm">
                        <Mail className="h-4 w-4 text-primary" />
                        <span>{event.contact.email}</span>
                      </div>
                    ) : null}
                    {!event.contact.phone && !event.contact.email ? (
                      <p className="text-sm text-muted-foreground">For questions, please reach out via our Contact page.</p>
                    ) : null}
                  </div>
                </div>
              </CardContent>

              <CardHeader>
                {/* Dynamic registration heading */}
                <CardTitle className="text-2xl font-serif">Registration for {event.title}</CardTitle>
                <CardDescription>Please fill out the details below to reserve your passes.</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="fullName">Full Name *</Label>
                      <Input
                        id="fullName"
                        value={fullName}
                        onChange={(e) => {
                          setFullName(e.target.value)
                          setErrors((prev) => {
                            const next = { ...prev }
                            delete next.fullName
                            return next
                          })
                        }}
                        placeholder="Your full name"
                        required
                        className="border-border/50 focus:border-primary transition-all"
                      />
                      {errors.fullName ? <p className="text-destructive text-sm">{errors.fullName}</p> : null}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email">Email *</Label>
                      <Input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => {
                          setEmail(e.target.value)
                          setErrors((prev) => {
                            const next = { ...prev }
                            delete next.email
                            return next
                          })
                        }}
                        placeholder="your@email.com"
                        required
                        className="border-border/50 focus:border-primary transition-all"
                      />
                      {errors.email ? <p className="text-destructive text-sm">{errors.email}</p> : null}
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number (10 digits) *</Label>
                      <Input
                        id="phone"
                        type="tel"
                        inputMode="numeric"
                        pattern="[0-9]{10}"
                        value={phone}
                        onKeyDown={handlePhoneKeyDown}
                        onPaste={handlePhonePaste}
                        onChange={(e) => {
                          handlePhoneChange(e.target.value)
                          setErrors((prev) => {
                            const next = { ...prev }
                            delete next.phone
                            return next
                          })
                        }}
                        placeholder="Enter 10 digit phone number"
                        required
                        className="border-border/50 focus:border-primary transition-all"
                      />
                      {errors.phone ? <p className="text-destructive text-sm">{errors.phone}</p> : null}
                    </div>

                    <div className="space-y-2">
                      <Label>No. of Passes (1 pass = 1 couple) *</Label>
                      <Select
                        value={passes}
                        onValueChange={(v) => {
                          setPasses(v)
                          setErrors((prev) => {
                            const next = { ...prev }
                            delete next.passes
                            return next
                          })
                        }}
                      >
                        <SelectTrigger className="border-border/50 focus:border-primary transition-all">
                          <SelectValue placeholder="Select passes" />
                        </SelectTrigger>
                        <SelectContent>
                          {Array.from({ length: 10 }, (_, i) => i + 1).map((n) => (
                            <SelectItem key={n} value={String(n)}>
                              {n}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {errors.passes ? <p className="text-destructive text-sm">{errors.passes}</p> : null}
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4 items-end">
                    <div className="space-y-2">
                      <Label>Price per pass</Label>
                      <Input value={pricePerPass ? formatUSD(pricePerPass) : "TBD"} readOnly />
                    </div>
                    <div className="space-y-2">
                      <Label>Total Amount *</Label>
                      <Input value={formatUSD(serverTotalAmount ?? totalAmount)} readOnly />
                    </div>
                  </div>

                  {/* Additional Instructions */}
                  <div className="rounded-lg border border-border bg-muted/50 p-4 md:p-6 space-y-3">
                    <h3 className="font-semibold text-foreground text-base md:text-lg">Additional Instructions:</h3>
                    <ul className="space-y-2 text-sm md:text-base leading-relaxed text-muted-foreground">
                      <li className="flex items-start gap-2">
                        <span className="text-primary mt-1 flex-shrink-0">•</span>
                        <span>Upon successful payment, a confirmation email will be sent and must be presented for event admission.</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-primary mt-1 flex-shrink-0">•</span>
                        <span>Payments are accepted only via PayPal or major credit cards.</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-primary mt-1 flex-shrink-0">•</span>
                        <span>All sales are final. Tickets are non-refundable, non-transferable, and non-creditable under any circumstances.</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-primary mt-1 flex-shrink-0">•</span>
                        <span>Windmill Events & Planning reserves the right to refuse entry at its discretion.</span>
                      </li>
                    </ul>
                  </div>

                  {/* Release of liability */}
                  <div className="space-y-2">
                    <div className="flex items-start gap-3">
                      <Checkbox
                        checked={acceptedLiability}
                        onCheckedChange={(v) => {
                          setAcceptedLiability(Boolean(v))
                          setErrors((prev) => {
                            const next = { ...prev }
                            delete next.acceptedLiability
                            return next
                          })
                        }}
                        aria-label="Accept terms and conditions"
                      />
                      <div className="text-sm leading-relaxed">
                        <span className="text-foreground">I agree to the </span>
                        <button
                          type="button"
                          className="text-primary underline underline-offset-4 hover:opacity-90"
                          onClick={() => setTermsOpen(true)}
                        >
                          Terms and Conditions
                        </button>
                        <span className="text-foreground"> (Release of Liability) *</span>
                      </div>
                    </div>
                    {errors.acceptedLiability && <p className="text-destructive text-sm">{errors.acceptedLiability}</p>}
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Submitting…" : "Submit Registration"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Release of liability modal */}
        <Dialog open={termsOpen} onOpenChange={setTermsOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Release of Liability</DialogTitle>
              <DialogDescription>
                Please read the following carefully. Closing this window does not automatically accept the terms.
              </DialogDescription>
            </DialogHeader>
            <ScrollArea className="h-[60vh] pr-2">
              <div className="whitespace-pre-line text-sm leading-relaxed text-foreground">
                {RELEASE_OF_LIABILITY_TEXT}
              </div>
            </ScrollArea>
          </DialogContent>
        </Dialog>
      </main>

      <Footer />
    </div>
  )
}
