# Nowak Workshop OS v7.5.0

## Seven-day cure tracking

High Gloss and Satin drums now have two automatic cure checkpoints based on the recorded checklist completion time.

### Sealer cure

After `Sealer coat` is completed:

- a seven-day cure period begins
- Workshop Today shows the drum as curing
- the remaining number of days and ready date are shown
- scheduling and progression are disabled until the ready date
- once ready, the drum is highlighted as `Seal coat cured — ready for polyurethane coat 1`

### Final finish cure

After:

- `Poly coat 4` for High Gloss, or
- `Satin coat` for Satin

the app begins another seven-day cure period.

Once ready, the drum is highlighted as:

`Final cure complete — ready to progress`

The checklist is not advanced automatically. The user still confirms progression after inspecting the finish.

The Dashboard also shows:

- cure-complete drums ready to progress
- drums currently curing

No cure logic is applied to Natural / Danish oil finishes.

## Spray batch mixing calculator

Workshop Today now automatically displays a mixing calculator for spray batches.

### Sealer coat, per drum

- 30 ml polyurethane
- 15 ml standard hardener
- 20% thinners calculated from the combined polyurethane and hardener

For three drums:

- 90 ml polyurethane
- 45 ml standard hardener
- 135 ml base mixture
- 27 ml thinners
- 162 ml total

### High Gloss polyurethane coats, per drum

- 40 ml polyurethane
- 20 ml standard hardener
- no thinners

### Final Satin coat, per drum

- 30 ml satin
- 15 ml rapid hardener
- 10% thinners calculated from the combined satin and hardener

The calculator includes optional 0%, 5% or 10% extra allowance.

## Supabase

No migration is required. Cure dates use the existing `stage_history` completion timestamps.

## Rollback

Use v7.4.2 to roll back.
