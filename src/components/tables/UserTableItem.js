import { useState } from 'react'
import { Avatar, IconButton, Stack, Typography } from "@mui/material";
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import TableRow from '@mui/material/TableRow';
import { styled } from '@mui/material/styles';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';

import { UserDeleteModal } from "../modals/UserDeleteModal";
import { UserEditModal } from "../modals/UserEditModal";

export function UserTableItem(props) {
  const [isDeleteOpen, setDeleteOpen] = useState(false)
  const handleDeleteOpen = () => setDeleteOpen(true)
  const handleDeleteClose = () => setDeleteOpen(false)

  const [isEditOpen, setEditOpen] = useState(false)
  const handleEditOpen = () => setEditOpen(true)
  const handleEditClose = () => setEditOpen(false)

  const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
      backgroundColor: theme.palette.common.black,
      color: theme.palette.common.white,
    },
    [`&.${tableCellClasses.body}`]: {
      fontSize: 14,
    },
  }));

  const StyledTableRow = styled(TableRow)(({ theme }) => ({
    '&:nth-of-type(odd)': {
      backgroundColor: theme.palette.action.hover,
    },
    // hide last border
    '&:last-child td, &:last-child th': {
      border: 0,
    },
  }));

  return (
    <>
      <StyledTableRow key={props.user.name}>
        <StyledTableCell align="left" width={'50px'}>
          <Avatar>{props.user.name.charAt(0)}</Avatar>
        </StyledTableCell>
        <StyledTableCell component="th" scope="row">
          <Stack direction={'column'} alignItems={'left'} spacing={'none'} maxWidth={100}>
            <Typography variant="h6">{props.user.name}</Typography>
            <Typography variant="caption">User ID: {props.user.id}</Typography>
          </Stack>
        </StyledTableCell>
        <StyledTableCell>{props.user.email}</StyledTableCell>
        <StyledTableCell align="right">
          <IconButton onClick={handleEditOpen}><EditIcon /></IconButton>
          <IconButton onClick={handleDeleteOpen}><DeleteIcon /></IconButton>
        </StyledTableCell>
      </StyledTableRow>

      <UserDeleteModal user={props.user} onPushUpdate={props.onPushUpdate} open={isDeleteOpen} onClose={handleDeleteClose} />
      <UserEditModal user={props.user} onPushUpdate={props.onPushUpdate} open={isEditOpen} onClose={handleEditClose} />
    </>
  )
}