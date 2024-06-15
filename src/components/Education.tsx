import Image from "next/image";
import { MagicCard, MagicContainer } from "./magicui/magic-card";
import WavyText from "./magicui/wavy-text";

export function Education() {
    return (
        <div className="h-full p-5">
            <WavyText word="Education" className="text-2xl md:text-4xl font-bold text-black dark:text-white" />

            <MagicContainer>
                <MagicCard>
                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="md:flex-1 flex justify-center items-center">
                            <Image src="/Aktu.png" alt="Education" width={200} height={200} layout="intrinsic" />
                        </div>
                        <div className="md:flex-1 flex flex-col justify-center">
                            <p className="z-10 text-xl md:text-4xl font-medium text-gray-800 dark:text-gray-200">
                                B.Tech. in Computer Science & Engineering
                            </p>
                            <p className="z-10 text-xl md:text-4xl font-medium text-gray-800 dark:text-gray-200">
                                Dr. A. P. J. Abdul Kalam Technical University, Lucknow
                            </p>
                            <p className="z-10 text-xl md:text-4xl font-medium text-gray-800 dark:text-gray-200">
                                2019 - 2023
                            </p>
                            <p className="z-10 text-xl md:text-4xl font-medium text-gray-800 dark:text-gray-200">
                                Kanpur, Uttar Pradesh
                            </p>
                        </div>
                        <div className="pointer-events-none absolute inset-0 h-full bg-[radial-gradient(circle_at_50%_120%,rgba(120,119,198,0.3),rgba(255,255,255,0))]" />
                    </div>
                </MagicCard>
            </MagicContainer>
        </div>
    );
}