import {
  HttpClient
} from '@angular/common/http';
import {
  Injectable
} from '@angular/core';
import { Http } from 'src/app/implementations';
import { environment } from 'src/environments/environment';
@Injectable({
  providedIn: 'root',
}) export class PersonFormService {
  BASE_URL = environment.baseUrl;
  constructor(private _httpClient: HttpClient) { }
  save(body: any) {
    return Http.post({
      route: `${this.BASE_URL}/auth/signup/person`,
      body: JSON.stringify(body),
      options: {
        headers: {
          'Authorization': sessionStorage.getItem('tokenToRegister'),
          'Content-Type': 'application/json',
        }
      }
    });
  };
}
