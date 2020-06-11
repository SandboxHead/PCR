# PCR

## How to run

### [Prerequisite installations][prereq]

* [Docker and Docker compose][docker]:
    - Install: `$ sudo apt install docker.io docker-compose`
    - [Post-installation][postinst]:
    `$ sudo groupadd docker && sudo usermod -aG docker $USER`

* Node.js Runtime and NPM:
    - Install: `$ sudo apt install npm && npm install npm@5.6.0 -g`

* [Fabric Samples Repo, binaries and docker images][sbd]
    - This [script][script] can help:
    `$ curl -sSL https://bit.ly/2ysbOFE | bash -s`

### Get this repo and run

* Clone this repository:
  `$ git clone https://github.com/EnigmaBreaker/PCR && cd PCR`
* Copy `bin/` from fabric samples: `$ cp -r ../fabric-samples/bin/ .`
* Run `start.sh`
* To run commands in the running docker container: `$ docker exec -it cli bash`
* Run `scripts/script.sh` to set up network and install smart contract.

## Important files

[sbd]: https://hyperledger-fabric.readthedocs.io/en/release-2.0/install.html
[prereq]: https://hyperledger-fabric.readthedocs.io/en/release-2.0/prereqs.html
[script]: https://raw.githubusercontent.com/hyperledger/fabric/master/scripts/bootstrap.sh
[docker]: https://docs.docker.com/engine/install/ubuntu/
[postinst]: https://docs.docker.com/engine/install/linux-postinstall/
