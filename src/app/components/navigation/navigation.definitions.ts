import { MenuItem } from 'primeng/api';

export const navigationItems: MenuItem[] = [
  {
    label: 'Product Models',
    icon: 'icon ion-md-cube',
    routerLink: '/models'
  },
  {
    label: 'Catalogs',
    icon: 'icon ion-md-filing',
    routerLink: '/catalogs'
  },
  {
    label: 'Templates',
    icon: 'icon ion-md-today',
    routerLink: '/templates'
  },
  {
    label: 'Flow Debug',
    icon: 'icon ion-md-bug',
    routerLink: '/flow/debug'
  }
];
