import { Component, Input, OnInit } from '@angular/core';
import { GlobalDataSummary } from 'src/app/models/global-data.model';

@Component({
  selector: 'app-shared',
  templateUrl: './shared.component.html',
  styleUrls: ['./shared.component.css']
})
export class SharedComponent implements OnInit {

  @Input('totalActive')totalActive;
  @Input('totalConfirmed')totalConfirmed;
  @Input('totalDeaths')totalDeaths;
  @Input('totalRecovered')totalRecovered;

  // @Input('countries')countries:GlobalDataSummary[];

  constructor() { }

  ngOnInit(): void {
  }

}
