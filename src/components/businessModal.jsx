import {
  Dialog,
  DialogContent,
  FormControlLabel,
  Radio,
  RadioGroup,
  Typography,
  Box,
} from '@mui/material';
import './businessModal.css';

export default function businessModal({
  isOpen,
  businesses,
  selectedBusiness,
  onSelect,
}) {
  return (
    <Dialog
      open={isOpen}
      fullWidth
      maxWidth="sm"
      disableEscapeKeyDown
      PaperProps={{
        className: 'usecase-dialog-paper',
      }}
      slotProps={{
        backdrop: {
          className: 'usecase-dialog-backdrop',
        },
      }}
    >
      <DialogContent className="usecase-dialog-content">
        <Typography variant="h3" component="h2" className="usecase-dialog-title">
          Select Business
        </Typography>

        <RadioGroup
          name="business"
          value={selectedBusiness}
          className="usecase-dialog-list"
        >
          {businesses.map((business) => (
            <Box key={business} className="usecase-dialog-option">
              <FormControlLabel
                value={business}
                control={
                  <Radio
                    onChange={() => onSelect(business)}
                    sx={{
                      color: '#8a8a8a',
                      '&.Mui-checked': {
                        color: '#163d95',
                      },
                    }}
                  />
                }
                label={business}
                className="usecase-dialog-label"
              />
            </Box>
          ))}
        </RadioGroup>
      </DialogContent>
    </Dialog>
  );
}