import { About } from "@/components/About";
import { HomePage } from "@/components/HomePage";
import { Spotlight } from "@/components/ui/Spotlight";

export default function Home() {
	return<div>
	<div className="absolute pointer-events-none inset-0 flex items-center justify-center dark:bg-black dark: bg-white [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]" />
	<div className="h-full w-full dark:bg-black bg-white  dark:bg-dot-white/[0.2] bg-dot-black/[0.2] relative flex items-center justify-center">
		<div className=" h-full w-screen">
		<Spotlight className="-top-40 left-0 md:left-60 md:-top-20 " fill="white" />
		<Spotlight className="-top-40 left-0 md:left-60 md:-top-20 dark:hidden -z-1" fill="#6a00ff" />

			<HomePage />
		<About/>
		</div>
	</div>
</div>
}
