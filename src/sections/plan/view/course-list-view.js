import isEqual from 'lodash/isEqual';
import { useState, useCallback, useEffect } from 'react';
// @mui
import { alpha } from '@mui/material/styles';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import Container from '@mui/material/Container';
import TableBody from '@mui/material/TableBody';
import IconButton from '@mui/material/IconButton';
import TableContainer from '@mui/material/TableContainer';
// routes
import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hook';
import { RouterLink } from 'src/routes/components';
// hooks
import { useBoolean } from 'src/hooks/use-boolean';
// api
import { useFilterPlans } from 'src/api/plan';
import useSWR, { mutate } from 'swr';
// components
import Label from 'src/components/label';
import Iconify from 'src/components/iconify';
import Scrollbar from 'src/components/scrollbar';
import { ConfirmDialog } from 'src/components/custom-dialog';
import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
import {
  useTable,
  getComparator,
  emptyRows,
  TableNoData,
  TableEmptyRows,
  TableHeadCustom,
  TableSelectedAction,
  TablePaginationCustom,
} from 'src/components/table';
//
import PlanTableRow from '../plan-table-row';
import PlanTableToolbar from '../plan-table-toolbar';
import PlanTableFiltersResult from '../plan-table-filters-result';

// ----------------------------------------------------------------------

const STATUS_OPTIONS = [{ value: 'all', label: 'All' }];

const TABLE_HEAD = [
  { id: 'courseName', label: 'Course Name' },
  { id: 'price', label: 'Price' },
  { id: 'planType', label: 'Plan Type' },
  { id: 'paymentType', label: 'Payment Type' },
  { id: 'recurringPeriod', label: 'Period' },
  { id: '', },
];

const defaultFilters = {
  name: '',
  status: 'all',
};

// ----------------------------------------------------------------------

