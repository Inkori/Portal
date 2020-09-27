import {BrowserModule} from '@angular/platform-browser';
import {APP_INITIALIZER, NgModule} from '@angular/core';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {HomePageComponent} from './components/home-page/home-page.component';
import {DevicesComponent} from './components/devices/devices.component';
import {DeviceRegistryComponent} from './components/device-registry/device-registry.component';
import {GroupsComponent} from './components/groups/groups.component';
import {ErrorPageComponent} from './components/error-page/error-page.component';
import {KeycloakAngularModule, KeycloakService} from 'keycloak-angular';
import {initializer} from '../appInit';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {LayoutModule} from '@angular/cdk/layout';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatButtonModule} from '@angular/material/button';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatIconModule} from '@angular/material/icon';
import {MatListModule} from '@angular/material/list';
import {SubscriptionBarComponent} from './components/subscription-bar/subscription-bar.component';
import {MatMenuModule} from '@angular/material/menu';
import {ExtendedModule, FlexModule} from '@angular/flex-layout';
import {RealmSelectionComponent} from './components/realm-selection/realm-selection.component';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import {SubscriptionInterceptor} from './interseptors/auth-interseptor';
import {MatTableModule} from '@angular/material/table';
import {MatPaginatorModule} from '@angular/material/paginator';
import {MatInputModule} from '@angular/material/input';
import {MatSortModule} from '@angular/material/sort';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatButtonToggleModule} from '@angular/material/button-toggle';
import {MatDialogModule} from '@angular/material/dialog';
import {AddDeviceModalComponent} from './components/modals/add-device-modal/add-device-modal.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import {GroupsModalComponent} from './components/modals/groups-modal/groups-modal.component';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {TableComponent} from './components/table/table.component';
import {DeviceModalComponent} from './components/modals/device-modal/device-modal.component';


@NgModule({
  declarations: [
    AppComponent,
    HomePageComponent,
    DevicesComponent,
    DeviceRegistryComponent,
    GroupsComponent,
    ErrorPageComponent,
    SubscriptionBarComponent,
    RealmSelectionComponent,
    AddDeviceModalComponent,
    GroupsModalComponent,
    TableComponent,
    DeviceModalComponent,
  ],
  imports: [
    HttpClientModule,
    BrowserModule,
    KeycloakAngularModule,
    MatMenuModule,
    ExtendedModule,
    FlexModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    LayoutModule,
    MatToolbarModule,
    MatButtonModule,
    MatSidenavModule,
    MatIconModule,
    MatListModule,
    MatTableModule,
    MatPaginatorModule,
    MatInputModule,
    MatSortModule,
    MatProgressSpinnerModule,
    MatButtonToggleModule,
    MatDialogModule,
    FormsModule,
    ReactiveFormsModule,
    MatSnackBarModule,
    MatCheckboxModule
  ],
  providers: [
    {provide: APP_INITIALIZER, useFactory: initializer, multi: true, deps: [KeycloakService]},
    {provide: HTTP_INTERCEPTORS, useClass: SubscriptionInterceptor, multi: true},
  ],
  bootstrap: [AppComponent],
  entryComponents: [AddDeviceModalComponent, GroupsModalComponent, DeviceModalComponent]
})
export class AppModule {
}
