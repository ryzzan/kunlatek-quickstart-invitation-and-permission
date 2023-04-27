import {
  Injectable
} from '@angular/core';
import { Http } from 'src/app/implementations';
import { deleteCookie, getCookie } from 'src/app/utils/cookie';
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
  COOKIE_DOMAIN = environment.cookieDomain;
  constructor() { }

  setAuthenticationToken = (code: string) => {
    return Http.get({ route: `${this.BASE_URL}/auth/token?code=${code}` });
  };

  getUserData = () => {
    const token = getCookie('auth-token');

    return Http.get({
      route: `${this.BASE_URL}/autentikigo/user/profile`,
      options: {
        headers: {
          'authorization': `${token}`
        }
      }
    });
  };

  getUserPermissions = () => {
    const token = getCookie('auth-token');
    return Http.get({
      route: `${this.BASE_URL}/autentikigo/user/permissions`,
      options: {
        headers: {
          'authorization': `${token}`
        }
      }
    });
  };

  signOut = async () => {
    deleteCookie('auth-token', this.COOKIE_DOMAIN);
    sessionStorage.clear();
  };
}
