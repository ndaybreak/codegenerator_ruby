function OptBuCustExcpEditCtrl($scope, $modalInstance, $http, $timeout, $document, $window, AdminService, sharedService, loading, check, selectedOptBuCustExcp)
{
	$scope.action = (!selectedOptBuCustExcp)? ACTION_ADD : ACTION_UPDATE ;
	$scope.item = ($scope.action === ACTION_ADD)? {} : selectedOptBuCustExcp;
	
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
	$scope.countries = AdminService.getCountries();
	$scope.businessUnits = AdminService.getBusinessUnits();
	
	//Set form defaults here
	$scope.formItem = {};//this is the object we used to capture form data, set defaults

	if ($scope.action === ACTION_ADD)
	{
		$scope.formItem.country = $scope.countries[0];
		$scope.formItem.bunit = $scope.businessUnits[0];
		
	}
	else if ($scope.action === ACTION_UPDATE)
	{
		var idx = null;
		//set popup values to the ones from object 'selectedOptBuCustExcp'
		idx = AdminService.getIndexOf(selectedOptBuCustExcp.cntryCd, $scope.countries, 'cd');
		$scope.formItem.country = $scope.countries[idx];

		idx = AdminService.getIndexOf(selectedOptBuCustExcp.busUnit, $scope.businessUnits, 'cd');
		$scope.formItem.bunit = $scope.businessUnits[idx];

		
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
	// validation - MDCP Org ID
	_wag['OptBuCustExcpEdit_MDCP Org ID'] = 'MDCP Org ID_focus;;MDCP Org ID_blur';
	$scope.elMdcpOrgIdFocus = function(){
		_waq.push(['MDCP Org ID_focus', (new Date()).valueOf(), {group:'OptBuCustExcpEdit_MDCP Org ID'}]);
	};
	$scope.elMdcpOrgIdCheck = function(type){
		var result = check.exec($scope.item.mdcpOrgId, ["notNull", "max32", "digital"]);
		if(!result[0]){
			sharedService.errorOcurs(AdminService.getErrMsg('ErrMsg_OptBuCustExcp', 'elMdcpOrgId', result[1]));
		}else{
			sharedService.noError();
		}
		if(type === 'blur'){
			_waq.push(['MDCP Org ID_blur', (new Date()).valueOf(), {group:'OptBuCustExcpEdit_MDCP Org ID'}]);
		}
		return result;
	};
	// validation - AMID2 *
	_wag['OptBuCustExcpEdit_AMID2'] = 'AMID2_focus;;AMID2_blur';
	$scope.elAmid2Focus = function(){
		_waq.push(['AMID2_focus', (new Date()).valueOf(), {group:'OptBuCustExcpEdit_AMID2'}]);
	};
	$scope.elAmid2Check = function(type){
		var result = check.exec($scope.item.amid2, ["notNull", "max15"]);
		if(!result[0]){
			sharedService.errorOcurs(AdminService.getErrMsg('ErrMsg_OptBuCustExcp', 'elAmid2', result[1]));
		}else{
			sharedService.noError();
		}
		if(type === 'blur'){
			_waq.push(['AMID2_blur', (new Date()).valueOf(), {group:'OptBuCustExcpEdit_AMID2'}]);
		}
		return result;
	};
	// validation - Note
	_wag['OptBuCustExcpEdit_Note'] = 'Note_focus;;Note_blur';
	$scope.elNoteFocus = function(){
		_waq.push(['Note_focus', (new Date()).valueOf(), {group:'OptBuCustExcpEdit_Note'}]);
	};
	$scope.elNoteCheck = function(type){
		var result = check.exec($scope.item.note, ["max256orNull"]);
		if(!result[0]){
			sharedService.errorOcurs(AdminService.getErrMsg('ErrMsg_OptBuCustExcp', 'elNote', result[1]));
		}else{
			sharedService.noError();
		}
		if(type === 'blur'){
			_waq.push(['Note_blur', (new Date()).valueOf(), {group:'OptBuCustExcpEdit_Note'}]);
		}
		return result;
	};

	//----validation for text box---------end--------------------
	$scope.save = function()
	{
		// Track user action
		_waq.push(['Click', 'OptBuCustExcpEditSave']);
		if ($scope.item === null)
		{
			//throw alert ?
			logger.warn("$scope.item is null, addOptBuCustExcp service not called.");
			return;
		}
		var action = $scope.action.replace(/^./g, function(s){return s.toUpperCase();});
		if(!$scope.elMdcpOrgIdCheck()[0]){
			_waq.push(['inputError', 'MDCP Org ID '+$scope.elMdcpOrgIdCheck()[1]+' OptBuCustExcpManagement'+action]);
			return;
		}
		if(!$scope.elAmid2Check()[0]){
			_waq.push(['inputError', 'AMID2 '+$scope.elAmid2Check()[1]+' OptBuCustExcpManagement'+action]);
			return;
		}
		if(!$scope.elNoteCheck()[0]){
			_waq.push(['inputError', 'Note '+$scope.elNoteCheck()[1]+' OptBuCustExcpManagement'+action]);
			return;
		}


		$scope.item.cntryCd = $scope.formItem.country.cd;
		$scope.item.busUnit = $scope.formItem.bunit.cd;
		
		//validate data
		var para = {
			item:$scope.item,
			dollerFields:dollerFields,
			percentFields:percentFields
		};
		if ($scope.action === ACTION_ADD)
		{
			loading.open();
			AdminService.saveOptBuCustExcp(para, function(optBuCustExcpList){
				optBuCustExcpList.totalRecordAmount = 1 + optBuCustExcpList.totalRecordAmount; 
				sharedService.shareGridData(optBuCustExcpList,'optBuCustExcp');
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
			AdminService.updateOptBuCustExcp(para, function(optBuCustExcpList){
				sharedService.shareGridData(optBuCustExcpList,'optBuCustExcp');
				loading.close();
				//close on success, not failure.
				$modalInstance.close();
			});
		}
	};

	$scope.cancel = function()
	{
		// Track user action
		_waq.push(['Click', 'OptBuCustExcpEditCancel']);

		//$modalInstance.close();
		$modalInstance.dismiss();
	};
}
