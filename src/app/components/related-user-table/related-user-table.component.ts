import { Component } from "@angular/core";
import { FormBuilder, FormGroup, FormGroupDirective } from "@angular/forms";
import { MatDialog } from "@angular/material/dialog";
import { MatSnackBar } from "@angular/material/snack-bar";
import { ActivatedRoute, Router } from "@angular/router";
import { lastValueFrom } from "rxjs";
import { MyErrorHandler } from "../../utils/error-handler";
import { RemoveConfirmationDialogComponent } from "../remove-confirmation-dialog/remove-confirmation-dialog.component";
import { RelatedUserTableService } from "./related-user-table.service";

@Component({
  selector: "app-related-user-table",
  templateUrl: "./related-user-table.component.html",
  styleUrls: ["./related-user-table.component.scss"],
})
export class RelatedUserTableComponent {
  relatedUserTableId: string = "";
  relatedUserTableDisplayedColumns: string[] = ["email", "undefined"];
  relatedUserTableDataSource: any = [];
  relatedUserTableSearchForm: FormGroup;
  isLoading = true;
  // SET PERMISSIONS
  permissionsToCheck = JSON.parse(sessionStorage.getItem("permission")!)[0]
    .modulePermissions;
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
    private _relatedUserTableService: RelatedUserTableService
  ) {
    const modulePermissionToCheck: any = this.permissionsToCheck.find((item: any) => item.module.name === "Usuários relacionados");
    this.updateOnePermission = modulePermissionToCheck.permissionActions.filter((item: any) => item.name === "updateOne").length > 0;
    this.readPermission = modulePermissionToCheck.permissionActions.filter((item: any) => item.name === "read").length > 0;
    this.deleteOnePermission = modulePermissionToCheck.permissionActions.filter((item: any) => item.name === "deleteOne").length > 0;
    this.relatedUserTableSearchForm = this._formBuilder.group({
      searchInput: [null, []],
    });
    try {
      this._activatedRoute.params.subscribe(async (routeParams) => {
        this.relatedUserTableId = routeParams["id"];
      });
    } catch (error: any) {
      const message = this._errorHandler.apiErrorMessage(error.message);
      this.sendErrorMessage(message);
    }
    this.setRelatedUserTableService();
  }

  relatedUserTableSearch(relatedUserTableDirective: FormGroupDirective) {
    this.isLoading = true;
    const filter = `?filter={"or":[${this.relatedUserTableDisplayedColumns.map(
      (element: string) => {
        if (element !== "undefined") {
          return `{"${element}":{"like": "${this.relatedUserTableSearchForm.value.searchInput}", "options": "i"}}`;
        }
        return "";
      }
    )}]}`;

    this.setRelatedUserTableService(filter.replace("},]", "}]"));

    this.relatedUserTableSearchForm.reset();
    relatedUserTableDirective.resetForm();
  }

  setRelatedUserTableService = async (filter: string = "") => {
    try {
      const result: any = await lastValueFrom(this._relatedUserTableService.getAll(filter));
      this.relatedUserTableDataSource = result.data.result;
      this.isLoading = false;
    } catch (error: any) {
      if (error.logMessage === "jwt expired") {
        await this.refreshToken();
        this.setRelatedUserTableService();
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
              this.relatedUserTableId !== ""
                ? this._router.url.split(`/${this.relatedUserTableId}`)[0]
                : this._router.url;
            this.isLoading = true;
            await lastValueFrom(this._relatedUserTableService.delete(res.id));
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

  refreshToken = async () => {
    try {
      const res: any = await lastValueFrom(this._relatedUserTableService.refreshToken());
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
