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
  mail : icon('ic_mail'),
  subscription: icon('ic_file')
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
        items: [
          // { title: t('app'), path: paths.dashboard.root, icon: ICONS.dashboard },
          // { title: t('ecommerce'), path: paths.dashboard.general.ecommerce, icon: ICONS.ecommerce },
          { title: t('analytics'), path: paths.dashboard.general.analytics, icon: ICONS.analytics },
          // { title: t('banking'), path: paths.dashboard.general.banking, icon: ICONS.banking },
          // { title: t('booking'), path: paths.dashboard.general.booking, icon: ICONS.booking },
          // { title: t('file'), path: paths.dashboard.general.file, icon: ICONS.file },
        ],
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
              // { title: t('profile'), path: paths.dashboard.user.root },
              // { title: t('cards'), path: paths.dashboard.user.cards },
              { title: t('list'), path: paths.dashboard.user.list },
              { title: t('create'), path: paths.dashboard.user.new },
              // { title: t('edit'), path: paths.dashboard.user.demo.edit },
              // { title: t('account'), path: paths.dashboard.user.account },
            ],
          },
            {
            title: t('Plans'),
            path: paths.dashboard.user.root,
            icon: ICONS.user,
            children: [
              // { title: t('profile'), path: paths.dashboard.user.root },
              // { title: t('cards'), path: paths.dashboard.user.cards },
              { title: t('list'), path: paths.dashboard.plan.list },
              { title: t('create'), path: paths.dashboard.plan.new },
              // { title: t('edit'), path: paths.dashboard.user.demo.edit },
              //  { title: t('account'), path: paths.dashboard.user.account },
            ],
          },

           {
            title: t('Subscriptions'),
            path: paths.dashboard.subscription.root,
            icon: ICONS.subscription,
            children: [
              // { title: t('profile'), path: paths.dashboard.user.root },
              // { title: t('cards'), path: paths.dashboard.user.cards },
              { title: t('list'), path: paths.dashboard.subscription.list },
              // { title: t('create'), path: paths.dashboard.plan.new },
              // { title: t('edit'), path: paths.dashboard.user.demo.edit },
              //  { title: t('account'), path: paths.dashboard.user.account },
            ],
          },

          {
            title: t('Wait List'),
            path: paths.dashboard.email.root,
            icon: ICONS.mail,
            children: [
              // { title: t('profile'), path: paths.dashboard.user.root },
              // { title: t('cards'), path: paths.dashboard.user.cards },
              { title: t('list'), path: paths.dashboard.email.list },
              // { title: t('create'), path: paths.dashboard.plan.new },
              // { title: t('edit'), path: paths.dashboard.user.demo.edit },
              //  { title: t('account'), path: paths.dashboard.user.account },
            ],
          },

           {
            title: t('contact'),
            path: paths.dashboard.contact.root,
            icon: ICONS.user,
            children: [
              // { title: t('profile'), path: paths.dashboard.user.root },
              // { title: t('cards'), path: paths.dashboard.user.cards },
              { title: t('list'), path: paths.dashboard.contact.list },
              // { title: t('create'), path: paths.dashboard.plan.new },
              // { title: t('edit'), path: paths.dashboard.user.demo.edit },
              //  { title: t('account'), path: paths.dashboard.user.account },
            ],
          },

        ],
      },
    ],
    [t]
  );

  return data;
}
