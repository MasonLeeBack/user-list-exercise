import { useEffect, useState } from 'react';

import {
  Box,
  Typography,
  IconButton,
  TextField,
  Alert,
  TableContainer,
  Paper,
  Table,
  TableBody,
  TablePagination
} from '@mui/material'
import AddIcon from '@mui/icons-material/Add'

import { UserTableItem } from '../components/tables/UserTableItem';
import { UserAddModal } from '../components/modals/UserAddModal';
import { ModalLoadingOverlay } from '../components/overlays/LoadingOverlay';

export function UserList(props) {
  const [isLoading, setLoading] = useState(false)
  const [errors, setErrors] = useState('')

  const [isAddOpen, setAddOpen] = useState(false)
  const handleAddOpen = () => setAddOpen(true)
  const handleAddClose = () => setAddOpen(false)

  // Primitive search
  const [userData, setUserData] = useState([])
  const [searchData, setSearchData] = useState([])

  const requestSearch = (searchValue) => {
    setSearchData(userData.filter((item) => item.name.toLowerCase().includes(searchValue.toLowerCase())
      || item.email.toLowerCase().includes(searchValue.toLowerCase())))
  }

  // Page change
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(10)

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const getUserData = async () => {
    try {
      setUserData([])
      setLoading(true)

      const response = await fetch(process.env.REACT_APP_BACKEND_URL + '/user')
      const data = await response.json()

      setUserData(data);
    } catch (e) {
      console.error('Failure acquiring user data: ', e)
      setErrors('Failed to get users. Please try again later.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    getUserData()
  }, [])

  return (
    <>
      <Box
        display={'flex'}
        justifyContent={'center'}
        alignItems={'center'}
        mt={5}
        flexDirection={'row'}
      >
        <Box maxWidth={700} width={'100%'} padding={2}>
          <Box display={'flex'} justifyContent={'space-between'} mb={2} alignItems={'center'}>
            <Typography variant='h4'>
              Users
            </Typography>
            <IconButton style={{ marginLeft: 'auto', marginRight: '20px' }} onClick={handleAddOpen}>
              <AddIcon />
            </IconButton>
            <TextField
              id='search-box'
              label='Search'
              variant='filled'
              onInput={(e) => requestSearch(e.target.value)}
            />
          </Box>

          {errors && <Alert severity='error'>{errors}</Alert>}

          {isLoading && <ModalLoadingOverlay/>}

          <TableContainer component={Paper} sx={{ maxWidth: 700 }}>
            <Table>
              <TableBody>
                {(searchData.length > 0 ? searchData : userData).slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((user) => (
                  <UserTableItem key={user.id} user={user} onPushUpdate={getUserData} />
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[10, 25, 100]}
            component="div"
            count={searchData.length > 0 ? searchData.length : userData.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Box>

      </Box>

      <UserAddModal open={isAddOpen} onPushUpdate={getUserData} onClose={handleAddClose} />
    </>
  )
}