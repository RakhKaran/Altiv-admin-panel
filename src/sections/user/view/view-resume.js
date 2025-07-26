import PropTypes from 'prop-types';
import {
  Box,
  Dialog,
  Typography,
  DialogTitle,
  DialogContent,
  IconButton,
  Stack,
  Divider,
  Button,
} from '@mui/material';
import Iconify from 'src/components/iconify';
import { useGetResumesByUserId } from 'src/api/user';

export default function UserViewResume({ open, onClose, userId }) {
  const { resumes, resumesLoading } = useGetResumesByUserId(userId);
  const resumeData = resumes?.[0]; // assuming one resume per user

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        Resume Details
        <IconButton
          onClick={onClose}
          sx={{ position: 'absolute', right: 16, top: 16 }}
        >
          <Iconify icon="eva:close-fill" />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers>
        {resumesLoading && <Typography>Loading...</Typography>}

        {!resumesLoading && resumeData && (
          <Stack spacing={2}>
            <Typography variant="subtitle1">
              <strong>File Name:</strong> {resumeData.fileDetails.fileName}
            </Typography>
            <Typography variant="body2">
              <strong>Created At:</strong>{' '}
              {new Date(resumeData.createdAt).toLocaleString()}
            </Typography>
            <Divider />
            <Box textAlign="center">
              <Button
                variant="outlined"
                startIcon={<Iconify icon="mdi:file-pdf-box" />}
                onClick={() =>
                  window.open(resumeData.fileDetails.fileUrl, '_blank')
                }
              >
                View Resume
              </Button>
            </Box>
          </Stack>
        )}

        {!resumesLoading && !resumeData && (
          <Box textAlign="center" py={5}>
            <Iconify icon="mdi:file-remove-outline" width={48} height={48} />
            <Typography>No resume uploaded</Typography>
          </Box>
        )}
      </DialogContent>
    </Dialog>
  );
}

UserViewResume.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func,
  userId: PropTypes.string,
};
