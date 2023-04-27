import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { MenuGuard } from "src/app/guards/menu.guard";
import { TextTransformation } from "src/app/utils/text.transformation";
import { MainComponent } from "./main.component";

export const routes: Routes = [
  {
    path: "",
    redirectTo: "dashboard",
  },
  {
    path: "",
    component: MainComponent,
    children: [
      {
        path: "dashboard",
        loadChildren: () =>
          import("../dashboard/dashboard.module").then(
            (m) => m.DashboardModule
          ),
      },
      {
        path: "__invitation",
        loadChildren: () =>
          import("../invitation/invitation.module").then(
            (m) => m.__InvitationModule
          ),
      },
      {
        path: "__invitation/:id",
        loadChildren: () =>
          import("../invitation/invitation.module").then(
            (m) => m.__InvitationModule
          ),
      },
      {
        path: "__permission-group",
        loadChildren: () =>
          import("../permission/permission.module").then(
            (m) => m.__PermissionGroupModule
          ),
      },
      {
        path: "__permission-group/:id",
        loadChildren: () =>
          import("../permission/permission.module").then(
            (m) => m.__PermissionGroupModule
          ),
      },
      {
        path: "__related-user",
        loadChildren: () =>
          import("../related-user/related-user.module").then(
            (m) => m.__RelatedUserModule
          ),
      },
      {
        path: "__related-user/:id",
        loadChildren: () =>
          import("../related-user/related-user.module").then(
            (m) => m.__RelatedUserModule
          ),
      },
    ],
  },
  {
    path: "**",
    redirectTo: "dashboard",
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MainRoutingModule {
  constructor() {
    const permissionString = sessionStorage.getItem("permission");
    const permissions = permissionString ? JSON.parse(permissionString) : [];

    permissions.forEach((module: any) => {
      let moduleName = `m.${TextTransformation.setIdToClassName(
        module.route
      )}Module`;
      if (routes[1]["children"]) {
        routes[1]["children"].push({
          path: `${module.route}`,
          loadChildren: () =>
            import(
              `../${module.route}/${module.route}.module`
            ).then((m) => eval(moduleName)),
          canActivate: [MenuGuard],
        });
      }
    });
  }
}
