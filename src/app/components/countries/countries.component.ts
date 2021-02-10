import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { GoogleChartInterface } from 'ng2-google-charts';
import { element } from 'protractor';
import { pipe } from 'rxjs';
import {map} from 'rxjs/operators';
import { DatewiseData } from 'src/app/models/country-data.model';
import { GlobalDataSummary } from 'src/app/models/global-data.model';
import { DataServiceService } from 'src/app/services/data-service.service';

@Component({
  selector: 'app-countries',
  templateUrl: './countries.component.html',
  styleUrls: ['./countries.component.css']
})
export class CountriesComponent implements OnInit {

  GlobalData:GlobalDataSummary[];
  countries:string[]=[];

  countryDatewiseCases:DatewiseData[];

  totalActive=0;
  totalRecovered=0;
  totalConfirmed=0;
  totalDeaths=0;
  loading=true;

  lineChartSwitchChecked = true;


  lineChart:GoogleChartInterface={
    chartType: 'LineChart',
  }

  columnChart:GoogleChartInterface={
    chartType: 'ColumnChart',
  }

  constructor(private dataService: DataServiceService,private router: Router) { }


  initChart(){

    let datatable=[];
    datatable.push(['Cases','Date']);
    this.countryDatewiseCases.forEach(element=>{
      datatable.push([element.cases,element.date]);
    })

    this.columnChart={
      chartType: 'ColumnChart',
      dataTable: datatable,
      options: {height:500},
    }

    this.lineChart={
      chartType: 'LineChart',
      dataTable: datatable,
      options: {height:500},
    }




  }



  ngOnInit(): void {

    this.dataService.getGlobalData()
    .subscribe(
      responseData=>{
        this.GlobalData = responseData;
      
        responseData.forEach(element=>{
          this.countries.push(element.country);
          if(element.country==='India')
          {
            this.totalActive = element.active;
            this.totalConfirmed = element.confirmed;
            this.totalDeaths = element.deaths;
            this.totalRecovered = element.recovered;
          }
        });
        // console.log("Countries");
        // console.log(this.countries);
        
      });

      this.getCountryData('India');
      setTimeout(() => {
        this.initChart(); 
        this.loading=false; 
      }, 1000);
      

  
  }


  getCountryData(country: string){
    this.loading=true;
    this.dataService.getDatewiseData(country)
      .subscribe(
        responseData=>{
          this.countryDatewiseCases=responseData;
          console.log(this.countryDatewiseCases);
        }
      );
  }

    selectCountry(country:string){

      console.log("Selected Country :  " + country);
      this.GlobalData.forEach(element=>{
        if(element.country===country)
        {
          this.totalActive = element.active;
          this.totalConfirmed = element.confirmed;
          this.totalDeaths = element.deaths;      
          this.totalRecovered = element.recovered;
        }
      });

      this.getCountryData(country);
      setTimeout(() => {
        this.initChart(); 
        this.loading=false;        
      }, 500);

    }


    switchChange(event){
      this.lineChartSwitchChecked = event.target.checked;
    }
  
}


