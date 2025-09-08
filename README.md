# CyberQP Table Component

A customized implementation of Material React Table v3 with specific design system requirements for CyberQP's SaaS application.

## Features

### 1. Layout & Styling
- Table is horizontally and vertically centered
- Default compact density with consistent 40px height for:
  - Table headers
  - Table rows
  - Pagination sections
- Font sizes standardized to 14px (0.875rem)
- Subtle styling:
  - Light grey (#f5f5f5) header background
  - Header font weight: 400
  - Single border (1px solid rgba(224, 224, 224, 1))
  - No shadows
  - Checkbox size: 20x20px

### 2. Dynamic Height Behavior
- For ≤10 rows: Auto height with exact fit
- For >10 rows: Takes full viewport height (calc(100vh - 184px))
- Internal scrolling for the table body when needed

### 3. Row Selection
- Multi-row selection with select-all capability
- Selection state reflected in the header:
  - No selection: "105 Customers"
  - With selection: "X of Y Customers selected" (Y = current page size)
- Context-aware action buttons:
  - Selected state: Shows "Delete selected" and "Archive selected"
  - Normal state: Shows all standard action buttons

### 4. Pagination
- Hidden for tables with fewer than 10 rows [[memory:8228205]]
- Options: 10, 20, 50, 100 rows per page
- Consistent 40px height with proper vertical alignment
- Font size: 14px for all elements

### 5. Toolbar & Controls
- Simplified toolbar with removed features:
  - No search
  - No show/hide filters
  - No column editing
  - No full-screen toggle
- Action buttons (24px height):
  - Primary button
  - 3 Secondary buttons
  - Info button (i)

## Usage Example

\`\`\`tsx
import { MaterialReactTable, useMaterialReactTable } from 'material-react-table';
import { ThemeProvider, createTheme } from '@mui/material/styles';

// See the full implementation in src/App.tsx for:
// 1. Theme configuration
// 2. Column definitions
// 3. Pagination component
// 4. Table configuration

const table = useMaterialReactTable({
  columns,
  data,
  // Core features
  enableRowSelection: true,
  enableSelectAll: true,
  enableMultiRowSelection: true,
  
  // Disabled features
  enableGlobalFilter: false,
  enableColumnFilters: false,
  enableHiding: false,
  enableColumnActions: false,
  enableFullScreenToggle: false,
  enableDensityToggle: false,

  // Custom styling
  muiTableHeadCellProps: {
    sx: { /* See src/App.tsx for full styling */ }
  },
  // ... other props
});

return (
  <ThemeProvider theme={theme}>
    <MaterialReactTable table={table} />
  </ThemeProvider>
);
\`\`\`

## Design Decisions

1. **Pagination Visibility**
   - Hidden for <10 rows to improve UX
   - Users don't expect pagination controls for small datasets

2. **Selection Feedback**
   - Title changes to reflect selection within current page size context
   - Action buttons adapt to show relevant operations

3. **Height Management**
   - Dynamic height calculation ensures efficient space usage
   - Internal scrolling maintains fixed overall dimensions

4. **Simplified Controls**
   - Removed non-essential toolbar features
   - Focus on core table functionality

## Dependencies

- Material React Table v3
- Material UI v6
- React
- TypeScript

## Next Steps

1. **For Developers**
   - Review the implementation in `src/App.tsx`
   - Test with different data volumes
   - Verify accessibility compliance
   - Consider adding unit tests

2. **For Designers**
   - Validate visual consistency
   - Review interaction patterns
   - Suggest refinements for selection states

3. **For Product Managers**
   - Confirm feature set matches requirements
   - Plan for additional functionality
   - Consider user feedback collection strategy

## Feedback & Contributions

Please provide feedback on:
1. Implementation approach
2. Styling decisions
3. UX patterns
4. Performance considerations
5. Additional features needed

## Known Considerations

1. The table adapts its height based on content:
   - Auto-height for ≤10 rows
   - Full viewport height with scrolling for >10 rows
2. Selection state shows current page context
3. Action buttons change based on selection state

## Project Docs

- [CHANGELOG](./CHANGELOG.md)
- [Edit Column UX Notes](./UX_NOTES.md)