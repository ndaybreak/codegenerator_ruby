function <%= $xc.entity_name %>EditCtrl($scope, $modalInstance, $http, $timeout, $document, $window, AdminService, sharedService, loading, check, selected<%= $xc.entity_name %>)
{
	$scope.action = (!selected<%= $xc.entity_name %>)? ACTION_ADD : ACTION_UPDATE ;
	$scope.item = ($scope.action === ACTION_ADD)? {} : selected<%= $xc.entity_name %>;
	
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
	<%= $xc.getDropdownSourceData %>
	//Set form defaults here
	$scope.formItem = {};//this is the object we used to capture form data, set defaults

	if ($scope.action === ACTION_ADD)
	{
		<%= $xc.initFormItemAdd %>
	}
	else if ($scope.action === ACTION_UPDATE)
	{
		var idx = null;
		//set popup values to the ones from object 'selected<%= $xc.entity_name %>'
		<%= $xc.initFormItemUpdate %>
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
<% $xc.items.each do |item| -%>
	<%- if item.checks && item.checks.size > 0 -%>
	// validation - <%= item.item_desc %>
	_wag['<%= $xc.entity_name %>Edit_<%= item.desc_for_message %>'] = '<%= item.desc_for_message %>_focus;;<%= item.desc_for_message %>_blur';
	$scope.<%= item.html_element_id %>Focus = function(){
		_waq.push(['<%= item.desc_for_message %>_focus', (new Date()).valueOf(), {group:'<%= $xc.entity_name %>Edit_<%= item.desc_for_message %>'}]);
	};
	$scope.<%= item.html_element_id %>Check = function(type){
		var result = check.exec($scope.item.<%= item.item_name %>, <%= item.checks %>);
		if(!result[0]){
			sharedService.errorOcurs(AdminService.getErrMsg('ErrMsg_<%= $xc.entity_name %>', '<%= item.html_element_id %>', result[1]));
		}else{
			sharedService.noError();
		}
		if(type === 'blur'){
			_waq.push(['<%= item.desc_for_message %>_blur', (new Date()).valueOf(), {group:'<%= $xc.entity_name %>Edit_<%= item.desc_for_message %>'}]);
		}
		return result;
	};
	<%- end -%>
<% end %>
	//----validation for text box---------end--------------------
	$scope.save = function()
	{
		// Track user action
		_waq.push(['Click', '<%= $xc.entity_name %>EditSave']);
		if ($scope.item === null)
		{
			//throw alert ?
			logger.warn("$scope.item is null, add<%= $xc.entity_name %> service not called.");
			return;
		}
		var action = $scope.action.replace(/^./g, function(s){return s.toUpperCase();});
<% $xc.items.each do |item| -%>
	<%- if item.checks && item.checks.size > 0 -%>
		if(!$scope.<%= item.html_element_id %>Check()[0]){
			_waq.push(['inputError', '<%= item.desc_for_message %> '+$scope.<%= item.html_element_id %>Check()[1]+' <%= $xc.entity_name %>Management'+action]);
			return;
		}
	<%- end -%>
<% end %>

		<%= $xc.getSaveItem %>
		//validate data
		var para = {
			item:$scope.item,
			dollerFields:dollerFields,
			percentFields:percentFields
		};
		if ($scope.action === ACTION_ADD)
		{
			loading.open();
			AdminService.save<%= $xc.entity_name %>(para, function(<%= $xc.entity_name_lower %>List){
				<%= $xc.entity_name_lower %>List.totalRecordAmount = 1 + <%= $xc.entity_name_lower %>List.totalRecordAmount; 
				sharedService.shareGridData(<%= $xc.entity_name_lower %>List,'<%= $xc.entity_name_lower %>');
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
			AdminService.update<%= $xc.entity_name %>(para, function(<%= $xc.entity_name_lower %>List){
				sharedService.shareGridData(<%= $xc.entity_name_lower %>List,'<%= $xc.entity_name_lower %>');
				loading.close();
				//close on success, not failure.
				$modalInstance.close();
			});
		}
	};

	$scope.cancel = function()
	{
		// Track user action
		_waq.push(['Click', '<%= $xc.entity_name %>EditCancel']);

		//$modalInstance.close();
		$modalInstance.dismiss();
	};
}
