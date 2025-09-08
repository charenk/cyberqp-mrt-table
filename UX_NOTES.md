# Edit Column UX Notes

- Staged editing: user can toggle multiple columns, table updates only when Save is pressed.
- Header:
  - 40px height, no gutters, divider has no margins
  - Title "Columns" left; Save button (small, contained) right-aligned
- List:
  - Checkbox items are 40px height, compact padding, checkboxes left-aligned
  - Shows up to 8 items before scrolling (max-height ~320px)
- Persistence:
  - Column visibility stored in localStorage under `mrt-column-visibility`
  - Restored on load
- Save button state:
  - Enabled only when current staged selection differs from table visibility
- Controls:
  - Global switch "Edit column feature" toggles presence of the CTA and popover in the top toolbar

These notes reflect the current implementation in `src/App.tsx`.
