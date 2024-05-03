import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {
  addmision: number = 0;
  BloodBank: number = 0;
  suppliers: number = 0;

  private apiUrl:string = "http://localhost:3000/api/v1/customers";

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    // Make HTTP GET request to retrieve user counts for each type
    this.http.get<any>(this.apiUrl).subscribe(
      (res: any) => {
        if (res && res.customers) {
          for (const customer of res.customers) {
            if(customer?.userType=="admission")this.addmision++;
            if(customer?.userType=="blood bank")this.BloodBank++;
            if(customer?.userType=="supplier")this.suppliers++;
          }
        }
        
        
      },
      (error: any) => {
        console.error('Error fetching user counts:', error);
      }
    );
  }
}
