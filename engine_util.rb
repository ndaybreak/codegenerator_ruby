module EngineUtil
    def self.lower_first (str)
        if str.length > 0
            str[0].downcase + str[1, str.length-1]
        else
            str
        end
    end
end
