import React, { useMemo, useState } from 'react';
import {
  Box,
  Button,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Menu,
  MenuItem,
  Paper,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import AddIcon from '@mui/icons-material/Add';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import userManagementBackground from '../../assets/user_management.svg';

const mockApiResponse = [
  {
    user_details: {
      firstName: 'John',
      lastName: 'Doe',
      emailId: 'john.doe@mail.com',
      lastLogin: '06/01/2026 10:15 AM',
      createdDate: '05/20/2026 09:30 AM',
      msid: 'MS10001',
    },
    project_role_dto: {
      role: 'ADMIN',
      project: 'SB',
    },
  },
  {
    user_details: {
      firstName: 'Jane',
      lastName: 'Smith',
      emailId: 'jane.smith@mail.com',
      lastLogin: '06/01/2026 11:45 AM',
      createdDate: '05/18/2026 02:10 PM',
      msid: 'MS10002',
    },
    project_role_dto: {
      role: 'SUPERVISOR',
      project: 'UST',
    },
  },
  {
    user_details: {
      firstName: 'Alex',
      lastName: 'Lee',
      emailId: 'alex.lee@mail.com',
      lastLogin: '05/31/2026 04:20 PM',
      createdDate: '05/15/2026 08:00 AM',
      msid: 'MS10003',
    },
    project_role_dto: {
      role: 'USER',
      project: 'VO',
    },
  },
  {
    user_details: {
      firstName: 'Mary',
      lastName: 'Johnson',
      emailId: 'mary.johnson@mail.com',
      lastLogin: '05/30/2026 01:05 PM',
      createdDate: '05/11/2026 12:15 PM',
      msid: 'MS10004',
    },
    project_role_dto: {
      role: 'ADMIN',
      project: 'OCC',
    },
  },
];

const mapUsers = (data) => {
  return data.map((item, index) => ({
    id: index + 1,
    name: `${item.user_details.firstName} ${item.user_details.lastName}`,
    email: item.user_details.emailId,
    lastLogin: item.user_details.lastLogin,
    createdDate: item.user_details.createdDate,
    role: item.project_role_dto.role,
    msid: item.user_details.msid,
    project: item.project_role_dto.project,
  }));
};

const emptyForm = {
  name: '',
  email: '',
  lastLogin: '',
  createdDate: '',
  role: '',
  msid: '',
  project: '',
};

export default function UserManagement() {
  const [rows, setRows] = useState(mapUsers(mockApiResponse));
  const [searchText, setSearchText] = useState('');

  const [menuAnchor, setMenuAnchor] = useState(null);
  const [selectedRow, setSelectedRow] = useState(null);

  const [openFormDialog, setOpenFormDialog] = useState(false);
  const [operation, setOperation] = useState('Add');
  const [formValues, setFormValues] = useState(emptyForm);

  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

  const filteredRows = useMemo(() => {
    const query = searchText.trim().toLowerCase();
    if (!query) return rows;

    return rows.filter((row) => {
      return (
        row.name.toLowerCase().includes(query) ||
        row.email.toLowerCase().includes(query) ||
        row.role.toLowerCase().includes(query) ||
        row.project.toLowerCase().includes(query)
      );
    });
  }, [rows, searchText]);

  const handleOpenAdd = () => {
    setOperation('Add');
    setFormValues(emptyForm);
    setOpenFormDialog(true);
  };

  const handleOpenEdit = () => {
    if (!selectedRow) return;
    setOperation('Update');
    setFormValues({
      name: selectedRow.name,
      email: selectedRow.email,
      lastLogin: selectedRow.lastLogin,
      createdDate: selectedRow.createdDate,
      role: selectedRow.role,
      msid: selectedRow.msid,
      project: selectedRow.project,
    });
    setOpenFormDialog(true);
    setMenuAnchor(null);
  };

  const handleSaveUser = () => {
    if (operation === 'Add') {
      const newRow = {
        id: Date.now(),
        ...formValues,
      };
      setRows((prev) => [newRow, ...prev]);
    } else {
      setRows((prev) =>
        prev.map((row) =>
          row.id === selectedRow.id ? { ...row, ...formValues } : row
        )
      );
    }
    setOpenFormDialog(false);
  };

  const handleDeleteUser = () => {
    if (!selectedRow) return;
    setRows((prev) => prev.filter((row) => row.id !== selectedRow.id));
    setOpenDeleteDialog(false);
    setMenuAnchor(null);
  };

  const columns = [
    {
      field: 'name',
      headerName: 'Name',
      flex: 1.2,
      minWidth: 180,
    },
    {
      field: 'email',
      headerName: 'Email',
      flex: 1.5,
      minWidth: 220,
    },
    {
      field: 'lastLogin',
      headerName: 'Last Login',
      flex: 1.2,
      minWidth: 180,
    },
    {
      field: 'createdDate',
      headerName: 'Created Date',
      flex: 1.2,
      minWidth: 180,
    },
    {
      field: 'role',
      headerName: 'Role',
      flex: 0.8,
      minWidth: 120,
    },
    {
      field: 'actions',
      headerName: '',
      sortable: false,
      filterable: false,
      width: 70,
      renderCell: (params) => (
        <IconButton
          onClick={(event) => {
            setSelectedRow(params.row);
            setMenuAnchor(event.currentTarget);
          }}
        >
          <MoreVertIcon />
        </IconButton>
      ),
    },
  ];

  return (
    <Box sx={{ backgroundColor: '#fff', minHeight: '100%' }}>
      <Box
        sx={{
          position: 'relative',
          width: '100%',
          height: 180,
          backgroundColor: '#0c1e3f',
          overflow: 'hidden',
        }}
      >
        <Box
          component="img"
          src={userManagementBackground}
          alt="User Management Background"
          sx={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            opacity: 0.95,
          }}
        />
        <Box
          sx={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'rgba(0,0,0,0.25)',
          }}
        >
          <Typography
            sx={{
              color: '#fff',
              fontWeight: 700,
              fontSize: 36,
              textShadow: '0 12px 30px rgba(0, 0, 0, 0.32)',
              letterSpacing: '0.04em',
            }}
          >
            User Management
          </Typography>
        </Box>
      </Box>

      <Container maxWidth="xl" sx={{ py: 3 }}>
        <Stack
          direction={{ xs: 'column', md: 'row' }}
          justifyContent="space-between"
          spacing={2}
          sx={{ mb: 2 }}
        >
          <TextField
            placeholder="Search users..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            sx={{ width: { xs: '100%', md: 360 } }}
          />

          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleOpenAdd}
            sx={{
              backgroundColor: '#5f7fbd',
              color: '#fff',
              textTransform: 'none',
              '&:hover': {
                backgroundColor: '#4a6a9e',
              },
            }}
          >
            Add New User
          </Button>
        </Stack>

        <Paper sx={{ width: '100%', minHeight: 360, overflow: 'hidden' }}>
          <DataGrid
            autoHeight
            rows={filteredRows}
            columns={columns}
            disableRowSelectionOnClick
            pageSizeOptions={[5, 10, 25]}
            initialState={{
              pagination: {
                paginationModel: { pageSize: 5, page: 0 },
              },
            }}
            sx={{
              border: 0,
              '& .MuiDataGrid-columnHeaders': {
                backgroundColor: '#eaf1ff',
                color: '#233857',
                fontWeight: 700,
              },
              '& .MuiDataGrid-row:hover': {
                backgroundColor: 'rgba(95, 127, 189, 0.08)',
              },
              '& .MuiDataGrid-virtualScroller': {
                overflow: 'visible !important',
              },
            }}
          />
        </Paper>
      </Container>

     <Menu
  anchorEl={menuAnchor}
  open={Boolean(menuAnchor)}
  onClose={() => setMenuAnchor(null)}
