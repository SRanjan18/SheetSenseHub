import { useEffect, useMemo, useState } from 'react';
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
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import userManagementBackground from '../../assets/user_management.svg';
import { apiFetch } from '../../reusable/apiClient';
import { useBusiness } from '../../context/businessContext';

const emptyForm = {
  firstName: '',
  lastName: '',
  email: '',
  businessName: '',
  roleCode: 'USER',
};

const formatDate = (value) => {
  if (!value) return '-';
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? '-' : date.toLocaleString();
};

const mapUserRow = (user) => {
  const businessRoles = Array.isArray(user.businessRoles) ? user.businessRoles : [];
  const primaryRole = businessRoles[0] || {};

  return {
    id: user.userUuid,
    userUuid: user.userUuid,
    firstName: user.firstName || '',
    lastName: user.lastName || '',
    name: [user.firstName, user.lastName].filter(Boolean).join(' ') || user.email,
    email: user.email,
    businessRoles,
    businessSummary: businessRoles.map((role) => role.businessName).filter(Boolean).join(', ') || '-',
    roleSummary: businessRoles
      .map((role) => role.roleName || role.roleCode)
      .filter(Boolean)
      .join(', ') || '-',
    businessName: primaryRole.businessName || '',
    roleCode: primaryRole.roleCode || 'USER',
    createdDate: formatDate(user.createdAt),
    updatedDate: formatDate(user.updatedAt),
  };
};

