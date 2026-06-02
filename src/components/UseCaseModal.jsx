import {
  Dialog,
  DialogContent,
  FormControlLabel,
  Radio,
  RadioGroup,
  Typography,
  Box,
} from '@mui/material';
import './UseCaseModal.css';

export default function UseCaseModal({
  isOpen,
  useCases,
  selectedUseCase,
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
          Select UseCase
        </Typography>

        <RadioGroup
          name="usecase"
          value={selectedUseCase}
          className="usecase-dialog-list"
        >
          {useCases.map((useCase) => (
            <Box key={useCase} className="usecase-dialog-option">
              <FormControlLabel
                value={useCase}
                control={
                  <Radio
                    onChange={() => onSelect(useCase)}
                    sx={{
                      color: '#8a8a8a',
                      '&.Mui-checked': {
                        color: '#163d95',
                      },
                    }}
                  />
                }
                label={useCase}
                className="usecase-dialog-label"
              />
            </Box>
          ))}
        </RadioGroup>
      </DialogContent>
    </Dialog>
  );
}