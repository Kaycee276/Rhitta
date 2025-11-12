import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAccount } from "wagmi";
import { useToastStore } from "../store/toastStore";
import { Upload, Music, FileText, ArrowLeft, ArrowRight } from "lucide-react";
import { Stepper } from "../components/Stepper";

const AddSong = () => {
	const { address } = useAccount();
	const navigate = useNavigate();
	const { addToast } = useToastStore();

	const [currentStep, setCurrentStep] = useState(0);

	const [formData, setFormData] = useState({
		title: "",
		artist: "",
		genre: "",
		coverArt: "",
		audioUrl: "",
		nftAmount: 1,
		price: "",
	});

	const [audioFile, setAudioFile] = useState<File | null>(null);
	const [coverFile, setCoverFile] = useState<File | null>(null);
	const [isSubmitting, setIsSubmitting] = useState(false);

	const steps = [
		{ title: "Track Details", description: "Basic info" },
		{ title: "Media Files", description: "Upload files" },
		{ title: "NFT Config", description: "Pricing & amount" },
	];

	const handleInputChange = (
		e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
	) => {
		const { name, value } = e.target;
		setFormData((prev) => ({ ...prev, [name]: value }));
	};

	const handleFileChange = (
		e: React.ChangeEvent<HTMLInputElement>,
		type: "audio" | "cover"
	) => {
		const file = e.target.files?.[0] || null;
		if (type === "audio") {
			setAudioFile(file);
		} else {
			setCoverFile(file);
		}
	};

	const validateStep = (stepIndex: number): boolean => {
		if (stepIndex === 0) {
			if (!formData.title || !formData.artist || !formData.genre) {
				addToast(
					"Please fill in all required fields for track details.",
					"error"
				);
				return false;
			}
		} else if (stepIndex === 1) {
			if (!formData.audioUrl && !audioFile) {
				addToast("Please provide an audio URL or upload a file.", "error");
				return false;
			}
			if (!formData.coverArt && !coverFile) {
				addToast("Please provide a cover art URL or upload a file.", "error");
				return false;
			}
		} else if (stepIndex === 2) {
			if (!formData.price || !formData.nftAmount) {
				addToast("Please fill in price and NFT amount.", "error");
				return false;
			}
		}
		return true;
	};

	const handleNextStep = () => {
		if (validateStep(currentStep)) {
			if (currentStep < steps.length - 1) {
				setCurrentStep(currentStep + 1);
			}
		}
	};

	const handlePrevStep = () => {
		if (currentStep > 0) {
			setCurrentStep(currentStep - 1);
		}
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		if (!validateStep(currentStep)) return;

		setIsSubmitting(true);

		// Simulate song creation
		addToast("Song added successfully! NFTs are being minted.", "success");
		setTimeout(() => {
			setIsSubmitting(false);
			navigate("/");
		}, 30000);

		// Add onchain logic
	};

	if (!address) {
		return (
			<div className=" flex items-center justify-center px-4">
				<div className="text-center space-y-4">
					<div className="w-12 h-12 rounded-full bg-(--accent-primary) mx-auto flex items-center justify-center">
						<Music className="w-6 h-6 " />
					</div>
					<h2 className="text-2xl font-semibold ">Connect Your Wallet</h2>
					<p className=" max-w-sm">
						You need to connect your wallet to upload and mint your music as
						NFTs.
					</p>
				</div>
			</div>
		);
	}

	return (
		<div className=" py-12 px-4">
			<div className="max-w-2xl mx-auto">
				{/* Header */}
				<div className="mb-12 text-center">
					<div className="flex items-center justify-center gap-3 mb-4">
						<div className="w-10 h-10 rounded-lg bg-(--accent-primary) flex items-center justify-center">
							<Music className="w-6 h-6 " />
						</div>
						<h1 className="text-4xl font-bold ">Upload Your Track</h1>
					</div>
					<p className="text-(--text-tertiary) text-lg">
						Share your music with the world and mint exclusive NFTs
					</p>
				</div>

				<Stepper
					currentStep={currentStep}
					// totalSteps={steps.length}
					steps={steps}
					className="mb-12"
				/>

				{/* Form */}
				<form onSubmit={handleSubmit} className="space-y-8">
					{currentStep === 0 && (
						<div className=" rounded-2xl border border-(--border) p-8 space-y-6 animate-in fade-in duration-300">
							<h2 className="text-xl font-semibold flex items-center gap-2">
								<FileText className="w-5 h-5 text-(--accent-primary)" />
								Track Details
							</h2>

							<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
								<div className="md:col-span-2">
									<label className="block text-sm font-medium text-(--text-tertiary) mb-2">
										Track Title{" "}
									</label>
									<input
										type="text"
										name="title"
										value={formData.title}
										onChange={handleInputChange}
										placeholder="Enter your track title"
										className="w-full px-4 py-3 bg-(--bg-tertiary) border border-(--border) rounded-xl text-(--text) placeholder:text-(--text-tertiary) focus:outline-none focus:ring-2 focus:ring-(--accent-primary)"
									/>
								</div>

								<div>
									<label className="block text-sm font-medium text-(--text-tertiary) mb-2">
										Artist Name{" "}
									</label>
									<input
										type="text"
										name="artist"
										value={formData.artist}
										onChange={handleInputChange}
										placeholder="Your artist name"
										className="w-full px-4 py-3 bg-(--bg-tertiary) border border-(--border) rounded-xl text-(--text) placeholder:text-(--text-tertiary) focus:outline-none focus:ring-2 focus:ring-(--accent-primary)"
									/>
								</div>

								<div>
									<label className="block text-sm font-medium text-(--text-tertiary) mb-2">
										Genre
									</label>
									<select
										name="genre"
										value={formData.genre}
										onChange={handleInputChange}
										className="w-full px-4 py-3 bg-(--bg-tertiary) border border-(--border) rounded-xl text-(--text) placeholder:text-(--text-tertiary) focus:outline-none focus:ring-2 focus:ring-(--accent-primary)"
									>
										<option value="" className="bg-(--bg-secondary)">
											Select Genre
										</option>
										<option value="Pop" className="bg-(--bg-secondary)">
											Pop
										</option>
										<option value="Rock" className="bg-(--bg-secondary)">
											Rock
										</option>
										<option value="Hip-Hop" className="bg-(--bg-secondary)">
											Hip-Hop
										</option>
										<option value="Electronic" className="bg-(--bg-secondary)">
											Electronic
										</option>
										<option value="Jazz" className="bg-(--bg-secondary)">
											Jazz
										</option>
										<option value="Classical" className="bg-(--bg-secondary)">
											Classical
										</option>
									</select>
								</div>
							</div>
						</div>
					)}

					{currentStep === 1 && (
						<div className=" rounded-2xl border border-(--border) p-8 space-y-6 animate-in fade-in duration-300">
							<h2 className="text-xl font-semibold flex items-center gap-2">
								<Upload className="w-5 h-5 text-(--accent-primary)" />
								Media Files
							</h2>

							<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
								{/* Cover Art */}
								<div>
									<label className="block text-sm font-medium text-(--text-secondary) mb-2">
										Cover Art
									</label>
									<input
										type="url"
										name="coverArt"
										value={formData.coverArt}
										onChange={handleInputChange}
										placeholder="https://..."
										className="w-full px-4 py-3 bg-(--bg-tertiary) border border-(--border) rounded-xl text-(--text) placeholder:text-(--text-tertiary) focus:outline-none focus:ring-2 focus:ring-(--accent-primary) mb-3"
									/>
									<label className="block">
										<div className="relative cursor-pointer">
											<div className="px-4 py-2 border-2 border-dashed border-(--border) rounded-lg text-center transition">
												<span className="text-sm text-(--text-secondary)">
													Or upload image
												</span>
											</div>
											<input
												type="file"
												accept="image/*"
												onChange={(e) => handleFileChange(e, "cover")}
												className="absolute inset-0 opacity-0 cursor-pointer"
											/>
										</div>
									</label>
									{coverFile && (
										<p className="text-xs text-(--success) mt-2">
											✓ {coverFile.name}
										</p>
									)}
								</div>

								{/* Audio File */}
								<div>
									<label className="block text-sm font-medium text-(--text-secondary) mb-2">
										Audio File
									</label>
									<input
										type="url"
										name="audioUrl"
										value={formData.audioUrl}
										onChange={handleInputChange}
										placeholder="https://..."
										className="w-full px-4 py-3 bg-(--bg-tertiary) border border-(--border) rounded-xl text-(--text) placeholder:text-(--text-tertiary) focus:outline-none focus:ring-2 focus:ring-(--accent-primary) mb-3"
									/>
									<label className="block">
										<div className="relative cursor-pointer">
											<div className="px-4 py-2 border-2 border-dashed border-(--border) rounded-lg text-center transition">
												<span className="text-sm text-slate-300">
													Or upload audio
												</span>
											</div>
											<input
												type="file"
												accept="audio/*"
												onChange={(e) => handleFileChange(e, "audio")}
												className="absolute inset-0 opacity-0 cursor-pointer"
											/>
										</div>
									</label>
									{audioFile && (
										<p className="text-xs text-green-400 mt-2">
											✓ {audioFile.name}
										</p>
									)}
								</div>
							</div>
						</div>
					)}

					{currentStep === 2 && (
						<div className=" rounded-2xl border border-(--border) p-8 space-y-6 animate-in fade-in duration-300">
							<h2 className="text-xl font-semibold ">NFT Configuration</h2>

							<div className="space-y-6">
								<div>
									<label className="block text-sm font-medium text-(--text-secondary) mb-2">
										Price (STT)
									</label>
									<input
										type="text"
										name="price"
										value={formData.price}
										onChange={handleInputChange}
										placeholder="0.00"
										className="w-full px-4 py-3 bg-(--bg-tertiary) border border-(--border) rounded-xl text-(--text) placeholder:text-(--text-tertiary) focus:outline-none focus:ring-2 focus:ring-(--accent-primary)"
									/>
									<p className="text-xs text-(--text-tertiary) mt-2">
										Set the price for each NFT edition
									</p>
								</div>

								<div>
									<label className="block text-sm font-medium text-(--text-secondary) mb-2">
										Number of NFTs to Create{" "}
									</label>
									<input
										type="number"
										name="nftAmount"
										value={formData.nftAmount}
										onChange={handleInputChange}
										min="1"
										className="w-full px-4 py-3 bg-(--bg-tertiary) border border-(--border) rounded-xl text-(--text) placeholder:text-(--text-tertiary) focus:outline-none focus:ring-2 focus:ring-(--accent-primary)"
									/>
									<p className="text-xs text-(--text-tertiary) mt-2">
										Create multiple NFT editions of your track
									</p>
								</div>

								{formData.price && formData.nftAmount && (
									<div className="bg-red-500/10 border border-(--accent-light) rounded-lg p-4">
										<p className="text-sm text-(--text-tertiary)">
											<span className="font-medium text-(--accent-dark)">
												Total Revenue (approx):
											</span>{" "}
											{(
												Number.parseFloat(formData.price) * formData.nftAmount
											).toFixed(2)}{" "}
											{formData.price ? "STT" : ""}
										</p>
									</div>
								)}
							</div>
						</div>
					)}

					{/* Navigation Buttons */}
					<div className="flex gap-4">
						<button
							type="button"
							onClick={handlePrevStep}
							disabled={currentStep === 0}
							className="flex-1 py-3 px-4 bg-(--bg-secondary) hover:bg-(--bg-tertiary) border-2 border-(--border) disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition duration-200 flex items-center justify-center gap-2"
						>
							<ArrowLeft className="w-4 h-4" />
							Previous
						</button>

						{currentStep < steps.length - 1 ? (
							<button
								type="button"
								onClick={handleNextStep}
								className="flex-1 py-3 px-4  bg-(--accent-primary) hover:bg-(--accent-dark) text-white font-semibold rounded-lg transition duration-200 flex items-center justify-center gap-2"
							>
								Next
								<ArrowRight className="w-4 h-4" />
							</button>
						) : (
							<button
								type="submit"
								disabled={isSubmitting}
								className="flex-1 py-3 px-4 bg-(--accent-primary) hover:bg-(--accent-dark) text-white font-semibold rounded-lg transition duration-200 flex items-center justify-center gap-2"
							>
								{isSubmitting ? (
									<>
										<span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
										Publishing...
									</>
								) : (
									<>
										<Music className="w-5 h-5 text-[10px]" />
										Publish Track & Mint NFTs
									</>
								)}
							</button>
						)}
					</div>
				</form>

				{/* Footer Note */}
				<p className="text-center text-sm text-(--text-tertiary) mt-8">
					Your track will be securely uploaded and converted to NFTs on the
					blockchain.
				</p>
			</div>
		</div>
	);
};

export default AddSong;
