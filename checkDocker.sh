if [ -x "$(command -v docker)" ]; then
    #echo "Update docker"
    # command
    #sudo apt-get update
    # remove the old
    #sudo apt-get purge lxc-docker*
    #install the new
    #sudo apt-get install docker-engine
else
    #echo "Install docker"
    # command
    curl -fsSL https://get.docker.com -o get-docker.sh
    sh get-docker.sh
fi

build image docker build —tag= image-name .
