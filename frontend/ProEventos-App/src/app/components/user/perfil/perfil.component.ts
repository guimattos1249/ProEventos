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

  userUpdate = {} as UserUpdate;

  public form!: FormGroup;

  get f(): { [key: string]: AbstractControl } {
    return this.form.controls;
  }
  constructor(private fb: FormBuilder,
              public accountService: AccountService,
              private router: Router,
              private toastr: ToastrService,
              private spinner: NgxSpinnerService
    ) { }

  ngOnInit(): void {
    this.validation();
    this.loadUser();
  }

  private loadUser(): void {
    this.spinner.show();
    this.accountService.getUser().subscribe(
      {
        next: (userReturn: UserUpdate) => {
          console.log(userReturn);
          this.userUpdate = userReturn;
          this.form.patchValue(this.userUpdate);
          this.toastr.success('Usuário carregado!', 'Sucesso!');
          // this.lotes.reset();
        },
        error: (error: any) => {
          console.error(error);
          this.toastr.error('Erro ao carregar o Usuário.', 'Erro!');
          this.router.navigate(['/dashboard']);
        },
      }).add(() => this.spinner.hide());
  }

  public validation(): void {
    const formOptions: AbstractControlOptions = {
      validators: ValidatorField.MustMatch('password', 'confirmePassword')
    };

    this.form = this.fb.group({
      userName: [''],
      titulo: ['NaoInformado', Validators.required],
      primeiroNome: ['', [Validators.required,  Validators.minLength(4), Validators.maxLength(50)]],
      ultimoNome: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phoneNumber: ['', Validators.required],
      funcao: ['NaoInformado', Validators.required],
      descricao: [''],
      password: ['', [Validators.minLength(4)]],
      confirmePassword: [''],
    }, formOptions);
  }

  onSubmit(): void {
    this.updateUser();
  }

  public updateUser() {
    this.userUpdate = { ... this.form.value };
    this.spinner.show();

    this.accountService.updateUser(this.userUpdate).subscribe({
      next: () => this.toastr.success('Usuário Atualizado!', 'Sucesso!'),
      error: (error: any) => {
        console.error(error);
        this.toastr.error('Erro ao atualizar o Usuário.', 'Erro!');
      },
    }).add(() => this.spinner.hide());
  }

  public resetForm(event: any): void {
    event.preventDefault();
    this.form.reset();
  }

}
