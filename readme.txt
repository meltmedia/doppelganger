doppelgänger - a web service cloning tool for great justice

############################################################
## brought to you by Meltmedia (http://www.meltmedia.com) ##
############################################################

## TAO

  "Roffel I Can't Believe This Thing Works!"
  1. sudo node bin/observer.js 
       --host=<SOME WEBSERVICE HOST>
       --proxyPort=80 --secureProxyPort=443
  2. run your integration test of manual exercise against localhost
  3. CTRL+C to end the observation and generate observations.json
  π. manually edit bin/doppelgänger.js to "do the right thing"
     ^^^ ZOMG I CAN'T BELIVE THAT'S A STEP ROFFEL! ^^^
  4. sudo node bin/doppelgänger.js
  5. run your client app against localhost
  6. PROFIT!!11!two!111!11

  "The `Right` Way" (patent pending)
    I'm working on this. See the MANual below for a hint as to
    what is coming!

## MAN
  common arguments
    --quiet -q
    --verbose
    --version -v
    --help -h

  doppelganger observe
    --host -h
    --port=<PORT> -p <PORT> (80)
    --secure-port=<PORT> -sp <PORT> (443)
    --proxy-port=<PORT> -pp <PORT> (80)
    --secure-proxy-port=<PORT> -spp <PORT> (443)
    --write=<PATH> -w <PATH> (observations.json)

  doppelganger serve
    --observations=<PATH> -o <PATH> (observations.json)
    --ssl-key -sk (ssl/key.pem)
    --ssl-cert -sc (ssl/cert.pem)
    --match-method --ignore-method (match)
    --match-url --ignore-url (match)
    --match-body --ignore-body (ignore)
    --match-body-json-path=<JSONPATH>
    --match-all-parameters -map
    --match-parameter=<PARAMETER> -mp <PARAMETER>
    --favor-success
    --global-series
    --series=<METHOD>@<URL>
    --script=<SCRIPT> -s <SCRIPT>

### CONTRIBUTION
bug reports and pull requests gladly accepted through github

### CREDITS
created by Kyle W. Cartmell (kyle.cartmell@meltmedia.com) for Meltmedia

### LICENSE
distributed under the terms of the General Public License version 2.0
see license.txt for details

### ROADMAP
- implement a pleasing user experience
- refactoring and testing
- polishing