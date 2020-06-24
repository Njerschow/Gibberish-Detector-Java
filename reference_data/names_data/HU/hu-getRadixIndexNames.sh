#!/bin/bash
for word in `cat hu-RadixIndex.list` ; do
	echo Grabbing $word ...
	# curl https://www.radixindex.com/hu/vezeteknevek/abc_szerinti_mutato/$word > x.$word
	cat x.$word | sed -e 's/<a/\'$'\n<a/g' | grep 'vezeteknev/' | sed -e 's/<[^>]*>//' -e 's/[ ]*<\/a.*//' | recode HTML..UTF-8 > y.$word
done
