"use client"

import WavyText from "./magicui/wavy-text"
import { motion } from "framer-motion"
import { Badge } from "./ui/badge"

export function TechStack() {
  const technologies = {
    Frontend: [
      "React",
      "Next.js",
      "TypeScript",
      "JavaScript",
      "HTML5",
      "CSS3",
      "Tailwind CSS",
      "Redux",
      "Framer Motion",
    ],
    Backend: ["Node.js", "Express", "Ruby on Rails", "Python", "RESTful APIs", "TRPC", "Drizzle ORM"],
    Database: ["MongoDB", "PostgreSQL", "MySQL", "Firebase"],
    "DevOps & Tools": ["Git", "GitHub","Caddy", "Docker", "AWS", "Vercel", "VS Code", "Postman"],
  }

  return (
    <section className="py-16 px-4 md:px-8" id="tech-stack">
      <div className="max-w-7xl mx-auto">
        <WavyText word="Tech Stack" className="text-4xl font-bold text-black dark:text-white mb-12" />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {Object.entries(technologies).map(([category, techs], index) => (
            <motion.div
              key={category}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="bg-card rounded-lg p-6 shadow-md"
            >
              <h3 className="text-xl font-bold mb-4">{category}</h3>
              <div className="flex flex-wrap gap-2">
                {techs.map((tech) => (
                  <Badge key={tech} variant="secondary" className="text-sm py-1 px-3">
                    {tech}
                  </Badge>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
