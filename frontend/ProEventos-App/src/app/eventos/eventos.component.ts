import { Evento } from './../models/Evento';
import { EventoService } from './../services/evento.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-eventos',
  templateUrl: './eventos.component.html',
  styleUrls: ['./eventos.component.scss'],
  //providers: [EventoService]
})
export class EventosComponent implements OnInit {

  public eventos: Evento[] = [];
  public eventosFiltrados: Evento[] = [];
  public widthImg: number = 100;
  public margImg: number = 2;
  isCollapsed: boolean = true;
  private _listFilter: string = '';

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

  constructor(private eventoService: EventoService) { }

  public ngOnInit() {
    this.getEventos();
  }

  public getEventos(): void {
    this.eventoService.getEventos().subscribe(
      (_eventos: Evento[]) => {
        this.eventos = _eventos;
        this.eventosFiltrados = this.eventos;
      },
      erro => console.log(erro)
    );
  }

}
