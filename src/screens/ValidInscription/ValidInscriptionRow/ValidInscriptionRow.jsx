import PropTypes from 'prop-types'

import TableCell from '@mui/material/TableCell'
import TableRow from '@mui/material/TableRow'
import Button from '@mui/material/Button'
import { useValidApply } from '../../../hooks/groups'

const ValidInscriptionRow = ({
  user: { displayName, email, uid },
  group: { name },
  groupId,
}) => {
  const validApply = useValidApply(groupId, uid)
  return (
    <TableRow>
      <TableCell>
        <b>{name}</b>
      </TableCell>
      <TableCell>{displayName}</TableCell>
      <TableCell>{email}</TableCell>
      <TableCell>
        <Button variant="contained" color="primary" onClick={validApply}>
          Valider
        </Button>
      </TableCell>
    </TableRow>
  )
}

ValidInscriptionRow.propTypes = {
  user: PropTypes.shape({
    displayName: PropTypes.string.isRequired,
    email: PropTypes.string.isRequired,
    uid: PropTypes.string.isRequired,
  }),
  group: PropTypes.shape({
    name: PropTypes.string.isRequired,
  }),
  groupId: PropTypes.string.isRequired,
}

export default ValidInscriptionRow
