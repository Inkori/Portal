import {Component, OnDestroy, OnInit} from '@angular/core';
import {GdrService} from '../../../services/gdr.service';
import {DEFAULT_GDR_PARAM_REQUEST} from '../../../constants/constants';
import {DataType} from '../../../models/common';
import {takeUntil} from 'rxjs/operators';
import {AccountManagementService} from '../../../services/account-management.service';
import {Subject} from 'rxjs';

@Component({
  selector: 'app-device-registry',
  templateUrl: './device-registry.component.html',
  styleUrls: ['./device-registry.component.css']
})
export class DeviceRegistryComponent implements OnInit, OnDestroy {
  private readonly subscriptions$ = new Subject<void>();
  pageName = 'Device Registry';
  dataSourceType = DataType.GDR;
  isRealmSelected: boolean;
  selectedIds = [];


  constructor(private gdrService: GdrService, private accManagement: AccountManagementService){  }

  ngOnInit(): void {
    this.isRealmSelected = this.accManagement.isRealmSelected();
    this.accManagement.currentRealm$.pipe(takeUntil(this.subscriptions$)).subscribe(data => {
      this.isRealmSelected = !!data;
    });
  }

  ngOnDestroy(): void {
    this.subscriptions$.next();
    this.subscriptions$.complete();
  }

  getList() {
    this.gdrService.getDevicesGdr(DEFAULT_GDR_PARAM_REQUEST).subscribe(data => console.log(data));
  }

  search() {
    const param = Object.assign({}, DEFAULT_GDR_PARAM_REQUEST);
    param.freeText = 'RG777777'
    this.gdrService.search(param).subscribe(data => console.log(data));
  }

  getIdList(idList: string[]) {
    this.selectedIds = idList;
  }

  generateCode() {
    // todo
  }
}
