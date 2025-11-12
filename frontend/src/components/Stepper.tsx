import { Check } from "lucide-react";

interface StepperProps {
	currentStep: number;
	// totalSteps: number;
	steps: Array<{ title: string; description?: string }>;
	className?: string;
}

export function Stepper({ currentStep, steps, className }: StepperProps) {
	return (
		<div className={`w-full ${className}`}>
			{/* Step Indicators */}
			<div className="flex justify-between items-start mb-8">
				{steps.map((step, index) => {
					const isCompleted = index < currentStep;
					const isCurrent = index === currentStep;
					const isUpcoming = index > currentStep;

					return (
						<div key={index} className="flex flex-col items-center flex-1">
							<div className="flex items-center w-10% mb-3">
								{/* Step Indicator */}
								<div
									className={`
										w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-all duration-200
										${isCurrent && "bg-(--accent-primary)  "}
										${isCompleted && "bg-(--success) "}
										${isUpcoming && "bg-(--bg-tertiary) "}
									`}
								>
									{isCompleted ? <Check className="w-5 h-5" /> : index + 1}
								</div>
								{/* Step Bar */}
								{index < steps.length - 1 && (
									<div
										className={`
											flex-1 h-1 transition-all duration-200
											${index < currentStep ? "bg-(--success)" : "bg-(--bg-tertiary)"}
										`}
									/>
								)}
							</div>
							{/* Title */}
							<div className="text-center">
								<p
									className={`
										text-sm font-medium transition-colors
										${isCurrent && "text-(--accent-primary)"}
										${isCompleted && "text-(--success)"}
										${isUpcoming && "text-(--text-secondary)"}
									`}
								>
									{step.title}
								</p>
							</div>
						</div>
					);
				})}
			</div>
		</div>
	);
}
