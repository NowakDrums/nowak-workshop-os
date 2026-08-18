from pathlib import Path

APP = (Path(__file__).parents[1] / 'src' / 'App.jsx').read_text()


def test_completed_drums_excluded_from_batches():
    start = APP.index('const batches=useMemo(()=>{')
    end = APP.index('const isAllocatedRow', start)
    block = APP[start:end]
    assert '!isManufacturingComplete(d)' in block
    assert 'drumLifecycleStatus(d)!=="Completed"' in block


def test_completed_drums_excluded_from_outstanding_final_work():
    start = APP.index('const outstandingFinalWork=filtered.filter')
    end = APP.index('const activeRepairs', start)
    block = APP[start:end]
    assert '!isManufacturingComplete(d)' in block
    assert 'drumLifecycleStatus(d)!=="Completed"' in block


def test_completed_final_work_copy_no_longer_claims_complete_drums_remain_today():
    assert 'These drums can remain Complete while the final practical task stays visible.' not in APP
