import PropTypes from 'prop-types';
// @mui
import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import MenuItem from '@mui/material/MenuItem';
import IconButton from '@mui/material/IconButton';
import Avatar from '@mui/material/Avatar';
// routes
import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hook';
import { RouterLink } from 'src/routes/components';
// hooks
import { useResponsive } from 'src/hooks/use-responsive';
// utils
import { fDate } from 'src/utils/format-time';
import { fShortenNumber } from 'src/utils/format-number';
// components
import Label from 'src/components/label';
import Image from 'src/components/image';
import Iconify from 'src/components/iconify';
import TextMaxLine from 'src/components/text-max-line';
import CustomPopover, { usePopover } from 'src/components/custom-popover';
import { height, width } from '@mui/system';

// ----------------------------------------------------------------------

export default function PostItemHorizontal({ post }) {
  const popover = usePopover();

  const router = useRouter();

  const mdUp = useResponsive('up', 'md');

  const {
    title,
    publish,
    coverUrl,
    createdAt,
    totalViews,
    totalShares,
    totalComments,
    description,
  } = post;

  return (
    <>
      <Card sx={{
        display: 'flex',
        flexDirection: { xs: 'column', md: 'row' },
        minHeight: { md: 240 },
      }}>
        <Box sx={{ flexGrow: 1, p: 3, display: 'flex', flexDirection: 'column' }}>
          <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 1 }}>
            <Label variant="soft" color={publish === 'published' ? 'info' : 'default'}>
              {publish}
            </Label>

            <Box component="span" sx={{ typography: 'caption', color: 'text.disabled' }}>
              {fDate(createdAt)}
            </Box>
          </Stack>

          <Link
            color="inherit"
            component={RouterLink}
            href={paths.dashboard.post.details(title)}
            sx={{ mb: 1 }}
          >
            <TextMaxLine variant="subtitle2" line={2}>
              {title}
            </TextMaxLine>
          </Link>

          <TextMaxLine
            variant="body2"
            line={2}
            sx={{
              color: 'text.secondary',
              height: 40,
              width: 200,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
         
            }}
          >
            {description}
          </TextMaxLine>

          <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mt: 2 }}>
            <IconButton color={popover.open ? 'inherit' : 'default'} onClick={popover.onOpen}>
              <Iconify icon="eva:more-horizontal-fill" />
            </IconButton>

            <Stack
              spacing={2}
              direction="row"
              sx={{ typography: 'caption', color: 'text.disabled' }}
            >
              <Stack direction="row" alignItems="center">
                <Iconify icon="eva:message-circle-fill" width={16} sx={{ mr: 0.5 }} />
                {fShortenNumber(totalComments)}
              </Stack>

              <Stack direction="row" alignItems="center">
                <Iconify icon="solar:eye-bold" width={16} sx={{ mr: 0.5 }} />
                {fShortenNumber(totalViews)}
              </Stack>

              <Stack direction="row" alignItems="center">
                <Iconify icon="solar:share-bold" width={16} sx={{ mr: 0.5 }} />
                {fShortenNumber(totalShares)}
              </Stack>
            </Stack>
          </Stack>
        </Box>

        {mdUp && (
          <Box sx={{ width: 180, height: 240, position: 'relative', flexShrink: 0 }}>
            {/* <Avatar
              alt={title.name}
              src={coverUrl}
              sx={{ position: 'absolute', top: 16, right: 16, zIndex: 9 }}
            /> */}
            <Image alt={title} src={coverUrl} sx={{ height: 1, borderRadius: 1.5 }} />
          </Box>
        )}
      </Card>

      <CustomPopover
        open={popover.open}
        onClose={popover.onClose}
        arrow="bottom-center"
        sx={{ width: 140 }}
      >
        <MenuItem
          onClick={() => {
            popover.onClose();
            router.push(paths.dashboard.post.details(title));
          }}
        >
          <Iconify icon="solar:eye-bold" />
          View
        </MenuItem>

        <MenuItem
          onClick={() => {
            popover.onClose();
            router.push(paths.dashboard.post.edit(title));
          }}
        >
          <Iconify icon="solar:pen-bold" />
          Edit
        </MenuItem>

        <MenuItem
          onClick={() => {
            popover.onClose();
          }}
          sx={{ color: 'error.main' }}
        >
          <Iconify icon="solar:trash-bin-trash-bold" />
          Delete
        </MenuItem>
      </CustomPopover>
    </>
  );
}

PostItemHorizontal.propTypes = {
  post: PropTypes.shape({
    coverUrl: PropTypes.string,
    createdAt: PropTypes.oneOfType([PropTypes.string, PropTypes.instanceOf(Date)]),
    description: PropTypes.string,
    publish: PropTypes.string,
    title: PropTypes.string,
    totalComments: PropTypes.number,
    totalShares: PropTypes.number,
    totalViews: PropTypes.number,
  }),
};
