#!/usr/bin/env ruby
require 'erb'
require 'yaml'
require_relative 'engine_util'
# >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
# conf / data classes
# ------------------------------------------------------------------------------
class XGrid
  attr_accessor :entity_name, :entity_title, :doller_fields, :percent_fields,
			  :input_date_fields, :action,:colms_info, :bigint_colms, :two_columns, :show_scroll

  def initialize()
    @entity_name
    @entity_title
    @doller_fields
    @percent_fields
	  @input_date_fields
    @action
	  @colms_info
	  @bigint_colms
    @two_columns = false
    @show_scroll = false
  end

  def entity_name_lower
      EngineUtil::lower_first(entity_name)
  end

  def html_container
    container_scrollable ='<section class="container left minWidth1800" style="width:100%;">'
    container_normal     ='<section class="container left" style="width:100%;">'

    @show_scroll ? container_scrollable : container_normal
  end

  def html_table_headers
	threshold_headers = <<-'EOF'
			<tr class="TableHeaderRow"> 
				<th ng-if="$index < 8" class="left filterMultiColumn ui-state-default"  ng-click="orderTableBy(header.value,header.cd)" ng-repeat="header in headers" ng-show="header.visible"> 
					<div class="DataTables_sort_wrapper"> 
						<input ng-if="$index == 0" type="checkbox" id="item-all" ng-click="checkAllSelection(data)" title="Check All">
							{{header.title}}<span ng-if="$index != 0" ng-class="{'icon-sort-up':header.value == orderHeader && orderDirection == false, 'icon-sort-down':header.value == orderHeader && orderDirection == true}" class="DataTables_sort_icon css_right icon-sort"></span>
					</div> 
				</th> 
				<th ng-if="$index > 7 && $index < 11" dg-tip tip-content="{{T1_title}}" tip-target="topMiddle" tip-tooltip="bottomMiddle" class="left filterMultiColumn ui-state-default"  ng-click="orderTableBy(header.value,header.cd)" ng-repeat="header in headers" ng-show="header.visible">
					<div class="DataTables_sort_wrapper"> 
						{{header.title}}<span ng-class="{'icon-sort-up':header.value == orderHeader && orderDirection == false, 'icon-sort-down':header.value == orderHeader && orderDirection == true}" class="DataTables_sort_icon css_right icon-sort"></span>
					</div> 
				</th> 
				<th ng-if="$index > 10" class="left filterMultiColumn ui-state-default"  ng-click="orderTableBy(header.value,header.cd)" ng-repeat="header in headers" ng-show="header.visible">
					<div class="DataTables_sort_wrapper"> 
						{{header.title}}<span ng-class="{'icon-sort-up':header.value == orderHeader && orderDirection == false, 'icon-sort-down':header.value == orderHeader && orderDirection == true}" class="DataTables_sort_icon css_right icon-sort"></span>
					</div> 
				</th> 
			</tr>
    EOF
    common_headers = <<-'EOF'
			<tr class="TableHeaderRow">
				<th class="left filterMultiColumn ui-state-default" ng-click="orderTableBy(header.value,header.cd)" ng-repeat="header in headers" ng-show="header.visible" filter-data="names($column)">
					<div class="DataTables_sort_wrapper">
						<input ng-if="$index == 0" type="checkbox" id="item-all" ng-click="checkAllSelection(data)" title="Check All">{{header.title}} <span ng-if="$index != 0" ng-class="{'icon-sort-up':header.value == orderHeader && orderDirection == false, 'icon-sort-down':header.value == orderHeader && orderDirection == true}" class="DataTables_sort_icon css_right icon-sort"></span>
					</div>
				</th>
			</tr>
    EOF
	case entity_name
    when 'OptThreshold'
      retval = threshold_headers
    else
      retval = common_headers
    end
  end

  def html_buttons
    # 1. buttons
    add_edit = <<-'EOF'
			<a class="btn btn-Primary {{btn}}" ng-click="btn || addOrEdit()"><i class="icon-edit"></i>Add/Edit</a>
    EOF
    save = <<-'EOF'
			<a class="btn btn-Primary {{btn}}" ng-click="save()"><i class="icon-pencil icon-white"></i>Save</a>
    EOF
    add = <<-'EOF'
			<a class="btn btn-Primary btn-add {{btn}}" ng-click="add()"><i class="icon-plus"></i>Add New Record</a>
    EOF
    del_inactive = <<-'EOF'
			<a class="btn btn-Primary btn-delete {{btn}}" ng-click="del();"><i class="icon-trash"></i>Inactive</a>
    EOF
    delete = <<-'EOF'
			<a class="btn btn-Primary btn-delete {{btn}}" ng-click="del();"><i class="icon-trash"></i>Delete</a>
    EOF
    update = <<-'EOF'
			<a class="btn btn-Primary {{btn}}" ng-click="update()"><i class="icon-pencil icon-white"></i>Edit</a>
    EOF

    # 2. select buttons
    case entity_name
    when 'OptPriceQualityBand'
      retval = add_edit
    when 'OptDefaultRevenueBucket'
      retval = save
    else
      retval = add

      case entity_name
      when 'OptUser'
        retval += del_inactive
      else
        retval += delete
      end

      retval += update
    end

    #retval
  end



  def js_column_style
    two_col_style = "windowClass: 'twoCols',
								size: 'lg'"
    one_col_style = "windowClass : 'oneCol',"


    two_columns ? two_col_style : one_col_style
  end

  def js_use_two_col
    two_col_style = "windowClass: 'twoCols',
								size: 'lg',"

    two_columns ? two_col_style : nil
  end

=begin
  def js_elseif_auth_role
    sales_comp_admin = '}else if(authList.role === "Sales Comp Admin"){'
    admin = '}else if(authList.role === "Admin"){'

    if ['OptPriceQualityBand', 'OptSqMccExcp', 'OptSqPricebookExcp'].include?( entity_name )
      sales_comp_admin
    else
      admin
    end
  end

  def js_use_right_targets
    if right_targets != '0'
      ',{ "sClass": "right filterMultiColumn", aTargets: [ <%= xc.right_targets %> ] }'
    else
      nil
    end
  end
=end
  def getAttrList
  	attrList = Array.new
  	@colms_info.each do |colm|
  		attrList.push(colm[2])
  		end
  	attrList.delete_at(0)
  	attrList
  end
  def getValueList
  	valueList = Array.new
  	@colms_info.each do |colm|
  		valueList.push(colm[1])
  	end
  	valueList.delete_at(0)
  	valueList
  end
  def getDollerFields
    doller_fields ? doller_fields : []
  end
  def getPercentFields
    percent_fields ? percent_fields : []
  end
  def getInputDateFields
    input_date_fields ? input_date_fields : []
  end
end
# <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<

$xc = nil
def render_frontMainEngine
	File.open( File.join(__FILE__, '../conf/frontMain.yaml') ) { |f|
		YAML.load_documents( f ) { |d|
		  $xc = d
		  # grid - html
		  input = File.read( File.join(__FILE__, '../template/frontMain.html') )
		  results = ERB.new(input, nil, '-').result()
		  output = File.join(__FILE__, "../output/html/#{$xc.entity_name}Management_pg.html")
		  File.open(output, 'w') { |file| file.write(results) }

		  # grid - js
		  input = File.read( File.join(__FILE__, '../template/frontMain.js') )
		  results = ERB.new(input, nil, '-').result()
		  output = File.join(__FILE__, "../output/js/#{$xc.entity_name}ManagementController_pg.js")
		  File.open(output, 'w') { |file| file.write(results) }
		}
	}
end