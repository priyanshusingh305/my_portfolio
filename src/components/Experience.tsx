"use client"

import WavyText from "./magicui/wavy-text"
import { motion } from "framer-motion"
import { MagicCard } from "./magicui/magic-card"
import { Briefcase, Calendar, MapPin } from "lucide-react"
import { TracingBeam } from "@/components/ui/tracing-beam"
import { TimelineDot } from "./ui/timeline-dot"

export function Experience() {
  const experiences = [
    {
      title: "Full Stack Developer",
      company: "Pintude Solutions LLP",
      location: "Mapusa, Goa",
      period: "June 2024 - Present",
    },
    {
      title: "Full-Stack Developer Intern",
      company: "Revispy",
      location: "Remote",
      period: "March 2024 - June 2024",
    },
    {
      title: "Frontend Intern",
      company: "Devsnest",
      location: "Remote",
      period: "Oct 2022 - Dec 2022",
    },
    {
      title: "IT Intern",
      company: "Rablo.in",
      location: "Remote",
      period: "Aug 2022 - Oct 2022",
    },
  ]

  return (
    <section className="py-16 px-4 md:px-8" id="experience">
      <div className="max-w-7xl mx-auto">
        <WavyText word="Experience" className="text-4xl font-bold text-black dark:text-white mb-12" />

        <TracingBeam beamColor="rgba(120, 119, 198, 0.6)" beamOpacity={0.6}>
          <div className="space-y-12 md:space-y-24 relative">
            {experiences.map((exp, index) => (
              <TimelineItem key={index} experience={exp} index={index} />
            ))}
          </div>
        </TracingBeam>
      </div>
    </section>
  )
}

function TimelineItem({ experience, index }: { experience: any; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      viewport={{ once: true, margin: "-100px" }}
      className="relative"
    >
      {/* Timeline dot */}
      {/* <div className="absolute -left-9 md:-left-20 top-5 flex items-center justify-center">
        <div className="h-5 w-5 rounded-full bg-primary" />
      </div> */}
      <TimelineDot isActive={index === 0} />

      {/* Content */}
      <MagicCard className="p-6 md:p-8 max-w-2xl">
        <div className="flex flex-col space-y-3">
          <div className="flex items-center gap-3">
            <Briefcase className="h-5 w-5 text-primary" />
            <h3 className="text-lg font-bold">{experience.title}</h3>
          </div>

          <div className="pl-8">
            <p className="text-base font-medium">{experience.company}</p>

            <div className="flex flex-col sm:flex-row sm:items-center gap-2 mt-2 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <MapPin className="h-4 w-4" />
                <span>{experience.location}</span>
              </div>

              <span className="hidden sm:inline">•</span>

              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                <span>{experience.period}</span>
              </div>
            </div>
          </div>
        </div>
      </MagicCard>
    </motion.div>
  )
}
