function OptUserEditCtrl($scope, $modalInstance, $http, $timeout, $document, $window, AdminService, sharedService, loading, check, selectedOptUser)
{
	$scope.action = (!selectedOptUser)? ACTION_ADD : ACTION_UPDATE ;
	$scope.item = ($scope.action === ACTION_ADD)? {} : selectedOptUser;
	
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
	$scope.tenantCodes = AdminService.getTenantCodes();
	$scope.roles = AdminService.getRoles();
	
	//Set form defaults here
	$scope.formItem = {};//this is the object we used to capture form data, set defaults

	if ($scope.action === ACTION_ADD)
	{
		$scope.formItem.tenantCode = $scope.tenantCodes[0];
		$scope.formItem.role = $scope.roles[0];
		
	}
	else if ($scope.action === ACTION_UPDATE)
	{
		var idx = null;
		//set popup values to the ones from object 'selectedOptUser'
		idx = AdminService.getIndexOf(selectedOptUser.tenantCode, $scope.tenantCodes, 'cd');
		$scope.formItem.tenantCode = $scope.tenantCodes[idx];

		idx = AdminService.getIndexOf(selectedOptUser.role, $scope.roles, 'cd');
		$scope.formItem.role = $scope.roles[idx];

		
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
	// validation - Email
	_wag['OptUserEdit_Email'] = 'Email_focus;;Email_blur';
	$scope.elEmailFocus = function(){
		_waq.push(['Email_focus', (new Date()).valueOf(), {group:'OptUserEdit_Email'}]);
	};
	$scope.elEmailCheck = function(type){
		var result = check.exec($scope.item.email, ["notNull", "email"]);
		if(!result[0]){
			sharedService.errorOcurs(AdminService.getErrMsg('ErrMsg_OptUser', 'elEmail', result[1]));
		}else{
			sharedService.noError();
		}
		if(type === 'blur'){
			_waq.push(['Email_blur', (new Date()).valueOf(), {group:'OptUserEdit_Email'}]);
		}
		return result;
	};
	// validation - First Name
	_wag['OptUserEdit_First Name'] = 'First Name_focus;;First Name_blur';
	$scope.elFirstNameFocus = function(){
		_waq.push(['First Name_focus', (new Date()).valueOf(), {group:'OptUserEdit_First Name'}]);
	};
	$scope.elFirstNameCheck = function(type){
		var result = check.exec($scope.item.firstName, ["notNull"]);
		if(!result[0]){
			sharedService.errorOcurs(AdminService.getErrMsg('ErrMsg_OptUser', 'elFirstName', result[1]));
		}else{
			sharedService.noError();
		}
		if(type === 'blur'){
			_waq.push(['First Name_blur', (new Date()).valueOf(), {group:'OptUserEdit_First Name'}]);
		}
		return result;
	};
	// validation - Last Name
	_wag['OptUserEdit_Last Name'] = 'Last Name_focus;;Last Name_blur';
	$scope.elLastNameFocus = function(){
		_waq.push(['Last Name_focus', (new Date()).valueOf(), {group:'OptUserEdit_Last Name'}]);
	};
	$scope.elLastNameCheck = function(type){
		var result = check.exec($scope.item.lastName, ["notNull"]);
		if(!result[0]){
			sharedService.errorOcurs(AdminService.getErrMsg('ErrMsg_OptUser', 'elLastName', result[1]));
		}else{
			sharedService.noError();
		}
		if(type === 'blur'){
			_waq.push(['Last Name_blur', (new Date()).valueOf(), {group:'OptUserEdit_Last Name'}]);
		}
		return result;
	};

	//----validation for text box---------end--------------------
	$scope.save = function()
	{
		// Track user action
		_waq.push(['Click', 'OptUserEditSave']);
		if ($scope.item === null)
		{
			//throw alert ?
			logger.warn("$scope.item is null, addOptUser service not called.");
			return;
		}
		var action = $scope.action.replace(/^./g, function(s){return s.toUpperCase();});
		if(!$scope.elEmailCheck()[0]){
			_waq.push(['inputError', 'Email '+$scope.elEmailCheck()[1]+' OptUserManagement'+action]);
			return;
		}
		if(!$scope.elFirstNameCheck()[0]){
			_waq.push(['inputError', 'First Name '+$scope.elFirstNameCheck()[1]+' OptUserManagement'+action]);
			return;
		}
		if(!$scope.elLastNameCheck()[0]){
			_waq.push(['inputError', 'Last Name '+$scope.elLastNameCheck()[1]+' OptUserManagement'+action]);
			return;
		}


		$scope.item.tenantCode = $scope.formItem.tenantCode.cd;
		$scope.item.role = $scope.formItem.role.cd;
		$scope.item.statusFg = ($scope.formItem['statusFlag'] === true) ? 'Y' : 'N';
		
		//validate data
		var para = {
			item:$scope.item,
			dollerFields:dollerFields,
			percentFields:percentFields
		};
		if ($scope.action === ACTION_ADD)
		{
			loading.open();
			AdminService.saveOptUser(para, function(optUserList){
				optUserList.totalRecordAmount = 1 + optUserList.totalRecordAmount; 
				sharedService.shareGridData(optUserList,'optUser');
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
			AdminService.updateOptUser(para, function(optUserList){
				sharedService.shareGridData(optUserList,'optUser');
				loading.close();
				//close on success, not failure.
				$modalInstance.close();
			});
		}
	};

	$scope.cancel = function()
	{
		// Track user action
		_waq.push(['Click', 'OptUserEditCancel']);

		//$modalInstance.close();
		$modalInstance.dismiss();
	};
}
