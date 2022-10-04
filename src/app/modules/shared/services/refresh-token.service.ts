
import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { lastValueFrom } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class RefreshTokenService {
  constructor(private _httpClient: HttpClient) { }

  refreshToken(url: string) {
    return await lastValueFrom(this._httpClient.get(
      `${url}/auth/refresh-token`, {
      headers: {
        'Authorization': `Bearer ${sessionStorage.getItem('refreshToken')}`
      }
    }));
  }

}
