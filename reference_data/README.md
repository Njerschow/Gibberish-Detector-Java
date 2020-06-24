# Personal name training data

[TOC]

Below is a compiled list of sources of data for personal names from various online sources.  These sources are primarily from sources such as:

* Government statistics data on birth names and census data
* Government issued online personal data related to licenses, real estate, business registries, etc.
* Historic lists of veterans, geneology data, lists of government officials, and membership lists
* Onomastic academic resources and data

## Search methodology

Searches for each region were first created and tuned in English. Then they were converted to the primary language for for each region using Google translate, and searched again using the translated search terms.  The search results were then translated again using Google translate back to English and promising sites further evaluated for quality and quantity of data.

## Data retrieval

Once a promising site was found, the data was either downloaded if provided in a convenient format such as .csv files, spreadsheets, or other single document.  Otherwise, the site was reverse-engineered, and a custom script created to scrape data by looping through each relevant page, filtering the resulting content to only the names data, and converting to a easy to process tab-delimited format.

The data, once found, was scanned to find any obvious junk data, based on previous experience and static gibberish detection filters to find things like repeated characters "xxxx", only punctuation "…", and common keyboard banging such as "qwert", "dfgdfgd", or "xyzzy", etc.

## Normalization of data

* use iconv or recode to covert data to UTF-8 if necessary
* find and fix hotkey combinations in non-Unicode files
  - `<Z^>` -> `ż`
  - `<e°>` -> `ė`
  - Etc.
* convert all data to lower case using
  * (in vi) `:.,$!tr '[[:upper:]]' '[[:lower:]]'`
* dedupe
  * `sort -iu`
* look again for gibberish such as repeats, keyboard banging
  * single letter: `"^.$"`
  * repeats: `"([^0-9sS])\1{3}|([sS])\1{4}"`

## Data sources

To Do:

* [ ] Fill in sources for English data previously found
* [ ] Add sources for other languages previously found

### Various

Source authors to search for and possibly contact:

* @ct.heise.de
* joerg@googlemail.com

TODO: 

* [ ] https://hackage.haskell.org/package/gender-0.1.1.0/src/data/nam_dict.txt.UTF8
* [ ] https://github.com/cstuder/genderReader - Same as above - european names with frequency statistics
* [ ] http://www.surnamedb.com/Surname - scrape surnames

### LT - Lithuanian

* http://www.studentsoftheworld.info/penpals/stats.php3?Pays=LIT
  http://bnn-news.com/lithuanian-civil-registry-official-choose-the-baby-s-name-thoughtfully-not-to-regret-it-later-158032
* https://lt.wikipedia.org/wiki/S%C4%85ra%C5%A1as:Lietuvoje_paplit%C4%99_vardai
* http://vardai.vlkk.lt/
* http://pavardes.lki.lt/

### FR - French
https://www.data.gouv.fr/fr/datasets/fichier-des-prenoms-edition-2017/
https://www.data.gouv.fr/fr/datasets/liste-de-prenoms/ - French government List of First 

Names

* [x] http://www.geopatronyme.com/insee.htm - French patronymic names. Scrape using

```
> curl "http://www.geopatronyme.com/cgi-bin/carte/hitnom.cgi?periode=5&suite=<page>"
```
where page is 1 to 300543.  mod 400 + 1, max 300401
e.g.
```
> curl "http://www.geopatronyme.com/cgi-bin/carte/hitnom.cgi?periode=5&suite=300401" | grep "LISTE.*nomcarte" | sed -e 's/^.*nomcarte[^"]*">//' | sed -e 's/<.*//'
```

* Examples of real french names that are also insults or bad words: http://www.geopatronyme.com/cdip/insolite/malsonnants.html 
* https://fr.wikipedia.org/wiki/Diacritiques_utilis%C3%A9s_en_fran%C3%A7ais - Diacritics and valid characters used in French names
* https://www.insee.fr/fr/statistiques/3536630#consulter - national data file contains the names attributed at least 30 times each from 1891 to 2000 in France 
* http://www2.culture.gouv.fr/documentation/leonore/DPT/com_00.htm - French Legion archives. Scrape to get accented surnames

