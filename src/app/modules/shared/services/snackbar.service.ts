
import { Injectable } from "@angular/core";
import { MatSnackBar } from "@angular/material/snack-bar";

@Injectable({
  providedIn: "root",
})
export class SnackBarService {
  constructor(private _snackbar: MatSnackBar) { }

  open(message: string, duration = 4 * 1000) {
    this._snackbar.open(message, 'Ok', {
      duration,
    });
  };
}
