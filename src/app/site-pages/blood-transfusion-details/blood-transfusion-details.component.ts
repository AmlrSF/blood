import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-blood-transfusion-details',
  templateUrl: './blood-transfusion-details.component.html',
  styleUrls: ['./blood-transfusion-details.component.css']
})
export class BloodTransfusionDetailsComponent implements OnInit {

  private baseUrl = 'http://localhost:3000/api/v1/requestBloodByAdmission'; 

  public TransfusionFile: any;
  constructor( private router : Router,private route: ActivatedRoute
    ,private http:HttpClient) {}

  public formatReadableDate(dateString: any) {
    const options: any = { year: 'numeric', month: 'long', day: 'numeric' };
  
    const date = new Date(dateString);
  
    return date.toLocaleString('en-US', options);
  }


  

  ngOnInit(): void {



    // Get the client ID from the route parameters
    const requestID = this.route.snapshot.paramMap.get('id');

    // Check if requestID is available
    if (requestID) {
      // Call the service to get client details by ID
    
    } else {
      console.error('Client ID not found in route parameters.');
    }

    this.http.get(`${this.baseUrl}/${requestID}`).subscribe(
      (res:any)=>{
        console.log(res)
        this.TransfusionFile = res.requestData;
        console.log(this.TransfusionFile);
        
        
      },(err:any)=>{
        console.log(err);
        
      }
    )
  }
}