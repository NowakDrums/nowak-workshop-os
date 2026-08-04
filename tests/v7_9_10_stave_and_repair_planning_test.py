from pathlib import Path

app = Path(__file__).parents[1] / 'src' / 'App.jsx'
text = app.read_text()

required = [
    'normalisedConstruction',
    'constructionMatches(d,constructionFilter)',
    'async function addRepairToPlan',
    'repair_id:repair.id',
    'function DailyWorkPlan({workPlan,drums,repairs=[]',
    'ScheduleWorkControl label="Schedule Repair"',
    'Estimated workshop hours',
    'repairPlanItem',
]
for token in required:
    assert token in text, token

migration = Path(__file__).parents[1] / 'supabase' / 'v7_9_10_repair_planning.sql'
sql = migration.read_text()
assert 'add column if not exists repair_id' in sql
assert 'add column if not exists estimated_hours' in sql
assert 'work_plan_unique_repair_date_idx' in sql

print('v7.9.10 targeted checks passed')
