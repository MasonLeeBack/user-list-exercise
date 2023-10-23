import {
  Box,
  CircularProgress
} from '@mui/material'

export function ModalLoadingOverlay(props) {
  return (
    <Box sx={{
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      width: '100%',
      height: '100%',
      bgcolor: 'rgba(0, 0, 0, 0.5)',
      borderRadius: '8px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1
    }}>
      <CircularProgress />
    </Box>
  )
}