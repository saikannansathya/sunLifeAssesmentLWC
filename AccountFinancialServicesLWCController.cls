public with sharing class AccountFinancialServicesLWCController {
    @AuraEnabled
    public static List<Account> getFinancialServicesAccounts(String searchKey){
        List<Account> financialServicesAccounts;
        if(String.isBlank(searchkey)){
            financialServicesAccounts = [select Id, Name, OwnerId, Owner.Name, Phone, Website, AnnualRevenue 
                                            from Account where  Industry ='Financial Services' ];
        }
        else{
            searchKey = searchKey+'%';
            financialServicesAccounts = [select Id, Name, OwnerId, Owner.Name, Phone, Website, AnnualRevenue 
                                            from Account where  Industry ='Financial Services' and Name like :searchkey];
        }
        return  financialServicesAccounts;                                    
    }
    @AuraEnabled
    public static String updateFinancialServicesAccounts(List<Account> updateAccountEditedList){
        try{
            update updateAccountEditedList;
            return 'Success';
        }
        catch (Exception e){
            return e.getMessage();
        }
    }   
}