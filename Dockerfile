FROM ubuntu:16.04
RUN apt-get update && apt-get install wget -y 
RUN apt-get install tar -y
#RUN wget -P ~/Documents/ http://apache.mirrors.hoobly.com/spark/spark-2.4.0/spark-2.4.0-bin-hadoop2.7.tgz
RUN wget -P=/spark/ https://www-eu.apache.org/dist/spark/spark-2.4.0/spark-2.4.0-bin-hadoop2.7.tgz
RUN tar -xvzf /spark/spark-2.4.0-bin-hadoop2.7.tgz
#RUN rm ~/Documents/spark-2.4.0-bin-hadoop2.7
RUN apt install openjdk-8-jre-headless -y
RUN ls /spark/spark-2.4.0-bin-hadoop2.7/
ENV SPARK_HOME=/spark/spark-2.4.0-bin-hadoop2.7
RUN $SPARK_HOME/sbin/start-slave.sh
