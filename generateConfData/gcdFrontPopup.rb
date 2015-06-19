# #!/usr/bin/env ruby
require 'yaml'
require_relative '../frontPopup'

def getEntityInfoLines
  oldLines = chopSeparator(IO.readlines( File.join(__FILE__, '../instructions/webapp/EntityList.txt') ))
  entityInfoLines = Array.new
  for line in oldLines
    if line.index('#') != 0
      entityInfoLines.push(line)
    end
  end
  entityInfoLines
end

# separator: \n , '
def chopSeparator(oldLines)
  newLines = Array.new
  for line in oldLines
    line.chomp!
    line.delete!("'")
    newLines.push(line)
  end
  newLines
end

# >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

# >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
#targetFile = File.join(__FILE__, '../../conf/frontPopup.yaml')
targetFile = File.join(__FILE__, '../output/frontPopup.yaml')
if File.file?(targetFile)
  File.delete(targetFile)
end

entityInfoLines = getEntityInfoLines()
file = File.new(targetFile, 'a')
for entityLine in entityInfoLines
  entityInfo = entityLine.split(',')
  tempXDetail = XDetail.new()
  tempXDetail.entity_name = entityInfo[0]
  tempXDetail.screen_name = entityInfo[1]
#  need auto add entity_name by custmer 
  if tempXDetail.entity_name == 'OptThreshold' || tempXDetail.entity_name == 'OptGuidanceDefaultPt'
    tempXDetail.one_column_flag = false
  else
    tempXDetail.one_column_flag = true
  end

  popupSourceFile = File.join(__FILE__, '../instructions/webapp/_addUpdate_' + tempXDetail.entity_name + '.txt')
  itemLines = chopSeparator(IO.readlines( popupSourceFile ))
  itemList = Array.new()
  $id = 1
  for itemLine in itemLines
    itemInfo = itemLine.split('|')
    tempItem = XDetailItem.new()
    tempItem.internal_id = $id
    tempItem.service_name = itemInfo[0]
    tempItem.return_value = itemInfo[1]
    tempItem.default_index = itemInfo[2]
    tempItem.data_source = itemInfo[3]
    tempItem.control_type = itemInfo[4]
    tempItem.key = itemInfo[5]
    tempItem.item_name = itemInfo[6]
    tempItem.item_value = itemInfo[7]
    tempItem.item_desc = itemInfo[8]
    tempItem.desc_for_message = itemInfo[9]
    tempItem.html_element_id = itemInfo[10]
    tempItem.html_element_name = itemInfo[11]
    tempItem.checks = itemInfo[12].split(',')
    tempItem.on_check_fail = itemInfo[13].split(',')
    tempItem.mandatory = (itemInfo[14] == 'Y' ? true:false)
    tempItem.side = itemInfo[15]
    itemList.push(tempItem)
    $id += 1
  end

  tempXDetail.items = itemList
  YAML.dump(tempXDetail, file)
  # YAML.dump('#>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>', file)
end
file.close