@echo off
cd /d C:\Users\lewow\Documents\Workspace\Testavimas

echo ================================================== >> scheduled-run-log.txt
echo [%date% %time%] Scheduled test run started >> scheduled-run-log.txt

call npx playwright test 1task/tests >> scheduled-run-log.txt 2>&1

echo [%date% %time%] Scheduled test run finished >> scheduled-run-log.txt
echo ================================================== >> scheduled-run-log.txt
echo. >> scheduled-run-log.txt