import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Tooltip from '@mui/material/Tooltip';
//
import { fileData, fileFormat, fileThumb } from './utils';
import DownloadButton from './download-button';

// ----------------------------------------------------------------------

export default function FileThumbnail({ file, tooltip, imageView, sx, imgSx }) {
  const { name = '', path = '', preview = '' } = fileData(file);
  const format = fileFormat(path || preview);

 const downloadFile = () => {
  window.open(preview, '_blank');
    window.href = preview;
    window.download = name;
    document.body.appendChild(window);
    window.click();
    document.body.removeChild(window);
  };

  const renderContent =
    format === 'image' && imageView ? (
      <Box
        component="img"
        src={preview}
        sx={{
          width: 1,
          height: 1,
          flexShrink: 0,
          objectFit: 'cover',
          ...imgSx,
        }}
      />
    ) : (
      <Box
        component="img"
        src={fileThumb(format)}
        sx={{
          width: 32,
          height: 32,
          flexShrink: 0,
          ...sx,
        }}
      />
    );

  if (tooltip) {
    return (
      <Tooltip title={name}>
        <Stack
          flexShrink={0}
          component="span"
          alignItems="center"
          justifyContent="center"
          sx={{
            width: 'fit-content',
            height: 'inherit',
          }}
        >
          {renderContent}
          <DownloadButton onDownload={downloadFile} />
        </Stack>
      </Tooltip>
    );
  }

  return (
    <>
      {renderContent}
      <DownloadButton onDownload={downloadFile} />
    </>
  );
}

FileThumbnail.propTypes = {
  file: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  imageView: PropTypes.bool,
  imgSx: PropTypes.object,
  sx: PropTypes.object,
  tooltip: PropTypes.bool,
};
