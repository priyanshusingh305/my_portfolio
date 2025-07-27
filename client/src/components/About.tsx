"use client";

import { MagicCard, MagicContainer } from "./magicui/magic-card";
import Image from "next/image";
import WavyText from "./magicui/wavy-text";
import { motion } from "framer-motion";
import { MapPin, Calendar, GraduationCap, FolderGit2, Mail, Phone } from "lucide-react";
import Link from "next/link";

export function About() {
	return (
		<section className="py-16 px-4 md:px-8" id="about">
			<div className="max-w-7xl mx-auto">
				<WavyText word="About me" className="text-4xl font-bold text-black dark:text-white mb-12" />

				<div className="grid md:grid-cols-2 gap-8 lg:gap-16">
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						whileInView={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.5 }}
						viewport={{ once: true }}
						className="flex justify-center items-center"
					>
						<div className="relative w-64 h-64 md:w-80 md:h-80">
							<Image
								src="/About.png"
								alt="About Priyanshu Singh"
								fill
								className="object-contain object-center rounded-lg shadow-lg"
							/>
						</div>
					</motion.div>

					<motion.div
						initial={{ opacity: 0, y: 20 }}
						whileInView={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.5, delay: 0.2 }}
						viewport={{ once: true }}
						className="flex flex-col space-y-6"
					>
						<div>
							<h2 className="text-3xl font-bold mb-1">Priyanshu Singh</h2>
							<p className="text-xl font-semibold text-muted-foreground mb-4">Full Stack Developer</p>

							{/* <div className="flex flex-wrap gap-4 mb-4">
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <a href="mailto:singhpriyanshu305@gmail.com" className="text-sm hover:underline">singhpriyanshu305@gmail.com</a>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <a href="tel:+918299614046" className="text-sm hover:underline">+91 8299614046</a>
                </div>
              </div> */}
						</div>

						<MagicContainer className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
							<MagicCard className="flex flex-col items-center justify-center p-6 shadow-md rounded-lg">
								<MapPin className="h-8 w-8 mb-2 text-primary" />
								<p className="text-lg font-medium">Kanpur</p>
								<p className="text-sm text-muted-foreground">Location</p>
							</MagicCard>

							<MagicCard className="flex flex-col items-center justify-center p-6 shadow-md rounded-lg">
								<GraduationCap className="h-8 w-8 mb-2 text-primary" />
								<p className="text-lg font-medium">B.Tech</p>
								<p className="text-sm text-muted-foreground">CS Engineering</p>
							</MagicCard>

							<MagicCard className="flex flex-col items-center justify-center p-6 shadow-md rounded-lg">
								<FolderGit2 className="h-8 w-8 mb-2 text-primary" />
								<p className="text-lg font-medium">3+</p>
								<p className="text-sm text-muted-foreground">Projects</p>
							</MagicCard>
						</MagicContainer>

						<div className="space-y-4">
							<p className="text-base leading-relaxed">
								I am a Computer Science graduate from Dr. A.P.J. Abdul Kalam Technical University with expertise in
								full-stack development. Currently working at Pintude Solutions LLP, I design and deploy scalable
								microservices and build secure platforms with custom authentication systems.
							</p>

							<p className="text-base leading-relaxed">
								My technical skills include C++, JavaScript, Python, TypeScript, and frameworks like React, Express,
								NextJS, and Tailwind. I&#39;m experienced with databases including MongoDB, PostgreSQL, and MySQL, as
								well as tools like AWS, Docker, and Git.
							</p>

							<div className="mt-4 flex flex-wrap gap-3">
								<Link
									href="https://github.com/priyanshusingh305"
									target="_blank"
									className="text-sm bg-primary/10 hover:bg-primary/20 text-primary px-3 py-1 rounded-full transition-colors"
								>
									GitHub
								</Link>
								<Link
									href="https://www.linkedin.com/in/akapriyanshudev"
									target="_blank"
									className="text-sm bg-primary/10 hover:bg-primary/20 text-primary px-3 py-1 rounded-full transition-colors"
								>
									LinkedIn
								</Link>
								{/* <Link href="#" target="_blank" className="text-sm bg-primary/10 hover:bg-primary/20 text-primary px-3 py-1 rounded-full transition-colors">HackerRank</Link> */}
								{/* <Link href="#" target="_blank" className="text-sm bg-primary/10 hover:bg-primary/20 text-primary px-3 py-1 rounded-full transition-colors">LeetCode</Link> */}
							</div>
						</div>
					</motion.div>
				</div>
			</div>
		</section>
	);
}
