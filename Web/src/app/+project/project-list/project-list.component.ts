import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Ng6OdooRPCService } from 'src/app/shared/services/angular6-odoo-jsonrpc.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
declare var $: any;

@Component({
  templateUrl: './project-list.component.html',
  styleUrls: ['./project-list.component.css']
})
export class ProjectListComponent implements OnInit {

  inspectionForm: FormGroup;
  quantityForm: FormGroup;
  projectsList:any;
  db: string='api-test';
  isValid:boolean=false;
  dateOfExamination:any;

  constructor(private formBuilder: FormBuilder, private odooRPC: Ng6OdooRPCService,private toastr: ToastrService,private router:Router) {
    //form building
    this.inspectionForm = this.formBuilder.group({
      orderNumber: ['', Validators.required],
      requestType: ['', Validators.required],
      workSite: ['', Validators.required],
      dateOfExamination: ['', Validators.required],
      itemNumber:['', Validators.required]
    });
    this.quantityForm = this.formBuilder.group({
      mainSection: ['', Validators.required],
      firstSubSection: ['', Validators.required],
      secondSubSection: ['', Validators.required],
      itemNumber: ['', Validators.required],
      itemName:['', Validators.required],
      session:['', Validators.required],
      itemDescription:['', Validators.required],
      unit:['', Validators.required],
      unitPrice:['', Validators.required],
      contractQuantity:['', Validators.required],
      totalPrice:['', Validators.required],
    });
    //Initializing date picker
    $('#datepicker').datepicker({
      dateFormat: 'dd/mm/yy',
      autoclose: true
    }).on('changeDate', (ev)=>{
      this.dateOfExamination=$('#datepicker').val();
    });
  }

  ngOnInit() {
    this.getProjectsList();
  }

  getProjectsList(){
    let projUrl='/projects/get?db='+this.db+'&token=6iAZe62OSJe1cbhb1s7oOA';
    this.odooRPC.getReq(projUrl).subscribe((data: any[])=>{
      this.projectsList = data;
      setTimeout(function () {
        $(function () {
          $('#projectDataTable').DataTable();
        });
      }, 100);
    });
  }

  onAddInspectionClick() {
    this.isValid=true;
    if(!this.inspectionForm.valid){

    }else{
      this.toastr.success("Inspection Clicked");
      this.router.navigate(['/project/project-list'])
    }
  }

  onAddTableQuantityClick(){
    this.isValid=true;
    if(!this.quantityForm.valid){

    }else{
      this.toastr.success("Table Quantities Clicked");
    }
  }
}
