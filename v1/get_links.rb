require 'csv'

source = '2021yoga.csv'

urls = []

raw = CSV.read(source)
raw.each{|row|
  # next if row[1] == nil# || row[1].length == 0
  # row[1].split(',').select{|str| str.start_with?('http')}.each{|url|
  #   urls << url if url
  # }
  next if !row[1]
  # urls = row[1].split("\n")#.select{|str| str.start_with?('http') }
  # p urls
  row[1].split("\n").select{|str| str.start_with?("http")}.each{|u|
    urls << u
  }
  # puts
}

# puts urls
puts "Extracted #{urls.count} urls from #{source}"
puts "Filtered down to #{urls.uniq.count} unique urls"

new_file_path = 'unique_urls.csv'
File.write(new_file_path, urls.uniq.join(",\n"))