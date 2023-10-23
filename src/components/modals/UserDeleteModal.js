import { useState } from 'react';
import {
  Modal,
  Button,
  Box,
  Typography
} from '@mui/material'
import { ModalLoadingOverlay } from '../overlays/LoadingOverlay';

export function UserDeleteModal(props) {
  const [isLoading, setLoading] = useState(false)

  const onUserDelete = async () => {
    try {
      setLoading(true)
      await fetch(process.env.REACT_APP_BACKEND_URL + '/user/' + props.user.id + '/address',
        {
          method: "DELETE",
        })

      await fetch(process.env.REACT_APP_BACKEND_URL + '/user/' + props.user.id,
        {
          method: "DELETE",
        })

      if (props.onPushUpdate) {
        props.onPushUpdate()
      }

      props.onClose()
    } catch (e) {
      console.error('Failure while deleting user info:', e);
    } finally {
      setLoading(false)
    }
  }

  return (
    <Modal open={props.open} onClose={props.onClose}>
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 400,
          bgcolor: 'background.paper',
          borderRadius: '8px',
          boxShadow: 24,
          p: 4
        }}
      >
        {isLoading && <ModalLoadingOverlay />}

        <Typography variant="h6" gutterBottom>
          Delete {props.user.name}
        </Typography>
        <Typography variant="body2" color="text.secondary" mb={2}>
          Are you sure you want to delete {props.user.name}? This action cannot be undone.
        </Typography>
        <Button variant="contained" color="error" onClick={onUserDelete}>Delete</Button>
        <Button sx={{ ml: '10px' }} variant="text" onClick={props.onClose}>Cancel</Button>
      </Box>
    </Modal>
  );
}