
import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Http } from "src/app/implementations";

@Injectable({
  providedIn: "root",
})
export class RelatedUserFormService {
  BASE_URL = "http://localhost:3000";

  constructor(private _httpClient: HttpClient) { }


  getAll(filter: string = "") {
    // return this._httpClient.get(
    //   `${this.BASE_URL}/__related-users${filter}`, {
    //   headers: {
    //     "Authorization": `Bearer ${sessionStorage.getItem("token")}`
    //   }
    // }
    // );
    return Http.get({
      route: `${this.BASE_URL}/__related-users${filter}`,
      options: {
        headers: {
          "Authorization": `Bearer ${sessionStorage.getItem("token")}`
        }
      }
    });
  };

  delete(id: string) {
    // return this._httpClient.delete(
    //   `${this.BASE_URL}/__related-users/${id}`,
    //   {
    //     headers: {
    //       "Authorization": `Bearer ${sessionStorage.getItem("token")}`
    //     }
    //   }
    // );
    return Http.delete({
      route: `${this.BASE_URL}/__related-users/${id}`,
      options: {
        headers: {
          "Authorization": `Bearer ${sessionStorage.getItem("token")}`
        }
      }
    });
  };

  save(body: any) {
    // return this._httpClient.post(
    //   `${this.BASE_URL}/__related-users`,
    //   body,
    //   {
    //     headers: {
    //       "Authorization": `Bearer ${sessionStorage.getItem("token")}`
    //     }
    //   }
    // );
    return Http.post({
      route: `${this.BASE_URL}/__related-users`,
      body: JSON.stringify(body),
      options: {
        headers: {
          "Authorization": `Bearer ${sessionStorage.getItem("token")}`,
          'Content-Type': 'application/json',
        }
      }
    });
  };

  update(body: any, id: string) {
    // return this._httpClient.put(
    //   `${this.BASE_URL}/__related-users/${id}`,
    //   body,
    //   {
    //     headers: {
    //       "Authorization": `Bearer ${sessionStorage.getItem("token")}`
    //     }
    //   }
    // );
    return Http.put({
      route: `${this.BASE_URL}/__related-users/${id}`,
      body: JSON.stringify(body),
      options: {
        headers: {
          "Authorization": `Bearer ${sessionStorage.getItem("token")}`,
          'Content-Type': 'application/json',
        }
      }
    });
  };

  find(id: string) {
    // return this._httpClient.get(
    //   `${this.BASE_URL}/__related-users/${id}`,
    //   {
    //     headers: {
    //       "Authorization": `Bearer ${sessionStorage.getItem("token")}`
    //     }
    //   }
    // );
    return Http.get({
      route: `${this.BASE_URL}/__related-users/${id}`,
      options: {
        headers: {
          "Authorization": `Bearer ${sessionStorage.getItem("token")}`
        }
      }
    });
  };

  permissionGroupIdSelectObjectGetAll(filter: string = "") {
    // return this._httpClient.get(
    //   `${this.BASE_URL}/__permission-groups${filter}`, {
    //   headers: {
    //     "Authorization": `Bearer ${sessionStorage.getItem("token")}`
    //   }
    // }
    // );
    return Http.get({
      route: `${this.BASE_URL}/__permission-groups${filter}`,
      options: {
        headers: {
          "Authorization": `Bearer ${sessionStorage.getItem("token")}`
        }
      }
    });
  }



  refreshToken() {
    // return this._httpClient.get(
    //   `${this.BASE_URL}/auth/refresh-token`, {
    //   headers: {
    //     'Authorization': `Bearer ${sessionStorage.getItem('refreshToken')}`
    //   }
    // }
    // );
    return Http.get({
      route: `${this.BASE_URL}/auth/refresh-token`,
      options: {
        headers: {
          'Authorization': `Bearer ${sessionStorage.getItem('refreshToken')}`
        }
      }
    });
  }

}