```
> curl http://www2.culture.gouv.fr/documentation/leonore/DPT/com_001.htm | grep leonore | sed -e "s/^<[^>]*>//" -e "s/<\/a.*$//" | grep leonore | sed -e "s/^<[^>]*>//" -e "s/<\/a.*$//" | recode HTML..UTF-8
```
Scrape from com_001.htm to com_162.htm

### BE - Belgium
* https://statbel.fgov.be/en/open-data/first-names-total-population-municipality - BE Census
* https://statbel.fgov.be/en/themes/population/family-names#figures - BE Family names

### DE - German
* https://en.wikipedia.org/wiki/German_name - about German names
* [x] https://www.hugenotten.de/genealogie/tabelle-namensliste.php
* [x] https://github.com/cstuder/genderReader
* [ ] http://www.name-statistics.org/de/numedefamiliecomune.php - need to scrape name database
* [x] http://www.statistik.at/web_de/statistiken/menschen_und_gesellschaft/bevoelkerung/geborene/vornamen/index.html 
* [ ] http://www.namenforschung.net/dfd/woerterbuch/liste/ - Digitale Familiennamenwörterbuch Deutschlands, project with Akademie der Wissenschaften und der Literatur, Mainz. 37564 German surnames

### VI - Vietnamese
https://github.com/duyetdev/vietnamese-namedb-crawler

### en-US - English
Census.gov

Lists of all senators and representative
https://www.senate.gov/artandhistory/history/resources/pdf/chronlist.pdf
http://bioguide.congress.gov/biosearch/biosearch1.asp

Public records
```
curl https://www.hiringfelons.com/hire-a-felon/$state/search.php?page=$page | sed -e 's/<td>/\'$'\n<td>/g' | grep "^<td>" | sed -e '/[Ii]mage/d' -e '/>[0-9][0-9]*/d' -e 's/<td>.*"[^">]*>//' -e 's/<\/a.*$//'
curl https://www.hiringfelons.com/hire-a-felon/florida/search.php?page=10 | sed -e 's/<td>/\'$'\n<td>/g' | grep "^<td>" | sed -e '/[Ii]mage/d' -e '/>.[0-9][0-9]*/d' -e 's/<td>.*"[^">]*>//' -e 's/<\/a.*$//'
	where state in alabama ... wyoming and page in 1 to "last"
	alabama arizona arkansas colorado connecticut florida georgia idaho illinois indiana iowa kansas
	kentucky maine maryland michigan minnesota mississippi missouri montana nebraska nevada newhampshire
	newjersey newmexico northcarolina northdakota ohio oklahoma oregon pennsylvania rhodeisland southcarolina
	southdakota texas virginia washington westvirginia wisconsin wyoming

	last page: <a href="https://www.hiringfelons.com/hire-a-felon/$state/search.php?page=562">[Last]|</a>
> curl https://www.hiringfelons.com/hire-a-felon/florida/search.php?page=10 | sed -e 's/<td>/\'$'\n<td>/g' -e 's/<a href/\'$'\n<a href/g' | grep -i ">.Last..<" | sed -e 's/^.*page=//' -e 's/">.*Last.*$//'
```

### GR - Greek
* http://www.lgpn.ox.ac.uk/index.html
* http://www.eortologio.gr/
* http://www.foundalis.com/grk/EllinikaOnomata.html
* https://el.wikipedia.org/wiki/%CE%9A%CE%B1%CF%84%CE%B7%CE%B3%CE%BF%CF%81%CE%AF%CE%B1:%CE%95%CE%BB%CE%BB%CE%B7%CE%BD%CE%B9%CE%BA%CE%AC_%CE%B5%CF%80%CF%8E%CE%BD%CF%85%CE%BC%CE%B1
* http://www.opengeodata.gr/?p=380 - Λεξικό Ελληνικών επωνύμων & ονομάτων

