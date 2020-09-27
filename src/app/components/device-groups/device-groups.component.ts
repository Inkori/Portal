import {Component, OnDestroy, OnInit} from '@angular/core';
import {AccountManagementService} from '../../services/account-management.service';

@Component({
  selector: 'app-device-groups',
  templateUrl: './device-groups.component.html',
  styleUrls: ['./device-groups.component.css']
})
export class DeviceGroupsComponent implements OnInit, OnDestroy {
  pageName = 'Groups page';

  constructor(private accManagement: AccountManagementService) {
  }

  ngOnInit(): void {  }

  ngOnDestroy(): void {

  }

}