export default function CourseListView() {
  const table = useTable();
  const settings = useSettingsContext();
  const router = useRouter();
  const confirm = useBoolean();

  const filter = { where: { planGroup: 0 } };
  const filterString = encodeURIComponent(JSON.stringify(filter));
  const { filteredPlans } = useFilterPlans(filterString);
  

  // Local state to handle instant updates
  const [localPlans, setLocalPlans] = useState(filteredPlans || []);
  const [filters, setFilters] = useState(defaultFilters);

  // Sync localPlans when SWR fetches new data
  useEffect(() => {
    setLocalPlans(filteredPlans || []);
  }, [filteredPlans]);

  const dataFiltered = applyFilter({
    inputData: localPlans,
    comparator: getComparator(table.order, table.orderBy),
    filters,
  });

  const dataInPage = dataFiltered.slice(
    table.page * table.rowsPerPage,
    table.page * table.rowsPerPage + table.rowsPerPage
  );

  const denseHeight = table.dense ? 52 : 72;
  const canReset = !isEqual(defaultFilters, filters);
  const notFound = (!dataFiltered.length && canReset) || !dataFiltered.length;

  const handleFilters = useCallback((name, value) => {
    table.onResetPage();
    setFilters((prev) => ({ ...prev, [name]: value }));
  }, [table]);

  const handleDeleteRow = useCallback((id) => {
    table.onUpdatePageDeleteRow(dataInPage.length);
  }, [dataInPage.length, table]);

  const handleDeleteRows = useCallback(() => {
    table.onUpdatePageDeleteRows({
      totalRows: localPlans.length,
      totalRowsInPage: dataInPage.length,
      totalRowsFiltered: dataFiltered.length,
    });
  }, [dataFiltered.length, dataInPage.length, localPlans.length, table]);

  // Handle edit row
  const handleEditRow = useCallback(
    (id) => {
      router.push({
        pathname: paths.dashboard.plan.edit(id),
        query: { fromList: true },
      });
    },
    [router]
  );

  // Call this after the edit form updates a plan
  const handlePlanUpdated = (updatedPlan) => {
    // Optimistically update localPlans
    setLocalPlans((prev) =>
      prev.map((plan) => (plan.id === updatedPlan.id ? updatedPlan : plan))
    );

    // Revalidate SWR cache
    mutate(filterString);
  };

  const handleFilterStatus = useCallback(
    (event, newValue) => handleFilters('status', newValue),
    [handleFilters]
  );

  const handleResetFilters = useCallback(() => {
    setFilters(defaultFilters);
  }, []);

  return (
    <>
      <Container maxWidth={settings.themeStretch ? false : 'lg'}>
        <CustomBreadcrumbs
          heading="Course List"
          links={[
            { name: 'Dashboard', href: paths.dashboard.root },
            { name: 'Courses', href: paths.dashboard.plan.courseList },
            { name: 'List' },
          ]}
          action={
            <Button
              component={RouterLink}
              href={paths.dashboard.plan.new}
              variant="contained"
              startIcon={<Iconify icon="mingcute:add-line" />}
            >
              New Plan
            </Button>
          }
          sx={{ mb: { xs: 3, md: 5 } }}
        />

        <Card>
          <Tabs
            value={filters.status}
            onChange={handleFilterStatus}
            sx={{
              px: 2.5,
              boxShadow: (theme) =>
                `inset 0 -2px 0 0 ${alpha(theme.palette.grey[500], 0.08)}`,
            }}
          >
            {STATUS_OPTIONS.map((tab) => (
              <Tab key={tab.value} value={tab.value} label={tab.label} />
            ))}
          </Tabs>

          <PlanTableToolbar filters={filters} onFilters={handleFilters} />

          {canReset && (
            <PlanTableFiltersResult
              filters={filters}
              onFilters={handleFilters}
              onResetFilters={handleResetFilters}
              results={dataFiltered.length}
              sx={{ p: 2.5, pt: 0 }}
            />
          )}

          <TableContainer sx={{ position: 'relative', overflow: 'unset' }}>
            <TableSelectedAction
              dense={table.dense}
              numSelected={table.selected.length}
              rowCount={localPlans.length}
              onSelectAllRows={(checked) =>
                table.onSelectAllRows(checked, localPlans.map((row) => row.id))
              }
              action={
                <Tooltip title="Delete">
                  <IconButton color="primary" onClick={confirm.onTrue}>
                    <Iconify icon="solar:trash-bin-trash-bold" />
                  </IconButton>
                </Tooltip>
              }
            />

            <Scrollbar>
              <Table size={table.dense ? 'small' : 'medium'} sx={{ minWidth: 960 }}>
                <TableHeadCustom
                  order={table.order}
                  orderBy={table.orderBy}
                  headLabel={TABLE_HEAD}
                  rowCount={localPlans.length}
                  numSelected={table.selected.length}
                  onSort={table.onSort}
                  onSelectAllRows={(checked) =>
                    table.onSelectAllRows(checked, localPlans.map((row) => row.id))
                  }
                />

                <TableBody>
                  {dataFiltered
                    .slice(
                      table.page * table.rowsPerPage,
                      table.page * table.rowsPerPage + table.rowsPerPage
                    )
                    .map((row) => (
                      <PlanTableRow
                        key={row.id}
                        row={row}
                        selected={table.selected.includes(row.id)}
                        onSelectRow={() => table.onSelectRow(row.id)}
                        onDeleteRow={() => handleDeleteRow(row.id)}
                        onEditRow={() => handleEditRow(row.id)}
                        planGroup={0}
                      />
                    ))}

                  <TableEmptyRows
                    height={denseHeight}
                    emptyRows={emptyRows(table.page, table.rowsPerPage, localPlans.length)}
                  />

                  <TableNoData notFound={notFound} />
                </TableBody>
              </Table>
            </Scrollbar>
          </TableContainer>

          <TablePaginationCustom
            count={dataFiltered.length}
            page={table.page}
            rowsPerPage={table.rowsPerPage}
            onPageChange={table.onChangePage}
            onRowsPerPageChange={table.onChangeRowsPerPage}
            dense={table.dense}
            onChangeDense={table.onChangeDense}
          />
        </Card>
      </Container>

      <ConfirmDialog
        open={confirm.value}
        onClose={confirm.onFalse}
        title="Delete"
        content={`Are you sure want to delete ${table.selected.length} items?`}
        action={
          <Button
            variant="contained"
            color="error"
            onClick={() => {
              handleDeleteRows();
              confirm.onFalse();
            }}
          >
            Delete
          </Button>
        }
      />
    </>
  );
}

// ----------------------------------------------------------------------

function applyFilter({ inputData, comparator, filters }) {
  const { name, status } = filters;

  const stabilizedThis = inputData.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  inputData = stabilizedThis.map((el) => el[0]);

  if (name) {
    const lowerName = name.toLowerCase();
    inputData = inputData.filter((plan) => {
      const course = plan.courses || {};
      return (
        course.courseName?.toLowerCase().includes(lowerName) ||
        course.description?.toLowerCase().includes(lowerName) ||
        course.courseDuration?.toLowerCase().includes(lowerName) ||
        plan.paymentType?.toLowerCase().includes(lowerName)
      );
    });
  }

  if (status !== 'all') {
    inputData = inputData.filter((plan) =>
      status === 'active' ? !plan.isDeleted : plan.isDeleted
    );
  }

  return inputData;
}
