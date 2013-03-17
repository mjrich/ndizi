from BeautifulSoup import BeautifulSoup
import urllib2
import datetime
import csv

terms = [ "produce", "location", "date", "weight", "unit", "low", "high" ]
csvwriter = csv.writer(open('mfarm_60_days.csv', "w"))
csvwriter.writerow(terms)

numdays = 1095
base = datetime.datetime.today()
dateList = [ base - datetime.timedelta(days=x) for x in range(0,numdays) ]

rows = []
for d in dateList:
	date = str(d).split(" ")[0]
	url = 'http://mfarm.co.ke/price/' + date
	
	print "making request..."
	soup = BeautifulSoup(urllib2.urlopen(url).read())
	tr = soup('tr')

	for i,td in enumerate(tr):
		if i != 0:
			newrow = []
			for i,t in enumerate(td('td')):
				newrow.append(t.string)
			csvwriter.writerow(newrow)

print "done"