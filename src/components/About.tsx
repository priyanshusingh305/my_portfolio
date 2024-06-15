import { MagicCard, MagicContainer } from "./magicui/magic-card";
import Image from "next/image";
import WavyText from "./magicui/wavy-text";

export function About() {
	return (
		<div className=" h-full p-5 " id="about">
			<WavyText word="About  me" className=" text-4xl font-bold text-black dark:text-white" />
			<div className="grid md:grid-cols-2 grid-rows-2  h-[30rem]">
				<div className="flex justify-center items-center  h-[27.5rem]  ">
					<Image alt={"alt"} src="/About.png" width={250} height={250} loading="eager" />
				</div>
				<div className="h-[27.5rem] ">
					<h1 className="gap-2 ml-2 text-3xl font-bold">Priyanshu Singh</h1>
					<p className="gap-2 ml-2 text-xl font-semibold ">Full Stack Developer</p>

					<MagicContainer className={"flex h-[500px] w-full flex-col gap-4 lg:h-[250px] lg:flex-row mb-2 mt-2"}>
						<MagicCard className="flex w-full cursor-pointer flex-col items-center justify-center overflow-hidden p-20 shadow-2xl">
							<p className="z-10 whitespace-nowrap text-4xl font-medium text-gray-800 dark:text-gray-200">Location</p>
							<p className="z-10 whitespace-nowrap text-4xl font-medium text-gray-800 dark:text-gray-200">Kanpur</p>
							<div className="pointer-events-none absolute inset-0 h-full bg-[radial-gradient(circle_at_50%_120%,rgba(120,119,198,0.3),rgba(255,255,255,0))]" />
						</MagicCard>
						<MagicCard className="flex w-full cursor-pointer flex-col items-center justify-center overflow-hidden p-20 shadow-2xl">
							<p className="z-10 whitespace-nowrap text-4xl font-medium text-gray-800 dark:text-gray-200">Age</p>
							<p className="z-10 whitespace-nowrap text-4xl font-medium text-gray-800 dark:text-gray-200">22</p>
							<div className="pointer-events-none absolute inset-0 h-full bg-[radial-gradient(circle_at_50%_120%,rgba(120,119,198,0.3),rgba(255,255,255,0))]" />
						</MagicCard>
						<MagicCard className="flex w-full cursor-pointer flex-col items-center justify-center overflow-hidden p-20 shadow-2xl">
							<p className="z-10 whitespace-nowrap text-4xl font-medium text-gray-800 dark:text-gray-200">Projects</p>
							<p className="z-10 whitespace-nowrap text-4xl font-medium text-gray-800 dark:text-gray-200">3</p>
							<div className="pointer-events-none absolute inset-0 h-full bg-[radial-gradient(circle_at_50%_120%,rgba(120,119,198,0.3),rgba(255,255,255,0))]" />
						</MagicCard>
					</MagicContainer>
					<p className="gap-2 ml-2 text-xl font-light">
						I am a passionate Full Stack Developer with a strong focus on JavaScript, React, and Node. I am passionate
						about creating efficient, scalable, and user-friendly applications. I am passionate about creating
						efficient, scalable, and user-friendly applications. I am passionate about creating efficient, scalable, and
						user-friendly applications.
					</p>
				</div>
			</div>
		</div>
	);
}
