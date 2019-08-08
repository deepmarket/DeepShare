# DeepShare
An OpenSource resource sharing platform accompanied by the capability to execute Distributed Tensorflow Programs at a very low cost.

To clone: `git clone --recurse-submodules https://github.com/shared-systems/DeepShare.git`

To build `docker-compose up --build --detach`

To stop `docker-compose down`

To update `git submodule update --recursive --remote`

To clean `docker container prune -f && docker image prune -f && docker network prune -f && docker volume prune -f`

### Potential Problems:
Some of our servers have ran into a problem with apparmor disallowing us to bring down some of the containers we're using. While we look into this issue, there's a [workaround](https://forums.docker.com/t/can-not-stop-docker-container-permission-denied-error/41142/6) that looks like this:
```sh
# Check the status of AppArmor (there should be some comments about the docker user being in `enforce-mode`)
sudo aa-status

# Disable the service
sudo systemctl disable apparmor.service --now

# Make sure it doesn't come back up when the machine restarts (once a permanent solution is found we'll re-roll the system anyways)
sudo service apparmor teardown

# The status should now say that no programs are in `enforce-mode`
sudo aa-status
```
