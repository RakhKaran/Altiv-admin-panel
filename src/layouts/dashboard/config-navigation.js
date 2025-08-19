import { useMemo } from 'react';
// routes
import { paths } from 'src/routes/paths';
// locales
import { useLocales } from 'src/locales';
// components
// import Label from 'src/components/label';
// import Iconify from 'src/components/iconify';
import SvgColor from 'src/components/svg-color';


// ----------------------------------------------------------------------

const icon = (name) => (
  <SvgColor src={`/assets/icons/navbar/${name}.svg`} sx={{ width: 1, height: 1 }} />
  // OR
  // <Iconify icon="fluent:mail-24-filled" />
  // https://icon-sets.iconify.design/solar/
  // https://www.streamlinehq.com/icons
);

const ICONS = {
  user: icon('ic_user'),
  analytics: icon('ic_analytics'),
  dashboard: icon('ic_dashboard'),
  mail: icon('ic_mail'),
  subscription: icon('ic_file'),
  product: icon('ic_product'),
  blog:  icon('ic_blog'),
  contact: icon('ic_contact'),
  
};

// ----------------------------------------------------------------------

export function useNavData() {
  const { t } = useLocales();

  const data = useMemo(
    () => [
      // OVERVIEW
      // ----------------------------------------------------------------------
      {
        subheader: t('overview'),
        items: [{ title: t('Dashboard'), path: paths.dashboard.root, icon: ICONS.dashboard }],
      },

      // MANAGEMENT
      // ----------------------------------------------------------------------
      {
        subheader: t('management'),
        items: [
          // USER
          {
            title: t('user'),
            path: paths.dashboard.user.root,
            icon: ICONS.user,
            children: [
              { title: t('list'), path: paths.dashboard.user.list },
              { title: t('create'), path: paths.dashboard.user.new },
            ],
          },
          {
            title: t('Products'),
            path: paths.dashboard.plan.root,
            icon: ICONS.product,
            children: [
              // { title: t('list'), path: paths.dashboard.plan.list },
              {title: t('course list'), path: paths.dashboard.plan.courseList},

               {title: t('service list'), path: paths.dashboard.plan.serviceList},
              { title: t('create'), path: paths.dashboard.plan.new },
            ],
          },
          {
            title: t('Invoices'),
            path: paths.dashboard.subscription.root,
            icon: ICONS.subscription,
            children: [{ title: t('list'), path: paths.dashboard.subscription.list },
            // { title: t('details'), path: paths.dashboard.subscription.details},
         ], },
          {
            title: t('Blogs'),
            path: paths.dashboard.post.root,
            icon: ICONS.blog,
            children: [
              { title: t('list'), path: paths.dashboard.post.list },
              { title: t('create'), path: paths.dashboard.post.new },
            ],
          },

          {
            title: t('Wait List'),
            path: paths.dashboard.email.root,
            icon: ICONS.mail,
            children: [{ title: t('list'), path: paths.dashboard.email.list }],
          },

          {
            title: t('contact'),
            path: paths.dashboard.contact.root,
            icon: ICONS.contact,
            children: [{ title: t('list'), path: paths.dashboard.contact.list }],
          },

          {
            title: t('category'),
            path: paths.dashboard.category.root,
            icon: ICONS.contact,
            children: [{ title: t('list'), path: paths.dashboard.category.list },
                      { title: t('create'), path: paths.dashboard.category.new}
            ],
          },
        ],
      },
    ],
    [t]
  );

  return data;
}
