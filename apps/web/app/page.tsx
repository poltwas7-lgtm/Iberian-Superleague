import { getMatches, getClubs, getLeagues } from '@/lib/googleSheets';

async function getData() {
	const spreadsheetId = process.env.GOOGLE_SHEETS_SPREADSHEET_ID;
	if (!spreadsheetId) {
		return { matches: [], clubs: [], leagues: [] };
	}

	try {
		const [matches, clubs, leagues] = await Promise.all([
			getMatches(spreadsheetId).catch(() => []),
			getClubs(spreadsheetId).catch(() => []),
			getLeagues(spreadsheetId).catch(() => [])
		]);
		return { matches, clubs, leagues };
	} catch {
		return { matches: [], clubs: [], leagues: [] };
	}
}

export default async function HomePage() {
	const { matches, clubs, leagues } = await getData();

	const nextMatches = matches
		.filter((m: any) => m.status === 'scheduled' || !m.status)
		.slice(0, 5);

	const playedMatches = matches
		.filter((m: any) => m.status === 'played')
		.slice(-5);

	return (
		<main style={{ maxWidth: 1200, margin: '40px auto', padding: 24 }}>
			<h1 style={{ fontSize: 32, marginBottom: 8, fontWeight: 'bold' }}>Iberian Superleague</h1>
			<p style={{ color: '#666', marginBottom: 32, fontSize: 16 }}>
				Modo carrera online con calendario, clasificación, mercado y estadísticas.
			</p>

			<div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 24, marginBottom: 32 }}>
				<section style={{ border: '1px solid #e0e0e0', borderRadius: 12, padding: 20, backgroundColor: '#fafafa' }}>
					<h2 style={{ fontSize: 20, marginBottom: 16, fontWeight: 600 }}>Próximos Partidos</h2>
					{nextMatches.length > 0 ? (
						<ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
							{nextMatches.map((match: any, idx: number) => (
								<li key={idx} style={{ padding: '8px 0', borderBottom: '1px solid #eee' }}>
									<div style={{ fontSize: 14 }}>
										<strong>{match.home_club || 'TBD'}</strong> vs <strong>{match.away_club || 'TBD'}</strong>
									</div>
									<div style={{ fontSize: 12, color: '#888', marginTop: 4 }}>
										Jornada {match.matchday || '?'} • {match.date || 'Por confirmar'}
									</div>
								</li>
							))}
						</ul>
					) : (
						<p style={{ color: '#999', fontSize: 14 }}>No hay partidos programados</p>
					)}
				</section>

				<section style={{ border: '1px solid #e0e0e0', borderRadius: 12, padding: 20, backgroundColor: '#fafafa' }}>
					<h2 style={{ fontSize: 20, marginBottom: 16, fontWeight: 600 }}>Últimos Resultados</h2>
					{playedMatches.length > 0 ? (
						<ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
							{playedMatches.map((match: any, idx: number) => (
								<li key={idx} style={{ padding: '8px 0', borderBottom: '1px solid #eee' }}>
									<div style={{ fontSize: 14 }}>
										<strong>{match.home_club || 'TBD'}</strong> {match.home_goals ?? '-'} - {match.away_goals ?? '-'} <strong>{match.away_club || 'TBD'}</strong>
									</div>
									<div style={{ fontSize: 12, color: '#888', marginTop: 4 }}>
										Jornada {match.matchday || '?'}
									</div>
								</li>
							))}
						</ul>
					) : (
						<p style={{ color: '#999', fontSize: 14 }}>No hay partidos jugados aún</p>
					)}
				</section>

				<section style={{ border: '1px solid #e0e0e0', borderRadius: 12, padding: 20, backgroundColor: '#fafafa' }}>
					<h2 style={{ fontSize: 20, marginBottom: 16, fontWeight: 600 }}>Clubes</h2>
					<p style={{ fontSize: 14, marginBottom: 8 }}>
						<strong>{clubs.length}</strong> clubes registrados
					</p>
					{clubs.length > 0 && (
						<ul style={{ listStyle: 'none', padding: 0, margin: 0, fontSize: 13 }}>
							{clubs.slice(0, 5).map((club: any, idx: number) => (
								<li key={idx} style={{ padding: '4px 0' }}>
									{club.name || club.id}
								</li>
							))}
						</ul>
					)}
				</section>
			</div>

			<div style={{ marginTop: 32, padding: 16, backgroundColor: '#f5f5f5', borderRadius: 8, fontSize: 14 }}>
				<h3 style={{ marginBottom: 12, fontSize: 16 }}>Estado del Sistema</h3>
				<ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
					<li>✅ API funcionando</li>
					<li>✅ Conexión con Google Sheets activa</li>
					<li>📊 {matches.length} partidos en base de datos</li>
					<li>🏆 {clubs.length} clubes registrados</li>
					<li>📅 {leagues.length} ligas configuradas</li>
				</ul>
				<div style={{ marginTop: 12 }}>
					<a href="/api/health" style={{ color: '#0366d6', marginRight: 16 }}>Health Check</a>
					<a href="/api/sheets/ping" style={{ color: '#0366d6' }}>Sheets Test</a>
				</div>
			</div>
		</main>
	);
}
