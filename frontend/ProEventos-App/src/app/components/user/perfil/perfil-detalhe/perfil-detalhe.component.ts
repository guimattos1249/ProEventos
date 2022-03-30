import { PalestranteService } from '@app/services/palestrante.service';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { AbstractControl, AbstractControlOptions, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ValidatorField } from '@app/helpers/ValidatorField';
import { UserUpdate } from '@app/models/Identity/UserUpdate';
import { AccountService } from '@app/services/account.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-perfil-detalhe',
  templateUrl: './perfil-detalhe.component.html',
  styleUrls: ['./perfil-detalhe.component.scss']
})
export class PerfilDetalheComponent implements OnInit {

  @Output() changeFormValue = new EventEmitter();

  userUpdate = {} as UserUpdate;
  public form!: FormGroup;

  constructor(
    private fb: FormBuilder,
    public accountService: AccountService,
    public palestranteService: PalestranteService,
    private router: Router,
    private toastr: ToastrService,
    private spinner: NgxSpinnerService) { }

  ngOnInit() {
    this.validation();
    this.loadUser();
    this.verifyForm();
  }

  private verifyForm(): void {
    this.form.valueChanges.subscribe(
      {
        next: () => this.changeFormValue.emit({ ... this.form.value }),
        error: (error: any) => console.error(error)
      });
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
      imagemURL: [''],
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

  get f(): { [key: string]: AbstractControl } {
    return this.form.controls;
  }

  onSubmit(): void {
    this.updateUser();
  }

  public updateUser() {
    this.userUpdate = { ... this.form.value };
    this.spinner.show();

    if(this.f.funcao.value == 'Palestrante') {
      this.palestranteService.post().subscribe();
    }

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
