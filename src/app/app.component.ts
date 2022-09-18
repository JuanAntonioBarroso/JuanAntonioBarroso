import { Component } from '@angular/core';
import * as faker from 'faker';
import { Contact } from './models/contact.model';
import { ExcelService } from './services/excel/excel.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'excel-project';
  importContacts: any[] = [];
  exportContacts: any[] = [];
  newName: string = '';
  newEmail: string = '';
  newPhone: string = '';
  newAddress: string = '';

  constructor(private excelSrv: ExcelService) { }

  ngOnInit(): void {
    for (let index = 0; index < 10; index++) {
      const contact = new Contact();
      contact.name = faker.name.findName();
      contact.phone = faker.phone.phoneNumber();
      contact.email = faker.internet.email();
      contact.address = faker.address.streetAddress();
      this.exportContacts.push(contact);
    }

  }

  onFileChange(evt: any) {
    const target: DataTransfer = <DataTransfer>(evt.target);
    if (target.files.length !== 1) throw new Error('Cannot use multiple files');

    const reader: FileReader = new FileReader();
    reader.onload = (e: any) => {

      const bstr: string = e.target.result;
      const data = <any[]>this.excelSrv.importFromFile(bstr);

      const header: string[] = Object.getOwnPropertyNames(new Contact());
      const importedData = data.slice(1, -1);

      this.importContacts = importedData.map(arr => {
        const obj:any = {};
        for (let i = 0; i < header.length; i++) {
          const k = header[i];
          obj[k] = arr[i];
        }
        return <Contact>obj;
      })

    };
    reader.readAsBinaryString(target.files[0]);

  }

  exportData(tableId: string) {
    this.excelSrv.exportToFile("contacts", tableId);
  }

  onKeyName($event: any) {
    this.newName = $event.target.value;
  }
  onKeyEmail($event: any) {
    this.newEmail = $event.target.value;
  }
  onKeyPhone($event: any) {
    this.newPhone = $event.target.value;
  }
  onKeyAddress($event: any) {
    this.newAddress = $event.target.value;
  }

  addCat() {
    let contact = {name: this.newName, email: this.newEmail, phone: this.newPhone, address: this.newAddress};
    this.importContacts.push(contact);
    this.newName = '';
    this.newEmail = '';
    this.newPhone = '';
    this.newAddress = '';
  }

}
