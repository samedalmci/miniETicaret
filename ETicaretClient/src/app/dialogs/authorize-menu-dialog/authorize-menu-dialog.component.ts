import { Component, Inject, OnDestroy, OnInit, ChangeDetectorRef } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { BaseDialog } from '../base/base-dialog';
import { MatSelectionList } from '@angular/material/list';
import { NgxSpinnerService } from 'ngx-spinner';
import { SpinnerType } from '../../base/base.component';
import { List_Role } from '../../contracts/role/List_Role';
import { AuthorizationEndpointService } from '../../services/common/model/authorization-endpoint.service';
import { RoleService } from '../../services/common/model/role.service';

@Component({
  selector: 'app-authorize-menu-dialog',
  templateUrl: './authorize-menu-dialog.component.html',
  standalone: false,
  styleUrls: ['./authorize-menu-dialog.component.scss']
})
export class AuthorizeMenuDialogComponent extends BaseDialog<AuthorizeMenuDialogComponent>  {
  constructor(dialogRef: MatDialogRef<AuthorizeMenuDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private roleService: RoleService,
    private authorizationEndpointService: AuthorizationEndpointService,
    private spinner: NgxSpinnerService,
    private cdr: ChangeDetectorRef) {
    super(dialogRef)
  }

  roles: { datas: List_Role[], totalCount: number } = { datas: [], totalCount: 0 };
  assignedRoles: Array<string> = [];
  listRoles: { name: string, selected: boolean }[] = [];

  async ngOnInit() {
    try {
      this.assignedRoles = await this.authorizationEndpointService.getRolesToEndpoint(this.data.code, this.data.menuName);

      let rolesResponse = await this.roleService.getRoles(-1, -1);
      if (rolesResponse && rolesResponse.Datas && rolesResponse.TotalCount !== undefined) {
        this.roles = {
          datas: rolesResponse.Datas,
          totalCount: rolesResponse.TotalCount
        };

        this.listRoles = this.roles.datas.map((r: any) => {
          return {
            name: r.Name,
            selected: this.assignedRoles?.indexOf(r.Name) > -1
          }
        });
      }
    } catch (error) {
      console.error('Error in ngOnInit:', error);
    } finally {
      this.cdr.detectChanges();
    }
  }

  assignRoles(rolesComponent: MatSelectionList) {
    const roles: string[] = rolesComponent.selectedOptions.selected.map(o => o.value)
    this.spinner.show(SpinnerType.BallAtom);
    this.authorizationEndpointService.assignRoleEndpoint(roles, this.data.code, this.data.menuName,
      () => {
        this.spinner.hide(SpinnerType.BallAtom);
      }, error => {

      })
  }
}

export enum AuthorizeMenuState {
  Yes,
  No
}
