#!/bin/bash

echo -e "\033[0;35m░▒█▀▀▀░█░░░▀░░▀█▀░█▀▀░█░█░░░▒█▀▀▄░▒█▀▀█\n░▒█▀▀▀░█░░░█▀░░█░░█▀▀░▄▀▄░░░▒█▄▄▀░▒█▄▄█\n░▒█▄▄▄░▀▀░▀▀▀░░▀░░▀▀▀░▀░▀░░░▒█░▒█░▒█░░░\033[0m"


if [[ $EUID -eq 0 ]]
then
    if ping -q -c 1 -w 1 8.8.8.8 > /dev/null
    then
        echo "Connection State Up...Proceeding..."
        
        # Install curl if not installed
        if ! command -v curl &> /dev/null
        then
            echo "curl not found, installing..."
            sudo apt-get update && sudo apt-get install -y curl
        fi
        
        # Install nvm if not installed
        if ! command -v nvm &> /dev/null
        then
            echo "nvm not found, installing..."
            curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.38.0/install.sh | bash
            source ~/.bashrc
        fi
        
        # Install latest Node.js if not installed
        if ! command -v node &> /dev/null
        then
            echo "Node.js not found, installing..."
            nvm install node
        fi
        
        # Install dependencies
        if ! command -v npm &> /dev/null
        then
            echo "npm not found, installing..."
            sudo apt-get update && sudo apt-get install -y npm
        fi

        if ! command -v jq &> /dev/null
        then
            echo "jq not found, installing..."
            sudo apt-get update && sudo apt-get install -y jq
        fi
        
        # Check for vulnerabilities
        audit_output=$(npm audit --json)
        audit_vulnerabilities=$(echo $audit_output | jq -r '.metadata.vulnerabilities."total"')
  
        if [ $audit_vulnerabilities -gt 0 ]; then
            echo "Found $audit_vulnerabilities vulnerabilities. Running 'npm audit fix'..."
    
            # Fix vulnerabilities
            npm audit fix --only=prod --force
    
            echo "Vulnerabilities fixed."
        else
            echo "No vulnerabilities found."
        fi
        
        echo "To proceed make sure you have updated all necessary details in '.env' and 'config.json'(y/n)"
        read decision

        if [ $decision == "y" ]
        then
            # Start Discord bot
            node .
        else
            echo "Aborted."
        fi

    else
        echo "No Internet Connection"
    fi    

else
    echo "Need sudo permissions to operate or run as root"
fi


# IF YOU GET ERROR "Error: Cannot find module 'node:events'" IT IS POSSIBILY THAT NODE VERSION
# IN ROOT USER IN LOW I.E BELOW VERSION 16
# CHECK USING sudo node -v
# OR ELSE JUST RUN WITHOUT start.sh (use node .)
