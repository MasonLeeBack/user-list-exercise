import {
  Modal,
  Button,
  Box,
  Typography,
  CircularProgress,
  TextField,
  Divider,
  Grid,
  Alert
} from '@mui/material';

import { useFormik } from 'formik'
import * as yup from 'yup'
import { useEffect, useState } from 'react';
import { ModalLoadingOverlay } from '../overlays/LoadingOverlay'

export function UserEditModal(props) {
  const [isLoading, setLoading] = useState(true)
  const [nestedRecordExists, setNestedRecordExists] = useState(true)
  const [isSubmitting, setSubmitting] = useState(false)
  const [errors, setErrors] = useState('')

  const getUserAddress = async () => {
    try {
      setLoading(true);
      const response = await fetch(config.backendUrl + "/user/" + props.user.id + "/address")
      if (!response.ok && response.status === 404) {
        setNestedRecordExists(false);
      }

      const data = await response.json();

      formik.setValues({
        name: props.user.name,
        email: props.user.email,
        line_1: data.line_1,
        line_2: data.line_2,
        city: data.city,
        state: data.state,
        zip: data.zip,
      });

    } catch (e) {
      console.error('Error while acquiring address info:', e)
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (props.open) {
      getUserAddress();
    }
  }, [props.open])

  const validationSchema = yup.object({
    name: yup
      .string()
      .required('Name is required'),
    email: yup
      .string()
      .email("Invalid email address")
      .required('Email is required'),
    line_1: yup
      .string()
      .required('Address is required'),
    line_2: yup
      .string(),
    city: yup
      .string()
      .required('City is required'),
    state: yup
      .string()
      .required('State is required'),
    zip: yup
      .string()
      .required('Zip code is required')
  });

  const formik = useFormik({
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      try {
        // Get rid of any errors (if applicable)
        setErrors('')

        setSubmitting(true)

        // Send the user information first
        await fetch(process.env.REACT_APP_BACKEND_URL + "/user/" + props.user.id, {
          method: 'PUT',
          headers: {
            'content-type': 'application/json'
          },
          body: JSON.stringify({
            id: props.user.id,
            name: values.name,
            email: values.email
          })
        })

        // Then send the address information (This can error out if the
        // nested record doesn't exist
        if (nestedRecordExists) {
          await fetch(process.env.REACT_APP_BACKEND_URL + "/address/" + props.user.id, {
            method: 'PUT',
            headers: {
              'content-type': 'application/json'
            },
            body: JSON.stringify({
              id: props.user.id,
              line_1: values.line_1,
              line_2: values.line_2,
              city: values.city,
              state: values.state,
              zip: values.zip
            })
          })
        } else {
          await fetch(config.backendUrl + "/address", {
            method: 'POST',
            headers: {
              'content-type': 'application/json'
            },
            body: JSON.stringify({
              id: props.user.id,
              line_1: values.line_1,
              line_2: values.line_2,
              city: values.city,
              state: values.state,
              zip: values.zip
            })
          })
        }


        // Update main user list, and close modal
        if (props.onPushUpdate) {
          props.onPushUpdate()
        }

        props.onClose()

      } catch (e) {
        console.error('Error during form submission: ', e)
        setErrors('Failed to edit user. Please try again later.')
      } finally {
        setSubmitting(false)
      }
    }
  })

  return (
    <Modal open={props.open} onClose={props.onClose}>
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          maxWidth: 600,
          bgcolor: 'background.paper',
          borderRadius: '8px',
          boxShadow: 24,
          p: 4
        }}
      >
        {props.user && props.user.name && !isLoading ? (
          <>
            {isSubmitting && <ModalLoadingOverlay />}

            <Typography variant="h6" mb={2}>
              Edit {props.user.name}
            </Typography>

            {errors && <Alert severity="error" sx={{ mb: 2 }}>{errors}</Alert>}

            <form onSubmit={formik.handleSubmit}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    variant="standard"
                    required={true}
                    id="name"
                    name="name"
                    label="Name"
                    value={formik.values.name}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.name && Boolean(formik.errors.name)}
                    helperText={formik.touched.name && formik.errors.name}
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    variant="standard"
                    required={true}
                    id="email"
                    name="email"
                    label="E-Mail Address"
                    value={formik.values.email}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.email && Boolean(formik.errors.email)}
                    helperText={formik.touched.email && formik.errors.email}
                    fullWidth
                  />
                </Grid>
              </Grid>

              <Divider sx={{ mt: 2, mb: 2 }} />

              <Grid container spacing={2}>
                <Grid item xs={24} sm={6}>
                  <TextField
                    variant="standard"
                    required={true}
                    id="line_1"
                    name="line_1"
                    label="Address Line 1"
                    value={formik.values.line_1}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.line_1 && Boolean(formik.errors.line_1)}
                    helperText={formik.touched.line_1 && formik.errors.line_1}
                    fullWidth
                  />
                </Grid>
                <Grid item xs={24} sm={6}>
                  <TextField
                    variant="standard"
                    id="line_2"
                    name="line_2"
                    label="Address Line 2"
                    value={formik.values.line_2}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    fullWidth
                  />
                </Grid>
                <Grid item xs={24} sm={6}>
                  <TextField
                    variant="standard"
                    required={true}
                    id="city"
                    name="city"
                    label="City"
                    value={formik.values.city}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.city && Boolean(formik.errors.city)}
                    helperText={formik.touched.city && formik.errors.city}
                    fullWidth
                  />
                </Grid>
                <Grid item xs={24} sm={6}>
                  <TextField
                    variant="standard"
                    required={true}
                    id="state"
                    name="state"
                    label="State"
                    value={formik.values.state}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.state && Boolean(formik.errors.state)}
                    helperText={formik.touched.state && formik.errors.state}
                    fullWidth
                  />
                </Grid>
                <Grid item xs={24} sm={6}>
                  <TextField
                    variant="standard"
                    required={true}
                    id="zip"
                    name="zip"
                    label="Zip code"
                    value={formik.values.zip}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.zip && Boolean(formik.errors.zip)}
                    helperText={formik.touched.zip && formik.errors.zip}
                    fullWidth
                  />
                </Grid>
              </Grid>

              <Divider sx={{ mt: 2, mb: 2 }} />

              <Button variant="contained" type='submit'>Save Changes</Button>
              <Button sx={{ ml: '10px' }} variant="text" onClick={props.onClose}>Cancel</Button>
            </form>
          </>
        ) : <CircularProgress />}
      </Box>
    </Modal>
  )
}