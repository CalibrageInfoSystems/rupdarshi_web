export const adminLteConf = {
  skin: 'blue',
  // isSidebarLeftCollapsed: false,
  // isSidebarLeftExpandOnOver: false,
  // isSidebarLeftMouseOver: false,
  // isSidebarLeftMini: true,
  // sidebarRightSkin: 'dark',
  // isSidebarRightCollapsed: true,
  // isSidebarRightOverContent: true,
  // layout: 'normal',
  sidebarLeftMenu: [
    {label: 'Security', iconClasses: 'fa fa-cog', children: [
    {label: 'Users', route: '/users', iconClasses: 'fa fa-users',ActivityRight:'CanViewUsers'},
    {label: 'Roles', route: '/roles', iconClasses: 'fa fa-id-badge',ActivityRight:'CanViewRoles'},
    ]},
    {label: 'Masters', iconClasses: 'fa fa-area-chart', children: [
      {label: 'Country', route: '/countries', iconClasses: 'fa fa-globe',ActivityRight:'CanViewMasters'},
      {label: 'City', route: '/cities', iconClasses: 'fa fa-building-o',ActivityRight:'CanViewMasters'},
      {label: 'Location', route: '/locations', iconClasses: 'fa fa-location-arrow',ActivityRight:'CanViewMasters'},
    ]},
    // {label: 'Users', route: '/users', iconClasses: 'fa fa-users',ActivityRight:'CanViewUsers'},
    // {label: 'Roles', route: '/roles', iconClasses: 'fa fa-id-badge',ActivityRight:'CanViewRoles'},
    {label: 'Orders', route: '/orders', iconClasses: 'fa fa-list-alt',ActivityRight:'CanViewOrders'},
    {label: 'Stores', route: '/stores', iconClasses: 'fa fa-archive',ActivityRight:'CanViewStores'},
    {label: 'Assigned Orders', route: '/assigned-orders', iconClasses: 'fa fa-list-alt',ActivityRight:'CanMakeOrderDelivered'},
    {label: 'Products', route: '/products', iconClasses: 'fa fa-outdent',ActivityRight:'CanViewProducts'},
    {label: 'Category', route: '/category', iconClasses: 'fa fa-outdent',ActivityRight:'CanViewProducts'},
    // {label: 'Country', route: '/countries', iconClasses: 'fa fa-globe',ActivityRight:'CanViewMasters'},
    // {label: 'City', route: '/cities', iconClasses: 'fa fa-building-o',ActivityRight:'CanViewMasters'},
    // {label: 'Location', route: '/locations', iconClasses: 'fa fa-location-arrow',ActivityRight:'CanViewMasters'},
  ]
};
