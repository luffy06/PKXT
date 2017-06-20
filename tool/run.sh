logname=`date +%Y-%m-%d`
echo $logname
mkdir ../log
node ../bin/www > ../log/$logname.txt

