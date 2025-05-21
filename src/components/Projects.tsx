"use client"

import WavyText from "./magicui/wavy-text"
import { motion } from "framer-motion"
import { MagicCard, MagicContainer } from "./magicui/magic-card"
import Image from "next/image"
import { Badge } from "./ui/badge"
import { Button } from "./ui/button"
import { Github, ExternalLink } from "lucide-react"
import Link from "next/link"

export function Projects() {
  const projects = [
    {
      title: "Roxxcart",
      description: "An e-commerce platform with product catalog, user authentication, and payment integration.",
      image: "/placeholder.svg?height=400&width=600",
      technologies: ["Next.js", "TypeScript", "Tailwind CSS", "MongoDB", "Stripe"],
      github: "https://github.com/priyanshusingh305",
      demo: "#",
    },
    {
      title: "LoFi",
      description: "A music player platform with curated playlists for focus and relaxation.",
      image: "/placeholder.svg?height=400&width=600",
      technologies: ["React", "Node.js", "Express", "PostgreSQL", "AWS S3"],
      github: "https://github.com/priyanshusingh305",
      demo: "#",
    },
    {
      title: "Portfolio Website",
      description: "Personal portfolio website showcasing skills, projects, and experience.",
      image: "/placeholder.svg?height=400&width=600",
      technologies: ["Next.js", "TypeScript", "Tailwind CSS", "Framer Motion"],
      github: "https://github.com/priyanshusingh305",
      demo: "#",
    },
  ]

  return (
    <section className="py-16 px-4 md:px-8" id="projects">
      <div className="max-w-7xl mx-auto">
        <WavyText word="Projects" className="text-4xl font-bold text-black dark:text-white mb-12" />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <MagicContainer>
                <MagicCard className="h-full overflow-hidden">
                  <div className="relative h-48 w-full">
                    <Image
                      src={project.image || "/placeholder.svg"}
                      alt={project.title}
                      fill
                      className="object-cover"
                    />
                  </div>

                  <div className="p-6 space-y-4">
                    <h3 className="text-xl font-bold">{project.title}</h3>

                    <p className="text-muted-foreground">{project.description}</p>

                    <div className="flex flex-wrap gap-2 pt-2">
                      {project.technologies.map((tech) => (
                        <Badge key={tech} variant="outline" className="text-xs">
                          {tech}
                        </Badge>
                      ))}
                    </div>

                    <div className="flex gap-3 pt-4">
                      <Link href={project.github} passHref target="_blank">
                        <Button size="sm" variant="outline" className="gap-2">
                          <Github className="h-4 w-4" />
                          <span>Code</span>
                        </Button>
                      </Link>

                      <Link href={project.demo} passHref target="_blank">
                        <Button size="sm" className="gap-2">
                          <ExternalLink className="h-4 w-4" />
                          <span>Demo</span>
                        </Button>
                      </Link>
                    </div>
                  </div>
                </MagicCard>
              </MagicContainer>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
