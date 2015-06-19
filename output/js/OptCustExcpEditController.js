function OptCustExcpEditCtrl($scope, $modalInstance, $http, $timeout, $document, $window, AdminService, sharedService, loading, check, selectedOptCustExcp)
{
	$scope.action = (!selectedOptCustExcp)? ACTION_ADD : ACTION_UPDATE ;
	$scope.item = ($scope.action === ACTION_ADD)? {} : selectedOptCustExcp;
	
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
	
	//Set form defaults here
	$scope.formItem = {};//this is the object we used to capture form data, set defaults

	if ($scope.action === ACTION_ADD)
	{
		$scope.formItem.country = $scope.countries[0];
		
	}
	else if ($scope.action === ACTION_UPDATE)
	{
		var idx = null;
		//set popup values to the ones from object 'selectedOptCustExcp'
		idx = AdminService.getIndexOf(selectedOptCustExcp.cntryCd, $scope.countries, 'cd');
		$scope.formItem.country = $scope.countries[idx];

		
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
	// validation - AMID2
	_wag['OptCustExcpEdit_AMID2'] = 'AMID2_focus;;AMID2_blur';
	$scope.elAmid2Focus = function(){
		_waq.push(['AMID2_focus', (new Date()).valueOf(), {group:'OptCustExcpEdit_AMID2'}]);
	};
	$scope.elAmid2Check = function(type){
		var result = check.exec($scope.item.amid2, ["notNull", "max15"]);
		if(!result[0]){
			sharedService.errorOcurs(AdminService.getErrMsg('ErrMsg_OptCustExcp', 'elAmid2', result[1]));
		}else{
			sharedService.noError();
		}
		if(type === 'blur'){
			_waq.push(['AMID2_blur', (new Date()).valueOf(), {group:'OptCustExcpEdit_AMID2'}]);
		}
		return result;
	};
	// validation - MDCP Org ID *
	_wag['OptCustExcpEdit_MDCP Org ID'] = 'MDCP Org ID_focus;;MDCP Org ID_blur';
	$scope.elMdcpOrgIdFocus = function(){
		_waq.push(['MDCP Org ID_focus', (new Date()).valueOf(), {group:'OptCustExcpEdit_MDCP Org ID'}]);
	};
	$scope.elMdcpOrgIdCheck = function(type){
		var result = check.exec($scope.item.mdcpOrgId, ["notNull", "max32", "digitalOrAsterisk"]);
		if(!result[0]){
			sharedService.errorOcurs(AdminService.getErrMsg('ErrMsg_OptCustExcp', 'elMdcpOrgId', result[1]));
		}else{
			sharedService.noError();
		}
		if(type === 'blur'){
			_waq.push(['MDCP Org ID_blur', (new Date()).valueOf(), {group:'OptCustExcpEdit_MDCP Org ID'}]);
		}
		return result;
	};
	// validation - MDCP Site ID *
	_wag['OptCustExcpEdit_MDCP Site ID'] = 'MDCP Site ID_focus;;MDCP Site ID_blur';
	$scope.elMdcpSiteIdFocus = function(){
		_waq.push(['MDCP Site ID_focus', (new Date()).valueOf(), {group:'OptCustExcpEdit_MDCP Site ID'}]);
	};
	$scope.elMdcpSiteIdCheck = function(type){
		var result = check.exec($scope.item.mdcpSiteId, ["notNull", "max32", "digitalOrAsterisk"]);
		if(!result[0]){
			sharedService.errorOcurs(AdminService.getErrMsg('ErrMsg_OptCustExcp', 'elMdcpSiteId', result[1]));
		}else{
			sharedService.noError();
		}
		if(type === 'blur'){
			_waq.push(['MDCP Site ID_blur', (new Date()).valueOf(), {group:'OptCustExcpEdit_MDCP Site ID'}]);
		}
		return result;
	};
	// validation - Note
	_wag['OptCustExcpEdit_Note'] = 'Note_focus;;Note_blur';
	$scope.elNoteFocus = function(){
		_waq.push(['Note_focus', (new Date()).valueOf(), {group:'OptCustExcpEdit_Note'}]);
	};
	$scope.elNoteCheck = function(type){
		var result = check.exec($scope.item.note, ["max256orNull"]);
		if(!result[0]){
			sharedService.errorOcurs(AdminService.getErrMsg('ErrMsg_OptCustExcp', 'elNote', result[1]));
		}else{
			sharedService.noError();
		}
		if(type === 'blur'){
			_waq.push(['Note_blur', (new Date()).valueOf(), {group:'OptCustExcpEdit_Note'}]);
		}
		return result;
	};

	//----validation for text box---------end--------------------
	$scope.save = function()
	{
		// Track user action
		_waq.push(['Click', 'OptCustExcpEditSave']);
		if ($scope.item === null)
		{
			//throw alert ?
			logger.warn("$scope.item is null, addOptCustExcp service not called.");
			return;
		}
		var action = $scope.action.replace(/^./g, function(s){return s.toUpperCase();});
		if(!$scope.elAmid2Check()[0]){
			_waq.push(['inputError', 'AMID2 '+$scope.elAmid2Check()[1]+' OptCustExcpManagement'+action]);
			return;
		}
		if(!$scope.elMdcpOrgIdCheck()[0]){
			_waq.push(['inputError', 'MDCP Org ID '+$scope.elMdcpOrgIdCheck()[1]+' OptCustExcpManagement'+action]);
			return;
		}
		if(!$scope.elMdcpSiteIdCheck()[0]){
			_waq.push(['inputError', 'MDCP Site ID '+$scope.elMdcpSiteIdCheck()[1]+' OptCustExcpManagement'+action]);
			return;
		}
		if(!$scope.elNoteCheck()[0]){
			_waq.push(['inputError', 'Note '+$scope.elNoteCheck()[1]+' OptCustExcpManagement'+action]);
			return;
		}


		$scope.item.cntryCd = $scope.formItem.country.cd;
		
		//validate data
		var para = {
			item:$scope.item,
			dollerFields:dollerFields,
			percentFields:percentFields
		};
		if ($scope.action === ACTION_ADD)
		{
			loading.open();
			AdminService.saveOptCustExcp(para, function(optCustExcpList){
				optCustExcpList.totalRecordAmount = 1 + optCustExcpList.totalRecordAmount; 
				sharedService.shareGridData(optCustExcpList,'optCustExcp');
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
			AdminService.updateOptCustExcp(para, function(optCustExcpList){
				sharedService.shareGridData(optCustExcpList,'optCustExcp');
				loading.close();
				//close on success, not failure.
				$modalInstance.close();
			});
		}
	};

	$scope.cancel = function()
	{
		// Track user action
		_waq.push(['Click', 'OptCustExcpEditCancel']);

		//$modalInstance.close();
		$modalInstance.dismiss();
	};
}
