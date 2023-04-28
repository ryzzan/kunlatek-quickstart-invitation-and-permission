import {
  Component,
  OnInit
} from '@angular/core';
import {
  FormBuilder,
  FormGroup
} from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import {
  ActivatedRoute, Router
} from '@angular/router';
// import { lastValueFrom } from 'rxjs';
import {
  MyErrorHandler
} from '../../utils/error-handler';
import {
  PersonFormService
} from './person-form.service';
export interface SelectObjectInterface {
  label?: string;
  value?: string;
}
@Component({
  selector: 'app-person-form',
  templateUrl: './person-form.component.html',
  styleUrls: ['./person-form.component.scss']
})
export class PersonFormComponent implements OnInit {
  genderSelectObject = [{
    "label": "Feminino",
    "value": "female"
  }, {
    "label": "Masculino",
    "value": "male"
  }];
  personFormId: string;
  isAddModule: boolean;
  mainDataForm: FormGroup;
  mobileForm: FormGroup;
  isLoading = false;
  isOptional = false;

  constructor(
    private router: Router,
    private _formBuilder: FormBuilder,
    private _activatedRoute: ActivatedRoute,
    private _personFormService: PersonFormService,
    private _errorHandler: MyErrorHandler,
    private _snackbar: MatSnackBar,
  ) {
    this.personFormId = this._activatedRoute.snapshot.params['id'];
    this.isAddModule = !this.personFormId;
    this.mainDataForm = this._formBuilder.group({
      uniqueId: [{
        value: null,
        disabled: false
      },
      []
      ],
      birthday: [{
        value: null,
        disabled: false
      },
      []
      ],
      country: 'br',
      name: [{
        value: null,
        disabled: true
      },
      []
      ],
      gender: [{
        value: null,
        disabled: true
      },
      []
      ],
    });

    this.mobileForm = this._formBuilder.group({
      phone: [{
        value: null,
        disabled: false
      },
      []
      ],
      smsCode: [{
        value: null,
        disabled: false
      },
      []
      ]
    });
  }

  ngOnInit(): void { }

  uniqueIdCheck = () => {

  };

  smsCodeCheck = () => {

  };

  async personFormSubmit() {
    this.isLoading = true;
    const timestamp = this.addHours(new Date(this.mainDataForm.value.birthday), 0);
    this.mainDataForm.value.birthday = new Date(timestamp);
    try {
      // const result: any = await lastValueFrom(this._personFormService.save(this.mainDataForm.value));
      const result: any = await this._personFormService.save(this.mainDataForm.value);
      this.isLoading = false;
      const message = result.message;
      this._errorHandler.apiErrorMessage(result.message);
      this.sendErrorMessage(message);
      this.router.navigate(['/login']);
      this.isLoading = false;
    } catch (error: any) {
      if (error.message) {
        const message = error.message;
        switch (error.message) {
          case 'jwt expired':
            this._errorHandler.apiErrorMessage(error.message);
            this.sendErrorMessage(message);
            this.router.navigate(['/login']);
            this.isLoading = false;
            break;

          default:
            this._errorHandler.apiErrorMessage(error.message);
            this.sendErrorMessage(message);
            this.isLoading = false;
            break;
        }
      }
    }
  }

  addHours = (date: Date, hours: number) => {
    const timestamp = date.setHours(date.getHours() + hours);
    return timestamp;
  };

  sendErrorMessage = (errorMessage: string) => {
    this._snackbar.open(errorMessage, undefined, {
      duration: 4 * 1000,
    });
  };
}
