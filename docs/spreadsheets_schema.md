# Esquema de Google Sheets (fuente de datos)

Este documento define las pestañas (sheets) y sus columnas. Todas las tablas deben tener una columna `id` única y estable. Las fechas en ISO (YYYY-MM-DD) y horas en UTC cuando aplique.

Convención:
- `id`: identificador único (string corto, p.ej. `club_001`).
- `ref_*`: claves externas a otras tablas por `id`.
- Enum: valores controlados, documentados.

## 1) seasons
- `id`
- `name` (string)
- `year` (number)
- `status` (enum: planned|active|finished)
- `created_at` (datetime ISO)

## 2) leagues
- `id`
- `name`
- `ref_season` (id en `seasons`)
- `created_at`

## 3) clubs
- `id`
- `name`
- `short_name`
- `ref_league` (id en `leagues`)
- `budget` (number, entero en unidades monetarias)
- `manager_name` (string, opcional si no asignado)
- `ref_manager` (id en `managers`, opcional)
- `created_at`

## 4) managers
- `id`
- `name`
- `email`
- `role` (enum: admin|manager)
- `invite_code` (string, único, opcional si ya registrado)
- `status` (enum: invited|active|suspended)
- `created_at`

## 5) players
- `id`
- `name`
- `position` (enum: GK|DF|MF|FW)
- `overall` (number)
- `age` (number)
- `ref_club` (id en `clubs`, opcional si agente libre)
- `contract_until` (YYYY-MM-DD, opcional)
- `value` (number)
- `status` (enum: active|injured|suspended|free)
- `created_at`

## 6) matches
- `id`
- `ref_league`
- `matchday` (number, jornada)
- `date` (YYYY-MM-DD)
- `home_club` (id en `clubs`)
- `away_club` (id en `clubs`)
- `home_goals` (number, nullable)
- `away_goals` (number, nullable)
- `status` (enum: scheduled|played|postponed)
- `mvp_player` (id en `players`, opcional)
- `notes` (string, opcional)

## 7) standings (tabla derivada o materializada)
Si se mantiene en Sheets para consulta rápida:
- `id` (p.ej. `standings_{leagueId}_{matchday}`)
- `ref_league`
- `matchday`
- `club`
- `played`
- `wins`
- `draws`
- `losses`
- `goals_for`
- `goals_against`
- `goal_diff`
- `points`

Alternativamente, calcular al vuelo desde `matches`.

## 8) transfers (mercado)
- `id`
- `ref_player`
- `from_club` (id en `clubs`, nullable si agente libre)
- `to_club` (id en `clubs`)
- `type` (enum: transfer|loan)
- `offer_amount` (number, para transfer)
- `wage` (number, opcional)
- `status` (enum: pending|accepted|rejected|cancelled)
- `created_by` (id en `managers`)
- `created_at`
- `updated_at`

## 9) budgets
- `id`
- `ref_club`
- `season_opening` (number)
- `season_current` (number)
- `last_update` (datetime)
- `notes` (string, opcional)

## 10) news (comunicados)
- `id`
- `title`
- `body`
- `ref_author` (id en `managers`)
- `visibility` (enum: public|managers|admins)
- `created_at`
- `published` (boolean)

## 11) stats (eventos por partido, opcional al inicio)
Para rankings:
- `id`
- `ref_match`
- `ref_player`
- `event` (enum: goal|assist|yellow|red|motm)
- `minute` (number)
- `notes`

---

### Reglas y validaciones sugeridas
- Claves de referencia deben existir en su tabla objetivo.
- No permitir `matches.status = played` si `home_goals`/`away_goals` son nulos.
- `transfers`: cambios de `status` sólo por actores válidos (from/to club o admin).
- `budgets`: al aceptar transferencias, ajustar `season_current` de ambos clubes.
- `managers`: `invite_code` único, consumo atómico al registrarse.

### Identificadores
Usar prefijos para legibilidad: `club_001`, `player_0001`, `match_2025_001`.

### Muestras mínimas
Incluye al menos 1 temporada, 1 liga, 4 clubes, 40 jugadores, y un calendario de 6-8 jornadas para pruebas.
