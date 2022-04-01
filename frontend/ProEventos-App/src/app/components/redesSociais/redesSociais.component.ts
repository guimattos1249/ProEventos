import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Component, OnInit, TemplateRef } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { RedeSocial } from '@app/models/RedeSocial';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { RedeSocialService } from '@app/services/redeSocial.service';

@Component({
  selector: 'app-redesSociais',
  templateUrl: './redesSociais.component.html',
  styleUrls: ['./redesSociais.component.scss']
})
export class RedesSociaisComponent implements OnInit {
  modalRef: BsModalRef;
  public eventoId = 0;
  public formRS: FormGroup;
  public redeSocialAtual = { id: 0, nome: '', indice: 0 };

  public get redesSociais(): FormArray {
    return this.formRS.get('redesSociais') as FormArray;
  }

  constructor(
    private fb: FormBuilder,
    private modalService: BsModalService,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService,
    private redeSocialService: RedeSocialService
  ) { }

  ngOnInit() {
    if(this.eventoId === 0) {
      this.loadRedesSociais('palestrante');
    }
    this.validation();
  }

  public loadRedesSociais(origem: string, id: number = 0): void {
    this.spinner.show();

    this.redeSocialService
      .getRedesSociais(origem, id)
      .subscribe({
        next: (redeSocialReturn: RedeSocial[]) => {
          redeSocialReturn.forEach((redeSocial) => {
            this.redesSociais.push(this.createRedeSocial(redeSocial));
          })
        },
        error: (error: any) => this.toastr.error('Erro ao tentar carregar Redes sociais', 'Erro')
      }).add(() => this.spinner.hide());
  }

  public validation(): void {
    this.formRS = this.fb.group({
      redesSociais: this.fb.array([])
    })
  }

  addRedeSocial(): void {
    this.redesSociais.push(this.createRedeSocial({id: 0} as RedeSocial));
  }

  createRedeSocial(redeSocial: RedeSocial): FormGroup {
    return this.fb.group({
      id: [redeSocial.id],
      nome: [redeSocial.nome, Validators.required],
      url: [redeSocial.url, Validators.required]
    });
  }

  public returnTitle(nome: string): string {
    return nome === null || nome == ''
    ? 'Rede Social'
    : nome
  }


  public cssValidator(fieldForm: FormControl | AbstractControl): any {
    return {'is-invalid': fieldForm.errors && fieldForm.touched };
  }

  public saveRedeSociais(): void{
    let origem = 'palestrante';

    if(this.eventoId !== 0) origem = 'evento';

    if(this.formRS.controls.redesSociais.valid){
      this.spinner.show();
      if(this.formRS.controls.redesSociais.status){
        this.redeSocialService.saveRedesSociais(origem, this.eventoId, this.formRS.value.redesSociais)
          .subscribe({
            next: () => {
              this.toastr.success('Redes Sociais salvas com sucesso!', 'Sucesso!');
            },
            error: (error: any) => {
              this.toastr.error('Erro ao tentar salvar Redes Sociais.', 'Erro!');
              console.error(error);
            },
          }).add(() => this.spinner.hide());
      }
    }
  }

  public removeRedeSocial(template: TemplateRef<any>, indice: number): void {
    this.redeSocialAtual.id = this.redesSociais.get(indice + '.id').value;
    this.redeSocialAtual.nome = this.redesSociais.get(indice + '.nome').value;
    this.redeSocialAtual.indice = indice;


    this.modalRef = this.modalService.show(template, { class: 'modal-sm' });
  }

  public confirmDeleteRedeSocial(): void {
    let origem = 'palestrante';

    this.modalRef.hide();
    this.spinner.show();

    if(this.eventoId !== 0) origem = 'evento';

    this.redeSocialService.deleteRedeSocial(origem, this.eventoId, this.redeSocialAtual.id).subscribe({
      next: () => {
        this.toastr.success('Rede Sociai excluída com sucesso!', 'Sucesso!');
        this.redesSociais.removeAt(this.redeSocialAtual.indice);
      },
      error: (error: any) => {
        this.toastr.error(`Erro ao tentar deletar redeSocial ${this.redeSocialAtual.nome}.`, 'Erro!');
        console.error(error);
      },
    }).add(() => this.spinner.hide());
  }

  public declineDeleteRedeSocial(): void {
    this.modalRef.hide();
  }
}
