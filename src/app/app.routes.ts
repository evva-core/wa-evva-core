import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/dashboard',
    pathMatch: 'full'
  },
  {
    path: 'dashboard',
    loadComponent: () => import('./features/dashboard/dashboard.component').then(m => m.DashboardComponent),
    title: 'Dashboard - EvvaCore'
  },
  {
    path: 'hosts',
    loadComponent: () => import('./features/hosts/hosts-list/hosts-list.component').then(m => m.HostsListComponent),
    title: 'Hosts - EvvaCore'
  },
  {
    path: 'hosts/add',
    loadComponent: () => import('./features/hosts/host-add/host-add.component').then(m => m.HostAddComponent),
    title: 'Add Host - EvvaCore'
  },
  {
    path: 'hosts/:id',
    loadComponent: () => import('./features/hosts/host-detail/host-detail.component').then(m => m.HostDetailComponent),
    title: 'Host Details - EvvaCore'
  },
  {
    path: 'projects',
    loadComponent: () => import('./features/projects/projects-list/projects-list.component').then(m => m.ProjectsListComponent),
    title: 'Projects - EvvaCore'
  },
  {
    path: 'projects/add',
    loadComponent:() => import('./features/projects/project-add/project-add.component').then(m=>m.ProjectAddComponent),
    title: 'Creating project'
  },
  {
    path: '**',
    redirectTo: '/dashboard'
  }
];

