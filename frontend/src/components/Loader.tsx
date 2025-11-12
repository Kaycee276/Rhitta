import { motion } from "framer-motion";

const Loader = () => {
	return (
		<div className="fixed inset-0 flex items-center justify-center bg-(--bg) z-50">
			<div className="flex flex-col items-center gap-4">
				<motion.h1
					className="text-4xl md:text-5xl font-bold text-(--accent-primary)"
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.5 }}
				>
					Rhitta
				</motion.h1>
				<div className="flex items-center gap-2">
					{[0, 1, 2].map((index) => (
						<motion.div
							key={index}
							className="w-2 h-2 bg-(--accent-primary) rounded-full"
							animate={{
								y: [0, -8, 0],
								opacity: [0.5, 1, 0.5],
							}}
							transition={{
								duration: 0.8,
								repeat: Infinity,
								delay: index * 0.2,
								ease: "easeInOut",
							}}
						/>
					))}
				</div>
			</div>
		</div>
	);
};

export default Loader;
