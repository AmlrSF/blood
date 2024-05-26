import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthUserService } from 'src/app/services/auth/auth-user.service';

@Component({
  selector: 'app-request-lists',
  templateUrl: './request-lists.component.html',
  styleUrls: ['./request-lists.component.css']
})
export class RequestListsComponent implements OnInit {
  private apiUrl: string = "http://localhost:3000/api/v1/requestBloodByAdmission";
  RequestBloodData: any[] = [];
  filteredRequestBloodData: any[] = [];
  isDropdownOpen: boolean = false;
  private id: string = "";
  public setLoading: boolean = false;
  patients: any[] = [];  // To store the patient data

  filters = [
    { id: 'filter-radio-example-1', value: 'last-day', label: 'Last day' },
    { id: 'filter-radio-example-2', value: 'last-7-days', label: 'Last 7 days' },
    { id: 'filter-radio-example-3', value: 'last-30-days', label: 'Last 30 days' },
    { id: 'filter-radio-example-4', value: 'last-month', label: 'Last month' },
    { id: 'filter-radio-example-5', value: 'last-year', label: 'Last year' },
  ];

  public AddrequestBlood!: FormGroup;
  user: any;
  selectedPatientId: any;

  constructor(private fb: FormBuilder, private router: Router, private http: HttpClient, private auth: AuthUserService) { }

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

            this.getRequestBloodData();
            this.fetchPatients();
        
          }

          this.user = res.customer;
          //console.log(this.user);
        }, (err: any) => {
          console.log(err);
        }
      );
    } catch (error) {
      console.log(error);
    }

  
    this.AddrequestBlood = this.fb.group({
      passionNumber: ['', Validators.required],
      bloodType: ['', Validators.required],
      rhesus: ['', Validators.required],
      selectedPhenotypes: ['', Validators.required],
      emergencyDegree: [false, Validators.required],
      product: ['', Validators.required],
      qualifications: ['', Validators.required],
      quantity: ['', Validators.required],

    });
  }

  getRequestBloodData(): void {
    this.http.get(this.apiUrl).subscribe(
      (RequestBloodData: any) => {
        this.RequestBloodData = RequestBloodData?.requestData;
        if(this.user?.userType === "admission"){
          this.filteredRequestBloodData = [...this.RequestBloodData.filter((item)=>item?.admissionNumber?._id == this.user?._id)];
        }else{
          this.filteredRequestBloodData = [...this.RequestBloodData];
        }
        
       
      },
      (error: any) => {
        console.error('Error fetching RequestBloodData:', error);
      }
    );
  }

  fetchPatients(): void {
    this.http.get('http://localhost:3000/api/v1/patient').subscribe(
      (patients: any) => {
        this.patients = patients;
        // console.log('Patients:', this.patients);
      },
      (error: any) => {
        console.error('Error fetching patients:', error);
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

  viewRequestetBlood(user: any): void {
    console.log('View user:', user);
    const userId = user?._id;
    this.router.navigate(['/admin/RequestBloodData/user', userId]);
  }

  editRequestetBlood(user: any): void {
    this.selectedPatientId = user?.passionNumber?._id || '';
    this.AddrequestBlood.patchValue({

      bloodType: user?.bloodType,
      rhesus: user?.rhesus,
      emergencyDegree: user?.emergencyDegree,
      product: user?.product,
      qualifications: user?.qualifications,
      quantity: user?.quantity,
      passionNumber: user?.passionNumber
    });
    // Initialize the phenotypes
    this.initializePhenotypes(user?.selectedPhenotypes);

    this.id = user._id;
    document.getElementById('editUserModal')?.classList.remove('hidden');
  }

  initializePhenotypes(selectedPhenotypes: string): void {
    this.selectedPhenotypeMap = {};
    this.selectedPhenotypes = selectedPhenotypes || '';

    if (this.selectedPhenotypes) {
      const phenotypesArray = this.selectedPhenotypes.split(' ');
      phenotypesArray.forEach(phenotype => {
        const key = phenotype[0];
        const value = phenotype.slice(1);
        this.selectedPhenotypeMap[key] = phenotype;
        // Set the radio button selection
        const radioBtn = document.getElementById(`${key}${value === '+' ? 'Positive' : 'Negative'}`) as HTMLInputElement;
        if (radioBtn) {
          radioBtn.checked = true;
        }
      });
    }
  }

  closeModel(): void {
    document.getElementById('editUserModal')?.classList.add('hidden');
  }

  deleteRequestetBlood(user: any): void {
    this.http.delete(`${this.apiUrl}/${user._id}`).subscribe((res: any) => {
      console.log(res);
      this.getRequestBloodData();
    })
  }

  submitForm(): void {
    this.AddrequestBlood.value["selectedPhenotypes"] = this.selectedPhenotypes;
    const formData = this.AddrequestBlood.value;
    console.log(formData);
    this.http.put(`${this.apiUrl}/${this.id}`, formData).subscribe(
      (res: any) => {
        if (res.success) {
          this.getRequestBloodData();
          this.closeModel();
          this.AddrequestBlood.reset();
        }
      }
    );
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value.toLowerCase();
    console.log(filterValue);

    this.filteredRequestBloodData = this.RequestBloodData.filter(user =>
      (user.bloodType && user.bloodType.toLowerCase().includes(filterValue)) ||
      (user.rhesus && user.rhesus.toLowerCase().includes(filterValue)) ||
      (user.product && user.product.includes(filterValue)) ||
      (user.quantity && user.quantity === +filterValue) || // Check for exact match
      (user.selectedPhenotypes && user.selectedPhenotypes.includes(filterValue)) ||
      (user.passionNumber && user.passionNumber.toLowerCase().includes(filterValue))
    );
  }

  selectedPhenotypes: string = '';
  selectedPhenotypeMap: { [key: string]: string } = {};

  // Method to update selected phenotypes string based on radio button selection
  updateSelectedPhenotypes(phenotype: string, value: string): void {
    this.selectedPhenotypeMap[phenotype] = value === 'Positive' ? `${phenotype}+` : `${phenotype}-`;

    // Reconstruct the selectedPhenotypes string
    this.selectedPhenotypes = Object.values(this.selectedPhenotypeMap).join(' ');
  }


  public ActivateRequestetBlood = (request: any) => {
    this.http.put(`${this.apiUrl}/${request._id}/Activaterequest`, {}).subscribe(
      (res: any) => {
        if (res.success) {
          console.log(res)
          this.getRequestBloodData();
        } else {
          alert(res.message);
        }
      }
    );
  }

  public NavigateToTransfusionFile = (request: any) => {
    this.router.navigate([`/TransfusionDetails/${request._id}`])
  }
}
