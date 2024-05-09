import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthUserService } from 'src/app/services/auth/auth-user.service';

@Component({
  selector: 'app-request-blood-bank-details',
  templateUrl: './request-blood-bank-details.component.html',
  styleUrls: ['./request-blood-bank-details.component.css']
})
export class RequestBloodBankDetailsComponent implements OnInit {

  private apiUrl: string = "http://localhost:3000/api/v1/RequestBloodBags";
  private apiUrl1: string = "http://localhost:3000/api/v1/BloodBags";

  RequestBloodData: any;
  bloodBags: any[] = [];
  editMode: boolean = false;
  bloodBagForm!: FormGroup;
  selectedBagod: any;

  constructor(private fb: FormBuilder,
    private http: HttpClient, private route: ActivatedRoute,
     private auth: AuthUserService, private router: Router) { }

  ngOnInit(): void {
    this.bloodBagForm = this.fb.group({
      BagId: ['', Validators.required],
      expireDate: ['', Validators.required]
    });

    const userId = this.route.snapshot.paramMap.get('id');
    const storedBloodBags = localStorage.getItem('bloodBags');
    if (storedBloodBags) {
      this.bloodBags = JSON.parse(storedBloodBags);
    }
    if (userId) {
      this.getRequestDataFromBloodbank(userId);
    }
  }

  addBloodBag(): void {
    console.log(this.bloodBagForm.value)
    if (this.bloodBagForm.invalid) {
      alert('Please fill out both Bag ID and Expire Date fields.');
      return;
    }

    const enteredExpireDate = new Date(this.bloodBagForm.value.expireDate);
    const currentDate = new Date();

    if (enteredExpireDate <= currentDate) {
      alert('Expiration date must be greater than the current date.');
      return;
    }



    const isBagIdExist = this.bloodBags.some((bloodBag: any) => bloodBag.BagId
      === this.bloodBagForm.value.BagId);

    if (isBagIdExist) {
      alert(`${this.bloodBagForm.value.BagId} is already used. Please try something else.`);
      return;
    }

    // Check if the number of bags added exceeds the requested quantity
    const requestedQuantity = this.RequestBloodData.quantityOfBags;
    if (this.bloodBags.length >= requestedQuantity) {
      alert(`The requested quantity of ${requestedQuantity} bags has already been added.`);
      return;
    }

    if (!this.editMode) {
      const newBloodBag = {
        product: this.RequestBloodData.productType,
        type: this.RequestBloodData.bloodType,
        BagId: this.bloodBagForm.value.BagId,
        expireDate: this.bloodBagForm.value.expireDate,
        status: "Available"
      };

      this.bloodBags.push(newBloodBag);
      localStorage.setItem('bloodBags', JSON.stringify(this.bloodBags));

      this.bloodBagForm.reset();
      alert('Blood bag added successfully!');
    } else {
      // Call a function to update the blood bag
      this.updateBloodBag();
    }
  }

  updateBloodBag(): void {
    // Find the index of the blood bag to update
    const index = this.bloodBags.findIndex(bloodBag => bloodBag.BagId ===
      this.selectedBagod);



    // Check if the blood bag is found
    if (index !== -1) {
      // Update the blood bag's properties
      this.bloodBags[index] = {
        ...this.bloodBags[index], // Keep existing properties
        BagId: this.bloodBagForm.value.BagId, // Update BagId with new value from the form
        expireDate: this.bloodBagForm.value.expireDate // Update expireDate with new value from the form
      };

      // Save the updated bloodBags array to local storage
      localStorage.setItem('bloodBags', JSON.stringify(this.bloodBags));

      // Reset the form
      this.bloodBagForm.reset();

      // Set editMode back to false
      this.editMode = false;

      // Show success message
      alert('Blood bag updated successfully!');
    } else {
      // If blood bag is not found, show an error message
      alert('Blood bag not found for update!');
    }
  }

  getRequestDataFromBloodbank(id: any): void {
    this.http.get(`${this.apiUrl}/${id}`).subscribe(
      (RequestBloodData: any) => {
        console.log(RequestBloodData);
        this.RequestBloodData = RequestBloodData.requestBloodBag;
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

  deleteRequestetBlood(bagIndex: number): void {
    if (confirm("Are you sure you want to delete this blood bag?")) {
      this.bloodBags.splice(bagIndex, 1);
      localStorage.setItem('bloodBags', JSON.stringify(this.bloodBags));
    }
  }

  editRequestetBlood(bloodBag: any): void {
    this.bloodBagForm.patchValue({
      BagId: bloodBag.BagId,
      expireDate: bloodBag.expireDate
    });
    this.selectedBagod = bloodBag.BagId;
    this.editMode = true;
  }

    
  transfereToBlodBank(qte:number) {
    const userId = this.route.snapshot.paramMap.get('id');

    if(this.bloodBags.length >= qte)
    this.http.put(`${this.apiUrl}/${userId}`,{status:true})
    .subscribe((res:any)=>{
      localStorage.removeItem("bloodBags");
      this.router.navigate([`BankAddmission-requests`])
    },(err:any)=>console.log(err));

    

    this.bloodBags.forEach(element => {
      this.http.post(this.apiUrl1,element)
      .subscribe((
        res:any
      )=>{
        console.log(res);
      },(err:any)=>{
        console.log(err);
      })
    });

    


  }


}
