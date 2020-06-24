#!/bin/sh
#
# Grab top level indexes
curl https://www.kdejsme.cz/seznam/ > x

# Grab lists of Surname indexes "prijmeni"
grep "/seznam/prijmeni" x | sed -e "s/.*prijmeni.//" | sed -e 's/">.*//' > kdejsme.prijmeni.index
# Grab lists of GivenName indexes "jmeno"
grep "/seznam/jmeno" x | sed -e "s/.*jmeno.//" | sed -e 's/">.*//' | sed -e "/></d" > kdejsme.jmeno.index

# Walk through surname pages (kdejsme.prijmeni.index)
rm -f cs-kdejsme-surnames.txt
rm -f temp-surnames.txt
touch cs-kdejsme-surnames.txt
touch temp-surnames.txt

for surname in `cat kdejsme.prijmeni.index`
do
	curl https://www.kdejsme.cz/seznam/prijmeni/$surname > y1
	grep '"/prijmeni/' y1 | sed 's/^.*">//' | sed 's/&quot;//g' | sed "s/<\/a.*//" > y2
	cat y2 | tr [:upper:] [:lower:] | recode -d utf8..html | recode html..utf8 > prijmeni-$surname.list
	cat prijmeni-$surname.list >> temp-surnames.txt
	rm y1 y2
done
sort -u temp-surnames.txt > cs-kdejsme-surnames.txt

# Walk thrugh given name pages (kdejsme.jmeno.index)

rm -f cs-kdejsme-givenNames.txt
touch cs-kdejsme-givenNames.txt
rm -f temp-givenNames.txt
touch temp-givenNames.txt

for givenName in `cat kdejsme.jmeno.index`
do
	curl https://www.kdejsme.cz/seznam/jmeno/$givenName > y1
	grep '"/jmeno/' y1 | sed 's/^.*">//' | sed 's/&quot;//g' | sed "s/<\/a.*//" > y2
	cat y2 | tr [:upper:] [:lower:] | recode -d utf8..html | recode html..utf8 > jmeno-$givenName.list
	cat jmeno-$givenName.list >> temp-givenNames.txt
	rm y1 y2
done
sort -u temp-givenNames.txt > cs-kdejsme-givenNames.txt

rm temp-*.txt
