# require 'open-uri'
# require 'nokogiri'

# # Perform a google search
# doc = Nokogiri::HTML(open('https://www.alomoves.com/signin'))

# const USERNAME_SELECTOR = "input[type='email']";
# const PASSWORD_SELECTOR = "input[type='password']";
# const CTA_SELECTOR = '.login-button';
# const DURATION_SELECTOR = '.vjs-remaining-time-display'

# doc.css('.vjs-remaining-time-display').each do |time|
#   puts time
# end

# require 'mechanize'

# a = Mechanize.new { |agent|
#   agent.user_agent_alias = 'Mac Safari'
# }

# a.get('https://www.alomoves.com/signin') do |page|
#   search_result = page.form_with(:id => 'signin') do |form|
#     p form
#   end.submit

#   # search_result.links.each do |link|
#   #   puts link.text
#   # end
# end

require 'csv'

CSV.read('cleansed_urls.csv').each{|row|
  puts row
}