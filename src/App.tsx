import { useMemo, useState, useEffect } from 'react';
import {
  MaterialReactTable,
  useMaterialReactTable,
  type MRT_ColumnDef,
} from 'material-react-table';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { TablePagination, Button, Switch, FormControlLabel, Menu, MenuItem, Checkbox, ListItemText, Divider, Box } from '@mui/material';

type Person = {
  name: {
    firstName: string;
    lastName: string;
  };
  address: string;
  city: string;
  state: string;
  email: string;
  phone: string;
};

const data: Person[] = Array.from({ length: 105 }, (_, index) => ({
  name: {
    firstName: ['John', 'Jane', 'Joe', 'Kevin', 'Joshua'][index % 5],
    lastName: ['Doe', 'Smith', 'Johnson', 'Williams', 'Brown'][index % 5],
  },
  address: `${100 + index} Main Street`,
  city: ['New York', 'Los Angeles', 'Chicago', 'Houston', 'Phoenix'][index % 5],
  state: ['NY', 'CA', 'IL', 'TX', 'AZ'][index % 5],
  email: `user${index}@example.com`,
  phone: `(555) ${String(index).padStart(3, '0')}-${String(index * 2).padStart(4, '0')}`,
}));

function App() {
  const [showTopPagination, setShowTopPagination] = useState(true);
  const [showBottomPagination, setShowBottomPagination] = useState(true);
  const [showActions, setShowActions] = useState(true);
  const [enableSelection, setEnableSelection] = useState(true);
  const [showEditColumns, setShowEditColumns] = useState(true);
  const [columnVisibility, setColumnVisibility] = useState<Record<string, boolean>>({});

  const COLUMN_VISIBILITY_STORAGE_KEY = 'mrt-column-visibility';

  useEffect(() => {
    try {
      const saved = localStorage.getItem(COLUMN_VISIBILITY_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && typeof parsed === 'object') {
          setColumnVisibility(parsed);
        }
      }
    } catch {
      // ignore malformed storage
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(COLUMN_VISIBILITY_STORAGE_KEY, JSON.stringify(columnVisibility));
    } catch {
      // ignore quota/storage errors
    }
  }, [columnVisibility]);

  const theme = createTheme({
    typography: {
      fontSize: 14,
      allVariants: {
        fontSize: '0.875rem',
      },
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            textTransform: 'none',
            height: '24px',
            padding: '0 8px',
            minWidth: 'unset',
            fontSize: '0.875rem',
            lineHeight: '24px',
            boxShadow: 'none',
            '&:hover': {
              boxShadow: 'none',
            },
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            boxShadow: 'none',
            border: '1px solid rgba(224, 224, 224, 1)',
          },
        },
      },
      MuiCheckbox: {
        styleOverrides: {
          root: {
            padding: '10px',
            '&.MuiCheckbox-root': {
              padding: '10px',
            },
            '& .MuiSvgIcon-root': {
              width: '20px',
              height: '20px',
            },
          },
        },
      },
    },
  });

  const columns = useMemo<MRT_ColumnDef<Person>[]>(
    () => [
      {
        accessorKey: 'name.firstName',
        header: 'First Name',
        size: 150,
      },
      {
        accessorKey: 'name.lastName',
        header: 'Last Name',
        size: 150,
      },
      {
        accessorKey: 'email',
        header: 'Email',
        size: 250,
      },
      {
        accessorKey: 'phone',
        header: 'Phone',
        size: 150,
      },
      {
        accessorKey: 'address',
        header: 'Address',
        size: 200,
      },
      {
        accessorKey: 'city',
        header: 'City',
        size: 150,
      },
      {
        accessorKey: 'state',
        header: 'State',
        size: 100,
      },
    ],
    [],
  );

  const PaginationComponent = ({ table, position, showActions, showPaginationControls, showEditColumns }: { table: any, position: 'top' | 'bottom', showActions: boolean, showPaginationControls: boolean, showEditColumns: boolean }) => {
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);
    const [stagedVisibility, setStagedVisibility] = useState<Record<string, boolean>>({});
    const handleOpen = (event: React.MouseEvent<HTMLButtonElement>) => setAnchorEl(event.currentTarget);
    const handleClose = () => setAnchorEl(null);
    const getResolvedCurrentVisibility = () => {
      const current: Record<string, boolean> = { ...table.getState().columnVisibility };
      table.getAllLeafColumns().forEach((c: any) => {
        if (typeof current[c.id] === 'undefined') current[c.id] = true;
      });
      return current;
    };
    const initializeStaged = () => {
      setStagedVisibility(getResolvedCurrentVisibility());
    };
    const isDirty = JSON.stringify(stagedVisibility) !== JSON.stringify(getResolvedCurrentVisibility());
    const handleSave = () => {
      table.setColumnVisibility(stagedVisibility);
      handleClose();
    };
    const totalRows = table.getFilteredRowModel().rows.length;
    const pageSize = table.getState().pagination.pageSize;
    const selectedRows = table.getSelectedRowModel().rows.length;
    const currentPageRows = Math.min(pageSize, totalRows);
    
    // Don't render pagination if less than 10 rows [[memory:8228205]]
    if (totalRows < 10) {
      return (
        <div style={{
          height: '40px',
          minHeight: '40px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 16px',
          borderBottom: position === 'top' ? '1px solid rgba(224, 224, 224, 1)' : 'none',
        }}>
          {position === 'top' ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <span style={{ 
                fontSize: '0.875rem', 
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                height: '24px',
              }}>
                {selectedRows > 0
                  ? `${selectedRows} of ${currentPageRows} Customers selected`
                  : `${totalRows} Customers`}
              </span>
              {showActions && table.getSelectedRowModel().rows.length > 0 ? (
                <>
                  <Button variant="contained" size="small">Delete selected</Button>
                  <Button variant="outlined" size="small">Archive selected</Button>
                </>
              ) : showActions ? (
                <>
                  <Button variant="contained" size="small">Primary button</Button>
                  <Button variant="outlined" size="small">Secondary button</Button>
                  <Button variant="outlined" size="small">Secondary button</Button>
                  {showEditColumns && (
                  <>
                  <Button variant="text" size="small" onClick={(e) => { handleOpen(e); initializeStaged(); }}>Edit column</Button>
                  <Menu anchorEl={anchorEl} open={open} onClose={handleClose} anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
                    PaperProps={{ sx: { minWidth: 220, '& .MuiMenuItem-root': { height: '40px', minHeight: '40px', py: 0, pl: 1 }, '& .MuiList-root': { p: 0 } } }}>
                    <MenuItem dense disableRipple disableGutters onClick={(e) => e.stopPropagation()} sx={{ cursor: 'default', height: '40px', minHeight: '40px', py: 0, pl: 1, pr: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', width: '100%', justifyContent: 'space-between' }}>
                        <span style={{ fontWeight: 600 }}>Columns</span>
                        <Button size="small" variant="contained" onClick={handleSave} disabled={!isDirty}>Save</Button>
                      </div>
                    </MenuItem>
                    <Divider sx={{ my: 0 }} />
                    <Box sx={{ maxHeight: 320, overflowY: 'auto' }}>
                      {table.getAllLeafColumns().map((col: any) => {
                        const checked = typeof stagedVisibility[col.id] === 'undefined' ? true : stagedVisibility[col.id];
                        return (
                          <MenuItem key={col.id} dense onClick={() => setStagedVisibility(prev => ({ ...prev, [col.id]: !checked }))}>
                            <Checkbox size="small" checked={checked} sx={{ ml: 0, mr: 1, p: 0.5 }} />
                            <ListItemText primary={col.columnDef.header || col.id} />
                          </MenuItem>
                        );
                      })}
                    </Box>
                  </Menu>
                  </>
                  )}
                </>
              ) : null}
            </div>
          ) : <div />}
          <div /> {/* Empty div to maintain space-between layout */}
        </div>
      );
    }

    return (
      <div style={{
        height: '40px',
        minHeight: '40px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 16px',
        borderBottom: position === 'top' ? '1px solid rgba(224, 224, 224, 1)' : 'none',
      }}>
        {position === 'top' ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          <span style={{ 
                fontSize: '0.875rem', 
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                height: '24px',
              }}>
                {selectedRows > 0
                  ? `${selectedRows} of ${currentPageRows} Customers selected`
                  : `${totalRows} Customers`}
              </span>
            {showActions && table.getSelectedRowModel().rows.length > 0 ? (
              <>
                <Button variant="contained" size="small">Delete selected</Button>
                <Button variant="outlined" size="small">Archive selected</Button>
              </>
            ) : showActions ? (
              <>
                <Button variant="contained" size="small">Primary button</Button>
                <Button variant="outlined" size="small">Secondary button</Button>
                <Button variant="outlined" size="small">Secondary button</Button>
                {showEditColumns && (
                <>
                <Button variant="text" size="small" onClick={(e) => { handleOpen(e); initializeStaged(); }}>Edit column</Button>
                <Menu anchorEl={anchorEl} open={open} onClose={handleClose} anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
                  PaperProps={{ sx: { minWidth: 220, '& .MuiMenuItem-root': { height: '40px', minHeight: '40px', py: 0, pl: 1 }, '& .MuiList-root': { p: 0 } } }}>
                  <MenuItem dense disableRipple disableGutters onClick={(e) => e.stopPropagation()} sx={{ cursor: 'default', height: '40px', minHeight: '40px', py: 0, pl: 1, pr: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', width: '100%', justifyContent: 'space-between' }}>
                      <span style={{ fontWeight: 600 }}>Columns</span>
                      <Button size="small" variant="contained" onClick={handleSave} disabled={!isDirty}>Save</Button>
                    </div>
                  </MenuItem>
                  <Divider sx={{ my: 0 }} />
                  <Box sx={{ maxHeight: 320, overflowY: 'auto' }}>
                    {table.getAllLeafColumns().map((col: any) => {
                      const checked = typeof stagedVisibility[col.id] === 'undefined' ? true : stagedVisibility[col.id];
                      return (
                        <MenuItem key={col.id} dense onClick={() => setStagedVisibility(prev => ({ ...prev, [col.id]: !checked }))}>
                          <Checkbox size="small" checked={checked} sx={{ ml: 0, mr: 1, p: 0.5 }} />
                          <ListItemText primary={col.columnDef.header || col.id} />
                        </MenuItem>
                      );
                    })}
                  </Box>
                </Menu>
                </>
                )}
              </>
            ) : null}
          </div>
        ) : <div />}
        {showPaginationControls && (
        <TablePagination
          component="div"
          count={totalRows}
          page={table.getState().pagination.pageIndex}
          rowsPerPage={table.getState().pagination.pageSize}
          onPageChange={(_, newPage) => table.setPageIndex(newPage)}
          onRowsPerPageChange={(event) => table.setPageSize(Number(event.target.value))}
          labelRowsPerPage="Rows per page:"
          rowsPerPageOptions={[10, 20, 50, 100]}
          sx={{
            '.MuiToolbar-root': {
              minHeight: '40px !important',
              height: '40px !important',
              padding: 0,
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            },
            '.MuiTablePagination-selectLabel': {
              margin: 0,
              fontSize: '0.875rem !important',
              lineHeight: '40px',
            },
            '.MuiInputBase-root': {
              marginRight: '8px',
              marginLeft: '8px',
              fontSize: '0.875rem !important',
              '.MuiSelect-select': {
                paddingTop: '5px',
                paddingBottom: '5px',
              },
            },
            '.MuiTablePagination-displayedRows': {
              margin: 0,
              fontSize: '0.875rem !important',
              lineHeight: '40px',
            },
            '.MuiTablePagination-actions': {
              marginLeft: '8px',
              gap: '4px',
              display: 'flex',
              alignItems: 'center',
            },
          }}
          SelectProps={{
            MenuProps: {
              sx: {
                '.MuiPaper-root': {
                  '.MuiMenuItem-root': {
                    fontSize: '0.875rem',
                    minHeight: '32px',
                    paddingTop: '4px',
                    paddingBottom: '4px',
                  },
                },
              },
            },
          }}
        />)}
      </div>
    );
  };

  const table = useMaterialReactTable({
    columns,
    data,
    displayColumnDefOptions: {
      'mrt-row-select': {
        size: 48,
      },
    },
    enableGlobalFilter: false,
    enableColumnFilters: false,
    enableHiding: false,
    enableColumnActions: false,
    enableFullScreenToggle: false,
    enableRowSelection: enableSelection,
    enableSelectAll: enableSelection,
    enableMultiRowSelection: enableSelection,
    state: { columnVisibility },
    onColumnVisibilityChange: setColumnVisibility,
    muiTableHeadCellProps: {
      sx: {
        height: '40px',
        padding: '0 16px',
        lineHeight: '40px',
        backgroundColor: '#f5f5f5',
        fontWeight: 400,
        '&.MuiTableCell-root': {
          paddingTop: '0',
          paddingBottom: '0',
        },
        '&.MuiTableCell-paddingCheckbox': {
          padding: '0 8px',
          width: '48px',
        },
      },
    },
    muiTableBodyRowProps: {
      sx: {
        height: '40px',
        '&.MuiTableRow-root': {
          height: '40px',
        }
      },
    },
    muiTableBodyCellProps: {
      sx: {
        height: '40px',
        padding: '0 16px',
        lineHeight: '40px',
        '&.MuiTableCell-root': {
          height: '40px',
          paddingTop: '0',
          paddingBottom: '0',
        },
        '&.MuiTableCell-paddingCheckbox': {
          padding: '0 8px',
          width: '48px',
        },
      },
    },
    muiTablePaperProps: {
      sx: {
        display: 'flex',
        flexDirection: 'column',
      },
    },
    muiTableContainerProps: ({ table }) => {
      const pageSize = table.getState().pagination.pageSize;
      const visibleRows = Math.min(pageSize, table.getFilteredRowModel().rows.length);
      
      return {
        sx: {
          height: pageSize <= 10 ? 'auto' : 'calc(100vh - 184px)', // 184px = top padding + gap + title + pagination heights
          minHeight: pageSize <= 10 ? `${(visibleRows * 40) + 40}px` : 'auto', // 40px per row + 40px for header
        },
      };
    },
    muiTableHeadProps: {
      sx: {
        position: 'sticky',
        top: 0,
        backgroundColor: '#f5f5f5',
        zIndex: 1,
      },
    },
    // Always hide MRT's built-in bottom toolbar to avoid duplicate pagination rows;
    // we render our own bottom toolbar conditionally instead.
    muiBottomToolbarProps: {
      sx: {
        display: 'none',
      },
    },
    renderTopToolbar: ({ table }) => (
      <PaginationComponent table={table} position="top" showActions={showActions} showPaginationControls={showTopPagination} showEditColumns={showEditColumns} />
    ),
    renderBottomToolbar: ({ table }) => showBottomPagination ? (
      <PaginationComponent table={table} position="bottom" showActions={false} showPaginationControls={true} showEditColumns={false} />
    ) : null,
    enableDensityToggle: false,
    initialState: {
      pagination: {
        pageSize: 10, // Start with 10 rows visible
        pageIndex: 0,
      },
    },
  });

  return (
    <ThemeProvider theme={theme}>
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        paddingTop: '20px',
      }}>
        <div style={{
          width: '100%',
          maxWidth: '1200px',
          margin: '0 auto',
          display: 'flex',
          flexDirection: 'column',
          gap: '20px',
          height: '100%',
          paddingLeft: '20px',
          paddingRight: '20px',
        }}>
          <h1 style={{
            margin: 0,
            fontSize: '24px',
            fontWeight: 500,
            alignSelf: 'flex-start',
            color: '#1a1a1a'
          }}>
            Page title placeholder
          </h1>
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            <FormControlLabel
              control={<Switch size="small" checked={showTopPagination} onChange={(e) => setShowTopPagination(e.target.checked)} />}
              label="Top pagination"
            />
            <FormControlLabel
              control={<Switch size="small" checked={showBottomPagination} onChange={(e) => setShowBottomPagination(e.target.checked)} />}
              label="Bottom pagination"
            />
            <FormControlLabel
              control={<Switch size="small" checked={showActions} onChange={(e) => setShowActions(e.target.checked)} />}
              label="Action CTAs"
            />
            <FormControlLabel
              control={<Switch size="small" checked={enableSelection} onChange={(e) => setEnableSelection(e.target.checked)} />}
              label="Row checkboxes"
            />
            <FormControlLabel
              control={<Switch size="small" checked={showEditColumns} onChange={(e) => setShowEditColumns(e.target.checked)} />}
              label="Edit column feature"
            />
          </div>
          <MaterialReactTable table={table} />
        </div>
      </div>
    </ThemeProvider>
  );
}

export default App;