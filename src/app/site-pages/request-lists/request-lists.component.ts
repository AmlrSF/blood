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
  filters = [
    { id: 'filter-radio-example-1', value: 'last-day', label: 'Last day' },
    { id: 'filter-radio-example-2', value: 'last-7-days', label: 'Last 7 days' },
    { id: 'filter-radio-example-3', value: 'last-30-days', label: 'Last 30 days' },
    { id: 'filter-radio-example-4', value: 'last-month', label: 'Last month' },
    { id: 'filter-radio-example-5', value: 'last-year', label: 'Last year' },
  ];

  public AddrequestBlood!: FormGroup;
  user: any;

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
          }

          this.user = res.customer;

          console.log(this.user);



        }, (err: any) => {
          console.log(err);
        }
      );
    } catch (error) {
      console.log(error);
    }
    this.getRequestBloodData();
    this.AddrequestBlood = this.fb.group({
      admissionNumber: ['', Validators.required],
      bloodType: ['', Validators.required],
      rhesus: ['', Validators.required],
      selectedPhenotypes: ['', Validators.required],
      emergencyDegree: [false, Validators.required],
      product: ['', Validators.required],
      qualifications: ['', Validators.required],
      quantity: ['', Validators.required],
      passionNumber:['', Validators.required]
    });
  }

  getRequestBloodData(): void {
    this.http.get(this.apiUrl).subscribe(
      (RequestBloodData: any) => {
        this.RequestBloodData = RequestBloodData.requestData;
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

  viewRequestetBlood(user: any): void {
    console.log('View user:', user);
    const userId = user._id;
    this.router.navigate(['/admin/RequestBloodData/user', userId]);
  }

  editRequestetBlood(user: any): void {
    this.AddrequestBlood.patchValue({
      admissionNumber: user?.admissionNumber,
      bloodType: user?.bloodType,
      rhesus: user?.rhesus,
      emergencyDegree: user?.emergencyDegree,
      product: user?.product,
      qualifications: user?.qualifications,
      quantity: user?.quantity,
      passionNumber:user?.passionNumber
    });
    this.id = user._id;
    document.getElementById('editUserModal')?.classList.remove('hidden');
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
  
  
  selectedPhenotypes: string = ''; // Initialize selected phenotypes string

  // Method to update selected phenotypes string based on radio button selection
  updateSelectedPhenotypes(phenotype: string, value: string): void {
    if (value === 'Positive') {
      this.selectedPhenotypes += `${phenotype}+`;
    } else if (value === 'Negative') {
      this.selectedPhenotypes += `${phenotype}-`;
    }
  }

  public ActivateRequestetBlood = (request: any) => {     
    this.router.navigate([`/TransfusionDetails/${request._id}`])
  }

}
