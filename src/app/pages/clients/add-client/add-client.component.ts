import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthUserService } from 'src/app/services/auth/auth-user.service';

@Component({
  selector: 'app-add-client',
  templateUrl: './add-client.component.html',
  styleUrls: ['./add-client.component.css']
})
export class AddClientComponent implements OnInit {
  public addUser!: FormGroup;
  private apiUrl = 'http://localhost:3000/api/v1/customers/register';
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private auth: AuthUserService,
    private http: HttpClient
  ) { }

  public setLoading:boolean=false;
  ngOnInit() {
    this.addUser = this.fb.group({
      fname: ['', Validators.required],
      lname: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      userType: ['', Validators.required]
    });
  }

  navigateToRegister() {
    this.router.navigate(['/Login']);
  }

  public onSubmit() {

    if (this.addUser.valid) {
      console.log(this.addUser.value);

      this.setLoading = true;
      try {


        this.http.post(this.apiUrl, this.addUser.value).subscribe(
          (res: any) => {
            console.log(res);

            if (res.success === false && res.error === 'Email already in use') {
              alert("Email already use")
            }

            this.setLoading = false;
            this.addUser.reset();

          },
          (err) => {
            console.log(err);
          }
        );


      } catch (error) {
        console.error(error);
      }


    }
  }
}
