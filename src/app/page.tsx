import { About } from "@/components/About";
import { Contact } from "@/components/Contact";
import { Education } from "@/components/Education";
import { Experience } from "@/components/Experience";
import { HomePage } from "@/components/HomePage";
import { Projects } from "@/components/Projects";
import { TechStack } from "@/components/TechStack";

export default function Home() {
	return (
		<div className="flex flex-col h-full gap-2">
			<HomePage />
			<About />
			{/* <TechStack /> */}
			<Education />
			{/* <Experience /> */}
			{/* <Projects /> */}
			{/* <Contact /> */}
		</div>
	);
}
