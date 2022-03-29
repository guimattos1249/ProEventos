import { User } from '@app/models/Identity/User';
import { UserUpdate } from './../../../models/Identity/UserUpdate';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { AccountService } from './../../../services/account.service';
import { Component, OnInit } from '@angular/core';
import { AbstractControl, AbstractControlOptions, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ValidatorField } from '@app/helpers/ValidatorField';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.scss']
})
export class PerfilComponent implements OnInit {
  user = {} as UserUpdate;

  constructor() { }

  ngOnInit(): void {

  }

  public setFormValue(user: UserUpdate): void {
    this.user = user;
  }

  get f(): any{
    return '';
  }

}
