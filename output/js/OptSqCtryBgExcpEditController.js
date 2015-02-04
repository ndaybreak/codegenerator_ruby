function OptSqCtryBgExcpEditCtrl($scope, $modalInstance, $http, $timeout, $document, $window, AdminService, sharedService, loading, check, selectedOptSqCtryBgExcp)
{
	$scope.action = (!selectedOptSqCtryBgExcp)? ACTION_ADD : ACTION_UPDATE ;
	$scope.item = ($scope.action === ACTION_ADD)? {} : selectedOptSqCtryBgExcp;
	
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
	$scope.businessGroups = AdminService.getBusinessGroups();
	
	//Set form defaults here
	$scope.formItem = {};//this is the object we used to capture form data, set defaults

	if ($scope.action === ACTION_ADD)
	{
		$scope.formItem.country = $scope.countries[0];
		$scope.formItem.businessGroup = $scope.businessGroups[0];
		
	}
	else if ($scope.action === ACTION_UPDATE)
	{
		var idx = null;
		//set popup values to the ones from object 'selectedOptSqCtryBgExcp'
		idx = AdminService.getIndexOf(selectedOptSqCtryBgExcp.cntryCd, $scope.countries, 'cd');
		$scope.formItem.country = $scope.countries[idx];

		idx = AdminService.getIndexOf(selectedOptSqCtryBgExcp.busGrp, $scope.businessGroups, 'cd');
		$scope.formItem.businessGroup = $scope.businessGroups[idx];

		
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
	// validation - Note
	_wag['OptSqCtryBgExcpEdit_Note'] = 'Note_focus;;Note_blur';
	$scope.elNoteFocus = function(){
		_waq.push(['Note_focus', (new Date()).valueOf(), {group:'OptSqCtryBgExcpEdit_Note'}]);
	};
	$scope.elNoteCheck = function(type){
		var result = check.exec($scope.item.note, ["max256orNull"]);
		if(!result[0]){
			sharedService.errorOcurs(AdminService.getErrMsg('ErrMsg_OptSqCtryBgExcp', 'elNote', result[1]));
		}else{
			sharedService.noError();
		}
		if(type === 'blur'){
			_waq.push(['Note_blur', (new Date()).valueOf(), {group:'OptSqCtryBgExcpEdit_Note'}]);
		}
		return result;
	};

	//----validation for text box---------end--------------------
	$scope.save = function()
	{
		// Track user action
		_waq.push(['Click', 'OptSqCtryBgExcpEditSave']);
		if ($scope.item === null)
		{
			//throw alert ?
			logger.warn("$scope.item is null, addOptSqCtryBgExcp service not called.");
			return;
		}
		var action = $scope.action.replace(/^./g, function(s){return s.toUpperCase();});
		if(!$scope.elNoteCheck()[0]){
			_waq.push(['inputError', 'Note '+$scope.elNoteCheck()[1]+' OptSqCtryBgExcpManagement'+action]);
			return;
		}


		$scope.item.cntryCd = $scope.formItem.country.cd;
		$scope.item.busGrp = $scope.formItem.businessGroup.cd;
		
		//validate data
		var para = {
			item:$scope.item,
			dollerFields:dollerFields,
			percentFields:percentFields
		};
		if ($scope.action === ACTION_ADD)
		{
			loading.open();
			AdminService.saveOptSqCtryBgExcp(para, function(optSqCtryBgExcpList){
				optSqCtryBgExcpList.totalRecordAmount = 1 + optSqCtryBgExcpList.totalRecordAmount; 
				sharedService.shareGridData(optSqCtryBgExcpList,'optSqCtryBgExcp');
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
			AdminService.updateOptSqCtryBgExcp(para, function(optSqCtryBgExcpList){
				sharedService.shareGridData(optSqCtryBgExcpList,'optSqCtryBgExcp');
				loading.close();
				//close on success, not failure.
				$modalInstance.close();
			});
		}
	};

	$scope.cancel = function()
	{
		// Track user action
		_waq.push(['Click', 'OptSqCtryBgExcpEditCancel']);

		//$modalInstance.close();
		$modalInstance.dismiss();
	};
}
