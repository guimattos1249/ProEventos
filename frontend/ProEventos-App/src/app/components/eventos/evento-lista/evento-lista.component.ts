import { PaginatedResult } from './../../../models/Pagination';
import { Router } from '@angular/router';
import { Component, OnInit, TemplateRef } from '@angular/core';

import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';

import { Evento } from '@app/models/Evento';
import { EventoService } from '@app/services/evento.service';
import { environment } from '@environments/environment';
import { Pagination } from '@app/models/Pagination';

@Component({
  selector: 'app-evento-lista',
  templateUrl: './evento-lista.component.html',
  styleUrls: ['./evento-lista.component.scss']
})
export class EventoListaComponent implements OnInit {
  modalRef?: BsModalRef;
  public eventos: Evento[] = [];
  public eventosFiltrados: Evento[] = [];
  public eventoId: number = 0;
  public pagination = {} as Pagination;

  public widthImg: number = 100;
  public margImg: number = 2;
  isCollapsed: boolean = true;
  private _listFilter: string = '';


  constructor(
    private eventoService: EventoService,
    private modalService: BsModalService,
    private toastr: ToastrService,
    private spinner: NgxSpinnerService,
    private router: Router
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
    this.pagination = {currentPage: 1, itemsPerPage: 3, totalItems: 1} as Pagination;
    this.getEventos();
  }

  public getEventos(): void {
    this.spinner.show();
    this.eventoService.getEventos(this.pagination.currentPage, this.pagination.itemsPerPage).subscribe({
      next: (paginatedResult: PaginatedResult<Evento[]>) => {
        this.eventos = paginatedResult.result;
        this.eventosFiltrados = this.eventos;
        this.pagination  = paginatedResult.pagination;
      },
      error: (error: any) => this.toastr.error('Erro ao carregar os eventos.', 'Erro!'),
    }).add(() => this.spinner.hide());
  }

  public showImage(imageURL: string): string {
    return (imageURL)
      ? `${environment.apiURL}resources/images/${imageURL}`
      : 'assets/img/semImg.png'
  }

  openModal(event: any, template: TemplateRef<any>, eventoId: number): void {
    event.stopPropagation();
    this.eventoId = eventoId;
    this.modalRef = this.modalService.show(template, {class: 'modal-sm'});
  }

  public pageChanged(event): void {
    this.pagination.currentPage = event.page;
    this.getEventos();
  }

  confirm(): void {
    this.modalRef?.hide();
    this.spinner.show();

    this.eventoService.deleteEvento(this.eventoId).subscribe({
      next: (result: string) => {
        console.log(result)
        this.toastr.success('Evento Deletado.', 'Deletado!');
        this.getEventos();
      },
      error: (error: any) => {
        console.error(error);
        this.toastr.error(`Erro ao tentar deletar o evento ${this.eventoId}.`, 'Erro!');
      },
      complete: () => {}
    }).add(() => this.spinner.hide());


  }

  decline(): void {
    this.modalRef?.hide();
  }

  detailEvento(id: number): void {
    this.router.navigate([`eventos/detalhe/${id}`]);
  }
}
