#!/usr/bin/env ruby
require 'erb'
require 'yaml'
require_relative 'engine_util'
# >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
# conf / data classes
# ------------------------------------------------------------------------------
class XDetailItem
	attr_accessor :internal_id, :service_name, :return_value, :default_index, :data_source,
              :control_type, :key, :item_name, :item_value, :item_desc,
              :desc_for_message, :html_element_id, :html_element_name,
              :checks, :on_check_fail, :mandatory, :side

  def initialize()
    @internal_id
    @service_name
    @return_value
    @default_index
    @data_source
    @control_type
    @key
    @item_name
    @item_value
    @item_desc
    @desc_for_message
    @html_element_id
    @html_element_name
    @checks
    @on_check_fail
    @mandatory
    @side
	
  end

  def control_title_one
  	case control_type
  	when 'dropdown', 'text', 'text2', 'textarea'
  		if(mandatory)
  			titleLable = '<label class="col-lg-3 control-label add_form_label pa-standalone-label popup_table_lable pa-edit-mandatory-label"> ' + @item_desc + '</label>'
  		else
  			titleLable = '<label class="col-lg-3 control-label add_form_label pa-standalone-label popup_table_lable"> ' + @item_desc + '</label>'
  		end
  	when 'checkbox'
  		if(mandatory)
  			titleLable = '<label class="col-lg-3 control-label add_form_label pa-standalone-label popup_table_lable pa-edit-mandatory-label" for="' + @html_element_id + '"> ' + @item_desc + '</label>'
  		else
  			titleLable = '<label class="col-lg-3 control-label add_form_label pa-standalone-label popup_table_lable" for="' + @html_element_id + '"> ' + @item_desc + '</label>'
  		end
  	end
  end
  
  def control_title_two
  	case control_type
  	when 'dropdown', 'text', 'text2', 'textarea'
  		if(mandatory)
  			titleLable = '<label class="col-lg-3 control-label add_form_label pa-standalone-label twoCols-label pa-edit-mandatory-label"> ' + @item_desc + '</label>'
  		else
  			titleLable = '<label class="col-lg-3 control-label add_form_label pa-standalone-label twoCols-label"> ' + @item_desc + '</label>'
  		end
  	when 'checkbox'
  		if(mandatory)
  			titleLable = '<label class="col-lg-3 control-label add_form_label twoCols-label pa-edit-mandatory-label" for="' + @html_element_id + '"> ' + @item_desc + '</label>'
  		else
  			titleLable = '<label class="col-lg-3 control-label add_form_label twoCols-label" for="' + @html_element_id + '"> ' + @item_desc + '</label>'
  		end
  	end
  end

end

class XDetail
	attr_accessor :entity_name, :screen_name, :one_column_flag, :items
  def entity_name_lower
      EngineUtil::lower_first(entity_name)
  end

  def getDropdownSourceData
    returnStr = ""
    @items.each do |item|
  		if item.data_source == 'admin'
  			returnStr += ("$scope." + item.return_value + " = AdminService." + item.service_name + "();\n\t")
  		end
  	end
  	returnStr
  end

  def initFormItemAdd
    returnStr = ""
  	@items.each do |item|
  		if item.data_source == 'admin'
  			returnStr += ("$scope.formItem." + item.item_name + " = $scope." + item.return_value + "[" + String(item.default_index) + "];\n\t\t")
  		end
  	end
  	returnStr
  end

  def initFormItemUpdate
    returnStr = ""
  	@items.each do |item|
  		if item.data_source == 'admin'
  			returnStr += "idx = AdminService.getIndexOf(selected" + @entity_name + "." + item.item_value + ", $scope." + item.return_value + ", 'cd');\n\t\t"
  			returnStr += "$scope.formItem." + item.item_name + " = $scope." + item.return_value + "[idx];\n\n\t\t";
  		end
  	end
  	@items.each do |item|
  		if item.data_source == 'bool'
  			if item.return_value == 'Y'
  				returnStr += "$scope.formItem." + item.item_name + " = true;\n\t\t"
  			end
  		end
  	end
  	returnStr
  end

  def getSaveItem
    returnStr = ""
    @items.each do |item|
  		if item.data_source == 'admin'
  			returnStr += "$scope.item." + item.item_value + " = $scope.formItem." + item.item_name + ".cd;\n\t\t"
  		end
  	end
  	@items.each do |item|
  		if item.data_source == 'bool'
  			returnStr += "$scope.item." + item.item_value + " = ($scope.formItem['" + item.item_name + "'] === true) ? 'Y' : 'N';\n\t\t"
  		end
  	end
  	@items.each do |item|
  		if item.data_source == 'text2'
  			returnStr += "$scope.item." + item.item_name + " = $scope.item." + item.item_name + ".toUpperCase();\n\t\t"
  		end
  	end
  	returnStr
  end
end
# <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<

$xc = nil
def render_frontPopup
	File.open( File.join(__FILE__, '../conf/frontPopup.yaml') ) { |f|
		YAML.load_documents( f ) { |d|
			$xc = d
			# popup - html
			if $xc.one_column_flag
				input = File.read( File.join(__FILE__, '../template/frontPopupOneColm.html') )
			else
				input = File.read( File.join(__FILE__, '../template/frontPopupTwoColm.html') )
			end
			results = ERB.new(input, nil, '-').result()
			output = File.join(__FILE__, "../output/html/#{$xc.entity_name}Edit.html")
			File.open(output, 'w') { |file| file.write(results) }
		  
			# popup - js
			input = File.read( File.join(__FILE__, "../template/frontPopup.js") )
			results = ERB.new(input, nil, '-').result
			output = File.join(__FILE__, "../output/js/#{$xc.entity_name}EditController.js")
			File.open(output, 'w'){|file| file.write(results)}
		}
	}
end