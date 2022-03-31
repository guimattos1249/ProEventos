import { Palestrante } from '@app/models/Palestrante';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { PalestranteService } from '@app/services/palestrante.service';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { debounceTime, map, tap } from 'rxjs/operators';

@Component({
  selector: 'app-palestrante-detalhe',
  templateUrl: './palestrante-detalhe.component.html',
  styleUrls: ['./palestrante-detalhe.component.scss']
})
export class PalestranteDetalheComponent implements OnInit {
  public form!: FormGroup;
  public formSituation = '';
  public descriptionColor = '';

  miniCurriculoChanged: Subject<string> = new Subject<string>();

  constructor(
    private fb: FormBuilder,
    public palestranteService: PalestranteService,
    private toastr: ToastrService,
    private spinner: NgxSpinnerService
  ) { }

  ngOnInit() {
    this.validation();
    this.formVerify();
    this.loadPalestrante();
  }

  public validation(): void {
    this.form = this.fb.group({
      miniCurriculo: ['']
    })
  }

  private loadPalestrante(): void {
    this.spinner.show();

    this.palestranteService
      .getPalestrante()
      .subscribe({
        next: (palestrante: Palestrante) => {
          this.form.patchValue(palestrante);
        },
        error: () => this.toastr.error('Erro ao carregar palestrante.', 'Erro!'),
      }).add(() => this.spinner.hide());
  }

  public get f(): any {
    return this.form.controls;
  }

  private formVerify(): void {
    this.form.valueChanges
      .pipe(
        map(() => {
          this.formSituation = 'Minicurriculo está sendo Atualizado';
          this.descriptionColor = 'text-warning';
        }),
        debounceTime(1000)
      )
      .subscribe({
        next: () => {
          this.palestranteService.put({ ... this.form.value }).subscribe({
            next: () => {
              this.formSituation = 'Minicurriculo está foi Atualizado';
              this.descriptionColor = 'text-success';

              setTimeout(() => {
                this.formSituation = 'Minicurriculo foi carregado';
                this.descriptionColor = 'text-muted';
              }, 2000)
            },
            error: () => this.toastr.error('Erro ao salvar Minicurrículo.', 'Erro!'),
          });
        }
      }).add(console.log('e'));
  }

}
