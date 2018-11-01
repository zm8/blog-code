Code:
#!/bin/bash
#!/bin/bash
# -------------------------------------------------------------------------- #
# Syntax  : spinning.cursor.sh
# -------------------------------------------------------------------------- #
#set -xv

# start the process that needs the spinning cursor
sleep 10 &
pid=$!



printf "Processing |"
rotate='|/-\'

while kill -n 0 $pid 2>/dev/null; do
    rotate="${rotate#?}${rotate%???}"
    printf '\b%.1s' "$rotate"
    sleep 1
done
echo ''

wait $pid

echo "All done"

exit 0

# -------------------------------------------------------------------------- #
# End