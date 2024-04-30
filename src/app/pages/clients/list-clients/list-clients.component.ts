import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { first } from 'rxjs';

@Component({
  selector: 'app-list-clients',
  templateUrl: './list-clients.component.html',
  styleUrls: ['./list-clients.component.css']
})
export class ListClientsComponent implements OnInit {
  private apiUrl:string = "http://localhost:3000/api/v1/customers"
  Users: any[] = [];
  filteredUsers: any[] = [];
  isDropdownOpen: boolean = false;
  private id:string = "";
  public setLoading:boolean=false;
  filters = [
    { id: 'filter-radio-example-1', value: 'last-day', label: 'Last day' },
    { id: 'filter-radio-example-2', value: 'last-7-days', label: 'Last 7 days' },
    { id: 'filter-radio-example-3', value: 'last-30-days', label: 'Last 30 days' },
    { id: 'filter-radio-example-4', value: 'last-month', label: 'Last month' },
    { id: 'filter-radio-example-5', value: 'last-year', label: 'Last year' },
  ];
  UsersService: any;

  toggleDropdown(): void {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  
  public addUser!: FormGroup;

  constructor(private fb: FormBuilder, private router:Router,private http : HttpClient) { }

 

  ngOnInit(): void {
    this.getUsers();
    this.addUser = this.fb.group({
      fname: ['', Validators.required],
      lname: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      userType: ['', Validators.required]
    });
  
  }

  getUsers(): void {
    this.http.get(this.apiUrl).subscribe(
      (Users: any) => {
        this.Users = Users.customers;
        this.filteredUsers = [...this.Users];
        console.log('Users:', this.Users);
      },
      (error: any) => {
        console.error('Error fetching Users:', error);
      }
    );
  }
  public formatReadableDate(dateString: any) {
    const options: any = { year: 'numeric', month: 'long', day: 'numeric' };
  
    const date = new Date(dateString);
  
    return date.toLocaleString('en-US', options);
  }
  

  viewUser(user: any): void {
    console.log('View user:', user);

    // Assuming 'id' is a property in your user object
    const userId = user._id;

    // Navigate to the user details page with the user ID
    this.router.navigate(['/admin/users/user', userId]);
  }

  // Function to edit a user
  editUser(user: any): void {
     // Assuming you have a form group for editing (edituserForm)
     this.addUser.patchValue({
      fname: user?.firstName,
      lname: user?.lastName,
      email: user?.email,
      password: user?.passwordHash,
      userType: user?.userType
   });

   this.id = user._id;

   // Show the modal
   document.getElementById('editUserModal')?.classList.remove('hidden');
   
  }

  public closeModel(){
    document.getElementById('editUserModal')?.classList.add('hidden');
  }

  // Function to delete a user
  deleteUser(user: any): void {
    this.http.delete(`${this.apiUrl}/users/${user._id}`).subscribe((res:any)=>{
      console.log(res);
      this.getUsers();
    })
  }

  public submitForm(): void {
    if (this.addUser.valid) {
      const formData = {
        firstName:this.addUser.value.fname,
        passwordHash:this.addUser.value.password,
        lastName:this.addUser.value.lname,
        userType:this.addUser.value.userType,
        email:this.addUser.value.email
       }; // Convert FormGroup to a plain object

       
       console.log(formData);
       

      // Send formData to the server
      this.http.put(`${this.apiUrl}/${this.id}`, formData).subscribe(
        (res: any) => {
          if(res.success){
            this.getUsers();
            this.closeModel();
            this.addUser.reset();
          }
        }
      );
    } else {
      // Handle form validation errors
      console.log('Form is invalid. Please check the fields.');
    }
  }
  

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value.toLowerCase();
    this.filteredUsers = this.Users.filter(user =>
      user.firstName.toLowerCase().includes(filterValue) ||
      user.lastName.toLowerCase().includes(filterValue) ||
      user.email.includes(filterValue) ||
      user.password.toLowerCase().includes(filterValue)
    );
  }
}
