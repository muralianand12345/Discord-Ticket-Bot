if [[ $EUID -eq 0 ]]
then
    if ping -q -c 1 -w 1 8.8.8.8 > /dev/null
    then
        echo "Connection State Up...Proceeding..."
        sudo apt update && sudo apt install nodejs npm -y && sudo npm i
        echo "To proceed make sure you have updated all necessary details in '.env' and 'config.json'(y/n)"
        read decision

        if [ $decision == "y" ]
        then
            sudo node .
        else
            exit "Aborted"
        fi

    else
        echo "No Internet Connection"
    fi    

else
    echo "Need sudo permissions to operate or run as root"
fi
