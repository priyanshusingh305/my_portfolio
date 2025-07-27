"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { RotateCcw, Trophy, Timer } from "lucide-react";
import WavyText from "./magicui/wavy-text";

interface Card {
	id: number;
	icon: string;
	name: string;
	isFlipped: boolean;
	isMatched: boolean;
}

const techIcons = [
	{ icon: "⚛️", name: "React" },
	{ icon: "📘", name: "TypeScript" },
	{ icon: "🟢", name: "Node.js" },
	{ icon: "🐍", name: "Python" },
	{ icon: "☕", name: "Java" },
	{ icon: "🔥", name: "Firebase" },
	{ icon: "🎨", name: "CSS" },
	{ icon: "⚡", name: "JavaScript" },
];

export function MemoryGame() {
	const [cards, setCards] = useState<Card[]>([]);
	const [flippedCards, setFlippedCards] = useState<number[]>([]);
	const [moves, setMoves] = useState(0);
	const [isGameComplete, setIsGameComplete] = useState(false);
	const [timer, setTimer] = useState(0);
	const [isGameStarted, setIsGameStarted] = useState(false);

	// Initialize game
	const initializeGame = () => {
		const shuffledCards = [...techIcons, ...techIcons]
			.sort(() => Math.random() - 0.5)
			.map((card, index) => ({
				id: index,
				icon: card.icon,
				name: card.name,
				isFlipped: false,
				isMatched: false,
			}));

		setCards(shuffledCards);
		setFlippedCards([]);
		setMoves(0);
		setIsGameComplete(false);
		setTimer(0);
		setIsGameStarted(true);
	};

	// Timer effect
	useEffect(() => {
		let interval: NodeJS.Timeout;
		if (isGameStarted && !isGameComplete) {
			interval = setInterval(() => {
				setTimer((prev) => prev + 1);
			}, 1000);
		}
		return () => clearInterval(interval);
	}, [isGameStarted, isGameComplete]);

	// Handle card click
	const handleCardClick = (cardId: number) => {
		if (flippedCards.length === 2) {
			return;
		}
		if (flippedCards.includes(cardId)) {
			return;
		}
		if (cards[cardId].isMatched) {
			return;
		}

		const newFlippedCards = [...flippedCards, cardId];
		setFlippedCards(newFlippedCards);

		// Update card state
		setCards((prev) => prev.map((card) => (card.id === cardId ? { ...card, isFlipped: true } : card)));

		// Check for match when 2 cards are flipped
		if (newFlippedCards.length === 2) {
			setMoves((prev) => prev + 1);

			const [firstCard, secondCard] = newFlippedCards.map((id) => cards[id]);

			if (firstCard.name === secondCard.name) {
				// Match found
				setTimeout(() => {
					setCards((prev) =>
						prev.map((card) => (newFlippedCards.includes(card.id) ? { ...card, isMatched: true } : card)),
					);
					setFlippedCards([]);

					// Check if game is complete
					const updatedCards = cards.map((card) =>
						newFlippedCards.includes(card.id) ? { ...card, isMatched: true } : card,
					);
					if (updatedCards.every((card) => card.isMatched)) {
						setIsGameComplete(true);
						setIsGameStarted(false);
					}
				}, 500);
			} else {
				// No match
				setTimeout(() => {
					setCards((prev) =>
						prev.map((card) => (newFlippedCards.includes(card.id) ? { ...card, isFlipped: false } : card)),
					);
					setFlippedCards([]);
				}, 1000);
			}
		}
	};

	const formatTime = (seconds: number) => {
		const mins = Math.floor(seconds / 60);
		const secs = seconds % 60;
		return `${mins}:${secs.toString().padStart(2, "0")}`;
	};

	return (
		<section className="py-16 px-4 md:px-8" id="game">
			<div className="max-w-4xl mx-auto">
				<WavyText word="Memory Challenge" className="text-4xl font-bold text-black dark:text-white mb-8" />

				<div className="text-center mb-8">
					<p className="text-muted-foreground mb-6">
						Test your memory with this tech-themed card matching game! Match all the programming languages and
						technologies.
					</p>

					{!isGameStarted && !isGameComplete && (
						<Button onClick={initializeGame} size="lg" className="gap-2">
							<Trophy className="h-5 w-5" />
							Start Game
						</Button>
					)}

					{(isGameStarted || isGameComplete) && (
						<div className="flex flex-wrap justify-center gap-4 mb-6">
							<Badge variant="outline" className="gap-2 px-4 py-2">
								<Timer className="h-4 w-4" />
								Time: {formatTime(timer)}
							</Badge>
							<Badge variant="outline" className="gap-2 px-4 py-2">
								Moves: {moves}
							</Badge>
							<Button onClick={initializeGame} variant="outline" size="sm" className="gap-2">
								<RotateCcw className="h-4 w-4" />
								Reset
							</Button>
						</div>
					)}
				</div>

				<AnimatePresence>
					{isGameComplete && (
						<motion.div
							initial={{ opacity: 0, scale: 0.8 }}
							animate={{ opacity: 1, scale: 1 }}
							exit={{ opacity: 0, scale: 0.8 }}
							className="text-center mb-8 p-6 bg-primary/10 rounded-lg border border-primary/20"
						>
							<Trophy className="h-12 w-12 text-primary mx-auto mb-4" />
							<h3 className="text-2xl font-bold mb-2">Congratulations! 🎉</h3>
							<p className="text-muted-foreground">
								You completed the game in {moves} moves and {formatTime(timer)}!
							</p>
						</motion.div>
					)}
				</AnimatePresence>

				{cards.length > 0 && (
					<div className="grid grid-cols-4 gap-3 md:gap-4 max-w-md mx-auto">
						{cards.map((card) => (
							<motion.div
								key={card.id}
								className="aspect-square cursor-pointer"
								whileHover={{ scale: 1.05 }}
								whileTap={{ scale: 0.95 }}
								onClick={() => handleCardClick(card.id)}
							>
								<div className="relative w-full h-full">
									<motion.div
										className="absolute inset-0 w-full h-full"
										initial={false}
										animate={{
											rotateY: card.isFlipped || card.isMatched ? 180 : 0,
										}}
										transition={{ duration: 0.3 }}
										style={{ transformStyle: "preserve-3d" }}
									>
										{/* Card Back */}
										<div
											className="absolute inset-0 w-full h-full bg-gradient-to-br from-primary/20 to-primary/40 rounded-lg border-2 border-primary/30 flex items-center justify-center"
											style={{ backfaceVisibility: "hidden" }}
										>
											<div className="text-2xl">💻</div>
										</div>

										{/* Card Front */}
										<div
											className={`absolute inset-0 w-full h-full rounded-lg border-2 flex flex-col items-center justify-center text-center p-2 ${
												card.isMatched ? "bg-green-100 dark:bg-green-900/30 border-green-500" : "bg-card border-border"
											}`}
											style={{
												backfaceVisibility: "hidden",
												transform: "rotateY(180deg)",
											}}
										>
											<div className="text-2xl mb-1">{card.icon}</div>
											<div className="text-xs font-medium">{card.name}</div>
										</div>
									</motion.div>
								</div>
							</motion.div>
						))}
					</div>
				)}

				<div className="text-center mt-8">
					<p className="text-sm text-muted-foreground">
						Click on cards to flip them and find matching pairs. Challenge yourself to complete it in fewer moves!
					</p>
				</div>
			</div>
		</section>
	);
}
