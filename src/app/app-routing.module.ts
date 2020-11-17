import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {DeviceRegistryComponent} from './components/pages/device-registry/device-registry.component';
import {DevicesComponent} from './components/pages/devices/devices.component';
import {ErrorPageComponent} from './components/pages/error-page/error-page.component';
import {GroupsComponent} from './components/pages/groups/groups.component';
import {HomeComponent} from './components/pages/home/home.component';
import {AppAuthGuard} from './guards/app-auth-guard';


export const routes: Routes = [
  {path: '', component: HomeComponent,
    canActivate: [AppAuthGuard]},
  {path: 'devices',
    component: DevicesComponent,
    canActivate: [AppAuthGuard],
    data: {ico: 'devices', title: 'Devices'}
  },
  {path: 'groups',
    component: GroupsComponent,
    canActivate: [AppAuthGuard],
    data: {ico: 'groups', title: 'Groups'}
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
