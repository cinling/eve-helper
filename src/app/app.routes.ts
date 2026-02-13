import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', loadChildren: () => import('./pages/auth/auth-routing.module').then(m => m.AuthRoutingModule) },
  { path: 'welcome', loadChildren: () => import('./pages/welcome/welcome.routes').then(m => m.WELCOME_ROUTES) },
  { path: 'blueprint-compute', loadChildren: () => import('./pages/blueprint-compute/blueprint-compute-routing.module').then(m => m.BlueprintComputeRoutingModule) },
  { path: 'settings', loadChildren: () => import('./pages/settings/settings-routing.module').then(m => m.SettingsRoutingModule) },
  { path: 'market-trend', loadChildren: () => import('./pages/market-trend/market-trend.module').then(m => m.MarketTrendModule) },
  { path: 'blueprint-rank', loadChildren: () => import('./pages/blueprint-rank/blueprint-rank.module').then(m => m.BlueprintRankModule) },
  { path: 'auth', loadChildren: () => import('./pages/auth/auth-routing.module').then(m => m.AuthRoutingModule) },
  { path: 'asset', loadChildren: () => import('./pages/asset/asset-routing.module').then(m => m.AssetRoutingModule) },
];