### HU - Hungarian
* https://www.mosthallottam.hu/hasznos_info/magyar-keresztnevek-utonevek-noi-ferfi/ - Available givenNames for registration
* http://mna.unideb.hu/ - Hungarian Name Archive
* http://mnl.gov.hu/bal_menusor/hasznalat/oktatas/mindenkinek/kerdezz_-_felelek/szemelynevek.html - National Archives, Personal Names database
* https://www.radixindex.com/hu/vezeteknevek - RadixIndex of personal names
```
> curl https://www.radixindex.com/hu/vezeteknevek/abc_szerinti_mutato/<2-letter> | clean >> list
> clean :: | sed -e 's/<a/\'$'\n<a/g' | grep 'vezeteknev/' | sed -e 's/<[^>]*>//' -e 's/\s*<\/a.*//'
> clean encoded chars :: recode
	#!/bin/bash
	for word in `cat hu-RadixIndex.list` ; do
		echo Grabbing $word ...
		# curl https://www.radixindex.com/hu/vezeteknevek/abc_szerinti_mutato/$word > x.$word
		cat x.$word | sed -e 's/<a/\'$'\n<a/g' | grep 'vezeteknev/' | sed -e 's/<[^>]*>//' -e 's/[ ]*<\/a.*//' | recode HTML..UTF-8 > y.$word
	done
```

* https://www.radixindex.com/en/surnames - RadixIndex : Hungarian and Central European genealogy and local history databases (surnames)

### FI - Finnish
* http://www.tuomas.salste.net/suku/nimi/index.html - "Tietoja suomalaisten sukunimistä" "Family names in Finland"
* https://verkkopalvelu.vrk.fi/nimipalvelu/ - Nimipalvelu "Names service for Population Information System of Finland"
* https://www.avoindata.fi/data/en_GB/dataset/none - Finnish names and surnames of names and surnames in the Population Information System

### EE - Estonian
* http://www.tervisetrend.ee/parimad-eriarstid.aspx - medical directory
* https://www.stat.ee/public/apps/nimed/
* https://nimed.ee/allikad
* http://www.esbl.ee/index.php?ac=alfabeet
* http://www.ra.ee/aadresslehed/index.php/sheet/search?lastname=%2A&q=1 (TO DO - 452k records) to http://www.ra.ee/aadresslehed/index.php/sheet/search?lastname=%2A&q=1&page=22626

### NG - Nigerian
* [ ] https://en.wikipedia.org/wiki/Ego_Nwodim
* [ ] http://www.top-names.info/names.php?S=F&P=NIG
* [ ] https://africa-facts.org/african-last-names/
* [ ] http://www.americanlastnames.us/last-names/Nigerian/O/O-0.html
* [ ] http://www.americanlastnames.us/last-names/Nigerian/A/A-0.html

### CZ - Czech
* https://www.kdejsme.cz/ - frequency of surnames or names in the Czech Republic
* https://www.prijmeni.cz - Czech names
  * Male names: https://krestnijmeno.prijmeni.cz/nejoblibenejsi_muzska_jmena/2016&page=001 page 01 to 22
  * Female names: https://krestnijmeno.prijmeni.cz/nejoblibenejsi_zenska_jmena/2016&page=01 page 01 to 27
  * Surnames: https://www.prijmeni.cz/nejcastejsi_prijmeni_novorozencu/2016&page=1 - can scrape from page 001 to 949 and search for `<a href="https://www.prijmeni.cz/[^"]*">\([^<]*\)</a>` and grab the $1 group from each `<td>` row.ttps://www.prijmeni.cz/nejcastejsi_prijmeni_novorozencu/2016
* https://www.nasejmena.cz/nj/cetnost.php - possible scraping of 100 most common surname and given name by ~50 alphabet values.  
  * Can scrape alphabetic lists `https://www.nasejmena.cz/nj/cetnost.php?id=1&typ=ab`, where `id` is 1 to 54, looking for `<TD[^']*'prijmeni')">\([^<]*\)<TD` for surname, and `'jmeno')"[^>]*>\([^<]*\)<TD` for givenName and grab the $1 group for each name. Can possibly scrape category lists too

