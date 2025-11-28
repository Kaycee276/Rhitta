const SongCardSkeleton = () => {
	const placeholders = [0, 1, 2, 3];
	return (
		<div className="space-y-2">
			{placeholders.map((p) => (
				<div
					key={p}
					className="flex items-start sm:items-center gap-3 p-3 rounded-lg bg-(--bg-secondary) border border-(--border)
                    animate-pulse"
				>
					<div className="w-16 h-16 sm:w-14 sm:h-14 bg-(--bg-tertiary) rounded" />
					<div className="flex-1 min-w-0 w-full">
						<div className="h-4 bg-(--bg-tertiary) rounded w-3/5 mb-2" />
						<div className="h-3 bg-(--bg-tertiary) rounded w-2/5 mb-2" />
						<div className="flex items-center gap-4 mt-1">
							<div className="h-3 bg-(--bg-tertiary) rounded w-16" />
							<div className="h-3 bg-(--bg-tertiary) rounded w-12" />
						</div>
					</div>
					<div className="flex items-center gap-2 sm:gap-3">
						<div className="h-4 w-12 bg-(--bg-tertiary) rounded" />
					</div>
				</div>
			))}
		</div>
	);
};

export default SongCardSkeleton;
