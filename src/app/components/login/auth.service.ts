import {
  HttpClient
} from '@angular/common/http';
import {
  Injectable
} from '@angular/core';
import { Http } from 'src/app/implementations';
import { environment } from 'src/environments/environment';

export enum SocialMedia {
  GoogleId = 'googleId',
  AppleId = 'appleId'
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  BASE_URL = environment.baseUrl;
  constructor(private _httpClient: HttpClient) { }

  setAuthenticationToken = (code: string) => {
    // return this._httpClient.get(`${this.BASE_URL}/auth/token?code=${code}`);
    return Http.get({ route: `${this.BASE_URL}/auth/token?code=${code}` });
  };

  getUserData = (token: string) => {
    // return this._httpClient.get(`${this.BASE_URL}/auth/login`, {
    //   headers: {
    //     'authorization': `Bearer ${token}`
    //   }
    // });
    return Http.get({
      route: `${this.BASE_URL}/auth/login`,
      options: {
        headers: {
          'authorization': `Bearer ${token}`
        }
      }
    });
  };

  signOut = async () => {
    sessionStorage.clear();
  };
}
