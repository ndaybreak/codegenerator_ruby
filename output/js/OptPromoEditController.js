function OptPromoEditCtrl($scope, $modalInstance, $http, $timeout, $document, $window, AdminService, sharedService, loading, check, selectedOptPromo)
{
	$scope.action = (!selectedOptPromo)? ACTION_ADD : ACTION_UPDATE ;
	$scope.item = ($scope.action === ACTION_ADD)? {} : selectedOptPromo;
	
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
	$scope.countries = AdminService.getCountries();
	$scope.businessGroups = AdminService.getBusinessGroups();
	$scope.businessModels = AdminService.getbusinessModels();
	
	//Set form defaults here
	$scope.formItem = {};//this is the object we used to capture form data, set defaults

	if ($scope.action === ACTION_ADD)
	{
		$scope.formItem.routeToMarket = $scope.routeToMarkets[0];
		$scope.formItem.region = $scope.regions[];
		$scope.formItem.country = $scope.countries[0];
		$scope.formItem.businessGroup = $scope.businessGroups[0];
		$scope.formItem.businessModel = $scope.businessModels[0];
		
	}
	else if ($scope.action === ACTION_UPDATE)
	{
		var idx = null;
		//set popup values to the ones from object 'selectedOptPromo'
		idx = AdminService.getIndexOf(selectedOptPromo.routeToMarket, $scope.routeToMarkets, 'cd');
		$scope.formItem.routeToMarket = $scope.routeToMarkets[idx];

		idx = AdminService.getIndexOf(selectedOptPromo.region, $scope.regions, 'cd');
		$scope.formItem.region = $scope.regions[idx];

		idx = AdminService.getIndexOf(selectedOptPromo.cntryCd, $scope.countries, 'cd');
		$scope.formItem.country = $scope.countries[idx];

		idx = AdminService.getIndexOf(selectedOptPromo.busGrpId, $scope.businessGroups, 'cd');
		$scope.formItem.businessGroup = $scope.businessGroups[idx];

		idx = AdminService.getIndexOf(selectedOptPromo.busModelCd, $scope.businessModels, 'cd');
		$scope.formItem.businessModel = $scope.businessModels[idx];

		
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
	_wag['OptPromoEdit_Note'] = 'Note_focus;;Note_blur';
	$scope.elNoteFocus = function(){
		_waq.push(['Note_focus', (new Date()).valueOf(), {group:'OptPromoEdit_Note'}]);
	};
	$scope.elNoteCheck = function(type){
		var result = check.exec($scope.item.note, ["max256orNull"]);
		if(!result[0]){
			sharedService.errorOcurs(AdminService.getErrMsg('ErrMsg_OptPromo', 'elNote', result[1]));
		}else{
			sharedService.noError();
		}
		if(type === 'blur'){
			_waq.push(['Note_blur', (new Date()).valueOf(), {group:'OptPromoEdit_Note'}]);
		}
		return result;
	};

	//----validation for text box---------end--------------------
	$scope.save = function()
	{
		// Track user action
		_waq.push(['Click', 'OptPromoEditSave']);
		if ($scope.item === null)
		{
			//throw alert ?
			logger.warn("$scope.item is null, addOptPromo service not called.");
			return;
		}
		var action = $scope.action.replace(/^./g, function(s){return s.toUpperCase();});
		if(!$scope.elNoteCheck()[0]){
			_waq.push(['inputError', 'Note '+$scope.elNoteCheck()[1]+' OptPromoManagement'+action]);
			return;
		}


		$scope.item.routeToMarket = $scope.formItem.routeToMarket.cd;
		$scope.item.region = $scope.formItem.region.cd;
		$scope.item.cntryCd = $scope.formItem.country.cd;
		$scope.item.busGrpId = $scope.formItem.businessGroup.cd;
		$scope.item.busModelCd = $scope.formItem.businessModel.cd;
		
		//validate data
		var para = {
			item:$scope.item,
			dollerFields:dollerFields,
			percentFields:percentFields
		};
		if ($scope.action === ACTION_ADD)
		{
			loading.open();
			AdminService.saveOptPromo(para, function(optPromoList){
				optPromoList.totalRecordAmount = 1 + optPromoList.totalRecordAmount; 
				sharedService.shareGridData(optPromoList,'optPromo');
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
			AdminService.updateOptPromo(para, function(optPromoList){
				sharedService.shareGridData(optPromoList,'optPromo');
				loading.close();
				//close on success, not failure.
				$modalInstance.close();
			});
		}
	};

	$scope.cancel = function()
	{
		// Track user action
		_waq.push(['Click', 'OptPromoEditCancel']);

		//$modalInstance.close();
		$modalInstance.dismiss();
	};
}
