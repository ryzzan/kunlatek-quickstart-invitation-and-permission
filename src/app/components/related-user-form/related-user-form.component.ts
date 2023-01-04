import { COMMA, ENTER } from "@angular/cdk/keycodes";
import { Component, ElementRef, ViewChild } from "@angular/core";
import {
  FormBuilder, FormGroup, FormGroupDirective, Validators
} from "@angular/forms";
import { MatSnackBar } from "@angular/material/snack-bar";
import { ActivatedRoute, Router } from "@angular/router";
// import { lastValueFrom } from "rxjs";
import { MyPerformance } from "src/app/utils/performance";
import { MyErrorHandler } from "../../utils/error-handler";
import { RelatedUserFormService } from "./related-user-form.service";

@Component({
  selector: "app-related-user-form",
  templateUrl: "./related-user-form.component.html",
  styleUrls: ["./related-user-form.component.scss"],
})
export class RelatedUserFormComponent {
  genderSelectObject = [
    {
      label: "Feminino",
      value: "F",
    },
    {
      label: "Masculino",
      value: "M",
    },
  ];
  relatedUserFormId: string = "";
  relatedUserFormForm: FormGroup;
  relatedUserFormToEdit: any;
  relatedUserFormToEditEdited: any;
  isAddModule: boolean = true;
  isLoading: boolean = false;
  // SET PERMISSIONS
  permissionsToCheck = JSON.parse(sessionStorage.getItem("permission")!)[0].modulePermissions;
  updateOnePermission: any;
  createOnePermission: any;

  filteredPermissionGroupId: Array<any> = [];

  permissionGroupIdSeparatorKeysCodes: number[] = [ENTER, COMMA];
  chosenPermissionGroupIdView: string[] = [];
  chosenPermissionGroupIdValue: string[] = [];

  @ViewChild("permissionGroupIdInput") permissionGroupIdInput!: ElementRef<
    HTMLInputElement
  >;
  relatedUserFormBuilder = {
    email: [
      {
        value: null,
        disabled: true,
      },
      [Validators.email, Validators.required],
    ],

    name: [
      {
        value: null,
        disabled: true,
      },
      [Validators.required],
    ],

    gender: [
      {
        value: null,
        disabled: true,
      },
      [],
    ],

    birthday: [
      {
        value: null,
        disabled: true,
      },
      [Validators.required],
    ],

    uniqueId: [
      {
        value: null,
        disabled: true,
      },
      [Validators.required],
    ],

    businessName: [
      {
        value: null,
        disabled: true,
      },
      [Validators.required],
    ],

    permissionGroupId: [null, [Validators.required]],

    isUserDisabled: [
      {
        value: null,
        disabled: false,
      },
      [],
    ],
  };

  constructor(
    private _formBuilder: FormBuilder,
    private _activatedRoute: ActivatedRoute,
    private _router: Router,
    private _snackbar: MatSnackBar,
    private _relatedUserFormService: RelatedUserFormService,
    private _errorHandler: MyErrorHandler
  ) {
    try {
      const modulePermissionToCheck: any = this.permissionsToCheck.find((item: any) => item.module.name === "Usuários relacionados");
      this.updateOnePermission = modulePermissionToCheck.permissionActions.filter((item: any) => item.name === "updateOne").length > 0;
      this.createOnePermission = modulePermissionToCheck.permissionActions.filter((item: any) => item.name === "createOne").length > 0;

      this._activatedRoute.params.subscribe(async (routeParams) => {
        this.relatedUserFormId = routeParams["id"];
        this.isAddModule = !this.relatedUserFormId;

        if (this.relatedUserFormId) {
          // this.relatedUserFormToEdit = await lastValueFrom(this._relatedUserFormService.find(
          this.relatedUserFormToEdit = await this._relatedUserFormService.find(
            this.relatedUserFormId
          );

          if (this.relatedUserFormToEdit.data.person) {
            this.relatedUserFormToEditEdited = {
              email: this.relatedUserFormToEdit.data.email,
              permissionGroup: this.relatedUserFormToEdit.data.permissionGroup,
              permissionGroupId: this.relatedUserFormToEdit.data.permissionGroupId,
              name: this.relatedUserFormToEdit.data.person.name,
              gender: this.relatedUserFormToEdit.data.person.gender,
              birthday: this.relatedUserFormToEdit.data.person.birthday,
              uniqueId: this.relatedUserFormToEdit.data.person.uniqueId,
              isUserDisabled: this.relatedUserFormToEdit.data.isUserDisabled,
            };
          }

          if (this.relatedUserFormToEdit.data.company) {
            this.relatedUserFormToEditEdited = {
              email: this.relatedUserFormToEdit.data.email,
              permissionGroup: this.relatedUserFormToEdit.data.permissionGroup,
              permissionGroupId: this.relatedUserFormToEdit.data.permissionGroupId,
              businesName: this.relatedUserFormToEdit.data.company.businessName,
              uniqueId: this.relatedUserFormToEdit.data.company.uniqueId,
              isUserDisabled: this.relatedUserFormToEdit.data.isUserDisabled,
            };
          }

          this.relatedUserFormForm.patchValue(this.relatedUserFormToEditEdited);
        }
        this.checkOptionsCreation([], 0);
      });
    } catch (error: any) {
      const message = this._errorHandler.apiErrorMessage(error.message);
      this.sendErrorMessage(message);
    }

    this.relatedUserFormForm = this._formBuilder.group(
      this.relatedUserFormBuilder
    );
  }

  displayFnToPermissionGroupId = (value?: any) => {
    const otherValue = this.relatedUserFormToEdit?.data?.permissionGroup
      ? this.relatedUserFormToEdit.data.permissionGroup
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
      if (this.relatedUserFormForm.value.permissionGroupId.length > 0) {
        const filter = `?filter={"or":[${paramsToFilter.map(
          (element: string) => {
            if (element !== "undefined") {
              return `{"${element}":{"like": "${this.relatedUserFormForm.value.permissionGroupId}", "options": "i"}}`;
            }
            return "";
          }
        )}]}`;

        // const result: any = await lastValueFrom(this._relatedUserFormService
        const result: any = await this._relatedUserFormService
          .permissionGroupIdSelectObjectGetAll(filter.replace("},]", "}]"));

        this.filteredPermissionGroupId = result.data.result;
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

  relatedUserFormSubmit = async (
    relatedUserFormDirective: FormGroupDirective
  ) => {
    this.isLoading = true;

    try {
      if (this.isAddModule) {
        // await lastValueFrom(this._relatedUserFormService.save(this.relatedUserFormForm.value));
        await this._relatedUserFormService.save(this.relatedUserFormForm.value);
      }

      if (!this.isAddModule) {
        // await lastValueFrom(this._relatedUserFormService.update(
        await this._relatedUserFormService.update(
          this.relatedUserFormForm.value,
          this.relatedUserFormId
        );
      }
      this.redirectTo("main/__related-user");

      this.isLoading = false;
    } catch (error: any) {
      if (error.logMessage === "jwt expired") {
        await this.refreshToken();
        this.relatedUserFormSubmit(relatedUserFormDirective);
      } else {
        const message = this._errorHandler.apiErrorMessage(error.message);
        this.isLoading = false;
        this.sendErrorMessage(message);
      }
    }

    this.relatedUserFormForm.reset();
    relatedUserFormDirective.resetForm();
  };
  refreshToken = async () => {
    try {
      // const res: any = await lastValueFrom(this._relatedUserFormService.refreshToken());
      const res: any = await this._relatedUserFormService.refreshToken();
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
