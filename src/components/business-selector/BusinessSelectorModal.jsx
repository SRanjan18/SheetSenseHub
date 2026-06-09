import {
  Dialog,
  DialogContent,
  FormControlLabel,
  Radio,
  RadioGroup,
  Typography,
  Box,
} from '@mui/material';
import './BusinessSelectorModal.css';

export default function BusinessSelectorModal({
  isOpen,
  businesses,
  onSelect,
}) {
  return (
    <Dialog
      open={isOpen}
      fullWidth
      maxWidth="sm"
      slotProps={{
        paper: {
          className: 'usecase-dialog-paper',
        },
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
          value=""
          className="usecase-dialog-list"
          onChange={(_, business) => onSelect(business)}
        >
          {businesses.map((business) => (
            <Box
              key={business}
              className="usecase-dialog-option"
              onClick={() => onSelect(business)}
            >
              <FormControlLabel
                value={business}
                control={
                  <Radio
                    sx={{
                      color: '#8a8a8a',
                      '&.Mui-checked': {
                        color: '#00856f',
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
