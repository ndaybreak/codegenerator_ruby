# #!/usr/bin/env ruby
require 'yaml'
require_relative '../frontMainEngine'

def getEntityNameList
  lines = IO.readlines( File.join(__FILE__, '../instructions/webapp/EntityList.txt') )
  entityNameList = Array.new
  for line in lines
    if line.index('#') != 0
      entityNameList.push(line.split(',')[0])
    end
  end
  entityNameList
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

def getColmnInfo(lines)
  valueList = lines[5].split(',')
  displayList = lines[6].split(',')
  cdList = lines[7].split(',')
  visibleList = lines[8].split(',')
  classList = lines[9].split(',')

  colmnsInfo = Array.new()
  $i = 0
  $num = valueList.size
  while $i < $num do
    tempColInfo = Array.new()
    tempColInfo.push(valueList[$i])
    tempColInfo.push(displayList[$i])
    tempColInfo.push(cdList[$i])
    tempColInfo.push(visibleList[$i] == 'Y'?true:false)
    tempColInfo.push(classList[$i])
    colmnsInfo.push(tempColInfo)
    $i += 1
  end
  colmnsInfo
end

# >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

# >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
targetFile = File.join(__FILE__, '../../conf/frontMain.yaml')
#targetFile = File.join(__FILE__, '../output/frontMain.yaml')
if File.file?(targetFile)
  File.delete(targetFile)
end

entityNameList = getEntityNameList()
file = File.new(targetFile, 'a')
for entityName in entityNameList
  lines = chopSeparator(IO.readlines( File.join(__FILE__, '../instructions/webapp/_grid_' + entityName + '.txt') ))
  tempXGrid = XGrid.new
  tempXGrid.entity_name = entityName
  tempXGrid.entity_title = lines[0]
  tempXGrid.doller_fields = lines[1].split(',')
  tempXGrid.percent_fields = lines[2].split(',')
  tempXGrid.input_date_fields = lines[3].split(',')
  tempXGrid.action = lines[4]
  tempXGrid.colms_info = getColmnInfo(lines)
  tempXGrid.bigint_colms = lines[10].split(',')
  tempXGrid.two_columns = (lines[11] == 'Y'? true:false)
  tempXGrid.show_scroll = (lines[12] == 'Y'? true:false)

  YAML.dump(tempXGrid, file)
  # YAML.dump('#>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>', file)
end
file.close