export default function UserManagement() {
  const roleOptions = ['ADMIN', 'ANALYST', 'USER'];
  const { selectedBusiness } = useBusiness();

  const [rows, setRows] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [menuAnchor, setMenuAnchor] = useState(null);
  const [selectedRow, setSelectedRow] = useState(null);
  const [openFormDialog, setOpenFormDialog] = useState(false);
  const [operation, setOperation] = useState('Add');
  const [formValues, setFormValues] = useState(emptyForm);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

  const selectedBusinessQuery = selectedBusiness ? `?business=${encodeURIComponent(selectedBusiness)}` : '';

  const loadData = async () => {
    if (!selectedBusiness) {
      setRows([]);
      setErrorMessage('Please select a business first.');
      return;
    }

    setLoading(true);
    setErrorMessage('');

    try {
      const usersResponse = await apiFetch(`/api/user-management${selectedBusinessQuery}`);
      setRows((usersResponse || []).map(mapUserRow));
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Unable to load users');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedBusiness]);

  const filteredRows = useMemo(() => {
    const query = searchText.trim().toLowerCase();
    if (!query) return rows;

    return rows.filter((row) =>
      [row.name, row.email, row.roleSummary, row.businessSummary]
        .some((value) => String(value || '').toLowerCase().includes(query))
    );
  }, [rows, searchText]);

  const updateFormValue = (field, value) => {
    setFormValues((prev) => ({ ...prev, [field]: value }));
  };

  const handleOpenAdd = () => {
    setOperation('Add');
    setSelectedRow(null);
    setFormValues({
      ...emptyForm,
      businessName: selectedBusiness || '',
      roleCode: roleOptions.includes('USER') ? 'USER' : roleOptions[0],
    });
    setOpenFormDialog(true);
  };

  const handleOpenEdit = () => {
    if (!selectedRow) return;

    setOperation('Update');
    setFormValues({
      firstName: selectedRow.firstName,
      lastName: selectedRow.lastName,
      email: selectedRow.email,
      businessName: selectedRow.businessName || selectedBusiness || '',
      roleCode: roleOptions.includes(selectedRow.roleCode) ? selectedRow.roleCode : roleOptions[0],
    });
    setOpenFormDialog(true);
    setMenuAnchor(null);
  };

  const validateForm = () => {
    if (!formValues.firstName.trim()) return 'First name is required';
    if (!formValues.email.trim()) return 'Email is required';
    if (!formValues.businessName) return 'Business is required';
    if (!formValues.roleCode) return 'Role is required';
    return '';
  };

  const buildRequestBody = () => {
    const selectedBusinessRole = {
      businessName: formValues.businessName,
      roleCode: formValues.roleCode,
    };

    return {
      firstName: formValues.firstName.trim(),
      lastName: formValues.lastName.trim(),
      email: formValues.email.trim(),
      active: true,
      businessRoles: [selectedBusinessRole],
    };
  };

  const handleSaveUser = async () => {
    const validationMessage = validateForm();
    if (validationMessage) {
      setErrorMessage(validationMessage);
      return;
    }

    setLoading(true);
    setErrorMessage('');

    try {
      const body = JSON.stringify(buildRequestBody());
      if (operation === 'Add') {
        await apiFetch(`/api/user-management${selectedBusinessQuery}`, { method: 'POST', body });
      } else {
        await apiFetch(`/api/user-management/${selectedRow.userUuid}${selectedBusinessQuery}`, { method: 'PUT', body });
      }

      setOpenFormDialog(false);
      await loadData();
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Unable to save user');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async () => {
    if (!selectedRow) return;

    setLoading(true);
    setErrorMessage('');

    try {
      await apiFetch(`/api/user-management/${selectedRow.userUuid}${selectedBusinessQuery}`, { method: 'DELETE' });
      setOpenDeleteDialog(false);
      setMenuAnchor(null);
      await loadData();
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Unable to delete user');
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    { field: 'name', headerName: 'Name', flex: 1.2, minWidth: 180 },
    { field: 'email', headerName: 'Email', flex: 1.5, minWidth: 220 },
    { field: 'businessSummary', headerName: 'Business Access', flex: 1.5, minWidth: 220 },
    { field: 'roleSummary', headerName: 'Role', flex: 1, minWidth: 140 },
    { field: 'createdDate', headerName: 'Created Date', flex: 1.2, minWidth: 180 },
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
          background:
            'radial-gradient(circle at 50% 0%, rgba(183, 227, 95, 0.13), transparent 26%), linear-gradient(135deg, #062721 0%, #0b2f2a 48%, #0e3b34 100%)',
          overflow: 'hidden',
        }}
      >
        <Box
          component="img"
          src={userManagementBackground}
          alt="User Management Background"
          sx={{
            position: 'absolute',
            left: '50%',
            top: '50%',
            width: { xs: '88vw', md: 620, lg: 700 },
            maxWidth: 'calc(100% - 80px)',
            height: 'auto',
            transform: 'translate(-50%, -50%)',
            opacity: 0.7,
          }}
        />
        <Box
          sx={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background:
              'linear-gradient(90deg, rgba(6, 39, 33, 0.55) 0%, rgba(6, 39, 33, 0.24) 48%, rgba(6, 39, 33, 0.55) 100%), rgba(0,0,0,0.12)',
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
        <Stack direction={{ xs: 'column', md: 'row' }} justifyContent="space-between" spacing={2} sx={{ mb: 2 }}>
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
            disabled={loading || !selectedBusiness}
            sx={{
              background: 'linear-gradient(135deg, #00856f 0%, #006c5b 100%)',
              border: '1px solid rgba(183, 227, 95, 0.42)',
              boxShadow: '0 10px 24px rgba(0, 133, 111, 0.18)',
              color: '#fff',
              textTransform: 'none',
              '&:hover': {
                background: 'linear-gradient(135deg, #006c5b 0%, #0b2f2a 100%)',
                boxShadow: '0 12px 28px rgba(0, 108, 91, 0.24)',
              },
            }}
          >
            Add New User
          </Button>
        </Stack>

        {errorMessage && (
          <Typography color="error" sx={{ mb: 2 }}>
            {errorMessage}
          </Typography>
        )}

        <Paper
          sx={{
            width: '100%',
            minHeight: 360,
            overflow: 'hidden',
            border: '1px solid rgba(0, 133, 111, 0.14)',
            borderTop: '4px solid #b7e35f',
            boxShadow: '0 18px 45px rgba(14, 59, 52, 0.08)',
          }}
        >
          <DataGrid
            autoHeight
            rows={filteredRows}
            columns={columns}
            loading={loading}
            disableRowSelectionOnClick
            pageSizeOptions={[5, 10, 25]}
            initialState={{ pagination: { paginationModel: { pageSize: 5, page: 0 } } }}
            sx={{
              border: 0,
              '& .MuiDataGrid-columnHeaders': {
                backgroundColor: '#e7f9f1',
                color: '#17211d',
                fontWeight: 700,
                borderBottom: '1px solid rgba(0, 133, 111, 0.24)',
              },
              '& .MuiDataGrid-row:hover': {
                backgroundColor: 'rgba(0, 133, 111, 0.08)',
              },
              '& .MuiDataGrid-virtualScroller': {
                overflow: 'visible !important',
              },
            }}
          />
        </Paper>
      </Container>

      <Menu anchorEl={menuAnchor} open={Boolean(menuAnchor)} onClose={() => setMenuAnchor(null)}>
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
          <DeleteOutlineOutlinedIcon fontSize="small" sx={{ mr: 1, color: 'error.main' }} />
          Delete
        </MenuItem>
      </Menu>

      <Dialog open={openFormDialog} onClose={() => setOpenFormDialog(false)} fullWidth maxWidth="sm">
        <DialogTitle>{operation} User Access</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <TextField
              label="First Name"
              value={formValues.firstName}
              onChange={(e) => updateFormValue('firstName', e.target.value)}
              fullWidth
              required
            />
            <TextField
              label="Last Name"
              value={formValues.lastName}
              onChange={(e) => updateFormValue('lastName', e.target.value)}
              fullWidth
            />
            <TextField
              label="Email"
              value={formValues.email}
              onChange={(e) => updateFormValue('email', e.target.value)}
              fullWidth
              required
            />
            <TextField
              label="Business"
              value={formValues.businessName}
              fullWidth
              required
              disabled
              helperText="User access will be managed only for the currently selected business."
            />
            <TextField
              select
              label="Role"
              value={formValues.roleCode}
              onChange={(e) => updateFormValue('roleCode', e.target.value)}
              fullWidth
              required
            >
              {roleOptions.map((role) => (
                <MenuItem key={role} value={role}>
                  {role}
                </MenuItem>
              ))}
            </TextField>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenFormDialog(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleSaveUser} disabled={loading}>
            Save
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={openDeleteDialog} onClose={() => setOpenDeleteDialog(false)}>
        <DialogTitle>Confirmation Required!</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete {selectedRow?.name || 'this user'}?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDeleteDialog(false)}>No</Button>
          <Button color="error" variant="contained" onClick={handleDeleteUser} disabled={loading}>
            Yes
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
