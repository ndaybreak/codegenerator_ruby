function OptGuidanceDefaultPtEditCtrl($scope, $modalInstance, $http, $timeout, $document, $window, AdminService, sharedService, loading, check, selectedOptGuidanceDefaultPt)
{
	$scope.action = (!selectedOptGuidanceDefaultPt)? ACTION_ADD : ACTION_UPDATE ;
	$scope.item = ($scope.action === ACTION_ADD)? {} : selectedOptGuidanceDefaultPt;
	
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
	$scope.routeToMarkets = AdminService.getRouteToMarkets();
	$scope.regions = AdminService.getRegions();
	$scope.businessUnits = AdminService.getBusinessUnits();
	$scope.countries = AdminService.getCountries();
	$scope.defBenchs = AdminService.getBenchmarks();
	$scope.roles = AdminService.getRoles();
	$scope.negMarginAprvlFgs = AdminService.getNegMarginAprvlFgs();
	$scope.authBenchs = AdminService.getBenchmarks();
	
	//Set form defaults here
	$scope.formItem = {};//this is the object we used to capture form data, set defaults

	if ($scope.action === ACTION_ADD)
	{
		$scope.formItem.routeToMarket = $scope.routeToMarkets[0];
		$scope.formItem.region = $scope.regions[0];
		$scope.formItem.businessUnit = $scope.businessUnits[0];
		$scope.formItem.country = $scope.countries[0];
		$scope.formItem.benchmark = $scope.defBenchs[0];
		$scope.formItem.role = $scope.roles[0];
		$scope.formItem.negMarginAprvlFg = $scope.negMarginAprvlFgs[0];
		$scope.formItem.authBenchmark = $scope.authBenchs[0];
		
	}
	else if ($scope.action === ACTION_UPDATE)
	{
		var idx = null;
		//set popup values to the ones from object 'selectedOptGuidanceDefaultPt'
		idx = AdminService.getIndexOf(selectedOptGuidanceDefaultPt.routeToMarket, $scope.routeToMarkets, 'cd');
		$scope.formItem.routeToMarket = $scope.routeToMarkets[idx];

		idx = AdminService.getIndexOf(selectedOptGuidanceDefaultPt.region, $scope.regions, 'cd');
		$scope.formItem.region = $scope.regions[idx];

		idx = AdminService.getIndexOf(selectedOptGuidanceDefaultPt.busUnit, $scope.businessUnits, 'cd');
		$scope.formItem.businessUnit = $scope.businessUnits[idx];

		idx = AdminService.getIndexOf(selectedOptGuidanceDefaultPt.cntryCd, $scope.countries, 'cd');
		$scope.formItem.country = $scope.countries[idx];

		idx = AdminService.getIndexOf(selectedOptGuidanceDefaultPt.defBench, $scope.defBenchs, 'cd');
		$scope.formItem.benchmark = $scope.defBenchs[idx];

		idx = AdminService.getIndexOf(selectedOptGuidanceDefaultPt.roleId, $scope.roles, 'cd');
		$scope.formItem.role = $scope.roles[idx];

		idx = AdminService.getIndexOf(selectedOptGuidanceDefaultPt.negMarginAprvlFg, $scope.negMarginAprvlFgs, 'cd');
		$scope.formItem.negMarginAprvlFg = $scope.negMarginAprvlFgs[idx];

		idx = AdminService.getIndexOf(selectedOptGuidanceDefaultPt.authBench, $scope.authBenchs, 'cd');
		$scope.formItem.authBenchmark = $scope.authBenchs[idx];

		
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
	// validation - Default Adjustment %
	_wag['OptGuidanceDefaultPtEdit_Default Adjustment %'] = 'Default Adjustment %_focus;;Default Adjustment %_blur';
	$scope.elDefAdjPctFocus = function(){
		_waq.push(['Default Adjustment %_focus', (new Date()).valueOf(), {group:'OptGuidanceDefaultPtEdit_Default Adjustment %'}]);
	};
	$scope.elDefAdjPctCheck = function(type){
		var result = check.exec($scope.item.defAdjPct, ["notNull", "perc"]);
		if(!result[0]){
			sharedService.errorOcurs(AdminService.getErrMsg('ErrMsg_OptGuidanceDefaultPt', 'elDefAdjPct', result[1]));
		}else{
			sharedService.noError();
		}
		if(type === 'blur'){
			_waq.push(['Default Adjustment %_blur', (new Date()).valueOf(), {group:'OptGuidanceDefaultPtEdit_Default Adjustment %'}]);
		}
		return result;
	};
	// validation - Auth Adjustment %
	_wag['OptGuidanceDefaultPtEdit_Auth Adjustment %'] = 'Auth Adjustment %_focus;;Auth Adjustment %_blur';
	$scope.elAuthAdjPctFocus = function(){
		_waq.push(['Auth Adjustment %_focus', (new Date()).valueOf(), {group:'OptGuidanceDefaultPtEdit_Auth Adjustment %'}]);
	};
	$scope.elAuthAdjPctCheck = function(type){
		var result = check.exec($scope.item.authAdjPct, ["notNull", "perc"]);
		if(!result[0]){
			sharedService.errorOcurs(AdminService.getErrMsg('ErrMsg_OptGuidanceDefaultPt', 'elAuthAdjPct', result[1]));
		}else{
			sharedService.noError();
		}
		if(type === 'blur'){
			_waq.push(['Auth Adjustment %_blur', (new Date()).valueOf(), {group:'OptGuidanceDefaultPtEdit_Auth Adjustment %'}]);
		}
		return result;
	};
	// validation - Note
	_wag['OptGuidanceDefaultPtEdit_Note'] = 'Note_focus;;Note_blur';
	$scope.elNoteFocus = function(){
		_waq.push(['Note_focus', (new Date()).valueOf(), {group:'OptGuidanceDefaultPtEdit_Note'}]);
	};
	$scope.elNoteCheck = function(type){
		var result = check.exec($scope.item.note, ["max256orNull"]);
		if(!result[0]){
			sharedService.errorOcurs(AdminService.getErrMsg('ErrMsg_OptGuidanceDefaultPt', 'elNote', result[1]));
		}else{
			sharedService.noError();
		}
		if(type === 'blur'){
			_waq.push(['Note_blur', (new Date()).valueOf(), {group:'OptGuidanceDefaultPtEdit_Note'}]);
		}
		return result;
	};

	//----validation for text box---------end--------------------
	$scope.save = function()
	{
		// Track user action
		_waq.push(['Click', 'OptGuidanceDefaultPtEditSave']);
		if ($scope.item === null)
		{
			//throw alert ?
			logger.warn("$scope.item is null, addOptGuidanceDefaultPt service not called.");
			return;
		}
		var action = $scope.action.replace(/^./g, function(s){return s.toUpperCase();});
		if(!$scope.elDefAdjPctCheck()[0]){
			_waq.push(['inputError', 'Default Adjustment % '+$scope.elDefAdjPctCheck()[1]+' OptGuidanceDefaultPtManagement'+action]);
			return;
		}
		if(!$scope.elAuthAdjPctCheck()[0]){
			_waq.push(['inputError', 'Auth Adjustment % '+$scope.elAuthAdjPctCheck()[1]+' OptGuidanceDefaultPtManagement'+action]);
			return;
		}
		if(!$scope.elNoteCheck()[0]){
			_waq.push(['inputError', 'Note '+$scope.elNoteCheck()[1]+' OptGuidanceDefaultPtManagement'+action]);
			return;
		}


		$scope.item.routeToMarket = $scope.formItem.routeToMarket.cd;
		$scope.item.region = $scope.formItem.region.cd;
		$scope.item.busUnit = $scope.formItem.businessUnit.cd;
		$scope.item.cntryCd = $scope.formItem.country.cd;
		$scope.item.defBench = $scope.formItem.benchmark.cd;
		$scope.item.roleId = $scope.formItem.role.cd;
		$scope.item.negMarginAprvlFg = $scope.formItem.negMarginAprvlFg.cd;
		$scope.item.authBench = $scope.formItem.authBenchmark.cd;
		$scope.item.showExpFg = ($scope.formItem['showExpFlag'] === true) ? 'Y' : 'N';
		$scope.item.showTypFg = ($scope.formItem['showTypeFlag'] === true) ? 'Y' : 'N';
		$scope.item.activeFg = ($scope.formItem['activeFlag'] === true) ? 'Y' : 'N';
		$scope.item.showFlrFg = ($scope.formItem['showFlrFlag'] === true) ? 'Y' : 'N';
		
		//validate data
		var para = {
			item:$scope.item,
			dollerFields:dollerFields,
			percentFields:percentFields
		};
		if ($scope.action === ACTION_ADD)
		{
			loading.open();
			AdminService.saveOptGuidanceDefaultPt(para, function(optGuidanceDefaultPtList){
				optGuidanceDefaultPtList.totalRecordAmount = 1 + optGuidanceDefaultPtList.totalRecordAmount; 
				sharedService.shareGridData(optGuidanceDefaultPtList,'optGuidanceDefaultPt');
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
			AdminService.updateOptGuidanceDefaultPt(para, function(optGuidanceDefaultPtList){
				sharedService.shareGridData(optGuidanceDefaultPtList,'optGuidanceDefaultPt');
				loading.close();
				//close on success, not failure.
				$modalInstance.close();
			});
		}
	};

	$scope.cancel = function()
	{
		// Track user action
		_waq.push(['Click', 'OptGuidanceDefaultPtEditCancel']);

		//$modalInstance.close();
		$modalInstance.dismiss();
	};
}
