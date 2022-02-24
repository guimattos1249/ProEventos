import { NgxSpinnerService } from 'ngx-spinner';
import { Component, OnInit } from '@angular/core';
import { AbstractControl, Form, FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { BsLocaleService } from 'ngx-bootstrap/datepicker';
import { ToastrService } from 'ngx-toastr';

import { EventoService } from '@app/services/evento.service';
import { LoteService } from '@app/services/lote.service';
import { Evento } from '@app/models/Evento';
import { Lote } from '@app/models/Lote';

@Component({
  selector: 'app-evento-detalhe',
  templateUrl: './evento-detalhe.component.html',
  styleUrls: ['./evento-detalhe.component.scss']
})
export class EventoDetalheComponent implements OnInit {

  eventoId: number;
  evento = {} as Evento;
  public form!: FormGroup;
  saveState = 'post';

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

  constructor(
    private fb: FormBuilder,
    private localeService: BsLocaleService,
    private activatedRouter: ActivatedRoute,
    private eventoService: EventoService,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService,
    private router: Router,
    private loteService: LoteService)
  {
    this.localeService.use('pt-br');
  }

  public loadEvento(): void {
    this.eventoId = +this.activatedRouter.snapshot.paramMap.get('id');

    if(this.eventoId !== null || this.eventoId == 0) {

      this.saveState = 'put';

      this.spinner.show();
      this.eventoService.getEventoById(this.eventoId).subscribe({
        next: (evento: Evento) => {
          this.evento = {... evento};
          this.form.patchValue(this.evento);
        },
        error: (error: any) => {
          this.toastr.error('Erro ao tentar carregar evento', 'Erro!');
          console.error(error);
        },
        complete: () => {}
      }).add(() => this.spinner.hide());
    }
  }

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
      imagemURL: ['', Validators.required],
      lotes: this.fb.array([])
    });
  }

  addLote(): void {
    this.lotes.push(this.criarLote({id: 0} as Lote));
  }

  criarLote(lote: Lote): FormGroup {
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
    this.spinner.show();

    if(this.form.controls.lotes.status){
      this.loteService.saveLotes(this.eventoId, this.form.value.lotes)
        .subscribe({
          next: () => {
            this.toastr.success('Lotes salvos com sucesso!', 'Sucesso!');
            this.lotes.reset();
          },
          error: (error: any) => {
            this.toastr.error('Erro ao tentar salvar lotes.', 'Erro!');
            console.error(error);
          },
        }).add(() => this.spinner.hide());
    }
  }

}
