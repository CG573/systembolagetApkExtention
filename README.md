# systembolagetApkExtention

## description
It replaces the "kr/l" with the APK (ml ethanol per kr) of the selected product on systembolaget.se. Drink smarter, and cheaper.

## what?
On any product page (for a beverage) on [systembolaget.se](https://www.systembolaget.se) you will see a line with the price for one liter of that beverage. But that's not the most useful "bang for your buck" stat. We want how much ethanol we get per swedish krona.

What this extention essentially does is fetch the abv, volume, and price of the product and then replaces the line with kr/l with "((volume * abv) / sek) APK". This means that it will instead display how many milliliters of ethanol you get for each krona spent.

## known bugs
~~when first clicking on a product the APK is displayed properly, however if the page is refreshed it simply shows as "undefined". This may be an issue in when the script is run... honestly idfk. This error does not occur when the inspect menu is open. Which makes this hell to debug.~~ Should be fixed.



~~abv is cast to an integer... ffs...~~



some seemingly random numbers are sometimes added to the start of some APKs. This happens for example with [Weinwurm](https://www.systembolaget.se/produkt/vin/weinwurm-2315301/). Please submit any additional faulty product pages [here](https://forms.gle/f6RsMeme7gchasgv7).

