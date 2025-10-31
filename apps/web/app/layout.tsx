export const metadata = {
	title: "Iberian Superleague",
	description: "Plataforma de liga online"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
	return (
		<html lang="es">
			<body style={{ fontFamily: 'ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Ubuntu, Cantarell, Noto Sans, Helvetica Neue, Arial' }}>
				{children}
			</body>
		</html>
	);
}
