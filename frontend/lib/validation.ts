import { z } from "zod"

export const contactFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().min(10, "Please enter a valid phone number"),
  eventType: z.enum(["wedding", "cultural", "corporate", "birthday", "other"]),
  date: z.string().min(1, "Please select an event date"),
  city: z.string().min(2, "Please enter your city"),
  message: z.string().min(10, "Please provide more details about your event"),
})

export type ContactFormData = z.infer<typeof contactFormSchema>

export const quoteRequestSchema = z.object({
  ...contactFormSchema.shape,
  services: z.array(z.string()).min(1, "Please select at least one service"),
  budget: z.string().optional(),
  guestCount: z.number().min(1, "Please enter expected guest count"),
})

export type QuoteRequestData = z.infer<typeof quoteRequestSchema>
