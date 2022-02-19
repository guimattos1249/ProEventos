import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-title',
  templateUrl: './title.component.html',
  styleUrls: ['./title.component.scss']
})
export class TitleComponent implements OnInit {
  @Input() title: string = "";
  @Input() iconClass: string = "fa fa-user";
  @Input() subtitle: string = "Desde 2021";
  @Input() listButton: boolean = false;

  constructor(private router: Router) { }

  ngOnInit() {
  }

  list(): void {
    this.router.navigate([`/${this.title.toLocaleLowerCase()}/lista`])
  }

}