>
  <MenuItem onClick={handleOpenEdit}>
    <EditOutlinedIcon fontSize="small" sx={{ mr: 1 }} />
    Edit
  </MenuItem>
  <MenuItem
    onClick={() => {
      setOpenDeleteDialog(true);
      setMenuAnchor(null);
    }}
  >
    <DeleteOutlineOutlinedIcon
      fontSize="small"
      sx={{ mr: 1, color: 'error.main' }}
    />
    Delete
  </MenuItem>
</Menu>

      <Dialog
        open={openFormDialog}
        onClose={() => setOpenFormDialog(false)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>{operation} User</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <TextField
              label="Name"
              value={formValues.name}
              onChange={(e) =>
                setFormValues((prev) => ({ ...prev, name: e.target.value }))
              }
              fullWidth
            />
            <TextField
              label="Email"
              value={formValues.email}
              onChange={(e) =>
                setFormValues((prev) => ({ ...prev, email: e.target.value }))
              }
              fullWidth
            />
            <TextField
              label="Last Login"
              value={formValues.lastLogin}
              onChange={(e) =>
                setFormValues((prev) => ({ ...prev, lastLogin: e.target.value }))
              }
              fullWidth
            />
            <TextField
              label="Created Date"
              value={formValues.createdDate}
              onChange={(e) =>
                setFormValues((prev) => ({ ...prev, createdDate: e.target.value }))
              }
              fullWidth
            />
            <TextField
              label="Role"
              value={formValues.role}
              onChange={(e) =>
                setFormValues((prev) => ({ ...prev, role: e.target.value }))
              }
              fullWidth
            />
            <TextField
              label="MS ID"
              value={formValues.msid}
              onChange={(e) =>
                setFormValues((prev) => ({ ...prev, msid: e.target.value }))
              }
              fullWidth
            />
            <TextField
              label="Project"
              value={formValues.project}
              onChange={(e) =>
                setFormValues((prev) => ({ ...prev, project: e.target.value }))
              }
              fullWidth
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenFormDialog(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleSaveUser}>
            Save
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={openDeleteDialog}
        onClose={() => setOpenDeleteDialog(false)}
      >
        <DialogTitle>Confirmation Required!</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to delete?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDeleteDialog(false)}>No</Button>
          <Button color="error" variant="contained" onClick={handleDeleteUser}>
            Yes
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}