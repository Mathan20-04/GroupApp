import {Component, HostListener} from '@angular/core';
import {MatDialogRef} from "@angular/material/dialog";
import {SharedDataService} from "../../../service/shared-data.service";
import {GroupService} from "../../../service/group.service";


@Component({
  selector: 'app-create-group',
  templateUrl: './create-group.component.html',
  styleUrls: ['./create-group.component.css']
})
export class CreateGroupComponent {
  public msg:any;
  public item:any;
  public _id:any;
  public groupName='';
  public adminName='';
  public today: Date = new Date();
  public memberInputList: any[] = [{ member_name: '' }];
  public inputValues: string[] = [];
  public isSaved=false;

  constructor(
    public dialogRef: MatDialogRef<CreateGroupComponent>,
    public sharedDataService: SharedDataService,
    public groupService:GroupService) {
    dialogRef.disableClose = true;
    this.sharedDataService.currentMessage.subscribe(
      message => (this.msg=message));
    if(this.msg.sender == "group") {
      this.item = this.msg.data;
    }
    if(this.item.action=='update') {
      this._id=this.item.item._id;
      this.groupName = this.item.item['group_name'];
      this.adminName = this.item.item['group_admin_name'];
      this.memberInputList = this.item.item['members_name'];
    }
  }

  ngOnInit() {
  }

  getCurrentDate() {
    let date = new Date();
    let dt = date.getDate();
    let mn = date.getMonth() + 1;
    let yy = date.getFullYear();
    return dt + '/' + mn + '/' + yy;
  }

  @HostListener('window:keyup.esc') onKeyUp() {
    this.dialogRef.close();
  }

  close(): void {
    this.dialogRef.close();
  }

  addMembers() {
    this.memberInputList.push({ member_name: '' });
  }

  removeMembers(index: number) {
    if (index >= 0 && index < this.memberInputList.length) {
      this.memberInputList.splice(index, 1);
    }
  }

  getMemberNames() {
    this.inputValues = this.memberInputList.map(input => input);
    return this.inputValues;
  }

  validate() {
    if(!this.groupName.trim()) {
      alert('Enter Group Name');
      return false;
    }
    if(!this.adminName.trim()) {
      alert('Enter Admin Name');
      return false;
    }
    return true;
  }

  save() {
    if(this.validate()){
      let obj:any = {
        group_name:this.groupName.trim(),
        group_admin_name:this.adminName.trim(),
        created_date:this.getCurrentDate(),
        members_name:this.getMemberNames(),
        isUpdated:false
      }
      if(this._id) {
        this.updateGroup(obj)
      } else {
        this.addGroup(obj);
      }
    }
  }

  addGroup(obj:any) {
    this.isSaved=true;
    this.groupService.addGroup(obj).subscribe(
      data => {
        this.dialogRef.close();
        alert("Group Added Successfully");
        this.isSaved=false;
      },error => {
        alert(error);
      }
    )
  }

  updateGroup(obj:any) {
    obj['isUpdated']=true;
    this.isSaved=true;
    this.groupService.updateGroup(this._id,obj).subscribe(
      data=>{
        this.dialogRef.close();
        alert("Group Updated Successfully");
        this.isSaved=false;
      },error => {
        alert(error);
      }
    )
  }
}

