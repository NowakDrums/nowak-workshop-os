# Nowak Workshop OS v7.9.35

Small workflow patch only.

- Complete can now be toggled back to Production reliably while the Job Card is still open.
- Returning a drum to Production immediately clears the local completed/fulfilment checklist state so Complete does not spring back on.
- Marking Complete now asks whether the standard hardware is physically fitted.
- If hardware is fitted, the existing hardware-used review opens before assembly/completion is recorded.
- If hardware is not fitted, no hardware preparation or assembly time is added.
- If unfitted hardware is already reserved, the app asks whether to keep that reservation or release it back to general available stock.
- In Adjust Hardware Used, saving with no fitted parts now offers to release the remaining reserved allocation instead of making the hardware appear permanently attached to the drum.
- No production timing values, inventory recipes, purchase-order mappings, media, marketing or supplier logic were otherwise changed.
