import Image from "next/image";

export function About() {
	return (
		<div className="md:h-[30rem] h-full ">
			<h1 className="text-3xl bold text-center font-bold mb-2">About me</h1>
			<div className="flex grid md:grid-cols-2 grid-rows-2">
				<div className="flex justify-center items-center  h-[27.5rem]  ">
					<Image alt={"alt"} src="/About.png" width={250} height={250} loading="eager" />
				</div>
				<div className="h-[27.5rem] ">
					<h1 className="gap-2 ml-2 text-3xl font-bold">Priyanshu Singh</h1>
					<p className="gap-2 ml-2 text-xl font-semibold ">Full Stack Developer</p>
					<div className="flex md:flex-row flex-col md:h-[13rem]  "></div>
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
