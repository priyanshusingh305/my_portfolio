"use client";

import Image from "next/image";
import { TextGenerateEffect } from "./ui/text-generate-effect";
import { DiscordLogoIcon, GitHubLogoIcon, LinkedInLogoIcon, TwitterLogoIcon } from "@radix-ui/react-icons";
import { Button } from "./ui/button";
import Link from "next/link";
import { motion } from "framer-motion";

export function HomePage() {
	const words = ["Hello there!", "I'm Priyanshu Singh, a Full Stack Developer."];

	return (
		<section
			id="home"
			className="min-h-screen w-full flex flex-col-reverse md:flex-row items-center justify-center px-4 md:px-8 py-10"
		>
			<motion.div
				initial={{ opacity: 0, x: -20 }}
				animate={{ opacity: 1, x: 0 }}
				transition={{ duration: 0.5 }}
				className="flex flex-col w-full md:w-1/2 space-y-6"
			>
				<div className="flex flex-col">
					{words.map((word, index) => (
						// biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
						<TextGenerateEffect key={index} words={word} className="text-4xl md:text-5xl lg:text-7xl font-bold" />
					))}
				</div>

				<motion.p
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					transition={{ delay: 1.2, duration: 0.5 }}
					className="text-muted-foreground text-lg max-w-md"
				>
					Passionate about creating elegant solutions to complex problems with modern web technologies.
				</motion.p>

				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: 1.5, duration: 0.5 }}
					className="flex flex-wrap gap-3"
				>
					<Link href="#contact" passHref>
						<Button size="lg" className="font-medium">
							Hire me
						</Button>
					</Link>
					<Link
						href="https://drive.google.com/file/d/1kOAtsx2-epd4I9IPklEXV6nqtkXwqYwb/view?usp=sharing"
						target="_blank"
						passHref
					>
						<Button size="lg" variant="outline" className="font-medium">
							Download CV
						</Button>
					</Link>
				</motion.div>

				<motion.div
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					transition={{ delay: 1.8, duration: 0.5 }}
					className="flex gap-3 mt-2"
				>
					<Link href="https://github.com/priyanshusingh305" target="_blank" passHref>
						<Button size="icon" variant="ghost" aria-label="GitHub">
							<GitHubLogoIcon className="h-5 w-5" />
						</Button>
					</Link>
					<Link href="https://www.linkedin.com/in/akapriyanshudev" target="_blank" passHref>
						<Button size="icon" variant="ghost" aria-label="LinkedIn">
							<LinkedInLogoIcon className="h-5 w-5" />
						</Button>
					</Link>
					<Link href="https://twitter.com/akapriyanshudev" target="_blank" passHref>
						<Button size="icon" variant="ghost" aria-label="Twitter">
							<TwitterLogoIcon className="h-5 w-5" />
						</Button>
					</Link>
					{/* discord */}
					{/* <Link href="https://discord.com/users/305" target="_blank" passHref>
						<Button size="icon" variant="ghost" aria-label="Discord">
							<DiscordLogoIcon className="h-5 w-5" />
						</Button>
					</Link> */}
				</motion.div>
			</motion.div>

			<motion.div
				initial={{ opacity: 0, scale: 0.9 }}
				animate={{ opacity: 1, scale: 1 }}
				transition={{ duration: 0.5 }}
				className="w-full md:w-1/2 flex justify-center items-center mb-8 md:mb-0"
			>
				<div className="relative w-64 h-64 md:w-80 md:h-80 lg:w-96 lg:h-96 overflow-visible">
					<div className="absolute inset-0">
						<Image
							src="/Profile.webp"
							alt="Priyanshu Singh"
							fill
							sizes="(max-width: 768px) 16rem, (max-width: 1024px) 20rem, 24rem"
							className="object-contain object-center rounded-full shadow-2xl"
							priority
						/>
					</div>
				</div>
			</motion.div>
		</section>
	);
}
