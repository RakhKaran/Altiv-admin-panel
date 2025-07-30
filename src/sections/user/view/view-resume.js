import PropTypes from 'prop-types';
import { MultiFilePreview } from 'src/components/upload';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from '@mui/material';
import { useGetResumesByUserId } from 'src/api/resume';

export default function UserViewResume({ open, onClose, userId }) {
  const { resume, resumeLoading } = useGetResumesByUserId(userId);
  
 const fileData = resume?.length > 0 
    ? resume.map((res) => res.fileDetails)
    : [];


  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle>User Resume</DialogTitle>

      <DialogContent dividers>
        {(!resumeLoading && fileData.length > 0) ?  (
          <MultiFilePreview
            thumbnail
            files={fileData}
            onRemove={null}
          />
        ) : (
          <p>No Resume Found</p>
        )}
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} variant="contained" >
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
}

UserViewResume.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func,
  userId: PropTypes.string,
};
