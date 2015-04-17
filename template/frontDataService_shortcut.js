/**
 * Services live in this file.
 */
angular.module("DataServiceModule", ["UtilityModule"]).factory("AdminService", function($http, logger, sharedService, loading)
{
	// First Part:
<%- $xc.entity_list.each do |entity| -%>
	var <%= entity.save_url %> = REST_BASE_URL + "<%= entity.save_service %>";
	var <%= entity.update_url %> = REST_BASE_URL + "<%= entity.update_service %>";
	var <%= entity.delete_url %> = REST_BASE_URL + "<%= entity.mass_delete_service %>";
<%- end -%>


	// Second Part:
	//------------------URL paging---------START-------
<%- $xc.entity_list.each do |entity| -%>
	/*<%= entity.entity_name_lower %>*/
	var <%= entity.no_filter_url %> = REST_BASE_URL + "<%= entity.entity_name %>";//all data
	var <%= entity.filter_url %> = <%= entity.no_filter_url %> + "/Filtered";//filtered data
	var <%= entity.select_url %> = <%= entity.no_filter_url %> + "/FilterData";//data for select dropdown
<%- end -%>
	//------------------URL paging---------END-------


	//Third Part:
	//variables for server side paging : returned selecte data and page data ---------------START--------------
<%- $xc.entity_list.each do |entity| -%>
	//<%= entity.entity_name_lower %>
	var <%= entity.entity_name_lower %>FilteredData,
	    <%= entity.entity_name_lower %>SelectData;
<%- end -%>
	//variables for server side paging : returned selecte data and page data ---------------END--------------


	
	var service =  
	{
		// Forth Part:
//-------------------get filter and paging data-------------START-------------------
<%- $xc.entity_list.each do |entity| -%>
	   //---<%= entity.entity_name %>
		get<%= entity.entity_name %>SelectData: function(callback)
		{
			logger.info("Executing get<%= entity.entity_name %>SelectData() from 'AdminService'.");
			_waq.push([
				'gridDataRequested',
				(new Date()).valueOf(),
				{group:'gridLoadGroup'}
			]);
			this.httpGet(<%= entity.select_url %>,
									function(result)
								   {
								        logger.info("get<%= entity.entity_name %>SelectData() call successful.");
								        logger.debug(JSON.stringify(result.data));
								        <%= entity.entity_name_lower %>SelectData = result.data;
								        callback && callback(<%= entity.entity_name_lower %>SelectData);
								   }, 
								   "Get get<%= entity.entity_name %>SelectData"
								   );
		},
		get<%= entity.entity_name %>Data: function(para,callback)
		{
			logger.info("Executing get<%= entity.entity_name %>Data() from 'AdminService'.");
			_waq.push([
				'gridDataRequested',
				(new Date()).valueOf(),
				{group:'gridLoadGroup'}
			]);
			this.httpGet(<%= entity.no_filter_url %> +'/'+para.pageSize+'/'+para.pageIndex,function(result){
								        logger.info("get<%= entity.entity_name %>Data() call successful.");
								        logger.debug(JSON.stringify(result.data));
								        <%= entity.entity_name_lower %>FilteredData = result.data;
								        formatData.toDollerData(<%= entity.entity_name_lower %>FilteredData.lineData,para.dollerFields);
								        formatData.toPercentData(<%= entity.entity_name_lower %>FilteredData.lineData,para.percentFields);
								        callback && callback(<%= entity.entity_name_lower %>FilteredData);
								   }, 
								   "Get get<%= entity.entity_name %>Data"
								   );
		},
		get<%= entity.entity_name %>FilteredData: function(para, callback)
		{
			logger.info("Executing get<%= entity.entity_name %>FilteredData()");
			logger.debug(JSON.stringify(para.filterObj));
			this.httpPost(<%= entity.filter_url %>+'/'+para.pageSize+'/'+para.pageIndex, para.filterObj, function(result){
				logger.info("Get get<%= entity.entity_name %>FilteredData operation successful.");
				<%= entity.entity_name_lower %>FilteredData = result.data;
				formatData.toDollerData(<%= entity.entity_name_lower %>FilteredData.lineData,para.dollerFields);
				formatData.toPercentData(<%= entity.entity_name_lower %>FilteredData.lineData,para.percentFields);
				callback && callback(<%= entity.entity_name_lower %>FilteredData);
			});
		}, 
<%- end -%>
		//-------------------get filter and paging data---------END-------------------
		
		// Fifth Part:
//-------popup -------save--------START------
	<%- $xc.entity_list.each do |entity| -%>
		save<%= entity.entity_name %>: function(options, callback)
		{
			logger.info("Executing save<%= entity.entity_name %>()");
			logger.debug(JSON.stringify(options.item));
			this.httpPost(<%= entity.save_url %>, options.item, function(result){
				logger.info("Save <%= entity.entity_name %> operation successful.");
				result.data.addFlag = true;
				formatData.toDollerData(result.data,options.dollerFields);
				formatData.toPercentData(result.data,options.percentFields);
				<%= entity.entity_name_lower %>FilteredData.lineData.push(result.data);
				if(callback)callback(<%= entity.entity_name_lower %>FilteredData);
			});
		},
	<%- end -%>
//-------popup -------save--------END------
		
		// Six Part:
//-------popup -------delete--------START------
	<%- $xc.entity_list.each do |entity| -%>
		delete<%= entity.entity_name %>: function(options,callback)
		{
			logger.info("Executing delete<%= entity.entity_name %>()");
			removeAttrAddFlag(options.itemToDelete);
			formatData.removeCommaForList(options.itemToDelete,options.dollerFields);
			logger.debug(JSON.stringify(options.itemToDelete));
			this.httpPost(<%= entity.delete_url %>, options.itemToDelete, function(result){
				logger.info("Delete <%= entity.entity_name %> service call successful.");
				<%= entity.entity_name_lower %>FilteredData = removeItemFromList(<%= entity.entity_name_lower %>FilteredData, result.data, "id");
				if(callback)callback(<%= entity.entity_name_lower %>FilteredData);
			});
		},
	<%- end -%>
//-------popup -------delete--------END------

		// Seventh Part:
//-------popup -------update--------START------
	<%- $xc.entity_list.each do |entity| -%>
		update<%= entity.entity_name %>: function(options,callback)
		{
		    logger.info("Executing update<%= entity.entity_name %>()");
			logger.debug(JSON.stringify(options.item));
			this.httpPost(<%= entity.update_url %>, options.item, function(result){
				formatData.toDollerData(result.data,options.dollerFields);
				formatData.toPercentData(result.data,options.percentFields);
				sync(result.data, <%= entity.entity_name_lower %>FilteredData, "id");
				logger.info("Update <%= entity.entity_name %> operation successful.");
				if(callback)callback(<%= entity.entity_name_lower %>FilteredData);
			});
		},
	<%- end -%>
//-------popup -------update--------END------
		
	};
	return service;
});