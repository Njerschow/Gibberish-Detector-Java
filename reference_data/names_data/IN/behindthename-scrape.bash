#!/bin/bash
## Args: $1 new file $2: base url, $3 start range $4 end range
##
## example
## > bash behindthename-scrape.bash in-givenName.txt https://www.behindthename.com/names/usage/indian 2 3

echo "Num args $#"
echo "Process $2 into $1"

## get core names
curl $2 > x
grep listname x | sed -E 's/></>\
</g' | grep 'href=..name\/' | sed -e 's/^.*<.*name[^>]*>//' -e 's/<\/a.*$//' -e 's/\s*<span.*$//' -e '/^\s*$/d' -e '/^\[/d' -e 's/ *$//' | tr '[:upper:]' '[:lower:]' | sort -u > y

## get any translations
grep listname x | sed -E 's/></>\
</g' | grep listtrans | sed -e 's/^.*listtrans.>//' -e 's/<.span.*$//' | sed -e 's/,\s*/\
/g' | sed -e 's/^ *//' -e 's/ *$//' | sort -uf > z

if [ $# -eq 4 ]
then
	num=$3
	while [ $num -le $4 ]
	do
		curl $2/$num > x
		echo "Process $2/$num into $1"
		grep listname x | sed -E 's/></>\
</g' | grep 'href=..name\/' | sed -e 's/^.*<.*name[^>]*>//' -e 's/<\/a.*$//' -e 's/\s*<span.*$//' -e '/^\s*$/d' -e '/^\[/d' -e 's/ *$//' | tr '[:upper:]' '[:lower:]' | sort -u >> y
		grep listname x | sed -E 's/></>\
</g' | grep listtrans | sed -e 's/^.*listtrans.>//' -e 's/<.span.*$//' | sed -e 's/,\s*/\
/g' | sed -e 's/^ *//' -e 's/ *$//' | sort -uf >> z
		let num++
	done
fi

sort -ubfi y > $1
sort -ubfi z > trans-$1
