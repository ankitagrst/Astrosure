import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { Header } from "@/components/shared/header"
import { Footer } from "@/components/shared/footer"

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
      <Header showRashis={false} />
      
      <main className="flex-1 bg-gray-50">
        {children}
      </main>

      <Footer />
    </div>
  )
}
