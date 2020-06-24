#!/bin/sh

# jmeno
# curl https://www.kdejsme.cz/jmeno/"Vlk"/  | grep '\(<caption>\|v celé České republice\)' | sed -e 's/^[^<]*<caption>//' -e 's/.*roce /    /' -e 's/<.a.*<strong>/ - /' -e 's/<\/.*//'

echo "jmeno - Given Names" > z2
for name in "j c" "khdr" "md" "mhd" "nnn" "vlk" "x" "xxx"
do
	echo '"'$name'"'
	curl https://www.kdejsme.cz/jmeno/"$name"/ | grep '<caption>' | sed -e 's/^[^<]*<caption>//' -e 's/<\/.*//' >> z2
done


# prijmeni
# curl https://www.kdejsme.cz/prijmeni/"Šprc"/  | grep '\(<caption>\|v celé České republice\)' | sed -e 's/^[^<]*<caption>//' -e 's/.*roce /    /' -e 's/<.a.*<strong>/ - /' -e 's/<\/.*//'

echo "prijmeni - Surnames" >> z2
for name in "šprc" "štrk" "b k" "bˇk" "brd" "brchl" "brkl" "brt" "crk" "cvrk" "chrt" "chrz" "chrzˇszcz" "drˇg" "drn" "drs" "fˇs" "frˇk" "frk" "głˇb" "hrb" "hrk" "k c" "k. c." "khkhkh" "klč" "kĺč" "kľč" "krb" "krč" "krch" "krs" "krš" "krt" "lv" "mlch" "mls" "ng" "plh" "plch" "prč" "smrc" "smrt" "srb" "srch" "srp" "trč" "trch" "trms" "trn" "trs" "trš" "tvrz" "vlč" "vlk" "wˇs" "xxx"
do
	echo '"'$name'"'
	curl https://www.kdejsme.cz/prijmeni/"$name"/ | grep '<caption>' | sed -e 's/^[^<]*<caption>//' -e 's/<\/.*//' >> z2
done
