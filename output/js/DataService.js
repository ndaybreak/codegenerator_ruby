/**
 * Services live in this file.
 */
angular.module("DataServiceModule", ["UtilityModule"]).factory("AdminService", function($http, logger, sharedService, loading)
{
	// First Part:
	var URL_SAVE_OPTSQCUSTEXCP = REST_BASE_URL + "saveOptSqCustExcp";
	var URL_UPDATE_OPTSQCUSTEXCP = REST_BASE_URL + "updateOptSqCustExcp";
	var URL_DELETE_OPTSQCUSTEXCP = REST_BASE_URL + "massDeleteOptSqCustExcp";
	var URL_SAVE_OPTSQCTRYBGEXCP = REST_BASE_URL + "saveOptSqCtryBgExcp";
	var URL_UPDATE_OPTSQCTRYBGEXCP = REST_BASE_URL + "updateOptSqCtryBgExcp";
	var URL_DELETE_OPTSQCTRYBGEXCP = REST_BASE_URL + "massDeleteOptSqCtryBgExcp";


	// Second Part:
	//------------------URL paging---------START-------
	/*optSqCustExcp*/
	var URL_OPTSQCUSTEXCP_DATA = REST_BASE_URL + "OptSqCustExcp";//all data
	var URL_OPTSQCUSTEXCP_FILTERED_DATA = URL_OPTSQCUSTEXCP_DATA + "/Filtered";//filtered data
	var URL_OPTSQCUSTEXCP_SELECT_DATA = URL_OPTSQCUSTEXCP_DATA + "/FilterData";//data for select dropdown
	/*optSqCtryBgExcp*/
	var URL_OPTSQCTRYBGEXCP_DATA = REST_BASE_URL + "OptSqCtryBgExcp";//all data
	var URL_OPTSQCTRYBGEXCP_FILTERED_DATA = URL_OPTSQCTRYBGEXCP_DATA + "/Filtered";//filtered data
	var URL_OPTSQCTRYBGEXCP_SELECT_DATA = URL_OPTSQCTRYBGEXCP_DATA + "/FilterData";//data for select dropdown
	//------------------URL paging---------END-------


	//Third Part:
	//variables for server side paging : returned selecte data and page data ---------------START--------------
	//optSqCustExcp
	var optSqCustExcpFilteredData,
	    optSqCustExcpSelectData;
	//optSqCtryBgExcp
	var optSqCtryBgExcpFilteredData,
	    optSqCtryBgExcpSelectData;
	//variables for server side paging : returned selecte data and page data ---------------END--------------


	
	var service =  
	{
		// Forth Part:
//-------------------get filter and paging data-------------START-------------------
	   //---OptSqCustExcp
		getOptSqCustExcpSelectData: function(callback)
		{
			logger.info("Executing getOptSqCustExcpSelectData() from 'AdminService'.");
			_waq.push([
				'gridDataRequested',
				(new Date()).valueOf(),
				{group:'gridLoadGroup'}
			]);
			this.httpGet(URL_OPTSQCUSTEXCP_SELECT_DATA,
									function(result)
								   {
								        logger.info("getOptSqCustExcpSelectData() call successful.");
								        logger.debug(JSON.stringify(result.data));
								        optSqCustExcpSelectData = result.data;
								        callback && callback(optSqCustExcpSelectData);
								   }, 
								   "Get getOptSqCustExcpSelectData"
								   );
		},
		getOptSqCustExcpData: function(para,callback)
		{
			logger.info("Executing getOptSqCustExcpData() from 'AdminService'.");
			_waq.push([
				'gridDataRequested',
				(new Date()).valueOf(),
				{group:'gridLoadGroup'}
			]);
			this.httpGet(URL_OPTSQCUSTEXCP_DATA +'/'+para.pageSize+'/'+para.pageIndex,function(result){
								        logger.info("getOptSqCustExcpData() call successful.");
								        logger.debug(JSON.stringify(result.data));
								        optSqCustExcpFilteredData = result.data;
								        formatData.toDollerData(optSqCustExcpFilteredData.lineData,para.dollerFields);
								        formatData.toPercentData(optSqCustExcpFilteredData.lineData,para.percentFields);
								        callback && callback(optSqCustExcpFilteredData);
								   }, 
								   "Get getOptSqCustExcpData"
								   );
		},
		getOptSqCustExcpFilteredData: function(para, callback)
		{
			logger.info("Executing getOptSqCustExcpFilteredData()");
			logger.debug(JSON.stringify(para.filterObj));
			this.httpPost(URL_OPTSQCUSTEXCP_FILTERED_DATA+'/'+para.pageSize+'/'+para.pageIndex, para.filterObj, function(result){
				logger.info("Get getOptSqCustExcpFilteredData operation successful.");
				optSqCustExcpFilteredData = result.data;
				formatData.toDollerData(optSqCustExcpFilteredData.lineData,para.dollerFields);
				formatData.toPercentData(optSqCustExcpFilteredData.lineData,para.percentFields);
				callback && callback(optSqCustExcpFilteredData);
			});
		}, 
	   //---OptSqCtryBgExcp
		getOptSqCtryBgExcpSelectData: function(callback)
		{
			logger.info("Executing getOptSqCtryBgExcpSelectData() from 'AdminService'.");
			_waq.push([
				'gridDataRequested',
				(new Date()).valueOf(),
				{group:'gridLoadGroup'}
			]);
			this.httpGet(URL_OPTSQCTRYBGEXCP_SELECT_DATA,
									function(result)
								   {
								        logger.info("getOptSqCtryBgExcpSelectData() call successful.");
								        logger.debug(JSON.stringify(result.data));
								        optSqCtryBgExcpSelectData = result.data;
								        callback && callback(optSqCtryBgExcpSelectData);
								   }, 
								   "Get getOptSqCtryBgExcpSelectData"
								   );
		},
		getOptSqCtryBgExcpData: function(para,callback)
		{
			logger.info("Executing getOptSqCtryBgExcpData() from 'AdminService'.");
			_waq.push([
				'gridDataRequested',
				(new Date()).valueOf(),
				{group:'gridLoadGroup'}
			]);
			this.httpGet(URL_OPTSQCTRYBGEXCP_DATA +'/'+para.pageSize+'/'+para.pageIndex,function(result){
								        logger.info("getOptSqCtryBgExcpData() call successful.");
								        logger.debug(JSON.stringify(result.data));
								        optSqCtryBgExcpFilteredData = result.data;
								        formatData.toDollerData(optSqCtryBgExcpFilteredData.lineData,para.dollerFields);
								        formatData.toPercentData(optSqCtryBgExcpFilteredData.lineData,para.percentFields);
								        callback && callback(optSqCtryBgExcpFilteredData);
								   }, 
								   "Get getOptSqCtryBgExcpData"
								   );
		},
		getOptSqCtryBgExcpFilteredData: function(para, callback)
		{
			logger.info("Executing getOptSqCtryBgExcpFilteredData()");
			logger.debug(JSON.stringify(para.filterObj));
			this.httpPost(URL_OPTSQCTRYBGEXCP_FILTERED_DATA+'/'+para.pageSize+'/'+para.pageIndex, para.filterObj, function(result){
				logger.info("Get getOptSqCtryBgExcpFilteredData operation successful.");
				optSqCtryBgExcpFilteredData = result.data;
				formatData.toDollerData(optSqCtryBgExcpFilteredData.lineData,para.dollerFields);
				formatData.toPercentData(optSqCtryBgExcpFilteredData.lineData,para.percentFields);
				callback && callback(optSqCtryBgExcpFilteredData);
			});
		}, 
		//-------------------get filter and paging data---------END-------------------
		
		// Fifth Part:
//-------popup -------save--------START------
		saveOptSqCustExcp: function(options, callback)
		{
			logger.info("Executing saveOptSqCustExcp()");
			logger.debug(JSON.stringify(options.item));
			this.httpPost(URL_SAVE_OPTSQCUSTEXCP, options.item, function(result){
				logger.info("Save OptSqCustExcp operation successful.");
				result.data.addFlag = true;
				formatData.toDollerData(result.data,options.dollerFields);
				formatData.toPercentData(result.data,options.percentFields);
				optSqCustExcpFilteredData.lineData.push(result.data);
				if(callback)callback(optSqCustExcpFilteredData);
			});
		},
		saveOptSqCtryBgExcp: function(options, callback)
		{
			logger.info("Executing saveOptSqCtryBgExcp()");
			logger.debug(JSON.stringify(options.item));
			this.httpPost(URL_SAVE_OPTSQCTRYBGEXCP, options.item, function(result){
				logger.info("Save OptSqCtryBgExcp operation successful.");
				result.data.addFlag = true;
				formatData.toDollerData(result.data,options.dollerFields);
				formatData.toPercentData(result.data,options.percentFields);
				optSqCtryBgExcpFilteredData.lineData.push(result.data);
				if(callback)callback(optSqCtryBgExcpFilteredData);
			});
		},
//-------popup -------save--------END------
		
		// Six Part:
//-------popup -------delete--------START------
		deleteOptSqCustExcp: function(options,callback)
		{
			logger.info("Executing deleteOptSqCustExcp()");
			removeAttrAddFlag(options.itemToDelete);
			formatData.removeCommaForList(options.itemToDelete,options.dollerFields);
			logger.debug(JSON.stringify(options.itemToDelete));
			this.httpPost(URL_DELETE_OPTSQCUSTEXCP, options.itemToDelete, function(result){
				logger.info("Delete OptSqCustExcp service call successful.");
				optSqCustExcpFilteredData = removeItemFromList(optSqCustExcpFilteredData, result.data, "id");
				if(callback)callback(optSqCustExcpFilteredData);
			});
		},
		deleteOptSqCtryBgExcp: function(options,callback)
		{
			logger.info("Executing deleteOptSqCtryBgExcp()");
			removeAttrAddFlag(options.itemToDelete);
			formatData.removeCommaForList(options.itemToDelete,options.dollerFields);
			logger.debug(JSON.stringify(options.itemToDelete));
			this.httpPost(URL_DELETE_OPTSQCTRYBGEXCP, options.itemToDelete, function(result){
				logger.info("Delete OptSqCtryBgExcp service call successful.");
				optSqCtryBgExcpFilteredData = removeItemFromList(optSqCtryBgExcpFilteredData, result.data, "id");
				if(callback)callback(optSqCtryBgExcpFilteredData);
			});
		},
//-------popup -------delete--------END------

		// Seventh Part:
//-------popup -------update--------START------
		updateOptSqCustExcp: function(options,callback)
		{
		    logger.info("Executing updateOptSqCustExcp()");
			logger.debug(JSON.stringify(options.item));
			this.httpPost(URL_UPDATE_OPTSQCUSTEXCP, options.item, function(result){
				formatData.toDollerData(result.data,options.dollerFields);
				formatData.toPercentData(result.data,options.percentFields);
				sync(result.data, optSqCustExcpFilteredData, "id");
				logger.info("Update OptSqCustExcp operation successful.");
				if(callback)callback(optSqCustExcpFilteredData);
			});
		},
		updateOptSqCtryBgExcp: function(options,callback)
		{
		    logger.info("Executing updateOptSqCtryBgExcp()");
			logger.debug(JSON.stringify(options.item));
			this.httpPost(URL_UPDATE_OPTSQCTRYBGEXCP, options.item, function(result){
				formatData.toDollerData(result.data,options.dollerFields);
				formatData.toPercentData(result.data,options.percentFields);
				sync(result.data, optSqCtryBgExcpFilteredData, "id");
				logger.info("Update OptSqCtryBgExcp operation successful.");
				if(callback)callback(optSqCtryBgExcpFilteredData);
			});
		},
//-------popup -------update--------END------
		
	};
	return service;
});