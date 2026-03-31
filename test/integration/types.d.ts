export declare global {
	type TestLogger = {
		error: ReturnType<typeof vi.fn>;
		warn: ReturnType<typeof vi.fn>;
		info: ReturnType<typeof vi.fn>;
	};
}
