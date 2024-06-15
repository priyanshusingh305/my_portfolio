import WavyText from "./magicui/wavy-text";

export function Projects() {
  return (
    <div>
            <WavyText
      word="Projects"
      variant={{
        hidden: { y: 50 },
        visible: { y: -10 },
      }}
      className=" text-4xl font-bold text-black dark:text-white"
    />
    
    </div>
  );
}