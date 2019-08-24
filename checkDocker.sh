if [ -x "$(command -v docker)" ]; then
    echo "Docker is already installed"
    # command
    #sudo apt-get update
    # remove the old
    #sudo apt-get purge lxc-docker*
    #install the new
    #sudo apt-get install docker-engine
else
    echo "Install docker"
    # command
    curl -fsSL https://get.docker.com -o get-docker.sh
    sh get-docker.sh
fi

docker build -t deepmarket-spark:latest .
