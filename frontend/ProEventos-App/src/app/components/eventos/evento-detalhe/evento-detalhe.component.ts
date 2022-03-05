import { environment } from './../../../../environments/environment';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { NgxSpinnerService } from 'ngx-spinner';
import { Component, OnInit, TemplateRef } from '@angular/core';
import { AbstractControl, Form, FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { BsLocaleService } from 'ngx-bootstrap/datepicker';
import { ToastrService } from 'ngx-toastr';

import { EventoService } from '@app/services/evento.service';
import { LoteService } from '@app/services/lote.service';
import { Evento } from '@app/models/Evento';
import { Lote } from '@app/models/Lote';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';

@Component({
  selector: 'app-evento-detalhe',
  templateUrl: './evento-detalhe.component.html',
  styleUrls: ['./evento-detalhe.component.scss']
})
export class EventoDetalheComponent implements OnInit {
  modalRef: BsModalRef;
  eventoId: number;
  evento = {} as Evento;
  public form!: FormGroup;
  saveState = 'post';
  loteAtual = {id: 0, nome: '', indice: 0};
  imagemURL = 'assets/img/upload.png';
  file: File;

  get editMode(): boolean {
    return this.saveState === 'put';
  }

  get lotes(): FormArray {
    return this.form.get('lotes') as FormArray;
  }

  get f(): any{
    return this.form.controls;
  }

  get bsConfig(): any {
    return {
      isAnimated: true,
      adaptivePosition: true ,
      dateInputFormat: 'DD/MM/YYYY hh:mm a',
      containerClass: 'theme-default',
      showWeekNumbers: false
    };
  }

  get bsConfigLote(): any {
    return {
      isAnimated: true,
      adaptivePosition: true ,
      dateInputFormat: 'DD/MM/YYYY',
      containerClass: 'theme-default',
      showWeekNumbers: false
    };
  }

  constructor(
    private fb: FormBuilder,
    private localeService: BsLocaleService,
    private activatedRouter: ActivatedRoute,
    private eventoService: EventoService,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService,
    private router: Router,
    private loteService: LoteService,
    private modalService: BsModalService)
  {
    this.localeService.use('pt-br');
  }

  public loadEvento(): void {
    this.eventoId = +this.activatedRouter.snapshot.paramMap.get('id');

    if(this.eventoId !== null && this.eventoId !== 0) {

      this.saveState = 'put';

      this.spinner.show();
      this.eventoService.getEventoById(this.eventoId).subscribe({
        next: (evento: Evento) => {
          this.evento = {... evento};
          this.form.patchValue(this.evento);
          console.log(this.evento.imagemURL)
          if(this.evento.imagemURL){
            this.imagemURL =  environment.apiURL + 'resources/images/' + this.evento.imagemURL;
          }
          this.evento.lotes.forEach(lote => {
            this.lotes.push(this.createLote(lote));
          });
          // this.loadLotes();
        },
        error: (error: any) => {
          this.toastr.error('Erro ao tentar carregar evento', 'Erro!');
          console.error(error);
        },
      }).add(() => this.spinner.hide());
    }
  }

  // public loadLotes(): void {
  //   this.loteService.getLotesByEventoId(this.eventoId).subscribe({
  //     next: (lotes: Lote[]) => {
  //       lotes.forEach(lote => {
  //         this.lotes.push(this.createLote(lote));
  //       });
  //     },
  //     error: (error: any) => {
  //       this.toastr.error('Erro ao tentar carregar evento', 'Erro!');
  //       console.error(error);
  //     },
  //   }).add(() => this.spinner.hide());
  // }

  ngOnInit(): void {
    this.loadEvento();
    this.validation();
  }

  public validation(): void {
    this.form = this.fb.group({
      tema: ['', [Validators.required,  Validators.minLength(4), Validators.maxLength(50)]],
      local: ['', Validators.required],
      dataEvento: ['', Validators.required],
      qtdPessoa: ['', [Validators.required, Validators.max(120000)]],
      telefone: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      imagemURL: [''],
      lotes: this.fb.array([])
    });
  }

  addLote(): void {
    this.lotes.push(this.createLote({id: 0} as Lote));
  }

  createLote(lote: Lote): FormGroup {
    return this.fb.group({
      id: [lote.id],
      nome: [lote.nome, Validators.required],
      quantidade: [lote.quantidade, Validators.required],
      preco: [lote.preco, Validators.required],
      dataInicio: [lote.dataInicio],
      dataFim: [lote.dataFim],
    });
  }

  public resetForm(event: any): void {
    event.preventDefault();
    this.form.reset();
  }

  public cssValidator(fieldForm: FormControl | AbstractControl): any {
    return {'is-invalid': fieldForm.errors && fieldForm.touched };
  }

  public saveEvento(): void {
    this.spinner.show();

    if(this.form.valid) {

      this.evento = this.saveState === 'post'
                    ? {... this.form.value}
                    : this.evento = {id: this.evento.id, ... this.form.value};


      this.eventoService[this.saveState](this.evento).subscribe({
        next: (eventoRetorno: Evento) => {
          this.toastr.success('Evento salvo com sucesso!', 'Sucesso!');
          this.router.navigate([`eventos/detalhe/${eventoRetorno.id}`]);
        },
        error: (error: any) => {
          this.toastr.error('Erro ao tentar salvar evento.', 'Erro!');
          console.error(error);
        },
      }).add(() => this.spinner.hide());;
    }
  }

  public saveLotes(): void{
    if(this.form.controls.lotes.valid){
      this.spinner.show();

      if(this.form.controls.lotes.status){
        this.loteService.saveLotes(this.eventoId, this.form.value.lotes)
          .subscribe({
            next: () => {
              this.toastr.success('Lotes salvos com sucesso!', 'Sucesso!');
              // this.lotes.reset();
            },
            error: (error: any) => {
              this.toastr.error('Erro ao tentar salvar lotes.', 'Erro!');
              console.error(error);
            },
          }).add(() => this.spinner.hide());
      }
    }
  }

  public removeLote(template: TemplateRef<any>, indice: number): void {
    this.loteAtual.id = this.lotes.get(indice + '.id').value;
    this.loteAtual.nome = this.lotes.get(indice + '.nome').value;
    this.loteAtual.indice = indice;


    this.modalRef = this.modalService.show(template, { class: 'modal-sm' });
  }

  public confirmDeleteLote(): void {
    this.modalRef.hide();
    this.spinner.show();

    this.loteService.deleteLote(this.eventoId, this.loteAtual.id).subscribe({
      next: () => {
        this.toastr.success('Lotes salvos com sucesso!', 'Sucesso!');
        this.lotes.removeAt(this.loteAtual.indice);
      },
      error: (error: any) => {
        this.toastr.error(`Erro ao tentar deletar lote ${this.loteAtual.nome}.`, 'Erro!');
        console.error(error);
      },
    }).add(() => this.spinner.hide());
  }

  public declineDeleteLote(): void {
    this.modalRef.hide();
  }

  public returnLoteTitle(nome: string): string {
    return nome === null || nome == ''
    ? 'Nome do Lote'
    : nome
  }

  onFileChange(ev: any): void {
    const reader = new FileReader();

    reader.onload = (event: any) => {this.imagemURL = event.target.result;}

    this.file = ev.target.files;
    reader.readAsDataURL(this.file[0]);

    this.uploadImage();
  }

  uploadImage(): void {
    this.spinner.show();
    this.eventoService.postUpload(this.eventoId, this.file).subscribe({
      next: () => {
        this.loadEvento();
        this.toastr.success('Imagem Atualizada com Sucesso!', 'Sucesso!');
      },
      error: (error: any) => {
        this.toastr.error(`Erro ao tentar atualizar imagem.`, 'Erro!');
        console.error(error);
      },
    }).add(() => this.spinner.hide());
  }

}
