import { Helmet } from "react-helmet-async";
import { filter, sample } from "lodash";
import { faker } from "@faker-js/faker";
import { sentenceCase } from "change-case";
import { useState, useEffect, useTransition } from "react";
import { useForm } from "react-hook-form";
import { useFormik } from "formik";
import * as yup from "yup";
// import axios from 'axios';
// @mui
import {
  Card,
  Box,
  Table,
  Stack,
  Paper,
  Avatar,
  Button,
  Popover,
  Checkbox,
  TableRow,
  MenuItem,
  TableBody,
  TableCell,
  Container,
  Typography,
  IconButton,
  TableContainer,
  TablePagination,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Select,
  InputLabel,
  FormControl,
  CircularProgress
} from "@mui/material";
// components
import Label from "../components/label";
import Iconify from "../components/iconify";
import Scrollbar from "../components/scrollbar";
// sections
import { InvoiceListHead, InvoiceListToolbar } from "../sections/@dashboard/user";
// mock

import * as InvoiceService from "../hooks/invoice";
import { useQuery } from "@tanstack/react-query";

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: "invoiceNumber", label: "Number", alignRight: false },
  { id: "currency", label: "Currency", alignRight: false },
  { id: "customer", label: "Customer", alignRight: false },
  { id: "invoiceDate", label: "Date", alignRight: false },
  { id: "invoiceGrossTotal", label: "Total", alignRight: false },
  { id: "totalDiscount", label: "Discount", alignRight: false },
  { id: "status", label: "Status", alignRight: false },
  { id: "option" },
];

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  // border: '2px solid #000',
  borderRadius: "8px",
  boxShadow: 24,
  p: 4,
  TransitionEvent: "all 1s",
};
// ----------------------------------------------------------------------

// Formik config
const validationSchema = yup.object({
  name: yup.string().required("Name is required"),
  school: yup.string().required("School is required"),
  status: yup.string().required("Status is required"),
  role: yup.string(),
  verified: yup.string(),
});


