-----------------------INSTALLATION STEPS-----------------------


1. Unzip the folder containing ATT contents to desired loaction (recommended it is a location 
   easy to access)

2. Download Node.js if it is not already downloaded on your machine (link here---> https://nodejs.org/en/)

3. This program gets its stock data from a 3rd party API named Alphavantage (link here---> https://www.alphavantage.co/support/#api-key)
Go to the provided link and enter your email. This is free of charge and no verification is needed. This will
give you your API key right after entering your email. (they do not send any sort of spam mail).

4. Copy the API key and then open up the unzipped folder where ATT contents is. Look for a .txt file named "alphavantage_key".
Open this empty text file and paste your API key into this text file. Once the API key is pasted you can save and close the file.
 
5. Go to the unzipped folder again and run the batch file named "module_installer" (this will 
   download all of the nessessary node.js modules and shouldn't take that long 1-2 minutes)

6. Once the module_installer is finished it will take a 15 second break and then attempt to start the server.
   (DO NOT close the console window once it says "Server started!" or you will be closing the server and 
   won't be able to access the ATT. You must leave this console window open while using the ATT)

7. At this point the installation is complete

----------------------------------------------------------------
 


----------------------------START UP----------------------------

To access the ATT you must first start the server running on the localhost.

To make this easy I included a batch file named "startATT" that will open a console window and start 
the server for you. Simply double click this file to start the server.

Once the console window says "Server Started!" (in blue), you can now open your browser and go to 
"http://127.0.0.1:1235" or "http://localhost:1235"

You can also navigate to the directory the ATT is loacted on your machine and start it manually by 
running the command "node server.js"

----------------------------------------------------------------