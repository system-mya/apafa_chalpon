interface NavAttributes {
  [propName: string]: any;
}
interface NavWrapper {
  attributes: NavAttributes;
  element: string;
}
interface NavBadge {
  text: string;
  variant: string;
}
interface NavLabel {
  class?: string;
  variant: string;
}

export interface NavData {
  name?: string;
  url?: string;
  icon?: string;
  badge?: NavBadge;
  title?: boolean;
  children?: NavData[];
  variant?: string;
  attributes?: NavAttributes;
  divider?: boolean;
  class?: string;
  label?: NavLabel;
  wrapper?: NavWrapper;
}

export const navAD: NavData[] = [
  {
    name: 'Menu',
    url: '/dashboard',
    icon: 'icon-speedometer'
  },
  {
    title: true,
    name: 'Opciones'
  },  
  {
    divider: true
  },
  {
    name: 'Apafa',
    url: '/apafa',
    icon: 'icon-people',
    children: [
      {
        name: 'Alumnos',
        url: '/apafa/alumnos',
        icon: 'fa fa-group'
      },
      {
        name: 'Apoderado',
        url: '/apafa/apoderado',
        icon: 'fa fa-user-circle'
      },
      {
        name: 'Matricula',
        url: '/apafa/matricula',
        icon: 'fa fa-vcard-o'
      },
      {
        name: 'Forms',
        url: '/apafa/forms',
        icon: 'icon-puzzle'
      }
    ]
  },  
  {
    divider: true
  },    
  {
    divider: true
  },
  {
    name: 'Tesoreria',
    url: '/tesoreria',
    icon: 'icon-screen-tablet',
    children: [
      {
        name: 'Ingresos',
        url: '/tesoreria/ingresos',
        icon: 'cui-note'
      },
      {
        name: 'Compras',
        url: '/tesoreria/badges',
        icon: 'icon-basket'
      },
      {
        name: 'Reuniones',
        url: '/tesoreria/modals',
        icon: 'fa fa-bell-o'
      },
      
      {
        name: 'Conceptos',
        url: '/tesoreria/modals',
        icon: 'cui-bookmark'
      }
    ]
  },  
  {
    divider: true
  },  
  {
    divider: true
  },
  {
    name: 'Administracion',
    url: '/administracion',
    icon: 'icon-settings',
    children: [
      {
        name: 'Usuarios',
        url: '/administracion/usuarios',
        icon: 'icon-user'
      },
      {
        name: 'Años Lectivos',
        url: '/administracion/anhios',
        icon: 'icon-calendar'
      },
      {
        name: 'Grados y Secciones',
        url: '/administracion/grado_seccion',
        icon: 'icon-grid'
        
      }
    ]
  },  
  {
    divider: true
  },  
  {
    divider: true
  },
  {
    name: 'Reportes',
    url: '/icons',
    icon: 'fa fa-file-text-o',
    children: [
      {
        name: 'CoreUI Icons',
        url: '/icons/coreui-icons',
        icon: 'icon-star',
        badge: {
          variant: 'success',
          text: 'NEW'
        }
      },
      {
        name: 'Flags',
        url: '/icons/flags',
        icon: 'icon-star'
      },
      {
        name: 'Font Awesome',
        url: '/icons/font-awesome',
        icon: 'icon-star',
        badge: {
          variant: 'secondary',
          text: '4.7'
        }
      },
      {
        name: 'Simple Line Icons',
        url: '/icons/simple-line-icons',
        icon: 'icon-star'
      }
    ]
  }
];


export const navSE: NavData[] = [
  {
    name: 'Menu',
    url: '/dashboard',
    icon: 'icon-speedometer'
  },
  {
    title: true,
    name: 'Theme'
  },
  {
    name: 'Colors',
    url: '/theme/colors',
    icon: 'icon-drop'
  },
  {
    name: 'Typography',
    url: '/theme/typography',
    icon: 'icon-pencil'
  }
];