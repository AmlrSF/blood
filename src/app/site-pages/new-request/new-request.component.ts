import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthUserService } from 'src/app/services/auth/auth-user.service';

@Component({
  selector: 'app-new-request',
  templateUrl: './new-request.component.html',
  styleUrls: ['./new-request.component.css']
})
export class NewRequestComponent implements OnInit {
  AddrequestBlood!: FormGroup;
  setLoading: boolean = false;
  selectedPhenotypes: string = '';
  private apiUrl: string = "http://localhost:3000/api/v1/requestBloodByAdmission";
  addmissionId: any = '';
  constructor(private auth: AuthUserService, private fb: FormBuilder, private http: HttpClient, private router: Router) { }


  // Method to update selected phenotypes string based on radio button selection
  updateSelectedPhenotypes(phenotype: string, value: string): void {
    if (value === 'Positive') {
      this.selectedPhenotypes += `${phenotype}+`;
    } else if (value === 'Negative') {
      this.selectedPhenotypes += `${phenotype}-`;
    }
  }
  ngOnInit(): void {
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

          this.addmissionId = res.customer._id;



        }, (err: any) => {
          console.log(err);
        }
      );
    } catch (error) {
      console.log(error);
    }
    this.AddrequestBlood = this.fb.group({
      admissionNumber: [''],
      bloodType: ['', Validators.required],
      rhesus: ['', Validators.required],
      selectedPhenotypes: [''],
      emergencyDegree: ['', Validators.required],
      product: ['', Validators.required],
      qualifications: ['', Validators.required],
      quantity: ['', Validators.required],
      passionNumber:["",Validators.required]
    });
  }

  submitForm() {
    this.AddrequestBlood.value["admissionNumber"] = this.addmissionId;
    this.AddrequestBlood.value["selectedPhenotypes"] = this.selectedPhenotypes;
    this.setLoading = true;
    const formData = this.AddrequestBlood.value;
    if (!Array.isArray(formData.qualifications)) {
      formData.qualifications = [formData.qualifications];
  }
    console.log(formData);
    this.http.post(this.apiUrl, formData).subscribe(
      (res: any) => {
        this.AddrequestBlood.reset();
        this.setLoading = false;
      }
    );

  }
} {

}
