import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-title',
  templateUrl: './title.component.html',
  styleUrls: ['./title.component.scss']
})
export class TitleComponent implements OnInit {
  @Input() title: string = "";
  @Input() iconClass: string = "fa fa-user";
  @Input() subtitulo: string = "Desde 2021";
  @Input() listButton: boolean = false;
  constructor() { }

  ngOnInit() {
  }

}
