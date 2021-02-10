import { Component, Input, OnInit } from '@angular/core';
import { DataServiceService } from 'src/app/services/data-service.service';

import { GoogleChartInterface } from 'ng2-google-charts';
import { GlobalDataSummary } from 'src/app/models/global-data.model';
import { connectableObservableDescriptor } from 'rxjs/internal/observable/ConnectableObservable';
import { Router } from '@angular/router';
import { concatMapTo } from 'rxjs/operators';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  totalActive=0;
  totalConfirmed=0;
  totalDeaths=0;
  totalRecovered=0;
  loading  = true;

  pieChartSwitchChecked = true;
  
  globalData:GlobalDataSummary[];

  pieChart:GoogleChartInterface={
    chartType: 'PieChart',
  }

  columnChart:GoogleChartInterface={
    chartType: 'ColumnChart',
  }


  constructor(private dataService: DataServiceService,private router : Router) { }

  initChart(caseType: string){

    let datatable = [];
    datatable.push(['Country','Cases']);

    this.globalData.forEach(element=>{
      
      let value:number;
      if(caseType == 'confirmed'){
          if(element.confirmed > 50000)
            value=element.confirmed;
        }
      
      if(caseType == 'deaths'){
        if(element.deaths > 50000)
          value=element.deaths;
      }

      if(caseType == 'recovered'){
        if(element.recovered > 50000)
          value=element.recovered;
      }

      if(caseType == 'active'){
        if(element.active > 50000)
          value=element.active;
      }

      datatable.push([element.country,value]);
      })

    this.pieChart={
      chartType : 'PieChart',
      dataTable : datatable,
      options: {height:500}
    }

    this.columnChart={
      chartType : 'ColumnChart',
      dataTable : datatable,
      options: {height:500}
    }

    
  }


  ngOnInit(): void {
    console.log("ngonit called");
    console.log(this.globalData);
 

    this.dataService.getGlobalData()
    .subscribe({
      next:(responseData)=>{

        console.log(responseData);
        this.globalData = responseData;
        console.log("Global Data Chanegd"); 
        console.log(this.globalData);
        responseData.forEach(element => {
          // this.loading=true;
          if(!Number.isNaN(element.confirmed)){
            this.totalConfirmed+=element.confirmed;
            this.totalDeaths+=element.deaths;
            this.totalRecovered+=element.recovered;
            this.totalActive+=element.active;
          }
        
          setTimeout(() => {
            this.initChart('confirmed');
            this.loading=false;              
          }, 1000);
        
        })
        
        // console.log(this.globalData);
      }
    });


  }

  switchChange(event){
    this.pieChartSwitchChecked = event.target.checked;
  }

  updateChart(caseType: HTMLInputElement){
    console.log(caseType.value);
    this.loading=true;

    setTimeout(() => {
      this.initChart(caseType.value);
      this.loading=false;      
    }, 500);

  }

}
