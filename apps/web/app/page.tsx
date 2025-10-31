export default function HomePage() {
	return (
		<main style={{ maxWidth: 960, margin: '40px auto', padding: 24 }}>
			<h1 style={{ fontSize: 28, marginBottom: 8 }}>Iberian Superleague</h1>
			<p style={{ color: '#555', marginBottom: 24 }}>
				Modo carrera online con calendario, clasificación, mercado y estadísticas.
			</p>
			<div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 16 }}>
				<section style={{ border: '1px solid #eee', borderRadius: 8, padding: 16 }}>
					<h2 style={{ fontSize: 18, marginBottom: 8 }}>Calendario</h2>
					<p>Próximamente: listado de partidos y resultados.</p>
				</section>
				<section style={{ border: '1px solid #eee', borderRadius: 8, padding: 16 }}>
					<h2 style={{ fontSize: 18, marginBottom: 8 }}>Clasificación</h2>
					<p>Próximamente: tabla de posiciones.</p>
				</section>
				<section style={{ border: '1px solid #eee', borderRadius: 8, padding: 16 }}>
					<h2 style={{ fontSize: 18, marginBottom: 8 }}>Mercado</h2>
					<p>Próximamente: ofertas de traspaso y cesión.</p>
				</section>
			</div>
			<div style={{ marginTop: 24 }}>
				<a href="/api/health" style={{ color: '#0366d6' }}>Verificar salud de la app (/api/health)</a>
			</div>
		</main>
	);
}
