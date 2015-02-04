# #!/usr/bin/env ruby
require 'yaml'
require_relative "../frontDataService"

lines = IO.readlines(File.join(__FILE__, '../instructions/CrossController.txt'))
entityList = Array.new
for line in lines
  if line.index('#') == 0
    next
  end
  line.chomp!

  tempArr = line.split(',')
  tempItem = XSeriveItem.new
  tempItem.entity_name =tempArr[0]
  tempItem.read_all_service = tempArr[1]
  tempItem.save_service = tempArr[2]
  tempItem.update_service = tempArr[3]
  tempItem.delete_service = tempArr[4]
  tempItem.mass_delete_service = tempArr[5]
  tempItem.read_all_url = tempArr[6]
  tempItem.save_url = tempArr[7]
  tempItem.update_url = tempArr[8]
  tempItem.delete_url = tempArr[9]
  tempItem.no_filter_url = tempArr[10]
  tempItem.filter_url = tempArr[11]
  tempItem.select_url = tempArr[12]
  tempItem.client_variable = tempArr[13]
  tempItem.client_variable_list = tempArr[14]
  entityList.push(tempItem)
end
dataservice = XDataSerive.new()
dataservice.entity_list =entityList
#file = File.new(File.join(__FILE__, '../../conf/frontDataService.yaml'), 'w')
file = File.new(File.join(__FILE__, '../output/frontDataService.yaml'), 'w')
YAML.dump(dataservice, file)
file.close