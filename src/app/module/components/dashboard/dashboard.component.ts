import { Component } from '@angular/core';
import {CreateGroupComponent} from "../create-group/create-group.component";
import {Message} from "../../../utils/message";
import {SharedDataService} from "../../../service/shared-data.service";
import {GroupService} from "../../../service/group.service";
import {MatDialog, MatDialogConfig} from "@angular/material/dialog";

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent{
  public groupList=[];
  public groupOriginalList=[];
  public search:any;
  public msg:any;
  public item:any;
  public isLoading=false;
  constructor(
    public dialog: MatDialog,
    public sharedDataService:SharedDataService,
    public groupService:GroupService) {
  }

  ngOnInit(){
    this.getGroupList();
  }

  getCurrentDate() {
    let date = new Date();
    let dt = date.getDate();
    let mn = date.getMonth() + 1;
    let yy = date.getFullYear();
    return dt + '/' + mn + '/' + yy;
  }

  createGroup(){
    let obj = {action:'add'};
    let message = new Message(obj, "group");
    this.sharedDataService.changeMessage(message);
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.id = "modal-component";
    dialogConfig.height = "400px";
    dialogConfig.width = "600px";
    const dialogRef = this.dialog.open(CreateGroupComponent,dialogConfig);
    dialogRef.afterClosed().subscribe(data=>{
      this.getGroupList();
    })
  }

  editGroup(item:any) {
    let obj = {action:'update',item:item};
    let message = new Message(obj, "group");
    this.sharedDataService.changeMessage(message);
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.id = "modal-component";
    dialogConfig.height = "400px";
    dialogConfig.width = "600px";
    const dialogRef = this.dialog.open(CreateGroupComponent,dialogConfig);
    dialogRef.afterClosed().subscribe(data=>{
      this.getGroupList();
    })
  }

  getGroupList() {
    this.isLoading=true;
    this.groupService.getGroupList().subscribe(
      data=>{
        this.groupList = data;
        this.groupOriginalList =data;
        this.isLoading=false;
      },error=>{
        alert(error);
      }
    )
  }

  copyGroup(item:any) {
    let obj = {
      group_name:item['group_name'],
      group_admin_name:item['group_admin_name'],
      created_date:this.getCurrentDate(),
      members_name:item['members_name']
    }
    this.groupService.addGroup(obj).subscribe(
      data=>{
        alert("Group Copied Successfully");
        this.getGroupList();
      },error => {
        alert("Error while Cloning");
      }
    )
  }

  deleteGroup(item:any) {
    if(confirm('Do you want to Delete Group '+"'"+item['group_name']+"'")){
      this.groupService.deleteGroup(item["_id"]).subscribe(
        data=>{
          alert("Group Deleted Successfully");
          this.getGroupList();
        },error=>{
          alert("Error while deleting");
        }
      )
    }
  }

  getCountUpdatedGroup() {
    let count=0;
    this.groupOriginalList?.forEach(item=>{
        if(item['isUpdated']==true)
          count++;
      }
    )
    return count;
  }

  onInputChange() {
    this.groupList=this.groupOriginalList.filter(item=>(item['group_name'] as String).toLowerCase().includes(this.search.toLowerCase()));
  }
}

