import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-client-detail',
  templateUrl: './client-detail.component.html',
  styleUrls: ['./client-detail.component.css']
})
export class ClientDetailComponent implements OnInit {

  private baseUrl = 'http://localhost:3000/api/v1/customers'; 

  public user: any;
  public relatedCDomainsBasedOnTheSameClient : any[] = []
  constructor( private router : Router,private route: ActivatedRoute,private http:HttpClient) {}

  public formatReadableDate(dateString: any) {
    const options: any = { year: 'numeric', month: 'long', day: 'numeric' };
  
    const date = new Date(dateString);
  
    return date.toLocaleString('en-US', options);
  }


  

  ngOnInit(): void {



    // Get the client ID from the route parameters
    const userId = this.route.snapshot.paramMap.get('id');

    // Check if userId is available
    if (userId) {
      // Call the service to get client details by ID
    
    } else {
      console.error('Client ID not found in route parameters.');
    }

    this.http.get(`${this.baseUrl}/${userId}`).subscribe(
      (res:any)=>{
        this.user = res?.customer
        
      },(err:any)=>{
        console.log(err);
        
      }
    )
  }
}
