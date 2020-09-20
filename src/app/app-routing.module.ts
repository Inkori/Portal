import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {DeviceGroupsComponent} from './components/device-groups/device-groups.component';
import {HomePageComponent} from './components/home-page/home-page.component';
import {DeviceRegistryComponent} from './components/device-registry/device-registry.component';
import {DevicesComponent} from './components/devices/devices.component';
import {SystemUpdatesComponent} from './components/system-updates/system-updates.component';
import {ErrorPageComponent} from './components/error-page/error-page.component';
import {AppAuthGuard} from './guards/app-auth-guard';


export const routes: Routes = [
  {path: '', component: HomePageComponent,
    canActivate: [AppAuthGuard]},
  {path: 'devices',
    component: DevicesComponent,
    canActivate: [AppAuthGuard],
    data: {ico: 'devices', title: 'Devices'}
  },
  {path: 'groups',
    component: DeviceGroupsComponent,
    canActivate: [AppAuthGuard],
    data: {ico: 'groups', title: 'Groups'}
  },
  {path: 'system-updates',
    component: SystemUpdatesComponent,
    canActivate: [AppAuthGuard],
    data: {ico: 'system_update', title: 'System updates'}
  },
  {path: 'registry',
    component: DeviceRegistryComponent,
    canActivate: [AppAuthGuard],
    data: {ico: 'add_to_photos', title: 'Device registry'}
  },
  {path: 'error', component: ErrorPageComponent},
  {path: '**', redirectTo: '/error'},
];
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [AppAuthGuard]
})
export class AppRoutingModule { }
