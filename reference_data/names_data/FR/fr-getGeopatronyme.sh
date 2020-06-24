#!/bin/bash
# 
# Scrape French surname database for list of surnames
# Note that none have accents

for listSet in `seq 1 400 300500`; do
	curl "http://www.geopatronyme.com/cgi-bin/carte/hitnom.cgi?periode=5&suite=${listSet}" | grep "LISTE.*nomcarte" | sed -e 's/^.*nomcarte[^"]*">//' | sed -e 's/<.*//' >> fr-geopatronyme.txt
done
