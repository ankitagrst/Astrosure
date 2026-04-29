import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
// Header/Footer are provided globally in the root layout

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth()

  if (!session) {
    redirect("/login")
  }

  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex-1 bg-gray-50">
        {children}
      </main>
    </div>
  )
}
