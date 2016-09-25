#!/bin/bash
# echo "start..."
# SOURCE="${BASH_SOURCE[0]}"
# echo $SOURCE
# while [ -h "$SOURCE" ]; do # resolve $SOURCE until the file is no longer a symlink
#   DIR="$( cd -P "$( dirname "$SOURCE" )" && pwd )"
#   SOURCE="$(readlink "$SOURCE")"
#   [[ $SOURCE != /* ]] && SOURCE="$DIR/$SOURCE" # if $SOURCE was a relative symlink, we need to resolve it relative to the path where the symlink file was located
# done
# basedir="$( cd -P "$( dirname "$SOURCE" )" && pwd )"
# echo $basedir


# case `uname` in
#     *CYGWIN*) basedir=`cygpath -w "$basedir"`;;
# esac

# if [ -x "$basedir/node" ]; then
#   "$basedir/node"  "$basedir/scripts/setupssh.js" "$1"
#   . "/tmp/envVar.sh"
#   ret=$?
# else 
#   node  "$basedir/scripts/setupssh.js" "$1"
#   . "/tmp/envVar.sh"
#   ret=$?
# fi
# exit $ret

#!/bin/sh
basedir='/home/jenkins/workspace/testJob'
node "$basedir/scripts/setupssh.js" "$SSH_CREDENTIALID"
ret=$?
if [ $ret -ne 0 ]; then
  exit $ret
fi
. /tmp/envVar.sh > /dev/null 2>&1
