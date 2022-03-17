import { ToastrService } from 'ngx-toastr';
import { AccountService } from './../../../services/account.service';
import { ValidatorField } from './../../../helpers/ValidatorField';
import { Component, OnInit } from '@angular/core';
import { AbstractControl, AbstractControlOptions, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { User } from '@app/models/Identity/User';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.scss']
})
export class RegistrationComponent implements OnInit {
  user = {} as User;

  public form!: FormGroup;

  get f(): { [key: string]: AbstractControl } {
    return this.form.controls;
  }
  constructor(private fb: FormBuilder,
              private accountService: AccountService,
              private router: Router,
              private toastr: ToastrService,
              private spinner: NgxSpinnerService) { }

  ngOnInit(): void {
    this.validation();
  }

  public validation(): void {
    const formOptions: AbstractControlOptions = {
      validators: ValidatorField.MustMatch('password', 'confirmePassword')
    };

    this.form = this.fb.group({
      primeiroNome: ['', [Validators.required,  Validators.minLength(4), Validators.maxLength(50)]],
      ultimoNome: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      userName: ['', [Validators.required, Validators.minLength(4)]],
      password: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(20)]],
      confirmePassword: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(20)]],
      termos: ['', Validators.requiredTrue],
    }, formOptions);
  }

  public register(): void {
    this.spinner.show();
    this.user = { ... this.form.value };
    this.accountService.register(this.user).subscribe({
      next: () => this.router.navigateByUrl('/dashboard'),
      error: (error: any) => this.toastr.error(error.console.error())
    }).add(() => this.spinner.hide());
  }

}
