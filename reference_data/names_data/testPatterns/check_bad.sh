#!/bin/sh
# find occurances of all punctuation and repeating caracters
#
# patterns (repeating badwords business keyboard singlechar)
# name_sets (cust bo)

DIR=`dirname "$0"`

for name_set in "$@" ; do
	echo Running analysis for $name_set
	for pat in repeating badwords business keyboard singlechar honorifics email allnumbers letternumbers ; do
		echo Checking bad ${pat} in $name_set
		egrep -i -E -f $DIR/pat_$pat.grep $name_set | sed -e 's///' -e "s/\$/	${pat}/" > $name_set.$pat.check
	done
	# check for all punctuation
	echo Checking bad allpunct in $name_set
	rg -i '\t[^A-ZÀ-ȞΑ-ΩА-Я]+\t' $name_set | sed -e 's///' -e "s/\$/	allpunct/" > $name_set.allpunct.check
        rg -i '\t[^A-ZÀ-ȞΑ-ΩА-Я]+$' $name_set | sed -e "s/\$/	allpunct/" >> $name_set.allpunct.check

	# check for multiple scripts
	echo Checking bad mixedscripts in ${name_set}
	rg -i '([А-Я][^\t]*[A-Z]|[A-Z][^\t]*[А-Я])' $name_set | sed -e 's///' -e "s/\$/	mixedscripts/" > ${name_set}.mixedscripts.check
	rg -i '([Α-Ω][^\t]*[A-Z]|[A-Z][^\t]*[Α-Ω])' $name_set | sed -e 's///' -e "s/\$/	mixedscripts/" >> ${name_set}.mixedscripts.check

done

# egrep -i -E -f pat_badwords.grep test_bo_names.txt > bad_bo_names_badwords.txt
# egrep -i -E -f pat_badwords.grep test_cust_names.txt > bad_cust_names_badwords.txt
# egrep -i -E -f pat_business.grep test_bo_names.txt > bad_bo_names_business.txt
# egrep -i -E -f pat_business.grep test_cust_names.txt > bad_cust_names_business.txt
# egrep -i -E -f pat_keyboard.grep test_bo_names.txt > bad_bo_names_keyboard.txt
# egrep -i -E -f pat_keyboard.grep test_cust_names.txt > bad_cust_names_keyboard.txt
# egrep -i -E -f pat_repeating.grep test_bo_names.txt > bad_bo_names_repeating.txt
# egrep -i -E -f pat_repeating.grep test_cust_names.txt > bad_cust_names_repeating.txt
# egrep -i -E -f pat_singlechar.grep test_bo_names.txt > bad_bo_names_singlechar.txt
# egrep -i -E -f pat_singlechar.grep test_cust_names.txt > bad_cust_names_singlechar.txt
