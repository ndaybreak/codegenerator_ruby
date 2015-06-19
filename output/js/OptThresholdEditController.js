function OptThresholdEditCtrl($scope, $modalInstance, $http, $timeout, $document, $window, AdminService, sharedService, loading, check, selectedOptThreshold)
{
	$scope.action = (!selectedOptThreshold)? ACTION_ADD : ACTION_UPDATE ;
	$scope.item = ($scope.action === ACTION_ADD)? {} : selectedOptThreshold;
	
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
	$scope.unverCustPrcMthds = AdminService.getUnverCustPrcMthds();
	
	//Set form defaults here
	$scope.formItem = {};//this is the object we used to capture form data, set defaults

	if ($scope.action === ACTION_ADD)
	{
		$scope.formItem.country = $scope.countries[0];
		$scope.formItem.businessUnit = $scope.businessUnits[0];
		$scope.formItem.unverCustPrcMthd = $scope.unverCustPrcMthds[0];
		
	}
	else if ($scope.action === ACTION_UPDATE)
	{
		var idx = null;
		//set popup values to the ones from object 'selectedOptThreshold'
		idx = AdminService.getIndexOf(selectedOptThreshold.cntryCd, $scope.countries, 'cd');
		$scope.formItem.country = $scope.countries[idx];

		idx = AdminService.getIndexOf(selectedOptThreshold.busUnit, $scope.businessUnits, 'cd');
		$scope.formItem.businessUnit = $scope.businessUnits[idx];

		idx = AdminService.getIndexOf(selectedOptThreshold.unverCustPrcMthd, $scope.unverCustPrcMthds, 'cd');
		$scope.formItem.unverCustPrcMthd = $scope.unverCustPrcMthds[idx];

		
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
	// validation - T1 ($)
	_wag['OptThresholdEdit_T1 ($)'] = 'T1 ($)_focus;;T1 ($)_blur';
	$scope.elT1Focus = function(){
		_waq.push(['T1 ($)_focus', (new Date()).valueOf(), {group:'OptThresholdEdit_T1 ($)'}]);
	};
	$scope.elT1Check = function(type){
		var result = check.exec($scope.item.t1, ["notNull", "curr", "max18"]);
		if(!result[0]){
			sharedService.errorOcurs(AdminService.getErrMsg('ErrMsg_OptThreshold', 'elT1', result[1]));
		}else{
			sharedService.noError();
		}
		if(type === 'blur'){
			_waq.push(['T1 ($)_blur', (new Date()).valueOf(), {group:'OptThresholdEdit_T1 ($)'}]);
		}
		return result;
	};
	// validation - T2 ($)
	_wag['OptThresholdEdit_T2 ($)'] = 'T2 ($)_focus;;T2 ($)_blur';
	$scope.elT2Focus = function(){
		_waq.push(['T2 ($)_focus', (new Date()).valueOf(), {group:'OptThresholdEdit_T2 ($)'}]);
	};
	$scope.elT2Check = function(type){
		var result = check.exec($scope.item.t2, ["notNull", "curr", "max18"]);
		if(!result[0]){
			sharedService.errorOcurs(AdminService.getErrMsg('ErrMsg_OptThreshold', 'elT2', result[1]));
		}else{
			sharedService.noError();
		}
		if(type === 'blur'){
			_waq.push(['T2 ($)_blur', (new Date()).valueOf(), {group:'OptThresholdEdit_T2 ($)'}]);
		}
		return result;
	};
	// validation - AMID2 *
	_wag['OptThresholdEdit_AMID2'] = 'AMID2_focus;;AMID2_blur';
	$scope.elAmid2Focus = function(){
		_waq.push(['AMID2_focus', (new Date()).valueOf(), {group:'OptThresholdEdit_AMID2'}]);
	};
	$scope.elAmid2Check = function(type){
		var result = check.exec($scope.item.amid2, ["notNull", "max15"]);
		if(!result[0]){
			sharedService.errorOcurs(AdminService.getErrMsg('ErrMsg_OptThreshold', 'elAmid2', result[1]));
		}else{
			sharedService.noError();
		}
		if(type === 'blur'){
			_waq.push(['AMID2_blur', (new Date()).valueOf(), {group:'OptThresholdEdit_AMID2'}]);
		}
		return result;
	};
	// validation - T3 ($)
	_wag['OptThresholdEdit_T3 ($)'] = 'T3 ($)_focus;;T3 ($)_blur';
	$scope.elT3Focus = function(){
		_waq.push(['T3 ($)_focus', (new Date()).valueOf(), {group:'OptThresholdEdit_T3 ($)'}]);
	};
	$scope.elT3Check = function(type){
		var result = check.exec($scope.item.t3, ["notNull", "curr", "max18"]);
		if(!result[0]){
			sharedService.errorOcurs(AdminService.getErrMsg('ErrMsg_OptThreshold', 'elT3', result[1]));
		}else{
			sharedService.noError();
		}
		if(type === 'blur'){
			_waq.push(['T3 ($)_blur', (new Date()).valueOf(), {group:'OptThresholdEdit_T3 ($)'}]);
		}
		return result;
	};
	// validation - Hold Initial Price ($)
	_wag['OptThresholdEdit_Hold Initial Price ($)'] = 'Hold Initial Price ($)_focus;;Hold Initial Price ($)_blur';
	$scope.elHoldIntlPrcFocus = function(){
		_waq.push(['Hold Initial Price ($)_focus', (new Date()).valueOf(), {group:'OptThresholdEdit_Hold Initial Price ($)'}]);
	};
	$scope.elHoldIntlPrcCheck = function(type){
		var result = check.exec($scope.item.holdIntlPrc, ["nullOrMax18_2Curr"]);
		if(!result[0]){
			sharedService.errorOcurs(AdminService.getErrMsg('ErrMsg_OptThreshold', 'elHoldIntlPrc', result[1]));
		}else{
			sharedService.noError();
		}
		if(type === 'blur'){
			_waq.push(['Hold Initial Price ($)_blur', (new Date()).valueOf(), {group:'OptThresholdEdit_Hold Initial Price ($)'}]);
		}
		return result;
	};
	// validation - PPS Hold Initial Price ($)
	_wag['OptThresholdEdit_PPS Hold Initial Price ($)'] = 'PPS Hold Initial Price ($)_focus;;PPS Hold Initial Price ($)_blur';
	$scope.elPpsHoldIntlPrcFocus = function(){
		_waq.push(['PPS Hold Initial Price ($)_focus', (new Date()).valueOf(), {group:'OptThresholdEdit_PPS Hold Initial Price ($)'}]);
	};
	$scope.elPpsHoldIntlPrcCheck = function(type){
		var result = check.exec($scope.item.ppsHoldIntlPrc, ["nullOrMax18_2Curr"]);
		if(!result[0]){
			sharedService.errorOcurs(AdminService.getErrMsg('ErrMsg_OptThreshold', 'elPpsHoldIntlPrc', result[1]));
		}else{
			sharedService.noError();
		}
		if(type === 'blur'){
			_waq.push(['PPS Hold Initial Price ($)_blur', (new Date()).valueOf(), {group:'OptThresholdEdit_PPS Hold Initial Price ($)'}]);
		}
		return result;
	};
	// validation - Note
	_wag['OptThresholdEdit_Note'] = 'Note_focus;;Note_blur';
	$scope.elNoteFocus = function(){
		_waq.push(['Note_focus', (new Date()).valueOf(), {group:'OptThresholdEdit_Note'}]);
	};
	$scope.elNoteCheck = function(type){
		var result = check.exec($scope.item.note, ["max256orNull"]);
		if(!result[0]){
			sharedService.errorOcurs(AdminService.getErrMsg('ErrMsg_OptThreshold', 'elNote', result[1]));
		}else{
			sharedService.noError();
		}
		if(type === 'blur'){
			_waq.push(['Note_blur', (new Date()).valueOf(), {group:'OptThresholdEdit_Note'}]);
		}
		return result;
	};

	//----validation for text box---------end--------------------
	$scope.save = function()
	{
		// Track user action
		_waq.push(['Click', 'OptThresholdEditSave']);
		if ($scope.item === null)
		{
			//throw alert ?
			logger.warn("$scope.item is null, addOptThreshold service not called.");
			return;
		}
		var action = $scope.action.replace(/^./g, function(s){return s.toUpperCase();});
		if(!$scope.elT1Check()[0]){
			_waq.push(['inputError', 'T1 ($) '+$scope.elT1Check()[1]+' OptThresholdManagement'+action]);
			return;
		}
		if(!$scope.elT2Check()[0]){
			_waq.push(['inputError', 'T2 ($) '+$scope.elT2Check()[1]+' OptThresholdManagement'+action]);
			return;
		}
		if(!$scope.elAmid2Check()[0]){
			_waq.push(['inputError', 'AMID2 '+$scope.elAmid2Check()[1]+' OptThresholdManagement'+action]);
			return;
		}
		if(!$scope.elT3Check()[0]){
			_waq.push(['inputError', 'T3 ($) '+$scope.elT3Check()[1]+' OptThresholdManagement'+action]);
			return;
		}
		if(!$scope.elHoldIntlPrcCheck()[0]){
			_waq.push(['inputError', 'Hold Initial Price ($) '+$scope.elHoldIntlPrcCheck()[1]+' OptThresholdManagement'+action]);
			return;
		}
		if(!$scope.elPpsHoldIntlPrcCheck()[0]){
			_waq.push(['inputError', 'PPS Hold Initial Price ($) '+$scope.elPpsHoldIntlPrcCheck()[1]+' OptThresholdManagement'+action]);
			return;
		}
		if(!$scope.elNoteCheck()[0]){
			_waq.push(['inputError', 'Note '+$scope.elNoteCheck()[1]+' OptThresholdManagement'+action]);
			return;
		}


		$scope.item.cntryCd = $scope.formItem.country.cd;
		$scope.item.busUnit = $scope.formItem.businessUnit.cd;
		$scope.item.unverCustPrcMthd = $scope.formItem.unverCustPrcMthd.cd;
		
		//validate data
		var para = {
			item:$scope.item,
			dollerFields:dollerFields,
			percentFields:percentFields
		};
		if ($scope.action === ACTION_ADD)
		{
			loading.open();
			AdminService.saveOptThreshold(para, function(optThresholdList){
				optThresholdList.totalRecordAmount = 1 + optThresholdList.totalRecordAmount; 
				sharedService.shareGridData(optThresholdList,'optThreshold');
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
			AdminService.updateOptThreshold(para, function(optThresholdList){
				sharedService.shareGridData(optThresholdList,'optThreshold');
				loading.close();
				//close on success, not failure.
				$modalInstance.close();
			});
		}
	};

	$scope.cancel = function()
	{
		// Track user action
		_waq.push(['Click', 'OptThresholdEditCancel']);

		//$modalInstance.close();
		$modalInstance.dismiss();
	};
}