export default function InvoicePage() {
  const [open, setOpen] = useState(null);

  const [page, setPage] = useState(0);

  const [order, setOrder] = useState("");

  const [selected, setSelected] = useState([]);

  const [orderBy, setOrderBy] = useState("");

  const [filterName, setFilterName] = useState("");

  const [isPending, startTransition] = useTransition();

  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalRows, setTotalRows] = useState(10);
  const [filterStatus, setFilterStatus] = useState("");

  const [invoiceDataSource, setInvoiceDataSource] = useState([]);

  const { isLoading, data } = useQuery({
    queryKey: ['invoice', page + 1, rowsPerPage, order, orderBy, filterName, filterStatus],
    queryFn: () => InvoiceService.fetchInvoice({ pageNumber: page + 1, pageSize: rowsPerPage, ordering: order, orderBy, keyword: filterName, status: filterStatus })
  })

  const [openModal, setOpenModal] = useState(false);
  const handleOpenModal = () => setOpenModal(true);
  const handleCloseModal = () => {
    setOpenModal(false);
    formik.handleReset(null);
    setCurrRowFocus(null);
  };

  const [currRowFocus, setCurrRowFocus] = useState(null);

  const handleOpenMenu = (event, row) => {
    console.log(
      "🚀 ~ file: InvoicePage.js ~ line 145 ~ handleOpenMenu ~ row",
      row
    );
    setOpen(event.currentTarget);
    setCurrRowFocus({ ...row });
  };

  const handleCloseMenu = () => {
    setOpen(null);
    setCurrRowFocus(null);
  };

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = invoiceDataSource.map((n) => n.invoiceId);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event, id) => {
    const selectedIndex = selected.indexOf(id);
    let newSelected = [];
    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      );
    }
    setSelected(newSelected);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleDeleteRow = async () => {
    await InvoiceService.deleteInvoice(currRowFocus.invoiceId);
    setOpen(null);
    setCurrRowFocus(null);
  };

  const handleChangeRowsPerPage = (event) => {
    setPage(0);
    setRowsPerPage(parseInt(event.target.value, 10));
  };

  const handleFilterByName = (event) => {
    startTransition(() => {
      setPage(0);
      setFilterName(event.target.value)
    })
  };


  const handleFilterStatus = (event, value) => {
    startTransition(() => {
      setPage(0);
      setFilterStatus(value)
    })
  };

  const handleDeleteInvoice = (ids) => {
    setInvoiceDataSource(
      invoiceDataSource.filter((item) => !selected.includes(item.invoiceId))
    );
    setSelected([]);
    console.log(invoiceDataSource);
  };

  const formik = useFormik({
    initialValues: {
      name: "",
      school: "",
      role: "",
      verified: "no",
      status: "active",
    },
    validationSchema,
    onSubmit: async (value: any) => {
      if (!value) return;
      value.isVerified = value.verified;
      value.id = faker.datatype.uuid();
      value.avatarUrl = `/assets/images/avatars/avatar_${invoiceDataSource.length + 1
        }.jpg`;
      if (!currRowFocus) {
        const payload = {
          universityId: parseInt(value.school, 10),
          name: value.name,
          role: value.role,
          status: value.status === "active",
          verify: value.verified,
          age: 22,
        };
        await InvoiceService.createInvoice(payload).then((data) => {
          handleCloseModal();
        });
      } else {
        const payload = {
          universityId: parseInt(value.school, 10),
          name: value.name,
          role: value.role,
          status: value.status === "active",
          verify: value.verified,
          age: 22,
        };
        await InvoiceService.updateInvoice(currRowFocus.id, payload).then((data) => {
          handleCloseModal();
        });
      }
      handleCloseModal();
    },
  });

  useEffect(() => {
    if (data) {
      setInvoiceDataSource(() => [...data?.data?.data]);
      setTotalRows(data?.data?.paging.totalRecords);
    }
  }, [data]);

  return (
    <>
      <Helmet>
        <title> Invoice | Minimal UI </title>
      </Helmet>

      <Container>
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          mb={5}
        >
          <Typography variant="h4" gutterBottom>
            INVOICES
          </Typography>
          <Button
            variant="contained"
            onClick={handleOpenModal}
            startIcon={<Iconify icon="eva:plus-fill" />}
            disabled={true}
          >
            New Invoice
          </Button>
        </Stack>

        <Card>
          <InvoiceListToolbar
            numSelected={selected.length}
            filterName={filterName}
            onFilterName={handleFilterByName}
            onDeleteIds={handleDeleteInvoice}
            onFilterStatus={handleFilterStatus}
          />

          <Scrollbar sx={undefined}>
            <TableContainer sx={{ minWidth: 800 }}>
              <Table>
                <InvoiceListHead
                  order={order}
                  orderBy={orderBy}
                  headLabel={TABLE_HEAD}
                  rowCount={invoiceDataSource.length || 2}
                  numSelected={selected.length}
                  onRequestSort={handleRequestSort}
                  onSelectAllClick={handleSelectAllClick}
                />
                <TableBody sx={{ position: "relative", minHeight: "1000px" }}>
                  <>
                    {invoiceDataSource.length > 0 &&

                      invoiceDataSource.map((row) => {
                        const {
                          invoiceId,
                          currency,
                          customer,
                          invoiceDate,
                          invoiceGrossTotal,
                          totalTax,
                          totalDiscount,
                          status,
                          type,
                          invoiceNumber
                        } = row;
                        const selectedInvoice = selected.indexOf(invoiceId) !== -1;

                        return (
                          <TableRow
                            hover
                            key={invoiceId}
                            tabIndex={-1}
                            role="checkbox"
                            selected={selectedInvoice}
                          >
                            <TableCell padding="checkbox">
                              <Checkbox
                                checked={selectedInvoice}
                                onChange={(event) => handleClick(event, invoiceId)}
                              />
                            </TableCell>
                            <TableCell align="left">
                              {invoiceNumber}
                            </TableCell>
                            <TableCell align="left">
                              {currency}
                            </TableCell>
                            <TableCell align="left">
                              {customer?.name}
                            </TableCell>
                            <TableCell align="left">
                              {invoiceDate}
                            </TableCell>
                            <TableCell align="left">
                              {invoiceGrossTotal}
                            </TableCell>
                            <TableCell align="left">
                              {totalDiscount}
                            </TableCell>
                            <TableCell align="left">
                              <Label color={status[0]?.key === "Paid" ? "success" : status[0]?.key === "Due" ? "warning" : "error"}>
                                {
                                  (() => {
                                    switch (status[0]?.key) {
                                      case "Paid":
                                        return sentenceCase("Paid");
                                      case "Overdue":
                                        return sentenceCase("Overdue");
                                      default:
                                        return sentenceCase("Due");
                                    }
                                  })()
                                }
                              </Label>
                            </TableCell>

                            <TableCell align="right">
                              <IconButton
                                size="large"
                                color="inherit"
                                onClick={(e) => handleOpenMenu(e, row)}
                              >
                                <Iconify icon={"eva:more-vertical-fill"} />
                              </IconButton>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    {(isLoading &&
                      <TableRow style={{
                        height: "100%",
                        position: "absolute",
                        top: 0,
                        right: 0,
                        width: "100%",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        backgroundColor: "#f4f6f8c7"
                      }}>
                        <TableCell align="center" colSpan={12} sx={{ py: 3, border: "none" }}>
                          <CircularProgress />
                        </TableCell>
                      </TableRow>
                    )}
                  </>

                </TableBody>

                {(invoiceDataSource.length < 0 && !isLoading) && (
                  <TableBody>
                    <TableRow>
                      <TableCell align="center" colSpan={6} sx={{ py: 3 }}>
                        <Paper
                          sx={{
                            textAlign: "center",
                          }}
                        >
                          <Typography variant="h6" paragraph>
                            Not found
                          </Typography>

                          <Typography variant="body2">
                            No results found for &nbsp;
                            <strong>&quot;{filterName}&quot;</strong>.
                            <br /> Try checking for typos or using complete
                            words.
                          </Typography>
                        </Paper>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                )}
              </Table>
            </TableContainer>
          </Scrollbar>

          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={totalRows}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Card>
      </Container>

      <Popover
        open={Boolean(open)}
        anchorEl={open}
        onClose={handleCloseMenu}
        anchorOrigin={{ vertical: "top", horizontal: "left" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
        PaperProps={{
          sx: {
            p: 1,
            width: 140,
            "& .MuiMenuItem-root": {
              px: 1,
              typography: "body2",
              borderRadius: 0.75,
            },
          },
        }}
      >
        <MenuItem sx={{ color: "error.main" }} onClick={handleDeleteRow} disabled={true}>
          <Iconify icon={"eva:trash-2-outline"} sx={{ mr: 2 }} />
          Delete
        </MenuItem>
      </Popover>
      <Dialog fullWidth={false} open={openModal} onClose={handleCloseModal}>
        <DialogTitle>
          {currRowFocus ? "Edit Invoice" : "Create new Invoice"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText>Student Information</DialogContentText>
          <Box
            noValidate
            component="form"
            sx={{
              display: "flex",
              flexDirection: "column",
              m: "auto",
              width: "100%",
              "& .MuiFormControl-root": { m: 1, width: "400px" },
            }}
            onSubmit={formik.handleSubmit}
          >
            <TextField
              fullWidth
              id="name"
              name="name"
              label="Name"
              value={formik.values.name}
              onChange={formik.handleChange}
              error={formik.touched.name && Boolean(formik.errors.name)}
            />

            <FormControl>
              <InputLabel id="demo-simple-select-label">School</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                onChange={formik.handleChange}
                fullWidth
                id="school"
                name="school"
                value={formik.values.school}
                label="School"
                type="school"
                error={formik.touched.school && Boolean(formik.errors.school)}
              >
              </Select>
            </FormControl>
            <TextField
              fullWidth
              id="role"
              name="role"
              label="Role"
              type="role"
              value={formik.values.role}
              onChange={formik.handleChange}
              error={formik.touched.role && Boolean(formik.errors.role)}
            />
            <FormControl>
              <InputLabel id="demo-simple-select-label">Status</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                onChange={formik.handleChange}
                fullWidth
                id="status"
                name="status"
                value={formik.values.status}
                label="Status"
                type="status"
                error={formik.touched.status && Boolean(formik.errors.status)}
              >
                <MenuItem value={"active"}>Active</MenuItem>
                <MenuItem value={"banned"}>Banned</MenuItem>
              </Select>
            </FormControl>
            <TextField
              fullWidth
              id="verified"
              name="verified"
              label="Verified"
              type="verified"
              value={formik.values.verified}
              onChange={formik.handleChange}
              error={formik.touched.verified && Boolean(formik.errors.verified)}
            />
          </Box>
        </DialogContent>
        <DialogActions>
        </DialogActions>
      </Dialog>
    </>
  );
}
