#!/bin/bash
# 
# Scrape French surname database for list of surnames
# Note that none have accents

echo "Paris legionaires (GRP=0..161)"
# MAX3=200
# GRP=0 .. 161
for listSet in `seq 1 161`; do
	echo Paris:GRP=${listSet}
	curl "http://www2.culture.gouv.fr/public/mistral/leonore_fr?ACTION=RETROUVER_TITLE&FIELD_4=LIEU-NSS&VALUE_4=PARIS&GRP=${listSet}&SPEC=9&SYN=1&IMLY=&MAX1=1&MAX2=1&MAX3=200&REQ=%28%28PARIS%29%20%3aLIEU-NSS%20%29&DOM=All&USRNAME=nobody&USRPWD=4%24%2534P" | recode ISO-8859-1..UTF-8 | grep "<TD.*Paris" | sed -e "s/^[^0]*000000.><B>//" -e "s/<\/B[^0]*000000.><N>/	/" -e "s/<\/N.*$//" >> fr-leonore.txt
done

echo "Marseille legionnaires (GRP=0 .. 14)"
# MAX3=200
# GRP=0 .. 14
for listSet in `seq 1 14`; do
	echo Marseille:GRP=${listSet}
	curl "http://www2.culture.gouv.fr/public/mistral/leonore_fr?ACTION=RETROUVER_TITLE&FIELD_4=LIEU-NSS&VALUE_4=MARSEILLE&GRP=${listSet}&SPEC=9&SYN=1&IMLY=&MAX1=1&MAX2=1&MAX3=200&REQ=%28%28MARSEILLE%29%20%3aLIEU-NSS%20%29&DOM=All&USRNAME=nobody&USRPWD=4%24%2534P" | recode ISO-8859-1..UTF-8 | grep "<TD.*Marseille" | sed -e "s/^[^0]*000000.><B>//" -e "s/<\/B[^0]*000000.><N>/	/" -e "s/<\/N.*$//" >> fr-leonore.txt
done

echo "Lyon legionnaires (GRP=0..19)"
# MAX3=200
# GRP=0 .. 19
for listSet in `seq 1 19`; do
	echo Lyon:GRP=${listSet}
	curl "http://www2.culture.gouv.fr/public/mistral/leonore_fr?ACTION=RETROUVER_TITLE&FIELD_4=LIEU-NSS&VALUE_4=LYON&GRP=${listSet}&SPEC=9&SYN=1&IMLY=&MAX1=1&MAX2=1&MAX3=200&REQ=%28%28LYON%29%20%3aLIEU-NSS%20%29&DOM=All&USRNAME=nobody&USRPWD=4%24%2534P" | recode ISO-8859-1..UTF-8 | grep -i "<TD.*Lyon" | sed -e "s/^[^0]*000000.><B>//" -e "s/<\/B[^0]*000000.><N>/	/" -e "s/<\/N.*$//" >> fr-leonore.txt
done

echo "Toulouse legionnaires (GRP=0..11)"
# MAX3=200
# GRP=0 .. 11
for listSet in `seq 1 11`; do
	echo Toulouse:GRP=${listSet}
	curl "http://www2.culture.gouv.fr/public/mistral/leonore_fr?ACTION=RETROUVER_TITLE&FIELD_4=LIEU-NSS&VALUE_4=TOULOUSE&GRP=${listSet}&SPEC=9&SYN=1&IMLY=&MAX1=1&MAX2=1&MAX3=200&REQ=%28%28TOULOUSE%29%20%3aLIEU-NSS%20%29&DOM=All&USRNAME=nobody&USRPWD=4%24%2534P" | recode ISO-8859-1..UTF-8 | grep "<TD.*Toulouse" | sed -e "s/^[^0]*000000.><B>//" -e "s/<\/B[^0]*000000.><N>/	/" -e "s/<\/N.*$//" >> fr-leonore.txt
done
