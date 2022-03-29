import { environment } from '@environments/environment';
import { UserUpdate } from '@app/models/Identity/UserUpdate';
import { NgxSpinnerService } from 'ngx-spinner';
import { AccountService } from '@app/services/account.service';
import { ToastrService } from 'ngx-toastr';
import { Component, OnInit } from '@angular/core';



@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.scss']
})
export class PerfilComponent implements OnInit {
  user = {} as UserUpdate;
  public imagemURL = '';
  public file: File;

  public get isPalestrante(): boolean {
    return this.user.funcao === 'Palestrante';
  }

  constructor(
    private spinner: NgxSpinnerService,
    private toastr: ToastrService,
    private accountService: AccountService) { }

  ngOnInit(): void {

  }

  public setFormValue(user: UserUpdate): void {
    this.user = user;
    if(this.user.imagemURL)
      this.imagemURL = environment.apiURL + `resources/perfil/${this.user.imagemURL}`;
    else
      this.imagemURL = `./assets/img/perfil.png`;
  }

  onFileChange(ev: any): void {
    const reader = new FileReader();

    reader.onload = (event: any) => {this.imagemURL = event.target.result;}

    this.file = ev.target.files;
    reader.readAsDataURL(this.file[0]);

    this.uploadImage();
  }

  private uploadImage(): void {
    this.spinner.show();
    this.accountService.postUpload(this.file).subscribe({
      next: () =>
        this.toastr.success('Imagem Atualizada com Sucesso!', 'Sucesso!'),
      error: (error: any) => {
        this.toastr.error(`Erro ao tentar atualizar imagem.`, 'Erro!');
        console.error(error);
      },
    }).add(() => this.spinner.hide());
  }

}
