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
  selectedPhenotypeMap: { [key: string]: string } = {};
  private apiUrl: string = "http://localhost:3000/api/v1/requestBloodByAdmission";
  addmissionId: any = '';
  patients: any[] = [];  // To store the patient data
  patient: any;

  constructor(private auth: AuthUserService, private fb: FormBuilder, private http: HttpClient, private router: Router) { }

  updateSelectedPhenotypes(phenotype: string, value: string): void {
    this.selectedPhenotypeMap[phenotype] = value === 'Positive' ? `${phenotype}+` : `${phenotype}-`;

    // Reconstruct the selectedPhenotypes string
    this.selectedPhenotypes = Object.values(this.selectedPhenotypeMap).join(' ');
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

    // Fetch all patients from the API
    this.http.get(`http://localhost:3000/api/v1/patient`).subscribe(
      (res: any) => {
        this.patients = res;  // Store the fetched patients
        console.log(this.patients)
      },
      (err: any) => {
        console.log(err);
      }
    );



    this.AddrequestBlood = this.fb.group({
      admissionNumber: ['',],
      bloodType: ['', Validators.required],
      rhesus: ['', Validators.required],
      selectedPhenotypes: [''],
      emergencyDegree: ['', Validators.required],
      product: ['', Validators.required],
      qualifications: ['', Validators.required],
      quantity: ['', Validators.required],
      passionNumber: ["", Validators.required, Validators.pattern(/^-?\d+$/)]
    });
  }

  onPassionNumberInput(passionNumber: number) {
    console.log('Entered Passion Number:', passionNumber);

    // You can perform additional actions here based on the entered value
    // For example, validating the number or performing calculations
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
        this.selectedPhenotypes = '';
        this.selectedPhenotypeMap = {};
        this.setLoading = false;

      }
    );
  }

  selectedPatient: any;
  public getRelatedInfo() {
    const passionNumber = this.AddrequestBlood.get('passionNumber')?.value;

    if (passionNumber) {
      this.selectedPatient = this.patients.find(patient => patient.id == passionNumber);

      if (!this.selectedPatient) {
        alert('Patient with passion number ' + passionNumber + ' not found.');
      }
    }
  }

  public ClearInfo(){
    this.AddrequestBlood.value["admissionNumber"] = "";
    this.selectedPatient = null;

  }
  public formatReadableDate(dateString: any) {
    const options: any = { year: 'numeric', month: 'long', day: 'numeric' };
    const date = new Date(dateString);
    return date.toLocaleString('en-US', options);
  }
}
