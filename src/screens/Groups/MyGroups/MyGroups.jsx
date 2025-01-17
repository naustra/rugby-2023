import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Typography from '@mui/material/Typography'
import isEmpty from 'lodash/isEmpty'
import map from 'lodash/map'
import { useGroupsForUser } from '../../../hooks/groups'
import GroupRow from './GroupRow'
import './MyGroups.scss'

const MyGroups = () => {
  const groups = useGroupsForUser()

  if (isEmpty(groups)) return null

  return (
    <Card className="my-groups-card">
      <Typography gutterBottom variant="h1">
        Mes tribus
      </Typography>

      <CardContent className="my-groups-card-content">
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Nom de la tribu</TableCell>
              <TableCell>Créateur</TableCell>
              <TableCell>Membres</TableCell>
              <TableCell>Statut</TableCell>
              <TableCell>Code</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {map(groups, (groupSnapshot, key) => (
              <GroupRow group={groupSnapshot.data()} key={groupSnapshot.id} />
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}

MyGroups.propTypes = {}

export default MyGroups
