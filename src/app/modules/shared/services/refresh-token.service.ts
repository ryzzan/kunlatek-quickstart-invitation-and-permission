
import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Http } from "src/app/implementations";
// import { lastValueFrom } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class RefreshTokenService {
  constructor(private _httpClient: HttpClient) { }

  async refreshToken(url: string) {
    // return await lastValueFrom(this._httpClient.get(
    //   `${url}/auth/refresh-token`, {
    //   headers: {
    //     'Authorization': `Bearer ${sessionStorage.getItem('refreshToken')}`
    //   }
    // }));
    return await Http.get({
      route: `${url}/auth/refresh-token`,
      options: {
        headers: {
          'Authorization': `Bearer ${sessionStorage.getItem('refreshToken')}`
        }
      }
    });
  }

}
