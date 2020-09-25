import {Component, ElementRef, Inject, OnInit, ViewChild, ViewChildren} from '@angular/core';
import {DeviceDataSource} from '../data-source/device-data-source';
import {Page} from '../../models/common';
import {Device} from '../../models/device';
import {takeUntil} from 'rxjs/operators';
import {Subject} from 'rxjs';
import {GroupsDataSource} from '../data-source/groups-data-source';
import {Group, GroupsPageRequest} from '../../models/acc-management';
import {FormBuilder} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {AccountManagementService} from '../../services/account-management.service';
import {FormService} from '../../services/form.service';
import {DEFAULT_GROUP_PARAM_REQUEST} from '../../common/constants';
import {PageEvent} from '@angular/material/paginator';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.css']
})
export class TableComponent implements OnInit {
  // private readonly subscriptions$ = new Subject<void>();
  // dataSource: GroupsDataSource<Page<Group>>;
  // displayedColumns = ['groupId', 'groups'];
  // paramRequest: GroupsPageRequest;
  // loading: boolean;
  // selectedIds = [];
  // selectAllIds = false;
  //
  // @ViewChild('searchInput') searchInput: ElementRef;
  // @ViewChild('checkAll') checkAllBoxes: ElementRef;
  // @ViewChildren('check') checkBoxes: ElementRef[];

  constructor(private formBuilder: FormBuilder,
              private accountManagementService: AccountManagementService,
              private formService: FormService,
              @Inject(MAT_DIALOG_DATA) data) {
  }

  ngOnInit(): void {
    // this.paramRequest = Object.assign({}, DEFAULT_GROUP_PARAM_REQUEST);
    // this.dataSource = new GroupsDataSource(this.accountManagementService);
    // this.dataSource.loadGroups(DEFAULT_GROUP_PARAM_REQUEST);
    // this.dataSource.loadingSubject$.pipe( takeUntil(this.subscriptions$) ).subscribe(value => this.loading = value);
  }
  //
  // select(id: string, checked: boolean) {
  //   if (checked && !this.selectedIds.find(value => value === id)) {
  //     this.selectedIds.push(id);
  //     if (!this.selectAllIds && !this.checkBoxes.find(value => !value.nativeElement.checked)) {
  //       this.selectAllCheckBoxes(true);
  //     }
  //   }
  //   if (!checked) {
  //     this.selectedIds = this.selectedIds.filter(value => value !== id);
  //     if (this.selectAllIds) {
  //       this.selectAllCheckBoxes(false);
  //     }
  //   }
  //   console.log('one' + this.selectedIds);
  // }
  //
  // selectAll(checked: boolean) {
  //   this.selectAllIds = checked;
  //   this.checkBoxes.forEach(value => {
  //       value.nativeElement.checked = checked;
  //       value.nativeElement.dispatchEvent(new MouseEvent('change'));
  //     }
  //   );
  // }
  //
  // getServerData($event: PageEvent) {
  //   this.setPaginationRequest($event);
  //   this.load();
  // }
  //
  // private setPaginationRequest(data): void {
  //   this.paramRequest.pageSize = data.pageSize;
  //   this.paramRequest.pageNumber = data.pageIndex;
  // }
  //
  // private load() {
  //   this.selectAllCheckBoxes(false, true);
  //   this.dataSource.loadGroups(this.paramRequest);
  // }
  //
  //
  // private selectAllCheckBoxes(value: boolean, clear?: boolean) {
  //   this.selectAllIds = value;
  //   if (this.checkAllBoxes) {
  //     this.checkAllBoxes.nativeElement.checked = value;
  //   }
  //   if (clear) {
  //     this.selectedIds = [];
  //   }
  // }
}
