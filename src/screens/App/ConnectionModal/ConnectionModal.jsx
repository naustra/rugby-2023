import Button from '@mui/material/Button'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import Typography from '@mui/material/Typography'
import { FaGoogle } from 'react-icons/fa'
import { useGoogleLogin } from '../../../hooks/user'
import './ConnectionModal.scss'

const ConnectionModal = () => {
  const authenticateWithGoogle = useGoogleLogin()

  return (
    <>
      <DialogContent className="auth-btns-container">
        <Button
          color="primary"
          onClick={authenticateWithGoogle}
          variant="contained"
        >
          <FaGoogle />
          &nbsp; Connexion avec Google
        </Button>

        <br />
        <Typography gutterBottom>
          En vous connectant, vous déclarez accepter la&nbsp;
          <a
            href="https://github.com/mbernardeau/euro-2021/blob/master/confidentialite.md"
            target="_blank"
            rel="noreferrer"
          >
            politique de confidentialité
          </a>{' '}
          du site.
        </Typography>
      </DialogContent>
    </>
  )
}

ConnectionModal.propTypes = {}

export default ConnectionModal
