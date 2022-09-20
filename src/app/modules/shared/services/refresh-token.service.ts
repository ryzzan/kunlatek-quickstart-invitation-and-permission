
import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { lastValueFrom } from "rxjs";
import { environment } from "src/environments/environment";

@Injectable({
  providedIn: "root",
})
export class RefreshTokenService {
  BASE_URL = environment.baseUrl;

  constructor(private _httpClient: HttpClient) { }

  refreshToken() {
    return lastValueFrom(this._httpClient.get(
      `${this.BASE_URL}/auth/refresh-token`, {
      headers: {
        'Authorization': `Bearer ${sessionStorage.getItem('refreshToken')}`
      }
    }));
  }

}
