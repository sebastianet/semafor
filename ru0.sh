#!/bin/bash

mydate=`date +"y%Y/m%m/d%d"`
mytime=`date +"h%H:m%M"`

logFN=/home/pi/logs/sem.log
szTxt="("$mydate"-"$mytime") +++ +++ +++ SEMAPHORE starts, logging to ("$logFN")."
logger  -i   -p user.info  $szTxt

sudo  /usr/bin/node  /home/pi/semafor/1_sem.js    >>  $logFN   2>&1   &
