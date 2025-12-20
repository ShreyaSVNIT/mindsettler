"use client"

import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"

/* ---------------- Zod Schema ---------------- */

const bookSchema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Phone number is required"),
  session: z.string().min(1, "Select a session"),
  date: z.string().min(1, "Select a date"),
  time: z.string().min(1, "Select a time"),
  message: z.string().optional(),
})

type BookFormData = z.infer<typeof bookSchema>

/* ---------------- Page ---------------- */

export default function BookPage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<BookFormData>({
    resolver: zodResolver(bookSchema),
    mode: "onSubmit",
  })

  const onSubmit = (data: BookFormData) => {
    console.log("Booking data:", data)
  }

  return (
    <main>
      <h1>Book a Session</h1>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div>
          <label>Full Name</label>
          <input {...register("name")} />
          {errors.name && <p>{errors.name.message}</p>}
        </div>

        <div>
          <label>Email Address</label>
          <input type="email" {...register("email")} />
          {errors.email && <p>{errors.email.message}</p>}
        </div>

        <div>
          <label>Phone Number</label>
          <input type="tel" {...register("phone")} />
          {errors.phone && <p>{errors.phone.message}</p>}
        </div>

        <div>
          <label>Session Type</label>
          <select {...register("session")}>
            <option value="">Select</option>
            <option value="consultation">Consultation</option>
            <option value="followup">Follow-up</option>
          </select>
          {errors.session && <p>{errors.session.message}</p>}
        </div>

        <div>
          <label>Preferred Date</label>
          <input type="date" {...register("date")} />
          {errors.date && <p>{errors.date.message}</p>}
        </div>

        <div>
          <label>Preferred Time Slot</label>
          <input type="time" {...register("time")} />
          {errors.time && <p>{errors.time.message}</p>}
        </div>

        <div>
          <label>Message / Query</label>
          <textarea {...register("message")} />
        </div>

        <button type="submit">Continue</button>
      </form>
    </main>
  )
}