import { About } from "@/components/About"
import { Contact } from "@/components/Contact"
import { Education } from "@/components/Education"
import { Experience } from "@/components/Experience"
import { HomePage } from "@/components/HomePage"
import { MemoryGame } from "@/components/MemoryGame"
import { Projects } from "@/components/Projects"
import { TechStack } from "@/components/TechStack"

export default function Home() {
  return (
    <main className="flex flex-col min-h-screen">
      <HomePage />
      <About />
      <TechStack />
      <Education />
      <Experience />
      <Projects />
      <MemoryGame/>
      <Contact />
    </main>
  )
}
