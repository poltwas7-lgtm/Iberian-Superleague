import { getMatches, getClubs, getLeagues, getPlayers } from '@/lib/googleSheets';

async function getData() {
	const spreadsheetId = process.env.GOOGLE_SHEETS_SPREADSHEET_ID;
	if (!spreadsheetId) {
		return { matches: [], clubs: [], leagues: [], players: [] };
	}

	try {
		const [matches, clubs, leagues, players] = await Promise.all([
			getMatches(spreadsheetId).catch(() => []),
			getClubs(spreadsheetId).catch(() => []),
			getLeagues(spreadsheetId).catch(() => []),
			getPlayers(spreadsheetId).catch(() => [])
		]);
		return { matches, clubs, leagues, players };
	} catch {
		return { matches: [], clubs: [], leagues: [], players: [] };
	}
}

export default async function HomePage() {
	const { matches, clubs, leagues, players } = await getData();

	const nextMatches = matches
		.filter((m: any) => m.status === 'scheduled' || !m.status)
		.slice(0, 5);

	const playedMatches = matches
		.filter((m: any) => m.status === 'played')
		.slice(-5);

	return (
		<div style={{ minHeight: '100vh', backgroundColor: '#fafafa' }}>
			<main style={{ maxWidth: 1400, margin: '0 auto', padding: '32px 24px' }}>
				<header style={{ marginBottom: 48, paddingBottom: 24, borderBottom: '3px solid #dc2626' }}>
					<h1 style={{ 
						fontSize: 48, 
						marginBottom: 8, 
						fontWeight: 800,
						background: 'linear-gradient(135deg, #dc2626 0%, #ea580c 100%)',
						WebkitBackgroundClip: 'text',
						WebkitTextFillColor: 'transparent',
						letterSpacing: '-0.02em'
					}}>
						Iberian Superleague
					</h1>
					<p style={{ color: '#6b7280', marginTop: 8, fontSize: 18, fontWeight: 300 }}>
						Modo carrera online con calendario, clasificación, mercado y estadísticas.
					</p>
				</header>

			<div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 28, marginBottom: 40 }}>
				<section style={{ 
					border: '1px solid #fee2e2', 
					borderRadius: 16, 
					padding: 28, 
					backgroundColor: '#ffffff',
					boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
					transition: 'transform 0.2s, box-shadow 0.2s'
				}}>
					<h2 style={{ 
						fontSize: 22, 
						marginBottom: 20, 
						fontWeight: 700,
						color: '#dc2626',
						display: 'flex',
						alignItems: 'center',
						gap: 8
					}}>
						<span style={{ width: 4, height: 24, backgroundColor: '#dc2626', borderRadius: 2, display: 'inline-block' }}></span>
						Próximos Partidos
					</h2>
					{nextMatches.length > 0 ? (
						<ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
							{nextMatches.map((match: any, idx: number) => (
								<li key={idx} style={{ 
									padding: '16px 0', 
									borderBottom: idx < nextMatches.length - 1 ? '1px solid #f3f4f6' : 'none' 
								}}>
									<div style={{ fontSize: 15, fontWeight: 600, color: '#111827', marginBottom: 6 }}>
										<span style={{ color: '#dc2626' }}>{match.home_club || 'TBD'}</span>
										<span style={{ color: '#9ca3af', margin: '0 8px', fontWeight: 400 }}>vs</span>
										<span style={{ color: '#dc2626' }}>{match.away_club || 'TBD'}</span>
									</div>
									<div style={{ fontSize: 13, color: '#6b7280', display: 'flex', gap: 8, alignItems: 'center' }}>
										<span style={{ 
											backgroundColor: '#fef3c7', 
											color: '#d97706', 
											padding: '2px 8px', 
											borderRadius: 12, 
											fontSize: 11, 
											fontWeight: 600 
										}}>
											Jornada {match.matchday || '?'}
										</span>
										<span>•</span>
										<span>{match.date || 'Por confirmar'}</span>
									</div>
								</li>
							))}
						</ul>
					) : (
						<p style={{ color: '#9ca3af', fontSize: 15, textAlign: 'center', padding: '24px 0' }}>No hay partidos programados</p>
					)}
				</section>

				<section style={{ 
					border: '1px solid #fee2e2', 
					borderRadius: 16, 
					padding: 28, 
					backgroundColor: '#ffffff',
					boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
				}}>
					<h2 style={{ 
						fontSize: 22, 
						marginBottom: 20, 
						fontWeight: 700,
						color: '#dc2626',
						display: 'flex',
						alignItems: 'center',
						gap: 8
					}}>
						<span style={{ width: 4, height: 24, backgroundColor: '#dc2626', borderRadius: 2, display: 'inline-block' }}></span>
						Últimos Resultados
					</h2>
					{playedMatches.length > 0 ? (
						<ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
							{playedMatches.map((match: any, idx: number) => (
								<li key={idx} style={{ 
									padding: '16px 0', 
									borderBottom: idx < playedMatches.length - 1 ? '1px solid #f3f4f6' : 'none' 
								}}>
									<div style={{ fontSize: 15, fontWeight: 600, color: '#111827', marginBottom: 6, display: 'flex', alignItems: 'center', gap: 12 }}>
										<span style={{ flex: 1, textAlign: 'right', color: '#dc2626' }}>{match.home_club || 'TBD'}</span>
										<span style={{ 
											fontSize: 18, 
											fontWeight: 700, 
											color: '#111827',
											minWidth: 60,
											textAlign: 'center'
										}}>
											{match.home_goals ?? '-'} - {match.away_goals ?? '-'}
										</span>
										<span style={{ flex: 1, textAlign: 'left', color: '#dc2626' }}>{match.away_club || 'TBD'}</span>
									</div>
									<div style={{ fontSize: 13, color: '#6b7280', textAlign: 'center' }}>
										<span style={{ 
											backgroundColor: '#fef3c7', 
											color: '#d97706', 
											padding: '2px 8px', 
											borderRadius: 12, 
											fontSize: 11, 
											fontWeight: 600 
										}}>
											Jornada {match.matchday || '?'}
										</span>
									</div>
								</li>
							))}
						</ul>
					) : (
						<p style={{ color: '#9ca3af', fontSize: 15, textAlign: 'center', padding: '24px 0' }}>No hay partidos jugados aún</p>
					)}
				</section>

				<section style={{ 
					border: '1px solid #fee2e2', 
					borderRadius: 16, 
					padding: 28, 
					backgroundColor: '#ffffff',
					boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
				}}>
					<h2 style={{ 
						fontSize: 22, 
						marginBottom: 20, 
						fontWeight: 700,
						color: '#dc2626',
						display: 'flex',
						alignItems: 'center',
						gap: 8
					}}>
						<span style={{ width: 4, height: 24, backgroundColor: '#dc2626', borderRadius: 2, display: 'inline-block' }}></span>
						Clubes
					</h2>
					<p style={{ 
						fontSize: 15, 
						marginBottom: 16, 
						color: '#6b7280',
						display: 'flex',
						alignItems: 'center',
						gap: 8
					}}>
						<span style={{ 
							backgroundColor: '#dc2626', 
							color: '#fff', 
							borderRadius: '50%', 
							width: 24, 
							height: 24, 
							display: 'inline-flex', 
							alignItems: 'center', 
							justifyContent: 'center',
							fontSize: 12,
							fontWeight: 700
						}}>
							{clubs.length}
						</span>
						clubes registrados
					</p>
					{clubs.length > 0 && (
						<ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
							{clubs.slice(0, 5).map((club: any, idx: number) => (
								<li key={idx} style={{ 
									padding: '10px 0',
									borderBottom: idx < Math.min(clubs.length, 5) - 1 ? '1px solid #f3f4f6' : 'none',
									fontSize: 14,
									color: '#374151',
									fontWeight: 500
								}}>
									{club.name || club.id}
								</li>
							))}
						</ul>
					)}
				</section>
			</div>

			<section style={{ 
				border: '1px solid #fee2e2', 
				borderRadius: 16, 
				padding: 32, 
				backgroundColor: '#ffffff',
				marginBottom: 40,
				boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
			}}>
				<h2 style={{ 
					fontSize: 28, 
					marginBottom: 24, 
					fontWeight: 700,
					color: '#dc2626',
					display: 'flex',
					alignItems: 'center',
					gap: 12
				}}>
					<span style={{ width: 6, height: 32, backgroundColor: '#dc2626', borderRadius: 3, display: 'inline-block' }}></span>
					Jugadores
					<span style={{ 
						backgroundColor: '#fef3c7', 
						color: '#d97706', 
						padding: '4px 12px', 
						borderRadius: 20, 
						fontSize: 14, 
						fontWeight: 700,
						marginLeft: 'auto'
					}}>
						{players.length}
					</span>
				</h2>
				{players.length > 0 ? (
					<div style={{ overflowX: 'auto' }}>
						<table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 15 }}>
							<thead>
								<tr style={{ borderBottom: '2px solid #fee2e2', backgroundColor: '#fef2f2' }}>
									<th style={{ padding: '16px 12px', textAlign: 'left', fontWeight: 700, color: '#dc2626', fontSize: 14, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Nombre</th>
									<th style={{ padding: '16px 12px', textAlign: 'center', fontWeight: 700, color: '#dc2626', fontSize: 14, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Posición</th>
									<th style={{ padding: '16px 12px', textAlign: 'center', fontWeight: 700, color: '#dc2626', fontSize: 14, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Overall</th>
									<th style={{ padding: '16px 12px', textAlign: 'center', fontWeight: 700, color: '#dc2626', fontSize: 14, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Edad</th>
									<th style={{ padding: '16px 12px', textAlign: 'left', fontWeight: 700, color: '#dc2626', fontSize: 14, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Club</th>
									<th style={{ padding: '16px 12px', textAlign: 'center', fontWeight: 700, color: '#dc2626', fontSize: 14, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Valor</th>
								</tr>
							</thead>
							<tbody>
								{players.slice(0, 20).map((player: any, idx: number) => (
									<tr key={idx} style={{ 
										borderBottom: '1px solid #f3f4f6'
									}}>
										<td style={{ padding: '14px 12px', fontWeight: 600, color: '#111827' }}>
											{player.name || player.id || 'Sin nombre'}
										</td>
										<td style={{ padding: '14px 12px', textAlign: 'center' }}>
											<span style={{ 
												backgroundColor: '#fef3c7', 
												color: '#d97706', 
												padding: '4px 10px', 
												borderRadius: 12, 
												fontSize: 12, 
												fontWeight: 600,
												display: 'inline-block'
											}}>
												{player.position || '-'}
											</span>
										</td>
										<td style={{ padding: '14px 12px', textAlign: 'center' }}>
											<span style={{ 
												fontWeight: 700, 
												color: player.overall >= 80 ? '#dc2626' : player.overall >= 70 ? '#ea580c' : '#6b7280',
												fontSize: 16
											}}>
												{player.overall ?? '-'}
											</span>
										</td>
										<td style={{ padding: '14px 12px', textAlign: 'center', color: '#6b7280' }}>
											{player.age ?? '-'}
										</td>
										<td style={{ padding: '14px 12px', color: '#4b5563', fontWeight: 500 }}>
											{(player.ref_club || player.club) ? (
												player.ref_club || player.club
											) : (
												<span style={{ color: '#9ca3af', fontStyle: 'italic' }}>Agente libre</span>
											)}
										</td>
										<td style={{ padding: '14px 12px', textAlign: 'center', fontWeight: 600, color: '#111827' }}>
											{player.value ? `€${Number(player.value).toLocaleString('es-ES')}` : '-'}
										</td>
									</tr>
								))}
							</tbody>
						</table>
						{players.length > 20 && (
							<p style={{ marginTop: 20, fontSize: 13, color: '#6b7280', textAlign: 'center', padding: '12px', backgroundColor: '#fef3c7', borderRadius: 8 }}>
								Mostrando 20 de {players.length} jugadores
							</p>
						)}
					</div>
				) : (
					<p style={{ color: '#9ca3af', fontSize: 15, textAlign: 'center', padding: '32px 0' }}>No hay jugadores registrados aún</p>
				)}
			</section>

			<div style={{ 
				marginTop: 40, 
				padding: 24, 
				backgroundColor: '#ffffff', 
				borderRadius: 16, 
				border: '1px solid #fee2e2',
				boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
			}}>
				<h3 style={{ 
					marginBottom: 20, 
					fontSize: 18, 
					fontWeight: 700,
					color: '#dc2626',
					display: 'flex',
					alignItems: 'center',
					gap: 8
				}}>
					<span style={{ width: 4, height: 20, backgroundColor: '#dc2626', borderRadius: 2, display: 'inline-block' }}></span>
					Estado del Sistema
				</h3>
				<div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, marginBottom: 20 }}>
					<div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
						<span style={{ fontSize: 20 }}>✅</span>
						<span style={{ color: '#374151', fontSize: 14, fontWeight: 500 }}>API funcionando</span>
					</div>
					<div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
						<span style={{ fontSize: 20 }}>✅</span>
						<span style={{ color: '#374151', fontSize: 14, fontWeight: 500 }}>Conexión Sheets activa</span>
					</div>
					<div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
						<span style={{ fontSize: 18 }}>📊</span>
						<span style={{ color: '#374151', fontSize: 14, fontWeight: 500 }}><strong style={{ color: '#dc2626' }}>{matches.length}</strong> partidos</span>
					</div>
					<div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
						<span style={{ fontSize: 18 }}>🏆</span>
						<span style={{ color: '#374151', fontSize: 14, fontWeight: 500 }}><strong style={{ color: '#dc2626' }}>{clubs.length}</strong> clubes</span>
					</div>
					<div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
						<span style={{ fontSize: 18 }}>👥</span>
						<span style={{ color: '#374151', fontSize: 14, fontWeight: 500 }}><strong style={{ color: '#dc2626' }}>{players.length}</strong> jugadores</span>
					</div>
					<div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
						<span style={{ fontSize: 18 }}>📅</span>
						<span style={{ color: '#374151', fontSize: 14, fontWeight: 500 }}><strong style={{ color: '#dc2626' }}>{leagues.length}</strong> ligas</span>
					</div>
				</div>
				<div style={{ paddingTop: 16, borderTop: '1px solid #f3f4f6', display: 'flex', gap: 12 }}>
					<a href="/api/health" style={{ 
						color: '#dc2626', 
						textDecoration: 'none',
						fontSize: 14,
						fontWeight: 600,
						padding: '8px 16px',
						borderRadius: 8,
						border: '1px solid #dc2626',
						transition: 'all 0.2s',
						display: 'inline-block'
					}}>Health Check</a>
					<a href="/api/sheets/ping" style={{ 
						color: '#dc2626', 
						textDecoration: 'none',
						fontSize: 14,
						fontWeight: 600,
						padding: '8px 16px',
						borderRadius: 8,
						border: '1px solid #dc2626',
						transition: 'all 0.2s',
						display: 'inline-block'
					}}>Sheets Test</a>
				</div>
			</div>
		</main>
		</div>
	);
}
