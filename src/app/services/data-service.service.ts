import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {catchError, map} from 'rxjs/operators';
import { DatewiseData } from '../models/country-data.model';
import { GlobalDataSummary } from '../models/global-data.model';


@Injectable({
  providedIn: 'root'
})
export class DataServiceService {

  private baseUrl = `https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_daily_reports/`;
  private globalDataUrl = '';
  private extension = '.csv';
  

  day;
  month;
  year;

  private datewiseDataUrl = `https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_confirmed_global.csv`;
  
  constructor(private http:HttpClient) { 

    let date = new Date();
    this.day = date.getDate();
    this.month = date.getMonth()+1;
    this.year = date.getFullYear();
    

    
  }

  countries:GlobalDataSummary[]=[];
  countryDatewiseData:DatewiseData[]=[];


  getDay(day:number){
    if(day<10)
      return '0'+day;
    return day;
  }
  getMonth(month:number){
    if(month<10)
      return '0'+month;
    else
      return month; 
  }


  getGlobalData(){
    // console.log("Hello1");
    this.globalDataUrl = `${this.baseUrl}${this.getMonth(this.month)}-${this.getDay(this.day)}-${this.year}${this.extension}`;
    console.log(this.globalDataUrl);
  return this.http.get(this.globalDataUrl, {responseType: 'text'})
  .pipe(
    map(responseData=>{
      let rows = (responseData.split('\n'));
      rows.splice(0,1);
      
      // let globalData : GlobalDataSummary[]=[];
      let countries:GlobalDataSummary[]=[];
      let cols=[];
      
      rows.forEach(element => {
         let cols = element.split(/,(?=\S)/);
          
         let countryWiseData={
          country: cols[3],
          confirmed: +cols[7],
          recovered: +cols[8],
          deaths:  +cols[9],
          active:  +cols[10],
         }
        
         let temp:GlobalDataSummary = countries[countryWiseData.country];

         if(temp){
          temp.active+=countryWiseData.active;
          temp.confirmed+=countryWiseData.confirmed;
          temp.recovered+=countryWiseData.recovered;
          temp.deaths+=countryWiseData.deaths;

          countries[countryWiseData.country] = temp;
        }
         else{
          countries[countryWiseData.country] = countryWiseData;
         }        
        
      });
      
      this.countries = countries;
    
      return  <GlobalDataSummary[]>Object.values(countries);
    }),
    catchError((error : HttpErrorResponse)=>{

      if(error.status == 404)
      {
        this.day = this.day - 1;
        this.globalDataUrl = `${this.baseUrl}${this.getMonth(this.month)}-${this.getDay(this.day)}-${this.year}${this.extension}`;
        return this.getGlobalData();
      }
    })
  )}



  getDatewiseData(country: string){
    return this.http.get(this.datewiseDataUrl,{responseType: 'text'})
    .pipe(
      map(responseData=>{

        let rows = responseData.split('\n');

        let header = rows[0].split(',');
        header.splice(0,4); // Removing Extra Headers except Dates
        rows.splice(0,1); //Removing Header from Rows

        let countryData:DatewiseData[]=[];
        let casesArray=[]; //Array of Cases
        
        // console.log(rows[0]);

        rows.forEach(element => {
          let cols = element.split(',');
          if(cols[1]==country){
            casesArray=cols;
          }
        });

        casesArray.splice(0,4); //Removing extra fields except cases


        for (let index = casesArray.length-1; index >= 0 ; index--) {
          let data={
            date: new Date(Date.parse(header[index])),
            cases: +casesArray[index],
          }
          countryData.push(data);
        }
        // console.log(countryData);

        return <DatewiseData[]>Object.values(countryData);
      })
    );
  }



}
