import {APP_INITIALIZER, NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {LayoutModule} from '@angular/cdk/layout';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import {ExtendedModule, FlexModule} from '@angular/flex-layout';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatButtonModule} from '@angular/material/button';
import {MatButtonToggleModule} from '@angular/material/button-toggle';
import {MatCardModule} from '@angular/material/card';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatDialogModule} from '@angular/material/dialog';
import {MatGridListModule} from '@angular/material/grid-list';
import {MatIconModule} from '@angular/material/icon';
import {MatInputModule} from '@angular/material/input';
import {MatListModule} from '@angular/material/list';
import {MatMenuModule} from '@angular/material/menu';
import {MatPaginatorModule} from '@angular/material/paginator';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import {MatSortModule} from '@angular/material/sort';
import {MatTableModule} from '@angular/material/table';
import {MatToolbarModule} from '@angular/material/toolbar';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {KeycloakAngularModule, KeycloakService} from 'keycloak-angular';
import {ChartsModule} from 'ng2-charts';
import {initializer} from '../appInit';
import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {BarComponent} from './components/common/charts/bar/bar.component';
import {LineComponent} from './components/common/charts/line/line.component';
import {PieComponent} from './components/common/charts/pie/pie.component';
import {RadarComponent} from './components/common/charts/radar/radar.component';
import {RealmSelectionComponent} from './components/common/realm-selection/realm-selection.component';
import {SubscriptionBarComponent} from './components/common/subscription-bar/subscription-bar.component';
import {TableComponent} from './components/common/table/table.component';
import {AddModalComponent} from './components/modals/add-modal/add-modal.component';
import {InfoModalComponent} from './components/modals/info-modal/info-modal.component';
import {ListModalComponent} from './components/modals/list-modal/list-modal.component';
import {DeviceRegistryComponent} from './components/pages/device-registry/device-registry.component';
import {DevicesComponent} from './components/pages/devices/devices.component';
import {ErrorPageComponent} from './components/pages/error-page/error-page.component';
import {GroupsComponent} from './components/pages/groups/groups.component';
import {HomeComponent} from './components/pages/home/home.component';
import {SubscriptionInterceptor} from './interseptors/auth-interseptor';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    DevicesComponent,
    DeviceRegistryComponent,
    GroupsComponent,
    ErrorPageComponent,
    SubscriptionBarComponent,
    RealmSelectionComponent,
    AddModalComponent,
    TableComponent,
    ListModalComponent,
    InfoModalComponent,
    PieComponent,
    RadarComponent,
    LineComponent,
    BarComponent,
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
    MatCheckboxModule,
    MatGridListModule,
    MatCardModule,
    ChartsModule,
  ],
  providers: [
    {provide: APP_INITIALIZER, useFactory: initializer, multi: true, deps: [KeycloakService]},
    {provide: HTTP_INTERCEPTORS, useClass: SubscriptionInterceptor, multi: true},
  ],
  bootstrap: [AppComponent],
  entryComponents: [AddModalComponent, ListModalComponent]
})
export class AppModule {
}
