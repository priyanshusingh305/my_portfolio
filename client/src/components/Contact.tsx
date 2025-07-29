"use client";

import WavyText from "./magicui/wavy-text";
import { motion } from "framer-motion";
import { MagicCard, MagicContainer } from "./magicui/magic-card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Mail, Phone, MapPin, Send } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import Link from "next/link";

export function Contact() {
	const [isLoading, setIsLoading] = useState(false);
	const [formData, setFormData] = useState({
		name: "",
		email: "",
		subject: "",
		message: "",
	});

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsLoading(true);

		try {
			const response = await fetch("/api/send", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(formData),
			});

			if (!response.ok) {
				throw new Error("Failed to send message");
			}

			toast.success("Message sent successfully!");
			setFormData({ name: "", email: "", subject: "", message: "" });
		} catch (error) {
			toast.error("Failed to send message. Please try again.");
		} finally {
			setIsLoading(false);
		}
	};

	const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
		const { id, value } = e.target;
		setFormData((prev) => ({ ...prev, [id]: value }));
	};

	return (
		<section className="py-16 px-4 md:px-8" id="contact">
			<div className="max-w-7xl mx-auto">
				<WavyText word="Contact Me" className="text-4xl font-bold text-black dark:text-white mb-12" />

				<div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
					<motion.div
						initial={{ opacity: 0, x: -20 }}
						whileInView={{ opacity: 1, x: 0 }}
						transition={{ duration: 0.5 }}
						viewport={{ once: true }}
						className="space-y-6"
					>
						<h3 className="text-2xl font-bold">Get In Touch</h3>
						<p className="text-muted-foreground max-w-md">
							Feel free to reach out if you&#39;re looking for a developer, have a question, or just want to connect.
						</p>
						<div className="space-y-4 pt-4">
							<div className="flex items-center gap-4">
								<div className="bg-primary/10 p-3 rounded-full">
									<Mail className="h-6 w-6 text-primary" />
								</div>
								<div>
									<p className="text-sm text-muted-foreground">Email</p>
									<Link className="font-medium" href="mailto:singhpriyanshu305@gmail.com">singhpriyanshu305@gmail.com</Link>
								</div>
							</div>

							<div className="flex items-center gap-4">
								<div className="bg-primary/10 p-3 rounded-full">
									<Phone className="h-6 w-6 text-primary" />
								</div>
								{/* <div>
									<p className="text-sm text-muted-foreground">Phone</p>
									<Link className="font-medium"  href="tel:+918299614046">+91 82996 14046</Link>
								</div> */}
							</div>

							<div className="flex items-center gap-4">
								<div className="bg-primary/10 p-3 rounded-full">
									<MapPin className="h-6 w-6 text-primary" />
								</div>
								<div>
									<p className="text-sm text-muted-foreground">Location</p>
									<p className="font-medium">Kanpur, Uttar Pradesh, India</p>
								</div>
							</div>
						</div>
					</motion.div>

					<motion.div
						initial={{ opacity: 0, x: 20 }}
						whileInView={{ opacity: 1, x: 0 }}
						transition={{ duration: 0.5 }}
						viewport={{ once: true }}
					>
						<MagicContainer>
							<MagicCard className="p-6">
								<form onSubmit={handleSubmit} className="space-y-4">
									<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
										<div className="space-y-2">
											<label htmlFor="name" className="text-sm font-medium">
												Name
											</label>
											<Input id="name" placeholder="Your name" value={formData.name} onChange={handleChange} required />
										</div>

										<div className="space-y-2">
											<label htmlFor="email" className="text-sm font-medium">
												Email
											</label>
											<Input
												id="email"
												type="email"
												placeholder="Your email"
												value={formData.email}
												onChange={handleChange}
												required
											/>
										</div>
									</div>

									<div className="space-y-2">
										<label htmlFor="subject" className="text-sm font-medium">
											Subject
										</label>
										<Input
											id="subject"
											placeholder="Subject"
											value={formData.subject}
											onChange={handleChange}
											required
										/>
									</div>

									<div className="space-y-2">
										<label htmlFor="message" className="text-sm font-medium">
											Message
										</label>
										<Textarea
											id="message"
											placeholder="Your message"
											rows={5}
											value={formData.message}
											onChange={handleChange}
											required
										/>
									</div>

									<Button type="submit" className="w-full gap-2" disabled={isLoading}>
										<Send className="h-4 w-4" />
										<span>{isLoading ? "Sending..." : "Send Message"}</span>
									</Button>
								</form>
							</MagicCard>
						</MagicContainer>
					</motion.div>
				</div>
			</div>
		</section>
	);
}
