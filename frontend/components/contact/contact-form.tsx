"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar, Mail, Phone, Send, User } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { motion, AnimatePresence } from "framer-motion"
import { ConfettiCelebration } from "@/components/confetti-celebration"

export function ContactForm() {
  const { toast } = useToast()

  // UI state: submit spinner + confetti
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showConfetti, setShowConfetti] = useState(false)

  // Form state: keep all field values here
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    eventType: "",
    eventDate: "",
    message: "",
  })

  // Which label is focused (for subtle color animation)
  const [focusedField, setFocusedField] = useState<string | null>(null)

  // Field-level errors returned from backend validation
  const [fieldErrors, setFieldErrors] = useState<Record<string, string | null>>({})

  // Update a single field in formData
  const handleChange = (field: string, value: string) => {
    if (field === "phone") {
      // Allow digits only and max 10 characters
      const digitsOnly = value.replace(/\D/g, "").slice(0, 10)
      setFormData((prev) => ({ ... prev, phone: digitsOnly }))
      setFieldErrors((prev) => ({ ...prev, phone: null }))
      return
    }

    setFormData((prev) => ({ ...prev, [field]: value }))
    setFieldErrors((prev) => ({ ...prev, [field]: null }))
  }


  // Client-side validation helpers
  const validateFields = () => {
    const errors: Record<string, string | null> = {}
    if (!formData.name || formData.name.trim().length < 2) errors.name = 'Please enter your full name'
    if (!formData.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) errors.email = 'Please enter a valid email address'
    if (!/^\d{10}$/.test(formData.phone)) {errors.phone = 'Phone number must be exactly 10 digits'}
    if (!formData.eventType || formData.eventType.trim().length === 0) errors.eventType = 'Please provide the event type'
    if (!formData.message || formData.message.trim().length < 10) errors.message = 'Please provide more details about your event (min 10 characters)'
    return errors
  }

  // Submit handler for the form
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)           // show "Sending..." + disable button
    // Client-side validation first
    const clientErrors = validateFields()
    if (Object.keys(clientErrors).length) {
      setFieldErrors(clientErrors)
      toast({ title: 'Validation error', description: 'Please check the form fields and try again.', variant: 'destructive' })
      setIsSubmitting(false)
      return
    }
    try {
      // Call backend Express endpoint
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || '/api'
      const resp = await fetch(`${apiUrl}/enquiries`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          eventType: formData.eventType,
          eventDate: formData.eventDate,
          message: formData.message,
        }),
      })

      if (resp.status === 201) {
        // success handled below
      } else if (resp.status === 400) {
        const body = await resp.json().catch(() => ({}))
        // Backend returns { ok:false, message: 'Invalid details', errors: { field: 'reason' } }
        const parsedErrors: Record<string, string | null> = {}
        if (body && body.errors && typeof body.errors === 'object') {
          Object.keys(body.errors).forEach((k) => {
            parsedErrors[k] = body.errors[k] || null
          })
        } else if (body?.issues) {
          // fallback for older Zod formatted issues
          const issues = body.issues || {}
          Object.keys(issues).forEach((k) => {
            try {
              const entry = issues[k]
              if (entry && entry._errors && entry._errors.length) parsedErrors[k] = entry._errors.join(', ')
              else parsedErrors[k] = null
            } catch (e) {
              parsedErrors[k] = null
            }
          })
        }
        setFieldErrors(parsedErrors)
        toast({ title: 'Validation error', description: body?.message || 'Please check the form fields and try again.', variant: 'destructive' })
        return
      } else if (resp.status === 429) {
        toast({
          title: 'Too many requests',
          description: 'Please try again later.',
          variant: 'destructive',
        })
        return
      } else {
        toast({
          title: 'Error',
          description: 'Something went wrong. Please try again.',
          variant: 'destructive',
        })
        return
      }

      // Confetti pop for a quick "success" celebration 🎉
      setShowConfetti(true)
      setTimeout(() => setShowConfetti(false), 100)

      // Toast confirmation
      toast({
        title: "🎉 Message Sent!",
        description: "Thank you for your inquiry. We'll get back to you within 24 hours.",
      })

      // Reset form fields after successful "submission"
      setFormData({
        name: "",
        email: "",
        phone: "",
        eventType: "",
        eventDate: "",
        message: "",
      })
      setFieldErrors({})
    } catch (err) {
      // Error toast (covers both network and unexpected errors)
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      })
    } finally {
      // Re-enable the button and restore original label
      setIsSubmitting(false)
    }
  }

  return (
    <>
      {/* Confetti overlay; appears briefly after a successful submit */}
      <ConfettiCelebration trigger={showConfetti} />

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <Card className="shadow-lg border-0 bg-card/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-2xl font-serif text-foreground flex items-center gap-2">
              <Send className="w-6 h-6 text-primary" />
              Get Your Free Quote
            </CardTitle>
            <CardDescription className="text-muted-foreground">
              Tell us about your event and we'll create a custom proposal just for you.
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Row 1: Name / Email */}
              <div className="grid md:grid-cols-2 gap-4">
                <motion.div className="space-y-2 relative" whileFocus={{ scale: 1.02 }} transition={{ duration: 0.2 }}>
                  <Label
                    htmlFor="name"
                    className={`text-sm font-medium flex items-center gap-2 transition-colors ${
                      focusedField === "name" ? "text-primary" : "text-foreground"
                    }`}
                  >
                    <User className="w-4 h-4" />
                    Full Name *
                  </Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => handleChange("name", e.target.value)}
                    onFocus={() => setFocusedField("name")}
                    onBlur={() => setFocusedField(null)}
                    placeholder="Your full name"
                    required
                    className="border-border/50 focus:border-primary transition-all"
                  />
                  {fieldErrors.name ? (
                    <p className="text-destructive text-sm mt-1">{fieldErrors.name}</p>
                  ) : null}
                </motion.div>

                <motion.div className="space-y-2" whileFocus={{ scale: 1.02 }} transition={{ duration: 0.2 }}>
                  <Label
                    htmlFor="email"
                    className={`text-sm font-medium flex items-center gap-2 transition-colors ${
                      focusedField === "email" ? "text-primary" : "text-foreground"
                    }`}
                  >
                    <Mail className="w-4 h-4" />
                    Email Address *
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleChange("email", e.target.value)}
                    onFocus={() => setFocusedField("email")}
                    onBlur={() => setFocusedField(null)}
                    placeholder="your@email.com"
                    required
                    className="border-border/50 focus:border-primary transition-all"
                  />
                  {fieldErrors.email ? (
                    <p className="text-destructive text-sm mt-1">{fieldErrors.email}</p>
                  ) : null}
                </motion.div>
              </div>

              {/* Row 2: Phone / Event Date */}
              <div className="grid md:grid-cols-2 gap-4">
                <motion.div className="space-y-2" whileFocus={{ scale: 1.02 }} transition={{ duration: 0.2 }}>
                  <Label
                    htmlFor="phone"
                    className={`text-sm font-medium flex items-center gap-2 transition-colors ${
                      focusedField === "phone" ? "text-primary" : "text-foreground"
                    }`}
                  >
                    <Phone className="w-4 h-4" />
                    Phone Number
                  </Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => handleChange("phone", e.target.value)}
                    onFocus={() => setFocusedField("phone")}
                    onBlur={() => setFocusedField(null)}
                    placeholder="10-digit phone number"
                    required
                    className="border-border/50 focus:border-primary transition-all"
                  />
                  {fieldErrors.phone ? (
                    <p className="text-destructive text-sm mt-1">{fieldErrors.phone}</p>
                  ) : null}
                </motion.div>

                <motion.div className="space-y-2" whileFocus={{ scale: 1.02 }} transition={{ duration: 0.2 }}>
                  <Label
                    htmlFor="eventDate"
                    className={`text-sm font-medium flex items-center gap-2 transition-colors ${
                      focusedField === "eventDate" ? "text-primary" : "text-foreground"
                    }`}
                  >
                    <Calendar className="w-4 h-4"/>
                    Event Date
                  </Label>
                  <Input
                    id="eventDate"
                    type="date"
                    value={formData.eventDate}
                    onChange={(e) => handleChange("eventDate", e.target.value)}
                    onFocus={() => setFocusedField("eventDate")}
                    onBlur={() => setFocusedField(null)}
                    min={new Date().toISOString().split('T')[0]}
                    className="border-border/50 focus:border-primary transition-all"
                  />
                  {fieldErrors.eventDate ? (
                    <p className="text-destructive text-sm mt-1">{fieldErrors.eventDate}</p>
                  ) : null}
                </motion.div>
              </div>

              {/* Row 3: Event Type (text) */}
              <motion.div className="space-y-2" whileFocus={{ scale: 1.02 }} transition={{ duration: 0.2 }}>
                <Label htmlFor="eventType" className="text-sm font-medium text-foreground">
                  Event Type *
                </Label>
                <Input
                  id="eventType"
                  value={formData.eventType}
                  onChange={(e) => handleChange("eventType", e.target.value)}
                  onFocus={() => setFocusedField("eventType")}
                  onBlur={() => setFocusedField(null)}
                  placeholder="e.g., Wedding, Cultural Festival, Corporate, Birthday…"
                  required
                  className="border-border/50 focus:border-primary transition-all"
                />
                {fieldErrors.eventType ? (
                  <p className="text-destructive text-sm mt-1">{fieldErrors.eventType}</p>
                ) : null}
              </motion.div>

              {/* Row 4: Message box */}
              <motion.div className="space-y-2" whileFocus={{ scale: 1.02 }} transition={{ duration: 0.2 }}>
                <Label htmlFor="message" className="text-sm font-medium text-foreground">
                  Tell Us About Your Event *
                </Label>
                <Textarea
                  id="message"
                  value={formData.message}
                  onChange={(e) => handleChange("message", e.target.value)}
                  placeholder="Describe your vision, guest count, special requirements, or any questions you have..."
                  rows={5}
                  required
                  className="border-border/50 focus:border-primary resize-none"
                />
                {fieldErrors.message ? (
                  <p className="text-destructive text-sm mt-1">{fieldErrors.message}</p>
                ) : null}
              </motion.div>

              {/* Submit button with animated label (Sending... / Get My Free Quote) */}
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-3 text-lg relative overflow-hidden"
                >
                  <AnimatePresence mode="wait">
                    {isSubmitting ? (
                      <motion.span key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                        Sending...
                      </motion.span>
                    ) : (
                      <motion.span key="submit" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                        Get My Free Quote
                      </motion.span>
                    )}
                  </AnimatePresence>
                </Button>
              </motion.div>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </>
  )
}
