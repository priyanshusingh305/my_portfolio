import Image from "next/image";
import { TextGenerateEffect } from "./ui/text-generate-effect";
import {  GitHubLogoIcon, LinkedInLogoIcon, TwitterLogoIcon } from '@radix-ui/react-icons'
import { Button } from "./ui/button";
import Link from "next/link";

export function HomePage() {
	const words = ["Hello there!", "I'm Priyanshu Singh, a Full Stack Developer."];
	return (
		<div className="h-screen grid grid-cols-2  w-auto  ml-2 md:ml-0">
			<div className="flex flex-col justify-center md:items-center items-start">
				<div className="flex flex-col ">
					{words.map((word, index) => (
						// biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
						<TextGenerateEffect key={index} words={word} />
					))}
          
				</div>
				<div  className="flex flex-row justify-start md:w-[33rem]  mt-[2rem] " >
					<Button className="mr-2">
						Hire me
					</Button>
					<Button className="mr-2">
						Download CV
					</Button>
				</div>
        <div  className="flex flex-row justify-start md:w-[33rem] mt-[2rem] " >
				<Link href="https://github.com/priyanshusingh305" target="_blank" passHref>
        <Button className=" mr-2">
        <GitHubLogoIcon />
        </Button>
				</Link>
				<Link href={"https://www.linkedin.com/in/akapriyanshudev"} target="_blank" passHref>
        <Button className="mr-2" >
        <LinkedInLogoIcon />
        </Button>
				</Link>
				<Link href={"https://twitter.com/akapriyanshudev"} target="_blank" passHref>

        <Button className="mr-2">
        <TwitterLogoIcon />
				</Button>
				</Link>
        </div>


			</div>

			<div className="flex flex-col justify-center items-center ">
				<Image alt={"alt"} src="/Profile.webp" width={400} height={400} loading="eager" />
			</div>
		</div>
	);
}
