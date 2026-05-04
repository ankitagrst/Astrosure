"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { PlaceAutocomplete } from "@/components/ui/place-autocomplete"

export default function NewKundaliPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [place, setPlace] = useState("")

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setIsLoading(true)

    const formData = new FormData(e.currentTarget)
    const name = formData.get("name") as string
    const dob = formData.get("dob") as string
    const tob = formData.get("tob") as string
    const placeValue = place || (formData.get("place") as string)

    try {
      const res = await fetch("/api/v1/kundali", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, dob, tob, place: placeValue }),
      })

      const data = await res.json()

      if (data.success) {
        router.push(`/dashboard/kundali/${data.data.id}`)
      }
    } catch (err) {
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container mx-auto max-w-2xl px-4 py-8">
      <Card>
        <CardHeader>
          <CardTitle>Generate Kundali</CardTitle>
          <CardDescription>Enter birth details to create your chart</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={onSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input id="name" name="name" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="dob">Date of Birth</Label>
              <Input id="dob" name="dob" type="date" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="tob">Time of Birth</Label>
              <Input id="tob" name="tob" type="time" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="place">Place of Birth</Label>
              <PlaceAutocomplete
                id="place"
                name="place"
                value={place}
                onChange={setPlace}
                onSelect={(selected) => setPlace(selected.formattedPlace)}
                placeholder="City, Country"
                inputClassName="h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              />
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Generating..." : "Generate Chart"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
