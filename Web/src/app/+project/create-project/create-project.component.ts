import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
declare var $: any;
import { Ng6OdooRPCService } from 'src/app/shared/services/angular6-odoo-jsonrpc.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  templateUrl: './create-project.component.html',
  styleUrls: ['./create-project.component.css'],
  providers: [Ng6OdooRPCService]
})
export class CreateProjectComponent implements OnInit {
  projectForm: FormGroup;
  public editorValue: string = '';
  isValid:boolean=false;
  //isDateValid:boolean=false;
  projectsList:any;
  consultantList:any;
  contractorList:any;
  projectDetails: any;
  fromDate:any;
  token:any;
  db: string='api-test';
  login: string='admin';
  password: string='admin';

  constructor(private formBuilder: FormBuilder, private odooRPC: Ng6OdooRPCService,private toastr: ToastrService) {
    // ,private toastr: ToastrService
  }

  ngOnInit() {
    this.projectForm = this.formBuilder.group({
      projectName: ['', Validators.required],
      contractNumber:['', Validators.required],
      consultant:['', Validators.required],
      contractor:['', Validators.required],
      projectValue:['',Validators.required],
      firstBatch:[''],
      date:['',Validators.required],
      projectDuration:['',Validators.required],
      budgetYear:['',Validators.required],
      parentProject:['',Validators.required],
      projectStatus:['',Validators.required],
      projectDescriptin:['']
    });

    $('#datepicker').datepicker({
      dateFormat: 'dd/mm/yy',
      autoclose: true
    }).on('changeDate', (ev)=>{
      this.fromDate=$('#datepicker').val();
        //alert($('#datepicker').val());
    });


    this.odooRPC.init({
      odoo_server: 'http://beta.cisin.com:5001/',
  });
  
  this.odooRPC.login(this.db,this.login,this.password).subscribe((data: any[])=>{
    this.token=data["token"];
  });

  let projUrl='/projects/get?db='+this.db+'&token=6iAZe62OSJe1cbhb1s7oOA';

  this.odooRPC.getReq(projUrl).subscribe((data: any[])=>{
    //console.log(data);
    this.projectsList = data;
  });

  let userUrl='/users/get?db='+this.db+'&token=6iAZe62OSJe1cbhb1s7oOA';

  this.odooRPC.getReq(userUrl).subscribe((data: any[])=>{
    //console.log(data);
    this.consultantList = data;
    this.contractorList = data;
  });

  }

  createProjUrl: string='/project/create?db='+this.db+'&values=';
  
  createProject(obj:any){
    this.odooRPC.postReq(this.createProjUrl+obj+'&token=6iAZe62OSJe1cbhb1s7oOA').subscribe((data: any)=>{
    if(data.msg=="Project Created Successfully"){
      this.toastr.success(data.msg);
    }else{
      this.toastr.error(data.msg);
    }
  });
  }  

  onCreateProjectClick() {
    this.isValid=true;
    if(!this.projectForm.valid)
    {
    }
    else
    {
      let cId = this.consultantList.find(s => s.name == this.projectForm.get('consultant').value).id;
      let conId = this.contractorList.find(s => s.name == this.projectForm.get('contractor').value).id;
      let pId = this.projectsList.find(s => s.name == this.projectForm.get('parentProject').value).id;
      this.projectDetails={
      "name": this.projectForm.get("projectName").value,
      "contact_no": this.projectForm.get("contractNumber").value,
      "proj_consultant": cId,
      "proj_contractor": conId,
      "proj_val": this.projectForm.get("projectValue").value,
      "first_pay": this.projectForm.get("firstBatch").value,
      "from_date": this.fromDate,
      "proj_duration": this.projectForm.get("projectDuration").value,
      "budget_year": this.projectForm.get("budgetYear").value,
      "parent_id": pId,
      "proj_state": "active",
      "description": this.projectForm.get("projectDescriptin").value
      };

      // this.projectDetails={	
      //   "name":"Sample Project 2",
      //   "contact_no":"95845231587",
      //   "proj_consultant":2,
      //   "proj_contractor":4,
      //   "proj_val":"25000",
      //   "first_pay":"2500",
      //   "from_date":"10/15/2019 16:27:16",
      //   "proj_duration":"5 months",
      //   "budget_year":"2019-20",
      //   "parent_id":6,
      //   "proj_state":"active",
      //   "description":"<p>Sample Project</p>\n"
      // };
      this.isValid=false;
      //alert(JSON.stringify(this.projectDetails));
      //this.toastr.success("Project added successfully!");
      //console.log(JSON.stringify(this.projectDetails));
      this.createProject(JSON.stringify(this.projectDetails));
      this.projectForm.reset();
    }
  }
}
