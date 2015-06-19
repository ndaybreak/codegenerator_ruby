function OptBuCustExcpEditDataGridCtrlPg($scope, $filter, $modal, $document, $window, AdminService, loading, confirm, logger, formatData)
{
	var pgOptions = {moduleName : 'optBuCustExcp'};
   	//save filter value after click OK button
	var oldFilterObj = {};
	//will update select options based on attrList(keys of $scope.select)
	var attrList = ["rgnCd", "subregn1Cd", "subregn2Cd", "subregn3Cd", "cntryCd", "busUnit", "mdcpOrgId", "amid2", "note", "lastModById", "lastModTs"];
	var forDisplayList = ["rgnCdForDisplay", "subregn1CdForDisplay", "subregn2CdForDisplay", "subregn3CdForDisplay", "cntryCdForDisplay", "busUnitForDisplay", "mdcpOrgId", "amid2", "note", "lastModByEmail", "lastModTs"];
	//finished ajax call
	var count = 0;
	//note: cd and value of dollerFields,percentFields must be same.
	$scope.dollerFields = [];
	$scope.percentFields = [];
	$scope.numStrCDFields = [];
	//the attribute list for input and date picker boxs.
	var inputAndDatePickerBoxs = ["mdcpOrgId", "amid2", "lastModTs"];
	// handle Broadcast from shareService when optBuCustExcpList is update in other controller
	$scope.$on('handleGridDataBroadcast', function(scope,action,result) {
		if(action == 'optBuCustExcp')
		{
			// reset guidanceList,and then directive will witch this value
            updateSelectOptions($scope,attrList,forDisplayList,result.lineData);
			//call paging component
			pgOptions.data = result.lineData;
			pgOptions.totalSize = result.totalRecordAmount;
            serverSidePaging(AdminService,loading,confirm,$scope,$filter,pgOptions);
			$scope.selection = [];
		}
    });
    $scope.$on('handleErrorOcurs', function(scope, msg, url) {
        if(!url){
    		return;
    	}
		if(url.indexOf('massDelete')>-1){
			//just handle delete operation error when user has not authority
			loading.close();
			confirm.tip(msg);
		}
	});
	$scope.add = function () {
        if($scope.btn){
          return;
        }
		// Track user action
		_waq.push(['Click', 'OptBuCustExcpManagementAdd']);
		logger.info("Executing add()");
		$modal
		.open({templateUrl: "html/OptBuCustExcpEdit.html", controller: OptBuCustExcpEditCtrl,
							windowClass : 'oneCol',							keyboard: false,
							resolve: {selectedOptBuCustExcp: null} });
	}
	$scope.update = function () {
        if($scope.btn){
          return;
        }
		// Track user action
		_waq.push(['Click', 'OptBuCustExcpManagementUpdate']);
		// get selected from scope
		var selectedItem = $scope.selection;
		if(selectedItem.length != 1)
		{
			confirm.tip(AdminService.getTipText('updateOnlyOne'));
			return ;
		}
		var guidCopy = angular.copy(selectedItem[0]);
		$modal.open({templateUrl: "html/OptBuCustExcpEdit.html", controller: OptBuCustExcpEditCtrl,
																keyboard: false,
								resolve: {selectedOptBuCustExcp: function() {return guidCopy;} } });
	};
	
	$scope.del = function(){
        if($scope.btn){
          return;
        }
		// Track user action
		_waq.push(['Click', 'OptBuCustExcpManagementDelete']);
		// get selected from scope
		var selectedItem = $scope.selection;
		if (selectedItem.length < 1) {
			confirm.tip(AdminService.getTipText('noItemToDelete'));
			return;
		}
		confirm.confirm(AdminService.getTipText('confirmDelete'),function(){
		    loading.open();
		    var options = {
				itemToDelete : selectedItem,
				dollerFields : $scope.dollerFields
			};
			AdminService.deleteOptBuCustExcp(options,function(result){
				// update optBuCustExcpList when delete completed
				result.totalRecordAmount = result.totalRecordAmount -selectedItem.length;
				//delete all data in current page, if true
				if(result.totalRecordAmount > 0 && result.lineData.length == 0){
					para = {
						pageSize : $scope.dataPageSize,
						pageIndex : 1,
						filterObj : $scope.getFilterObj(),
						dollerFields : $scope.dollerFields
					};
					AdminService.getOptBuCustExcpFilteredData(para,function(result) {
						$scope.currentPage = 1;
						pgOptions.data = result.lineData;
						pgOptions.totalSize = result.totalRecordAmount;
			            serverSidePaging(AdminService,loading,confirm,$scope,$filter,pgOptions);
						$scope.selection = [];
						loading.close();
					});
				}else{
					pgOptions.data = result.lineData;
					pgOptions.totalSize = result.totalRecordAmount;
		            serverSidePaging(AdminService,loading,confirm,$scope,$filter,pgOptions);
					//delete item which had been delete from selection
					$scope.selection = [];
					loading.close();
				}
				$document.find("input[id='item-all']").prop("checked",false);
			});
		});
	}; 

    //======set button state base on user authority======//
    $scope.btn= 'btn-Disabled';
    var userAccess = AdminService.getUserAccess();
    $scope.setAuth = function(){
        var authList = AdminService.getAuthList(); // Admin, Viewer, Super User, Sales Comp Admin
		if(authList.role === userAccess.superUser){
			$scope.btn= '';
		}else if(authList.role === userAccess.admin){
			$scope.btn= '';
		}else if(authList.role === userAccess.viewer){
			$scope.btn= 'btn-Disabled';
		};
    };
    //======end set button state base on user authority======//

	//exportExcel with filtered data
	$scope.exportAsExcel = function(partFlag) {
		//var setting = $scope.dataTable.fnSettings();
		//gridDataToJson(setting, 'BU-Customer Exception');
		//for OptBuCustExcp page only ["lastModById"] is bigint
		var limitNum = AdminService.getLimitNumForExport(); 
		//if data size is more than max number,will not export data.
		if($scope.size() >= parseInt(limitNum)){
			var obj = {limitNum:limitNum};
			formatData.toDollerData(obj,['limitNum']);
			confirm.tip('Cannot export the data more than '+ obj.limitNum.substring(0,obj.limitNum.length-3) +' items.');
			return;
		}
		loading.open();
		var columns = ["lastModById"];
		var entityName = 'OptBuCustExcp';
		result = formatObjForExport($scope.headers,$scope.obj,columns,entityName,partFlag);
        $.fileDownload(AdminService.getExportToExcelByFilterCriteriaUrl(), {
            httpMethod: "post",
            data: result,
            successCallback: function (url) {
            	loading.close();
            },
            failCallback: function (html, url) {
            	loading.close();
            }
        });
	};

	//disable click backspace button direct to before page.
	$window.setTimeout($document.bind("keydown keypress", function (event) {
        if (event.currentTarget.activeElement.tagName !="INPUT" && event.currentTarget.activeElement.tagName !="TEXTAREA" && event.which === 8) {
        	$scope.$apply(function () {
        		$scope.$eval();
            });
            event.preventDefault();
        }
    }), 0);

	$scope.status = {
		   icon: false
	};
	
	$scope.toggle = function toggle(){
		$scope.status.icon = !$scope.status.icon;
	};

	var sortOptions = {
			field:'valueForDisplay',
			numFields:$scope.percentFields,
			numStrFields:$scope.numStrCDFields
	};
	$scope.orderTableBy = function(header,cd){
		if('' == cd) 
            return; 
        sortOptions.colCd = cd;
	    if ( $scope.orderHeader == header && $scope.orderDirection == true){
	        $scope.orderHeader = null; // clear sort.
	        sortOptions.reverse = true;
	        $scope.select[cd].sort(sortDivF(sortOptions));
	    }
	    else if ( $scope.orderHeader == header ){
	        $scope.orderDirection = true;
	        sortOptions.reverse = false;
	        $scope.select[cd].sort(sortDivF(sortOptions));
	    }else{
	    	$scope.orderHeader = header;
	        $scope.orderDirection = false;
	        sortOptions.reverse = true;
	        $scope.select[cd].sort(sortDivF(sortOptions));
	    }
	    if($scope.orderHeader == null){
    		$scope.data = angular.copy($scope.originalFilteredData);
    	}else{
    		$scope.data = $filter('orderBy')($scope.originalFilteredData, $scope.orderHeaderFunc, $scope.orderDirection);
    	}
	};
	$scope.orderHeaderFunc = function(obj){
		if(inArray($scope.orderHeader, $scope.dollerFields) != -1){
			var newVal = formatData.removeComma(obj[$scope.orderHeader]);
			if(newVal){
				return parseFloat(newVal);
			}else{//newVal is null
				return newVal;
			}
		}else if("lastModTs" == $scope.orderHeader){
			var newVal = $.trim(obj[$scope.orderHeader]);
			var deDatea = $.trim(newVal).split(' ');
            var deTimea = deDatea[1].split(':');
            var deDatea2 = deDatea[0].split('/');
            return (deDatea2[2] + deDatea2[0] + deDatea2[1] + deTimea[0] + deTimea[1] + deTimea[2]) * 1;
		}else if(inArray($scope.orderHeader, $scope.percentFields) != -1){
			var newVal = $.trim(obj[$scope.orderHeader]);
			if(isNaN(newVal)){
				return newVal;
			}else{
				return parseFloat(newVal);
			}
		}else if("roleForDisplay" == $scope.orderHeader){//numStrValueFields need added by user
			var newVal = String(obj[$scope.orderHeader]);
			newVal = newVal.split("-")[0].trim();
			return parseFloat(newVal);
		}
		return obj[$scope.orderHeader];
	};
	//store check box items.
    $scope.selection = [];
	$scope.checkAllSelection = function(item) {
		$document.find(".dataTable").trigger('click');
		if($scope.data && $scope.selection.length < $scope.data.length){
    		$scope.selection = angular.copy(item);
    		$document.find("input[id*='item']").prop("checked",true);
    	}else{
    		$scope.selection = [];
    		$document.find("input[id*='item']").prop("checked",false);
    	}
    };
	
    $scope.toggleSelection = function(index,item) {	
    	  var idx = -1;
    	  angular.forEach($scope.selection,function(value,key){
    		  if(value.id == item.id){
    			  idx = key;
    		  };
    	  });
    	  // is currently selected
    	  if (idx > -1) {
    		  $scope.selection.splice(idx, 1);
    		  $document.find("input[id='item-all']").prop("checked",false);
    	  }
    	  // is newly selected
    	  else {
    		  $scope.selection.push(item);
    		  if($scope.selection.length == $scope.data.length){
    			  $document.find("input[id='item-all']").prop("checked",true);
    		  }
    	  }
    };
    $scope.isInputOrDatePickerBox = function(headerVal,isContainDatePicker){
    	return isInputOrDatePickerBox(headerVal,isContainDatePicker);
    };

	// init table data
    $scope.tdShow = false;
    loading.open();
    
    //clear datepicker value
    $scope.clearDate = function (){
    	$scope.selected.lastModTs= []; 
    	$document.find('div.datapicker .btn-primary').removeClass('btn-primary');
    };
	//======paging inital  code ==========//
	$scope.dataPageSize = 50;
	$scope.currentPage = 1;
	$scope.pageSizeArray = [10,25,50,100];
	var para = {
		pageSize : $scope.dataPageSize,
		pageIndex : $scope.currentPage,
		dollerFields : $scope.dollerFields,
		percentFields : $scope.percentFields
	};
	//when set page size get data from server
	$scope.setPageSize = function(pageSize){
		loading.open();
		$scope.dataPageSize = pageSize;
		para = {
			pageSize : $scope.dataPageSize,
			pageIndex : 1,
			filterObj : $scope.getFilterObj(),
			dollerFields : $scope.dollerFields,
			percentFields : $scope.percentFields
		};
		AdminService.getOptBuCustExcpFilteredData(para,function(result) {
			$scope.currentPage = 1;
			pgOptions.data = result.lineData;
			pgOptions.totalSize = result.totalRecordAmount;
            serverSidePaging(AdminService,loading,confirm,$scope,$filter,pgOptions);
			loading.close();
			$scope.selection = [];
		});
	};
	
	//get table data list from server  with paging
	AdminService.getOptBuCustExcpData(para,function(result) {
		AdminService.getStaticData($scope.setAuth,plusOne);
		$scope.headers = [
					{title: '',value: '',cd: '',visible: true,className: ''},
					{title: 'Region',value: 'rgnCdForDisplay',cd: 'rgnCd',visible: true,className: 'pg-col-min-width'},
					{title: 'Sub Region 1',value: 'subregn1CdForDisplay',cd: 'subregn1Cd',visible: true,className: 'pg-col-width'},
					{title: 'Sub Region 2',value: 'subregn2CdForDisplay',cd: 'subregn2Cd',visible: true,className: 'pg-col-width'},
					{title: 'Sub Region 3',value: 'subregn3CdForDisplay',cd: 'subregn3Cd',visible: true,className: 'pg-col-width'},
					{title: 'Country',value: 'cntryCdForDisplay',cd: 'cntryCd',visible: true,className: 'pg-col-width'},
					{title: 'Business Unit',value: 'busUnitForDisplay',cd: 'busUnit',visible: true,className: 'pg-col-width'},
					{title: 'MDCP Org ID',value: 'mdcpOrgId',cd: 'mdcpOrgId',visible: true,className: 'pg-col-width'},
					{title: 'AMID2',value: 'amid2',cd: 'amid2',visible: true,className: 'pg-col-width'},
					{title: 'Note',value: 'note',cd: 'note',visible: true,className: 'pg-col-width'},
					{title: 'Updated By',value: 'lastModByEmail',cd: 'lastModById',visible: true,className: 'pg-col-min-width'},
					{title: 'Updated On',value: 'lastModTs',cd: 'lastModTs',visible: true,className: 'pg-col-min-width'},
		    	];
		$scope.currentPage = 1;
		pgOptions.data = result.lineData;
		pgOptions.totalSize = result.totalRecordAmount;
        serverSidePaging(AdminService,loading,confirm,$scope,$filter,pgOptions);
		$scope.tdShow = true;
		count++;
		if(count == 3){
			loading.close();
		}
	});
	//if value in array function
    var inArray = Array.prototype.indexOf ?
            function (val, arr) {
                return arr.indexOf(val);
            } :
            function (val, arr) {
                var i = arr.length;
                while (i--) {
                    if (arr[i] === val) return i;
                }
                return -1;
            };
	//select:filter list item ,selected filter list  item chosen
	$scope.getFilterData = function(){
		$scope.select = {};
		$scope.selected = {};
		$scope.originalSelected = {};
		AdminService.getOptBuCustExcpSelectData(function(result) {
			angular.forEach($scope.dollerFields,function(key){
				result[key] = formatData.toDollerData(result[key],['cd','valueForDisplay']);
			});
	        angular.forEach(inputAndDatePickerBoxs,function(key){
				$scope.select[key] = [];
				$scope.selected[key] = [];
			});
			
		    angular.forEach(result, function(val,key){
	            $scope.select[key]= val; 
			});
			angular.forEach(result, function(val,key){
				var arr = [],
		        select = [];
		        angular.forEach(val, function(item,i){
		    		if (inArray(item.cd, arr) === -1) {
		                arr.push(val.cd);
		                select.push(item.cd);
		            }
		        });
				$scope.selected[key]= select;
		    });
			$scope.originalSelected = angular.copy($scope.selected);
			count++;
			if(count == 3){
				loading.close();
			}
	    });
	};
	$scope.getFilterData();
    //========listen selected changing code ============//
	$scope.$watch('selected',function(newObj,oldObj){
		var objWatch = {};
		if(newObj == oldObj){
			return;
		}else if(typeof oldObj != "undefined"){
			angular.forEach(newObj, function(item,key){
	    		if( typeof oldObj[key]!= "undefined" &&typeof newObj[key]!= "undefined"&& newObj[key].length != $scope.originalSelected[key].length){
	    			var dispaly = [];
	    			angular.forEach(newObj[key], function(val){
	    				if('note' == key){
	    					dispaly.push(val.trim());
	    				}else{
	    					dispaly.push(val.split("-")[0].trim());
	    				}
	    			});
	    			objWatch[key]=dispaly;
	    		}else if(typeof oldObj[key]!= "undefined" &&typeof newObj[key]!= "undefined"&& newObj[key].length != $scope.originalSelected[key].length && newObj[key].length != oldObj[key].length){
	    			var dispaly = [];
	    			angular.forEach(newObj[key], function(val){
	    				if('note' == key){
	    					dispaly.push(val.trim());
	    				}else{
	    					dispaly.push(val.split("-")[0].trim());
	    				}
	    			});
	    			objWatch[key]=dispaly;
	    		}
	    	});
			angular.forEach(inputAndDatePickerBoxs,function(key){
				if('lastModTs' == key){
					if(typeof $scope.selected[key] != "undefined" && $scope.selected[key].length !=0){
						objWatch[key]=[];
						objWatch[key].push(printDate($scope.selected[key]));
					}
				}else{
					if(typeof newObj[key] != "undefined" && newObj[key].length != 0){
						objWatch[key]=[];
						angular.forEach(newObj[key].split(","),function(value){
							objWatch[key].push(value);
						});
				    	//check if the input length more than 1000 char 
				    	if(!checkLength(newObj[key])){
				    		confirm.tip(AdminService.getTipText('limitChar1000'));
				    	}
					}
				}
			});
			$scope.obj = objWatch;
		}
	},true);
	
	//========get filterObj code ========//
	$scope.getFilterObj = function(){
		var returnObj = {};
		angular.forEach($scope.obj,function(value,key){
			if(value.length > 0){
				if(inArray(key, $scope.dollerFields) != -1){
					var tempVal = [];
					angular.forEach(value,function(a){
						tempVal.push(formatData.removeComma(a));
					});
					returnObj[key] = tempVal;
				}else{
					returnObj[key] = value;
				}
			}
		});
		return returnObj;
	};
	//========columFilter code ==========//
	$scope.columnFilter = function(){
		if(JSON.stringify($scope.getFilterObj()) != "{}"){
			loading.open();
			para = {
				pageSize : $scope.dataPageSize,
				pageIndex : 1,
				filterObj : $scope.getFilterObj(),
				dollerFields : $scope.dollerFields,
				percentFields : $scope.percentFields
			};
			AdminService.getOptBuCustExcpFilteredData(para, function(result) {
				$scope.currentPage = 1;
				pgOptions.data = result.lineData;
				pgOptions.totalSize = result.totalRecordAmount;
		        serverSidePaging(AdminService,loading,confirm,$scope,$filter,pgOptions);
				loading.close();
				$scope.selection = [];
				oldFilterObj = angular.copy($scope.obj);
				$document.find("input[id='item-all']").prop("checked",false);
			});
		}else if(JSON.stringify(oldFilterObj) != "{}"){
			loading.open();
			para = {
				pageSize : $scope.dataPageSize,
				pageIndex : 1,
				dollerFields : $scope.dollerFields,
				percentFields : $scope.percentFields
			};
			AdminService.getOptBuCustExcpData(para,function(result) {
				$scope.currentPage = 1;
				pgOptions.data = result.lineData;
				pgOptions.totalSize = result.totalRecordAmount;
		        serverSidePaging(AdminService,loading,confirm,$scope,$filter,pgOptions);
				loading.close();
				$scope.selection = [];
				oldFilterObj = angular.copy($scope.obj);
				$document.find("input[id='item-all']").prop("checked",false);
			});
		}else{
			confirm.tip(AdminService.getTipText('noFilterCriteria'));
		}
	};	
	function plusOne(){
		count++;
		if(count == 3){
			loading.close();
		}
	}
	$scope.$watch('selection',function(newObj,oldObj){
		if(newObj.length == 0){
			$document.find("input[id='item-all']").prop("checked",false);
		}
	});
}