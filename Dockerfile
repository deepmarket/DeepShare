FROM ubuntu:latest
RUN apt-get update && apt-get install wget -y && apt-get install tar -y && apt install openjdk-8-jre-headless -y
RUN wget -P /home/Documents/ https://www-us.apache.org/dist/spark/spark-2.4.3/spark-2.4.3-bin-hadoop2.7.tgz
RUN tar -zxC /home/Documents/ -f /home/Documents/spark-2.4.3-bin-hadoop2.7.tgz 
ENV SPARK_HOME=/home/Documents/spark-2.4.3-bin-hadoop2.7
RUN ${SPARK_HOME}/sbin/start-slave.sh spark://131.252.209.102:8989

