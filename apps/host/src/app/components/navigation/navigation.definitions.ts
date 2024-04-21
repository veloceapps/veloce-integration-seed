import { MenuItem } from 'primeng/api';

export const navigationItems: MenuItem[] = [
  {
    label: 'Configuration UI',
    icon: 'vl-icon vl-icon-product-model',
    routerLink: '/configuration-ui',
  },
  {
    label: 'Catalogs',
    icon: 'vl-icon vl-icon-catalog',
    routerLink: '/catalogs',
  },
  // {
  //   label: 'Templates',
  //   icon: 'vl-icon vl-icon-template',
  //   routerLink: '/templates',
  // },
  {
    label: 'Flow debug',
    icon: 'vl-icon vl-icon-debug',
    routerLink: '/flow/debug',
  },
];
