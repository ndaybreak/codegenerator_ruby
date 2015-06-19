#!/usr/bin/env ruby
require 'erb'
require 'yaml'
require_relative 'engine_util'
# >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
# conf / data classes
# ------------------------------------------------------------------------------
class XSeriveItem
  attr_accessor :entity_name, :read_all_service, :save_service, :update_service,:delete_service,
			  :mass_delete_service, :read_all_url, :save_url, :update_url,:delete_url,
			  :no_filter_url, :filter_url, :select_url, :client_variable, :client_variable_list

  def initialize()
    @entity_name
    @read_all_service
    @save_service
    @update_service
    @delete_service
    @mass_delete_service
    @read_all_url
    @save_url
    @update_url
    @delete_url
    @no_filter_url
    @filter_url
	  @select_url
    @client_variable
    @client_variable_list
	
  end
  def entity_name_lower
      EngineUtil::lower_first(entity_name)
  end
end
class XDataSerive
  attr_accessor :entity_list
end

# <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
$xc = nil
def render_frontDataService
  File.open( File.join(__FILE__, '../conf/frontDataService.yaml') ) { |f|
    YAML.load_documents( f ) { |d|
		$xc = d
		input = File.read(File.join(__FILE__, '../template/frontDataService_shortcut.js'))
		results = ERB.new(input, nil, '-').result
		output = File.join(__FILE__, '../output/js/DataService.js')
		File.open(output, 'w'){|file| file.write(results)}
    }
  }
end