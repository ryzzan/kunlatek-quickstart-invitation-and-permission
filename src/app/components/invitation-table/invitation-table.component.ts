import { Component } from "@angular/core";
import { FormBuilder, FormGroup, FormGroupDirective } from "@angular/forms";
import { MatDialog } from "@angular/material/dialog";
import { MatSnackBar } from "@angular/material/snack-bar";
import { ActivatedRoute, Router } from "@angular/router";
// import { lastValueFrom } from "rxjs";
import { MyErrorHandler } from "../../utils/error-handler";
import { RemoveConfirmationDialogComponent } from "../remove-confirmation-dialog/remove-confirmation-dialog.component";
import { InvitationTableService } from "./invitation-table.service";

@Component({
  selector: "app-invitation-table",
  templateUrl: "./invitation-table.component.html",
  styleUrls: ["./invitation-table.component.scss"],
})
export class InvitationTableComponent {
  invitationTableId: string = "";
  invitationTableDisplayedColumns: string[] = ["email", "undefined"];
  invitationTableDataSource: any = [];
  invitationTableSearchForm: FormGroup;
  isLoading = true;
  // SET PERMISSIONS
  permissionsToCheck = JSON.parse(sessionStorage.getItem("permission")!)[0].modulePermissions;
  updateOnePermission: any;
  deleteOnePermission: any;
  readPermission: any;

  constructor(
    private _formBuilder: FormBuilder,
    private _activatedRoute: ActivatedRoute,
    private _router: Router,
    private _dialog: MatDialog,
    private _snackbar: MatSnackBar,
    private _errorHandler: MyErrorHandler,
    private _invitationTableService: InvitationTableService
  ) {
    const modulePermissionToCheck: any = this.permissionsToCheck.find((item: any) => item.module.name === "Convites");
    this.updateOnePermission = modulePermissionToCheck.permissionActions.filter((item: any) => item.name === "updateOne").length > 0;
    this.readPermission = modulePermissionToCheck.permissionActions.filter((item: any) => item.name === "read").length > 0;
    this.deleteOnePermission = modulePermissionToCheck.permissionActions.filter((item: any) => item.name === "deleteOne").length > 0;
    this.invitationTableSearchForm = this._formBuilder.group({
      searchInput: [null, []],
    });
    try {
      this._activatedRoute.params.subscribe(async (routeParams) => {
        this.invitationTableId = routeParams["id"];
      });
    } catch (error: any) {
      const message = this._errorHandler.apiErrorMessage(error.message);
      this.sendErrorMessage(message);
    }
    this.setInvitationTableService();
  }

  invitationTableSearch(invitationTableDirective: FormGroupDirective) {
    this.isLoading = true;
    const filter = `?filter={"or":[${this.invitationTableDisplayedColumns.map(
      (element: string) => {
        if (element !== "undefined") {
          return `{"${element}":{"like": "${this.invitationTableSearchForm.value.searchInput}", "options": "i"}}`;
        }
        return "";
      }
    )}]}`;

    this.setInvitationTableService(filter.replace("},]", "}]"));

    this.invitationTableSearchForm.reset();
    invitationTableDirective.resetForm();
  }

  setInvitationTableService = async (filter: string = "") => {
    try {
      // const result: any = await lastValueFrom(this._invitationTableService.getAll(filter));
      const result: any = await this._invitationTableService.getAll(filter);
      this.invitationTableDataSource = result.data.result;
      this.isLoading = false;
    } catch (error: any) {
      if (error.logMessage === "jwt expired") {
        await this.refreshToken();
        this.setInvitationTableService();
      } else {
        const message = this._errorHandler.apiErrorMessage(error.message);
        this.isLoading = false;
        this.sendErrorMessage(message);
      }
    }
  };

  removeConfirmationDialogOpenDialog = (id: string) => {
    const removeConfirmationDialogDialogRef = this._dialog.open(
      RemoveConfirmationDialogComponent,
      { data: { id: id } }
    );
    removeConfirmationDialogDialogRef
      .afterClosed()
      .subscribe(async (res: any) => {
        if (res) {
          try {
            const routeToGo =
              this.invitationTableId !== ""
                ? this._router.url.split(`/${this.invitationTableId}`)[0]
                : this._router.url;
            this.isLoading = true;
            // await lastValueFrom(this._invitationTableService.delete(res.id));
            await this._invitationTableService.delete(res.id);
            this.redirectTo(routeToGo);
            this.isLoading = false;
          } catch (error: any) {
            const message = this._errorHandler.apiErrorMessage(
              error.message
            );
            this.sendErrorMessage(message);
          }
        }
      });
  };

  resendInvitation = async (id: string) => {
    try {
      const res: any = await this._invitationTableService.sendInvitation(id);
      if (res) {
        this._snackbar.open('Convite enviado!');
      }
    } catch (error: any) {
      const message = this._errorHandler.apiErrorMessage(error.message);
      this.sendErrorMessage(message);
    }
  };

  refreshToken = async () => {
    try {
      // const res: any = await lastValueFrom(this._invitationTableService.refreshToken());
      const res: any = await this._invitationTableService.refreshToken();
      if (res) {
        sessionStorage.setItem("token", res?.data.authToken);
        sessionStorage.setItem("refreshToken", res?.data.authRefreshToken);
      }
    } catch (error: any) {
      const message = this._errorHandler.apiErrorMessage(error.message);
      this.isLoading = false;
      this.sendErrorMessage(message);
      sessionStorage.clear();
      this._router.navigate(["/"]);
    }
  };

  redirectTo = async (uri: string) => {
    try {
      await this._router.navigateByUrl('/main', { skipLocationChange: true });
      this._router.navigate([uri]);
    } catch (error: any) {
      const message = this._errorHandler.apiErrorMessage(error.message);
      this.sendErrorMessage(message);
    }
  };

  sendErrorMessage = (errorMessage: string) => {
    this._snackbar.open(errorMessage, undefined, { duration: 4 * 1000 });
  };
}
