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
import { deleteCookie } from 'src/app/utils/cookie';
import { environment } from 'src/environments/environment';
import {
  MyErrorHandler
} from '../../utils/error-handler';
import {
  CompanyFormService
} from './company-form.service';
@Component({
  selector: 'app-company-form',
  templateUrl: './company-form.component.html',
  styleUrls: ['./company-form.component.scss']
})
export class CompanyFormComponent implements OnInit {
  companyFormId: string;
  isAddModule: boolean;
  mainDataForm: FormGroup;
  mobileForm: FormGroup;
  isLoading = false;
  isOptional = false;
  COOKIE_DOMAIN = environment.cookieDomain;

  constructor(
    private router: Router,
    private _formBuilder: FormBuilder,
    private _activatedRoute: ActivatedRoute,
    private _companyFormService: CompanyFormService,
    private _errorHandler: MyErrorHandler,
    private _snackbar: MatSnackBar
  ) {
    this.companyFormId = this._activatedRoute.snapshot.params['id'];
    this.isAddModule = !this.companyFormId;
    this.mainDataForm = this._formBuilder.group(
      {
        country: 'br',
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
        companyName: [{
          value: null,
          disabled: true
        },
        []
        ],
        businessName: [{
          value: null,
          disabled: true
        },
        []
        ]
      }
    );

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

  async companyFormSubmit() {
    this.isLoading = true;
    const timestamp = this.addHours(new Date(this.mainDataForm.value.birthday), 3);
    this.mainDataForm.value.birthday = new Date(timestamp).getTime();
    try {
      // const result: any = await lastValueFrom(this._companyFormService.save(this.mainDataForm.value));
      const result: any = await this._companyFormService.save(this.mainDataForm.value);
      this.isLoading = false;
      const message = result.message;
      this._errorHandler.apiErrorMessage(result.message);
      this.sendErrorMessage(message);
      deleteCookie('signup-token', this.COOKIE_DOMAIN);
      this.router.navigate(['/login']);
    } catch (error: any) {
      this.isLoading = false;

      if (error.message) {
        const message = this._errorHandler.apiErrorMessage(error.message);
        switch (error.message) {
          case 'jwt expired':
            this.sendErrorMessage(message);
            this.router.navigate(['/login']);
            break;

          default:
            this.sendErrorMessage(message);
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
