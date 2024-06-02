// blood-stock.component.ts

import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthUserService } from 'src/app/services/auth/auth-user.service';

@Component({
  selector: 'app-blood-stock',
  templateUrl: './blood-stock.component.html',
  styleUrls: ['./blood-stock.component.css']
})
export class BloodStockComponent implements OnInit {
  productsWithElements: any[] = [];
  private apiUrl = 'http://localhost:3000/api/v1/BloodBags';
  private baseUrl = 'http://localhost:3000/api/v1/RequestBloodBags'
  public requestBloodBag!: FormGroup;
  public setLoading:boolean = false;
  bloodbankId: any;
  constructor(private fb: FormBuilder,private router:Router, private http:HttpClient,private auth:AuthUserService) { }

  ngOnInit() { 
    this.getbloodsBags();
    let token = {
      token: this.auth.getToken()
    };

    console.log(token);

    try {
      this.http.post(`http://localhost:3000/api/v1/customers/profile`, token).subscribe(
        (res: any) => {


          if (res.success) {
            if (res.customer.role == 1) {
              this.router.navigate(["admin"])
            }
          }

          this.bloodbankId = res.customer._id;



        }, (err: any) => {
          console.log(err);
        }
      );
    } catch (error) {
      console.log(error);
    }
    this.requestBloodBag = this.fb.group({
      requester: [''],
      bloodType: ['', Validators.required],
      rhesus: ['', Validators.required], 
      productType: ['', Validators.required],   
      quantityOfBags: ['', Validators.required],    
    });
  }

  public getbloodsBags(){
    this.http.get<any[]>(this.apiUrl).subscribe(
      (response: any) => {
        this.productsWithElements = this.groupByProduct(response.data);
      },
      (error: any) => {
        console.error('Error fetching blood bags:', error);
      }
    );
  }

  public requestBloodbags(ele?:any){
    if(ele){
      this.requestBloodBag.patchValue({
        productType:ele.product
      });
  
    }
   
    document.getElementById('editUserModal')?.classList.remove('hidden');

  }


  isExpired(expireDate: Date): boolean {
    const today = new Date();
    return new Date(expireDate) < today;
  }


  deleteBag(bagId: string): void {
    this.http.delete(`http://localhost:3000/api/v1/BloodBags/${bagId}`).subscribe(
      (res: any) => {

        console.log(res);
        // Remove the deleted bag from the list
        this.getbloodsBags();
        
      },
      (err: any) => {
        console.log(err);
      }
    );
  }


  groupByProduct(bloodBags: any[]): any[] {
    const groupedProducts: any[] = [];

    // Group blood bags by product
    const groupedByProduct = bloodBags.reduce((acc, bloodBag) => {
      (acc[bloodBag.product] = acc[bloodBag.product] || []).push(bloodBag);
      return acc;
    }, {});

    // Convert grouped data into an array of objects
    for (const product in groupedByProduct) {
      if (groupedByProduct.hasOwnProperty(product)) {
        groupedProducts.push({ product, elements: groupedByProduct[product] });
      }
    }

    return groupedProducts;
  }
  

  closeModel(): void {
    document.getElementById('editUserModal')?.classList.add('hidden');
  }



  submitForm(): void {
    this.requestBloodBag.value['requester'] = this.bloodbankId;
    console.log(this.requestBloodBag.value);
    if(this.requestBloodBag.valid){
      try {
        let formaData = {
          productType:this.requestBloodBag.value.productType,
          quantityOfBags:this.requestBloodBag.value.quantityOfBags,
          bloodType:this.requestBloodBag.value.bloodType+this.requestBloodBag.value.rhesus,
          requester:this.requestBloodBag.value.requester

        }
        console.log(formaData)
        this.http.post(this.baseUrl, formaData).subscribe(
          (res: any) => {
            this.requestBloodBag.reset();
            this.closeModel();
            this.setLoading = false;
          }
        ,(err:any)=>{
          console.log(err);
          
        });
        
      } catch (error) {
        
      }
    }else{
      alert("fill in the fields")
    }

  
   
  }
}
