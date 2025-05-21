"use client"

import WavyText from "./magicui/wavy-text"
import { motion } from "framer-motion"
import { MagicCard, MagicContainer } from "./magicui/magic-card"
import { Briefcase, Calendar, ExternalLink } from "lucide-react"
import { Button } from "./ui/button"
import Link from "next/link"

export function Experience() {
  const experiences = [
    {
      title: "Full Stack Developer",
      company: "Pintude Solutions LLP",
      location: "Mapusa, Goa",
      period: "June 2024 - Present",
      description: [
        "Designed and deployed scalable billing microservices, enabling seamless invoice generation and payment tracking across platforms.",
        "Built a career and blogging platform integrated with a custom in-house authentication system to manage user roles and access securely.",
        "Developed a reusable wallet microservice offered as a SaaS component for integration across multiple products.",
        "Engineered the backend of a merchant backup application with support for secure file storage of up to 1GB per user using AWS S3."
      ],
      link: "#",
    },
    {
      title: "Full-Stack Developer Intern",
      company: "Revispy",
      location: "Remote",
      period: "March 2024 - June 2024",
      description: [
        "Engineered a data-driven approach by implementing Drizzle ORM for seamless schema organization, resulting in a 40% reduction in database query time and a 25% increase in system performance.",
        "Architected and developed APIs for key functionalities like category, subcategory, product, and review through TRPC, establishing a secure and structured communication layer for seamless data exchange and improved system performance."
      ],
      link: "#",
    },
    {
      title: "Frontend Intern",
      company: "Devsnest",
      location: "Remote",
      period: "Oct 2022 - Dec 2022",
      description: [
        "Developed test cases for evaluating front-end assignments using Chai and MochaJS.",
        "Facilitated learning sessions on the basics of programming and conducted multiple sessions on emerging technologies like blockchain."
      ],
      link: "#",
    },
    {
      title: "IT Intern",
      company: "Rablo.in",
      location: "Remote",
      period: "Aug 2022 - Oct 2022",
      description: [
        "Developed a front-end solution using ReactJS for efficient 1-minute video registration within the Learning Management System (LMS).",
        "Integrated the Aadhaar authentication API, strengthening project security and enhancing user verification capabilities, leading to a 40% reduction in fraudulent activities and ensuring data integrity."
      ],
      link: "#",
    },
  ]

  return (
    <section className="py-16 px-4 md:px-8" id="experience">
      <div className="max-w-7xl mx-auto">
        <WavyText word="Experience" className="text-4xl font-bold text-black dark:text-white mb-12" />
        
        <div className="space-y-8">
          {experiences.map((exp, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <MagicContainer>
                <MagicCard className="p-6 md:p-8">
                  <div className="flex flex-col space-y-4">
                    <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-2">
                      <div className="flex items-center gap-3">
                        <Briefcase className="h-6 w-6 text-primary" />
                        <div>
                          <h3 className="text-xl font-bold">{exp.title}</h3>
                          <p className="text-lg font-medium">{exp.company}</p>
                        </div>
                      </div>
                      <div className="flex flex-col md:flex-row md:items-center gap-2">
                        <span className="text-muted-foreground">{exp.location}</span>
                        <span className="hidden md:inline text-muted-foreground">|</span>
                        <div className="flex items-center gap-2">
                          <Calendar className="h-5 w-5 text-muted-foreground" />
                          <span className="text-muted-foreground">{exp.period}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="text-base leading-relaxed py-2">
                      <ul className="list-disc pl-5 space-y-2">
                        {exp.description.map((point, idx) => (
                          <li key={idx}>{point}</li>
                        ))}
                      </ul>
                    </div>
                    
                    {exp.link && (
                      <div>
                        <Link href={exp.link} passHref>
                          <Button variant="ghost" size="sm" className="gap-2">
                            <span>View Details</span>
                            <ExternalLink className="h-4 w-4" />
                          </Button>
                        </Link>
                      </div>
                    )}
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