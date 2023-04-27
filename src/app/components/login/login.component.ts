import { Component } from "@angular/core";
import { AuthService } from "./auth.service";

import { ActivatedRoute, Router } from "@angular/router";
import { MyErrorHandler } from "../../utils/error-handler";

import { MatSnackBar } from "@angular/material/snack-bar";
// import { lastValueFrom } from "rxjs";
import { getCookie } from "src/app/utils/cookie";
import { environment } from "src/environments/environment";
import { ICompany, IPerson } from "../../interfaces/autentikigo";

export interface ParamsI {
  token?: string;
}

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.scss"],
})
export class LoginComponent {
  user?: any;
  loggedIn = false;
  isLoading = true;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private _auth: AuthService,
    private _errorHandler: MyErrorHandler,
    private _snackbar: MatSnackBar
  ) {
    this.setAuthentication();
  }

  signInWithGoogle = () => {
    this.isLoading = true;
    window.location.replace(`${environment.baseUrl}/auth/login/google`);
  };

  signInWithApple = () => {
    this.isLoading = true;
    window.location.replace(`${environment.baseUrl}/auth/login/apple`);
  };

  setAuthentication = async () => {
    // this._auth.signOut();

    try {
      const authToken = getCookie('auth-token');
      const signupToken = getCookie('signup-token');

      if (authToken) {
        const profileResult: any = (await this._auth.getUserData()).data;
        const permissionResult: any = (await this._auth.getUserPermissions()).data;

        if (profileResult?.corporateName) this.setCompanySessionStorage(profileResult as ICompany, permissionResult);
        else this.setPersonSessionStorage(profileResult as IPerson, permissionResult);

        this.router.navigate(["/main"]);
      } else if (signupToken) {
        sessionStorage.setItem("tokenToRegister", signupToken);
        this.router.navigate(["/signup"]);
      }

    } catch (error: any) {
      const message = this._errorHandler.apiErrorMessage(error.message);
      this.sendErrorMessage(message);
    }

    this.isLoading = false;

    if (sessionStorage.getItem("_id")) {
      this.router.navigate(["/main"]);
    }
  };

  setPersonSessionStorage = (profile: IPerson, permissions: any[]) => {
    sessionStorage.setItem("_id", profile.userId._id);
    sessionStorage.setItem("email", profile.userId.email);
    sessionStorage.setItem("permission", JSON.stringify(permissions));

    sessionStorage.setItem("birthday", profile.birthday);
    sessionStorage.setItem("country", profile.country);
    sessionStorage.setItem("gender", profile.gender);
    sessionStorage.setItem("mother", profile.mother);
    sessionStorage.setItem("name", profile.name);
    sessionStorage.setItem("uniqueId", profile.uniqueId);
    sessionStorage.setItem("personId", profile._id);
  };

  setCompanySessionStorage = (profile: ICompany, permissions: any[]) => {
    sessionStorage.setItem("_id", profile.userId._id);
    sessionStorage.setItem("email", profile.userId.email);
    sessionStorage.setItem("permission", JSON.stringify(permissions));

    sessionStorage.setItem("birthday", profile.birthday);
    sessionStorage.setItem("cnae", profile.cnae);
    sessionStorage.setItem("corporateName", profile.corporateName);
    sessionStorage.setItem("tradeName", profile.tradeName);
    sessionStorage.setItem("companyEmail", profile.email);
    sessionStorage.setItem("responsible", profile.responsible);
    sessionStorage.setItem("uniqueId", profile.uniqueId);
    sessionStorage.setItem("companyId", profile._id);
  };

  sendErrorMessage = (errorMessage: string) => {
    this._snackbar.open(errorMessage, undefined, {
      duration: 4 * 1000,
    });
  };
}

