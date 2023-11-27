**Install NodeJS:** Ensure that NodeJS is installed on the host device. It can be downloaded from https://nodejs.org/en/download.

**Download D-CIDE from GitHub:** Obtain D-CIDE from its GitHub repository at https://github.com/lukasgrant3102/D-CIDE.

**Place Downloaded Files:** After downloading, place the D-CIDE folder anywhere on the machine.

**Modify the index.js File:** Locate the index.js file within the D-CIDE folder and open it for editing.

**Set the IP and Port:**

-Find the lines beginning with let ip = … and let PORT = … towards the bottom of the index.js file.

-Set the PORT variable to an open port on your network.

Find the host device’s IPv4 address:

--On Windows: Open Command Prompt and type ipconfig.

--On Mac: Go to “Network” settings in System Settings, click “Properties”, and locate the IPv4 address.

-Update the ip variable in the index.js file with this IPv4 address.

**Run D-CIDE.bat:** Execute the D-CIDE.bat file located within the folder. This will start the server.

Access the Tool: The console will display a URL. Users should navigate to this URL to use the tool.
