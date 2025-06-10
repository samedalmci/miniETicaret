import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSelectionList } from '@angular/material/list';
import { NgxSpinnerService } from 'ngx-spinner';
import { SpinnerType } from '../../base/base.component';
import { List_Role } from '../../contracts/role/List_Role';
import { RoleService } from '../../services/common/model/role.service';
import { UserService } from '../../services/common/model/user.service';
import { BaseDialog } from '../base/base-dialog';

@Component({
  selector: 'app-authorize-user-dialog',
  templateUrl: './authorize-user-dialog.component.html',
  standalone: false,
  styleUrls: ['./authorize-user-dialog.component.scss']
})
export class AuthorizeUserDialogComponent extends BaseDialog<AuthorizeUserDialogComponent> implements OnInit {
  constructor(dialogRef: MatDialogRef<AuthorizeUserDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private roleService: RoleService,
    private userService: UserService,
    private spinner: NgxSpinnerService) {
    super(dialogRef)
  }
  roles: { Datas: List_Role[], TotalCount: number };
  assignedRoles: Array<string>;
  listRoles: { name: string, selected: boolean }[];

  async ngOnInit() {
    this.spinner.show(SpinnerType.BallAtom);

    this.assignedRoles = await this.userService.getRolesToUser(this.data, () => this.spinner.hide(SpinnerType.BallAtom));

    this.roles = await this.roleService.getRoles(-1, -1);

    if (this.roles && this.roles.Datas) {
      this.listRoles = this.roles.Datas.map((r: any) => {
        const selectedStatus = this.assignedRoles?.indexOf(r.Name) > -1;
        return {
          name: r.Name,
          selected: selectedStatus
        };
      });
    } else {
      this.listRoles = [];
    }

    this.spinner.hide(SpinnerType.BallAtom);
  }


  assignRoles(rolesComponent: MatSelectionList) {
    const roles: string[] = rolesComponent.selectedOptions.selected.map(o => o.value.name);
    this.spinner.show(SpinnerType.BallAtom);
    this.userService.assignRoleToUser(this.data, roles,
      () => {
        this.spinner.hide(SpinnerType.BallAtom);
      }, error => {
        this.spinner.hide(SpinnerType.BallAtom);
        // İstersen hata yönetimi yapabilirsin
      });
  }

}
