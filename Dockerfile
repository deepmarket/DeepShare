FROM ubuntu:16.04
RUN apt-get update && apt-get install wget -y 
RUN apt-get install tar -y
#RUN wget -P ~/Documents/ http://apache.mirrors.hoobly.com/spark/spark-2.4.0/spark-2.4.0-bin-hadoop2.7.tgz
RUN wget -P /home/$USER/Documents/ http://apache.mirrors.hoobly.com/spark/spark-2.4.0/spark-2.4.0-bin-hadoop2.7.tgz
Run ls
RUN tar zxvf /home/$USER/Documents/spark-2.4.0-bin-hadoop2.7.tgz -C /tmp/
RUN ls
RUN apt install openjdk-8-jre-headless -y
RUN mv /tmp/spark-2.4.0-bin-hadoop2.7 /home/$USER/Documents/
#RUN ls /home/$USER/Documents/
ENV SPARK_HOME=/home/$USER/Documents/spark-2.4.0-bin-hadoop2.7
RUN $SPARK_HOME/sbin/start-slave.sh
