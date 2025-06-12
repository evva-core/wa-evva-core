import { Component, Input, OnInit, HostListener, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

interface MenuItem {
  label: string;
  icon: string;
  route?: string;
  children?: MenuItem[];
  expanded?: boolean;
  badge?: string | number;
}

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {
  @Input() isCollapsed = false;
  @Input() isOpen = true;
  @Output() sidebarClose = new EventEmitter<void>();

  isMobile = false;

  emojiList: Array<string> = [
    '🌍', '🔥', '🌡️', '🌟', '🖥️',
  '🙈', '🙉', '🙊', '🐲', '🐍',
  '🐸', '🐦‍🔥', '🪽', '🔮', '🎱',
  '🎮', '🕹️', '🎲', '🎰', '🎀'
];

  menuItems: MenuItem[] = [
    {
      label: 'Dashboard',
      icon: 'home',
      route: '/dashboard'
    },
    {
      label: 'Host Management',
      icon: 'server',
      badge: '6',
      children: [
        { label: 'All Hosts', icon: 'list', route: '/hosts' },
        { label: 'Add Host', icon: 'plus', route: '/hosts/add' },
        { label: 'Host Groups', icon: 'folder', route: '/hosts/groups' }
      ]
    },
    {
      label: 'Projects',
      icon: 'folder',
      badge: '4',
      children: [
        { label: 'All Projects', icon: 'list', route: '/projects' },
        { label: 'Create Project', icon: 'plus', route: '/projects/add' },
        { label: 'Templates', icon: 'template', route: '/projects/templates' }
      ]
    },
    {
      label: 'Monitoring',
      icon: 'activity',
      badge: '10',
      children: [
        { label: 'System Health', icon: 'heart', route: '/monitoring/health' },
        { label: 'Performance', icon: 'trending-up', route: '/monitoring/performance' },
        { label: 'Alerts', icon: 'alert-triangle', route: '/monitoring/alerts', badge: '3' }
      ]
    },
    {
      label: 'Automation',
      icon: 'zap',
      badge: '11',
      children: [
        { label: 'Schedules', icon: 'clock', route: '/automation/schedules' },
        { label: 'Scripts', icon: 'code', route: '/automation/scripts' },
        { label: 'Workflows', icon: 'git-branch', route: '/automation/workflows' }
      ]
    },
    {
      label: 'Settings',
      icon: 'settings',
      badge: '12',
      children: [
        { label: 'General', icon: 'sliders', route: '/settings/general' },
        { label: 'Users', icon: 'users', route: '/settings/users' },
        { label: 'Security', icon: 'shield', route: '/settings/security' },
        { label: 'API Keys', icon: 'key', route: '/settings/api-keys' }
      ]
    }
  ];

  constructor() {
    this.checkScreenSize();
  }

  ngOnInit(): void {}

  @HostListener('window:resize', ['$event'])
  onResize(event: any): void {
    this.checkScreenSize();
  }

  private checkScreenSize(): void {
    this.isMobile = window.innerWidth < 768;
    if (this.isMobile) {
      this.isCollapsed = false; // Don't collapse on mobile, just hide/show
    }
  }

  toggleMenuItem(item: MenuItem): void {
    if (item.children && !this.isCollapsed) {
      item.expanded = !item.expanded;
      
      // Close other expanded items
      this.menuItems.forEach(menuItem => {
        if (menuItem !== item && menuItem.children) {
          menuItem.expanded = false;
        }
      });
    }
  }
emojRandomSelector():string{
  return this.emojiList[Math.floor(Math.random()* this.emojiList.length)]
}
  toggleCollapse(): void {
    if (!this.isMobile) {
      this.isCollapsed = !this.isCollapsed;
      
      // Close all expanded items when collapsing
      if (this.isCollapsed) {
        this.menuItems.forEach(item => {
          if (item.children) {
            item.expanded = false;
          }
        });
      }
    }
  }

  closeSidebar(): void {
    if (this.isMobile) {
      this.sidebarClose.emit();
    }
  }

  isMenuItemActive(item: MenuItem): boolean {
    // TODO: Implement active route detection
    return false;
  }
}

