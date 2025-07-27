"use client";

import Image from "next/image";
import { MagicCard, MagicContainer } from "./magicui/magic-card";
import WavyText from "./magicui/wavy-text";
import { motion } from "framer-motion";
import { GraduationCap, Calendar, MapPin } from "lucide-react";

export function Education() {
	return (
		<section className="py-16 px-4 md:px-8" id="education">
			<div className="max-w-7xl mx-auto">
				<WavyText word="Education" className="text-4xl font-bold text-black dark:text-white mb-12" />

				<motion.div
					initial={{ opacity: 0, y: 20 }}
					whileInView={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.5 }}
					viewport={{ once: true }}
				>
					<MagicContainer>
						<MagicCard className="p-6 md:p-8">
							<div className="flex flex-col md:flex-row gap-8 items-center">
								<div className="md:w-1/4 flex justify-center">
									<div className="relative w-40 h-40 md:w-48 md:h-48">
										<Image src="/AKtu.png" alt="AKTU University Logo" fill className="object-contain" />
									</div>
								</div>

								<div className="md:w-3/4 space-y-4">
									<div className="flex items-center gap-2">
										<GraduationCap className="h-6 w-6 text-primary" />
										<h3 className="text-2xl font-bold">B.Tech. in Computer Science & Engineering</h3>
									</div>

									<p className="text-xl font-medium">Dr. A. P. J. Abdul Kalam Technical University, Lucknow</p>

									<div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-6">
										<div className="flex items-center gap-2">
											<Calendar className="h-5 w-5 text-muted-foreground" />
											<span className="text-muted-foreground">2019 - 2023</span>
										</div>

										<div className="flex items-center gap-2">
											<MapPin className="h-5 w-5 text-muted-foreground" />
											<span className="text-muted-foreground">Kanpur, Uttar Pradesh</span>
										</div>
									</div>

									<div className="pt-2">
										<p className="text-base leading-relaxed">
											Completed my bachelor&#39;s degree with a focus on software development, data structures,
											algorithms, and web technologies. Participated in various coding competitions and hackathons.
										</p>
									</div>
								</div>
							</div>
						</MagicCard>
					</MagicContainer>
				</motion.div>
			</div>
		</section>
	);
}
