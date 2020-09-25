import {Component, ElementRef, Inject, OnInit, ViewChild, ViewChildren} from '@angular/core';
import {FormBuilder} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {AccountManagementService} from '../../../services/account-management.service';
import {FormService} from '../../../services/form.service';
import {DEFAULT_GROUP_PARAM_REQUEST} from '../../../common/constants';
import {GroupsDataSource} from '../../data-source/groups-data-source';
import {Page} from '../../../models/common';
import {Group, GroupsPageRequest} from '../../../models/acc-management';
import {PageEvent} from '@angular/material/paginator';
import {Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';

@Component({
  selector: 'app-groups-modal',
  templateUrl: './groups-modal.component.html',
  styleUrls: ['./groups-modal.component.css']
})
export class GroupsModalComponent implements OnInit {
  private readonly subscriptions$ = new Subject<void>();
  dataSource: GroupsDataSource<Page<Group>>;
  displayedColumns = ['groupId', 'groups'];
  paramRequest: GroupsPageRequest;
  loading: boolean;
  selectedIds = [];
  selectAllIds = false;

  @ViewChild('searchInput') searchInput: ElementRef;
  @ViewChild('checkAll') checkAllBoxes: ElementRef;
  @ViewChildren('check') checkBoxes: ElementRef[];

  constructor(private formBuilder: FormBuilder,
              private dialogRef: MatDialogRef<GroupsModalComponent>,
              private accountManagementService: AccountManagementService,
              private formService: FormService,
              @Inject(MAT_DIALOG_DATA) data) {
  }

  ngOnInit(): void {
    this.paramRequest = Object.assign({}, DEFAULT_GROUP_PARAM_REQUEST);
    this.dataSource = new GroupsDataSource(this.accountManagementService);
    this.dataSource.loadGroups(DEFAULT_GROUP_PARAM_REQUEST);
    this.dataSource.loadingSubject$.pipe( takeUntil(this.subscriptions$) ).subscribe(value => this.loading = value);
  }

  close() {
    this.dialogRef.close();
  }

  submit() {
    this.dialogRef.close(this.selectedIds);
  }

  select(id: string, checked: boolean) {
    if (checked && !this.selectedIds.find(value => value === id)) {
      this.selectedIds.push(id);
      if (!this.selectAllIds && !this.checkBoxes.find(value => !value.nativeElement.checked)) {
        this.selectAllCheckBoxes(true);
      }
    }
    if (!checked) {
      this.selectedIds = this.selectedIds.filter(value => value !== id);
      if (this.selectAllIds) {
        this.selectAllCheckBoxes(false);
      }
    }
  }

  selectAll(checked: boolean) {
    this.selectAllIds = checked;
    this.checkBoxes.forEach(value => {
        value.nativeElement.checked = checked;
        value.nativeElement.dispatchEvent(new MouseEvent('change'));
      }
    );
  }

  getServerData($event: PageEvent) {
    this.setPaginationRequest($event);
    this.load();
  }

  private setPaginationRequest(data): void {
    this.paramRequest.pageSize = data.pageSize;
    this.paramRequest.pageNumber = data.pageIndex;
  }

  private load() {
    this.selectAllCheckBoxes(false, true);
    this.dataSource.loadGroups(this.paramRequest);
  }


  private selectAllCheckBoxes(value: boolean, clear?: boolean) {
    this.selectAllIds = value;
    if (this.checkAllBoxes) {
      this.checkAllBoxes.nativeElement.checked = value;
    }
    if (clear) {
      this.selectedIds = [];
    }
  }
}
