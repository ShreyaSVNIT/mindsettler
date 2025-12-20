"use client"

import { useForm } from "react-hook-form"

type VerifyFormData = {
  otp: string
}

export default function VerifyPage() {
  const { register, handleSubmit } = useForm<VerifyFormData>()

  const onSubmit = (data: VerifyFormData) => {
    console.log("OTP:", data.otp)
  }

  return (
    <main>
      <h1>Verify Email</h1>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div>
          <label>Verification Code</label>
          <input {...register("otp")} />
        </div>

        <button type="submit">Verify</button>
      </form>
    </main>
  )
}