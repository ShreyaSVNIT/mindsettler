"use client"

import { useEffect, useState } from "react"

export default function StatusPage() {
  const [data, setData] = useState<any>(null)
  const bookingId =
    typeof window !== "undefined"
      ? sessionStorage.getItem("bookingId")
      : null

  useEffect(() => {
    if (!bookingId) return

    fetch(`/api/booking/status?bookingId=${bookingId}`)
      .then((res) => res.json())
      .then((res) => setData(res))
  }, [bookingId])

  if (!bookingId) return <p>No booking found</p>

  return (
    <main>
      <h1>Booking Status</h1>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </main>
  )
}