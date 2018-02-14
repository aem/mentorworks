#!/usr/local/bin/zsh
# ONLY USE THIS IF YOURE ADAM OR IF YOUVE UPLOADED YOUR
# SSH KEY TO PANTHEON, OTHERWISE IT WON'T WORK!¡!
gulp build
rsync -arLvz --size-only --ipv4 --progress -e 'ssh -p 2222' ./build --temp-dir=~/tmp/ dev.9c5fdfca-3e02-4e9a-84a5-0292b8cf6a5a@appserver.dev.9c5fdfca-3e02-4e9a-84a5-0292b8cf6a5a.drush.in:code/wp-content/themes/scout
echo "Deployed"
open "https://dev-mentorworks.pantheonsite.io"
