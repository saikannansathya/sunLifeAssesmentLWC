import { LightningElement, track, wire } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import getFinancialServicesAccounts from '@salesforce/apex/AccountFinancialServicesLWCController.getFinancialServicesAccounts';
import updateFinancialServicesAccounts from '@salesforce/apex/AccountFinancialServicesLWCController.updateFinancialServicesAccounts';
const columns = [
    { label: 'Account Name', fieldName: 'accountLink', sortable: true, type: 'url',
    typeAttributes: {label: { fieldName: 'Name' }, target: '_blank'}},
    { label: 'Account Owner', fieldName: 'OwnerName', sortable: true},
    { label: 'Phone', fieldName: 'Phone', type: 'phone', editable: true },
    { label: 'Website', fieldName: 'Website', type: 'url', editable: true },
    { label: 'Annual Revenue', fieldName: 'AnnualRevenue', type: 'currency' , editable: true }
];

export default class AccountTableForFinancialServices extends LightningElement {
    columns=columns;
    searchKey = '';
    error;
    @track
    data;
    @track
    saveDraftValues
    sortBy;
    sortDirection;
    fieldName;
    result;
    connectedCallback(){
        console.log('connectedCallback');
        this.handleAccountLoadAndSearch();
    }

    handleAccountNameSearch(event) {
        this.searchKey = event.target.value;
        this.handleAccountLoadAndSearch();
    }

    handleAccountLoadAndSearch() {
        console.log('handleAccountLoadAndSearch');
        getFinancialServicesAccounts({ searchKey: this.searchKey })
            .then((result) => {
                console.log('result');
                console.log(result);
                
                result.forEach(function(accountRecord){
                    try{
                        accountRecord['OwnerName'] = accountRecord.Owner.Name; 
                        accountRecord['accountLink'] = '/'+accountRecord.Id; 
                        
                    }catch(e){}
                  });
                this.result=JSON.parse(JSON.stringify(result));
                this.data = {};
                this.data = result;
                this.error = undefined;
            })
            .catch((error) => {
                this.error = error;
                this.data = undefined;
                console.log('this.error'+this.error);
            });
    }

    handleAccountSave(event){
        console.log('event.detail.draftValues');
        console.log(event.detail.draftValues);
        this.saveDraftValues = event.detail.draftValues;
        this.handleAccountUpdate();
    }

    handleAccountUpdate() {
        console.log('handleAccountLoadAndSearch');
        updateFinancialServicesAccounts({ updateAccountEditedList: this.saveDraftValues })
            .then((result) => {
                console.log('result');
                console.log(result);
                if(result == 'Success'){
                    window.location.reload();
                }
                else{
                    this.error = result;
                    this.showErrorNotification();
                }
            })
            .catch((error) => {
                this.error = error;
                this.data = undefined;
            });
    }

    showErrorNotification() {
        const evt = new ShowToastEvent({
            title: 'Error Ocurred While Saving:',
            message: 'Please check the data entered!',
            variant: 'error'
        });
        this.dispatchEvent(evt);
    }

    handleAccountSort(event){
        this.fieldName = event.detail.fieldName;
        this.sortBy = this.fieldName;
        this.sortDirection = event.detail.sortDirection;
        // assign the latest attribute with the sorted column fieldName and sorted direction
        console.log('handleAccountSort'+this.fieldName + this.sortDirection);
        if(this.fieldName =='accountLink'){
            this.fieldName = 'Name';
        }
        
        this.result = JSON.parse(JSON.stringify(this.result));

        console.log('this.data--'+this.fieldName);
        console.log(this.result);
        
        this.data = JSON.parse(JSON.stringify(this.result));

        if(this.sortDirection == 'asc'){
            this.result.sort(this.sortAscOrder(this.fieldName));
            this.sortDirection = 'dsc';
        }
        else{
            this.result.sort(this.sortDscOrder(this.fieldName));
            this.sortDirection = 'asc';
        }
        
        
        console.log('this.data-2-');
        console.log(this.result);
        //this.data = JSON.parse(JSON.stringify(this.data));
    }

    sortAscOrder(prop) {    
        return function(a, b) {    
            if (a[prop] > b[prop]) {    
                return 1;    
            } else if (a[prop] < b[prop]) {    
                return -1;    
            }    
            return 0;    
        }    
    }

    sortDscOrder(prop) {    
        return function(a, b) {    
            if (a[prop] > b[prop]) {    
                return -1;    
            } else if (a[prop] < b[prop]) {    
                return 1;    
            }    
            return 0;    
        }    
    }

}