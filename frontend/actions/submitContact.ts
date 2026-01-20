"use server"

// TODO(backend): Implement actual contact form submission
// This will be connected to database and email service in Phase 2

import type { z } from "zod"
import { contactFormSchema } from "@/lib/validation"

export async function submitContact(data: z.infer<typeof contactFormSchema>) {
  try {
    // TODO(backend): Validate data with Zod schema
    const validatedData = contactFormSchema.parse(data)

    // TODO(backend): Save to database
    // await db.insert(contacts).values(validatedData)

    // TODO(backend): Send notification email to team
    // await sendEmail({
    //   to: 'team@windmillevents.com',
    //   subject: `New inquiry from ${validatedData.name}`,
    //   template: 'contact-inquiry',
    //   data: validatedData
    // })

    // TODO(backend): Send auto-reply to customer
    // await sendEmail({
    //   to: validatedData.email,
    //   subject: 'Thank you for your inquiry - Windmill for Events',
    //   template: 'contact-confirmation',
    //   data: validatedData
    // })

    return { success: true, message: "Contact form submitted successfully" }
  } catch (error) {
    console.error("Contact form submission error:", error)
    return { success: false, message: "Failed to submit contact form" }
  }
}
