# Installation on Docker

WSTUN repositoriy:
 * [x86_64](https://hub.docker.com/r/mdslab/wstun/)

MDSLAB Docker Hub [webpage](https://hub.docker.com/r/mdslab/)

## Requirements

* Docker! Follow the official [guides](https://docs.docker.com/install/)

## Get container

Create container editing the following command substituting <PARAMETERS> with those one specified [here](https://github.com/MDSLab/wstun#usage-from-command-line:)
```
docker run  -d --name=wstun -p 8080:8080 mdslab/wstun <PARAMETERS>
```