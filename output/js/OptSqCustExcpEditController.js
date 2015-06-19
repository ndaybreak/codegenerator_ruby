function OptSqCustExcpEditCtrl($scope, $modalInstance, $http, $timeout, $document, $window, AdminService, sharedService, loading, check, selectedOptSqCustExcp)
{
	$scope.action = (!selectedOptSqCustExcp)? ACTION_ADD : ACTION_UPDATE ;
	$scope.item = ($scope.action === ACTION_ADD)? {} : selectedOptSqCustExcp;
	
	var dollerFields = [];
	var percentFields = [];
	$scope.$on('handleErrorOcurs', function(scope,data) {
		//if fails, show the error message.
		$scope.hasError = true;
		$scope.errorMessage = data;
		loading.close();
	});

	$scope.$on('everyThingIsFine', function(scope) {
		//hide the error message
		$scope.hasError = false;
		$scope.errorMessage = '';
//		loading.close();
	});

	//disable click backspace button direct to before page.
	$window.setTimeout($document.bind("keydown keypress", function (event) {
        if(event.currentTarget.activeElement.tagName !="INPUT" && event.currentTarget.activeElement.tagName !="TEXTAREA" && event.which === 8) {
        	$scope.$apply(function (){
        		$scope.$eval();
            });
            event.preventDefault();
        }
    }), 0);

	$scope.hasError = false;
	$scope.errorMessage = '';
	//TODO - get this from services module or a different one
	$scope.idTypes = AdminService.getCustormerIdTypes();
	
	//Set form defaults here
	$scope.formItem = {};//this is the object we used to capture form data, set defaults

	if ($scope.action === ACTION_ADD)
	{
		$scope.formItem.idType = $scope.idTypes[0];
		
	}
	else if ($scope.action === ACTION_UPDATE)
	{
		var idx = null;
		//set popup values to the ones from object 'selectedOptSqCustExcp'
		idx = AdminService.getIndexOf(selectedOptSqCustExcp.idType, $scope.idTypes, 'cd');
		$scope.formItem.idType = $scope.idTypes[idx];

		
	}

	$scope.clearError = function(){
		sharedService.noError();
	};

	$scope.trimAndToUpperCase = function(val){
		var str = val;
		// console.log(str);
		str = check.trimAll(str);
		str = check.toUpperCase(str);
		return str;
	};
	//----validation for text box---------start--------------------
	// validation - Customer
	_wag['OptSqCustExcpEdit_Customer'] = 'Customer_focus;;Customer_blur';
	$scope.elCustomerIdFocus = function(){
		_waq.push(['Customer_focus', (new Date()).valueOf(), {group:'OptSqCustExcpEdit_Customer'}]);
	};
	$scope.elCustomerIdCheck = function(type){
		var result = check.exec($scope.item.custId, ["notNull", "max32"]);
		if(!result[0]){
			sharedService.errorOcurs(AdminService.getErrMsg('ErrMsg_OptSqCustExcp', 'elCustomerId', result[1]));
		}else{
			sharedService.noError();
		}
		if(type === 'blur'){
			_waq.push(['Customer_blur', (new Date()).valueOf(), {group:'OptSqCustExcpEdit_Customer'}]);
		}
		return result;
	};
	// validation - Note
	_wag['OptSqCustExcpEdit_Note'] = 'Note_focus;;Note_blur';
	$scope.elNoteFocus = function(){
		_waq.push(['Note_focus', (new Date()).valueOf(), {group:'OptSqCustExcpEdit_Note'}]);
	};
	$scope.elNoteCheck = function(type){
		var result = check.exec($scope.item.note, ["max256orNull"]);
		if(!result[0]){
			sharedService.errorOcurs(AdminService.getErrMsg('ErrMsg_OptSqCustExcp', 'elNote', result[1]));
		}else{
			sharedService.noError();
		}
		if(type === 'blur'){
			_waq.push(['Note_blur', (new Date()).valueOf(), {group:'OptSqCustExcpEdit_Note'}]);
		}
		return result;
	};

	//----validation for text box---------end--------------------
	$scope.save = function()
	{
		// Track user action
		_waq.push(['Click', 'OptSqCustExcpEditSave']);
		if ($scope.item === null)
		{
			//throw alert ?
			logger.warn("$scope.item is null, addOptSqCustExcp service not called.");
			return;
		}
		var action = $scope.action.replace(/^./g, function(s){return s.toUpperCase();});
		if(!$scope.elCustomerIdCheck()[0]){
			_waq.push(['inputError', 'Customer '+$scope.elCustomerIdCheck()[1]+' OptSqCustExcpManagement'+action]);
			return;
		}
		if(!$scope.elNoteCheck()[0]){
			_waq.push(['inputError', 'Note '+$scope.elNoteCheck()[1]+' OptSqCustExcpManagement'+action]);
			return;
		}


		$scope.item.idType = $scope.formItem.idType.cd;
		
		//validate data
		var para = {
			item:$scope.item,
			dollerFields:dollerFields,
			percentFields:percentFields
		};
		if ($scope.action === ACTION_ADD)
		{
			loading.open();
			AdminService.saveOptSqCustExcp(para, function(optSqCustExcpList){
				optSqCustExcpList.totalRecordAmount = 1 + optSqCustExcpList.totalRecordAmount; 
				sharedService.shareGridData(optSqCustExcpList,'optSqCustExcp');
				tmp1 = $(document).find(".dataTable tr").last().offset().top;
				tmp2 = $(window).scrollTop();
				$("body,html").animate({scrollTop: tmp2}, 160);
				$("body,html").animate({scrollTop: tmp1+tmp2}, 160);
				loading.close();
				$modalInstance.close();
			});
		}
		else if ($scope.action === ACTION_UPDATE)
		{
			loading.open();
			delete $scope.item.addFlag;
			AdminService.updateOptSqCustExcp(para, function(optSqCustExcpList){
				sharedService.shareGridData(optSqCustExcpList,'optSqCustExcp');
				loading.close();
				//close on success, not failure.
				$modalInstance.close();
			});
		}
	};

	$scope.cancel = function()
	{
		// Track user action
		_waq.push(['Click', 'OptSqCustExcpEditCancel']);

		//$modalInstance.close();
		$modalInstance.dismiss();
	};
}
