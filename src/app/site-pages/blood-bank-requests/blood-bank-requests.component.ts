import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';

import { AuthUserService } from 'src/app/services/auth/auth-user.service';

@Component({
  selector: 'app-blood-bank-requests',
  templateUrl: './blood-bank-requests.component.html',
  styleUrls: ['./blood-bank-requests.component.css']
})
export class BloodBankRequestsComponent implements OnInit {
  private apiUrl: string = "http://localhost:3000/api/v1/RequestBloodBags";
  RequestBloodData: any[] = [];
  filteredRequestBloodData: any[] = [];
  isDropdownOpen: boolean = false;
  private id: string = "";

  public setLoading: boolean = false;
  filters = [
    { id: 'filter-radio-example-1', value: 'last-day', label: 'Last day' },
    { id: 'filter-radio-example-2', value: 'last-7-days', label: 'Last 7 days' },
    { id: 'filter-radio-example-3', value: 'last-30-days', label: 'Last 30 days' },
    { id: 'filter-radio-example-4', value: 'last-month', label: 'Last month' },
    { id: 'filter-radio-example-5', value: 'last-year', label: 'Last year' },
  ];

  user: any;

  constructor(private fb: FormBuilder,
     private http: HttpClient, private auth: AuthUserService,private router:Router) { }

  ngOnInit(): void {
    
    this.getRequestDataFromBloodbank();
  
  }

  getRequestDataFromBloodbank(): void {
    this.http.get(this.apiUrl).subscribe(
      (RequestBloodData: any) => {
        console.log(RequestBloodData)
        this.RequestBloodData = RequestBloodData.requestBloodBag
        this.filteredRequestBloodData = [...this.RequestBloodData];
        console.log('RequestBloodData:', this.RequestBloodData);
      },
      (error: any) => {
        console.error('Error fetching RequestBloodData:', error);
      }
    );
  }

  public formatReadableDate(dateString: any) {
    const options: any = { year: 'numeric', month: 'long', day: 'numeric' };

    const date = new Date(dateString);

    return date.toLocaleString('en-US', options);
  }


  toggleDropdown(): void {
    this.isDropdownOpen = !this.isDropdownOpen;
  }


 

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value.toLowerCase();
    console.log(filterValue);
    
    this.filteredRequestBloodData = this.RequestBloodData.filter(user =>
      (user.bloodType && user.bloodType.toLowerCase().includes(filterValue)) ||
      (user.productType && user.productType.includes(filterValue)) ||
      (user.quantityOfbags && user.quantityOfbags === +filterValue) || // Check for exact match
      (user.requester.firstName && user.requester.firstName.toLowerCase().includes(filterValue))
      (user.requester.lastname && user.requester.lastname.toLowerCase().includes(filterValue))
   
    );
  }
  
  


  public ActivateRequestetBlood = (request: any) => {
    
    this.router.navigate([`BankAddmission-requests/${request._id}`])

    
  }
}
