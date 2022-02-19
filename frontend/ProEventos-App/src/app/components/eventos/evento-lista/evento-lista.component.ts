import { Component, OnInit, TemplateRef } from '@angular/core';

import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';

import { Evento } from 'src/app/models/Evento';
import { EventoService } from 'src/app/services/evento.service';

@Component({
  selector: 'app-evento-lista',
  templateUrl: './evento-lista.component.html',
  styleUrls: ['./evento-lista.component.scss']
})
export class EventoListaComponent implements OnInit {
  modalRef?: BsModalRef;
  public eventos: Evento[] = [];
  public eventosFiltrados: Evento[] = [];
  public widthImg: number = 100;
  public margImg: number = 2;
  isCollapsed: boolean = true;
  private _listFilter: string = '';

  constructor(
    private eventoService: EventoService,
    private modalService: BsModalService,
    private toastr: ToastrService,
    private spinner: NgxSpinnerService
  ) { }

  public get listFilter(): string {
    return this._listFilter;
  }

  public set listFilter(value: string) {
    this._listFilter = value;
    this.eventosFiltrados = this._listFilter ? this.filteredEvents(this.listFilter) : this.eventos;
  }

  public filteredEvents(listFilter: string): Evento[] {
    listFilter = listFilter.toLocaleLowerCase();
    return this.eventos.filter(
      (evento: {tema: string; local: string}) =>
        evento.tema.toLocaleLowerCase().indexOf(listFilter) !== -1 ||
        evento.local.toLocaleLowerCase().indexOf(listFilter) !== -1

    );
  }

  public ngOnInit() {
    this.spinner.show();
    this.getEventos();
  }

  public getEventos(): void {
    this.eventoService.getEventos().subscribe({
      next: (_eventos: Evento[]) => {
        this.eventos = _eventos;
        this.eventosFiltrados = this.eventos;
      },
      error: (erro: any) => {
        this.spinner.hide();
        this.toastr.error('Erro ao carregar os eventos.', 'Erro!');
      },
      complete: () => this.spinner.hide()
    });
  }

  openModal(template: TemplateRef<any>): void {
    this.modalRef = this.modalService.show(template, {class: 'modal-sm'});
  }

  confirm(): void {
    this.modalRef?.hide();
    this.toastr.success('Evento Deletado.', 'Deletado!');
  }

  decline(): void {
    this.modalRef?.hide();
  }
}
