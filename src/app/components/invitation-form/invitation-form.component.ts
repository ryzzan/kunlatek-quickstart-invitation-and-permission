import { Component } from "@angular/core";
import {
  FormBuilder, FormGroup, FormGroupDirective, Validators
} from "@angular/forms";
import { MatSnackBar } from "@angular/material/snack-bar";
import { ActivatedRoute, Router } from "@angular/router";
// import { lastValueFrom } from "rxjs";
import { MyPerformance } from "src/app/utils/performance";

import { MyErrorHandler } from "../../utils/error-handler";
import { InvitationFormService } from "./invitation-form.service";

@Component({
  selector: "app-invitation-form",
  templateUrl: "./invitation-form.component.html",
  styleUrls: ["./invitation-form.component.scss"],
})
export class InvitationFormComponent {
  invitationFormId: string = "";
  invitationFormForm: FormGroup;
  invitationFormToEdit: any;
  isAddModule: boolean = true;
  isLoading: boolean = false;
  // SET PERMISSIONS
  permissionsToCheck = JSON.parse(sessionStorage.getItem("permission")!)[0].modulePermissions;
  updateOnePermission: any;
  createOnePermission: any;

  filteredPermissionGroupId: Array<any> = [];
  loadingPermissionGroupId: boolean = false;
  invitationFormBuilder = {
    email: [
      {
        value: null,
        disabled: false,
      },
      [Validators.email, Validators.required],
    ],

    project: [null, []],

    permissionGroupId: [null, [Validators.required]],
  };

  constructor(
    private _formBuilder: FormBuilder,
    private _activatedRoute: ActivatedRoute,
    private _router: Router,
    private _snackbar: MatSnackBar,
    private _invitationFormService: InvitationFormService,
    private _errorHandler: MyErrorHandler
  ) {
    try {
      const modulePermissionToCheck: any = this.permissionsToCheck.find((item: any) => item.module.name === "Convites");
      this.updateOnePermission = modulePermissionToCheck.permissionActions.filter((item: any) => item.name === "updateOne").length > 0;
      this.createOnePermission = modulePermissionToCheck.permissionActions.filter((item: any) => item.name === "createOne").length > 0;

      this._activatedRoute.params.subscribe(async (routeParams) => {
        this.invitationFormId = routeParams["id"];
        this.isAddModule = !this.invitationFormId;

        if (this.invitationFormId) {
          // this.invitationFormToEdit = await lastValueFrom(this._invitationFormService.find(
          //   this.invitationFormId
          // ));
          this.invitationFormToEdit = await this._invitationFormService.find(
            this.invitationFormId
          );
          this.invitationFormForm.patchValue(this.invitationFormToEdit.data);
        }
        this.checkOptionsCreation([], 0);
      });
    } catch (error: any) {
      const message = this._errorHandler.apiErrorMessage(error.message);
      this.sendErrorMessage(message);
    }

    this.invitationFormForm = this._formBuilder.group(
      this.invitationFormBuilder
    );
  }

  displayFnToPermissionGroupId = (value?: any) => {
    const otherValue = this.invitationFormToEdit?.data?.permissionGroup
      ? this.invitationFormToEdit.data.permissionGroup
      : null;
    if (value === otherValue?._id) {
      return otherValue.name;
    }
    return value
      ? this.filteredPermissionGroupId.find((_) => _._id === value)?.name
      : null;
  };
  setFilteredPermissionGroupId = async () => {
    try {
      const paramsToFilter = ["name"];

      if (this.invitationFormForm.value.permissionGroupId.length > 0) {
        this.loadingPermissionGroupId = true;

        const filter = `?filter={"or":[${paramsToFilter.map(
          (element: string) => {
            if (element !== "undefined") {
              return `{"${element}":{"like": "${this.invitationFormForm.value.permissionGroupId}", "options": "i"}}`;
            }
            return "";
          }
        )}]}${this.invitationFormForm.value.project ? `&project=${this.invitationFormForm.value.project}` : ``}`;

        // const result: any = await lastValueFrom(this._invitationFormService.permissionGroupIdSelectObjectGetAll(filter.replace("},]", "}]")));
        const result: any = await this._invitationFormService.permissionGroupIdSelectObjectGetAll(filter.replace("},]", "}]"));
        this.filteredPermissionGroupId = result.data.result;
        
        this.loadingPermissionGroupId = false;
        this.isLoading = false;
      }
    } catch (error: any) {
      if (error.logMessage === "jwt expired") {
        await this.refreshToken();
        this.setFilteredPermissionGroupId();
      } else {
        const message = this._errorHandler.apiErrorMessage(
          error.message
        );
        this.sendErrorMessage(message);
      }
    }
  };
  callSetFilteredPermissionGroupId = MyPerformance.debounce(() =>
    this.setFilteredPermissionGroupId()
  );
  clearPermissionGroupOptions = () => {
    this.invitationFormForm.get('permissionGroupId')!.setValue(null);
    this.filteredPermissionGroupId = []
  }

  invitationFormSubmit = async (
    invitationFormDirective: FormGroupDirective
  ) => {
    this.isLoading = true;

    try {
      if (this.isAddModule) {
        // await lastValueFrom(this._invitationFormService.save(this.invitationFormForm.value));
        await this._invitationFormService.save(this.invitationFormForm.value);
      }

      if (!this.isAddModule) {
        // await lastValueFrom(this._invitationFormService.update(
        //   this.invitationFormForm.value,
        //   this.invitationFormId
        // ));
        await this._invitationFormService.update(
          this.invitationFormForm.value,
          this.invitationFormId
        );
      }
      this.redirectTo("main/__invitation");

      this.isLoading = false;
    } catch (error: any) {
      if (error.logMessage === "jwt expired") {
        await this.refreshToken();
        this.invitationFormSubmit(invitationFormDirective);
      } else {
        const message = this._errorHandler.apiErrorMessage(error.message);
        this.isLoading = false;
        this.sendErrorMessage(message);
      }
    }

    this.invitationFormForm.reset();
    invitationFormDirective.resetForm();
  };
  refreshToken = async () => {
    try {
      // const res: any = await lastValueFrom(this._invitationFormService.refreshToken());
      const res: any = await this._invitationFormService.refreshToken();
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
  checkOptionsCreation = async (functions: Array<Function>, index: number) => {
    const newIndex = index + 1;

    if (newIndex <= functions.length) {
      await functions[index].call(null);
      this.checkOptionsCreation(functions, newIndex);
    } else {
      this.isLoading = false;
    }
  };
  sendErrorMessage = (errorMessage: string) => {
    this._snackbar.open(errorMessage, undefined, {
      duration: 4 * 1000,
    });
  };
}