### PL - Poland / Polish

* Polish government statistics
  * https://dane.gov.pl/dataset?page=1&per_page=50&q=imi%C4%99&sort=relevance
  * Names appearing in the PESEL register, including names of deceased persons
    * https://dane.gov.pl/dataset/568,nazwiska-wystepujace-w-rejestrze-pesel
* Men's surnames - as of January 22, 2020 
     * https://dane.gov.pl/dataset/568,nazwiska-wystepujace-w-rejestrze-pesel/resource/22811,nazwiska-meskie-stan-na-2020-01-22/table?page=1&per_page=20&q=&sort= 
* Frequency of names 1950-2016
  * Name density in 1950-2016
    * https://dane.gov.pl/dataset/24/resource/140,gestosc-imion-w-latach-19502016/table?page=1&per_page=20&q=&sort= 

## Tools

### iconv - convert from encodings to UTF-8

### recode - HTML to UTF-8
* http://www.chiark.greenend.org.uk/doc/recode-doc/index.html 
* https://github.com/rrthomas/recode/ 
* https://github.com/pinard/Recode
* https://stackoverflow.com/questions/5929492/bash-script-to-convert-from-html-entities-to-characters
* Download from here: https://packages.debian.org/en/sid/recode

Alternatively, use perl
```
perl -Mopen=locale -pe 's/&#x([\da-f]+);/chr hex $1/gie'
```

=======
### IE - Irish
* https://pdf.cso.ie/www/pdf/20180227105506_Irish_Babies_Names_2013_full.pdf
* https://www.behindthename.com/names/usage/irish/3
* https://www.celticthunder.com/blog/2017/01/13/irish-surnames-meanings/
* https://surnames.behindthename.com/names/usage/irish
* http://www.americanlastnames.us/last-names/Irish/K/K-11.html

### HR - Croatian
* https://www.dzs.hr/default_e.htm
* http://www.behindthename.com/names/usage/croatian/2
* http://www.20000-names.com/male_croatian_names.htm
* https://en.wikipedia.org/wiki/Croatian_name#Croatian_given_names
* https://actacroatica.com/en/diaspora/world/
* https://www.dzs.hr/Eng/censuses/census2011/results/htm/e01_01_31/E01_01_31.html
* http://www.americanlastnames.us/last-names/Croatian/A/A-0.html

### RO - Romanian
* http://www.americanlastnames.us/last-names/Romanian/A/A-0.html
* http://www.20000-names.com/female_romanian_names.htm
* http://www.20000-names.com/male_romanian_names.htm
* http://www.behindthename.com/top/lists/romania/2009
* https://en.wikipedia.org/wiki/Romanian_name
* http://www.metalhead.ro/articole/cele-mai-ciudate-nume-la-romani-aid45874

### SE - Swedish
* http://www.statistikdatabasen.scb.se/pxweb/en/ssd/START__BE__BE0001__BE0001G/BE0001ENamn10/?rxid=08cea6fc-f998-447b-961e-6dab06aa1826
* http://www.statistikdatabasen.scb.se/pxweb/en/ssd/START__BE__BE0001__BE0001G/BE0001FNamn10/?rxid=08cea6fc-f998-447b-961e-6dab06aa1826

### IT - Italian
* https://www.paginebianche.it/A.htm
* https://www.repubblica.it/robinson/2019/05/07/news/appello_per_la_storia_le_firme_dei_lettori_3-225642633/?ref=drac-2
* https://www.istat.it/it/dati-analisi-e-prodotti/contenuti-interattivi/contanomi
* https://www.istat.it/it/files//2015/11/Natalità_fecondita_2014.pdf
* https://it.wikipedia.org/wiki/Prenomi_italiani_(A-L)
* https://it.wikipedia.org/wiki/Prenomi_italiani_(M-Z)
* http://www.gooo.it/nomimas.html
* http://www.gooo.it/nomifem.html
