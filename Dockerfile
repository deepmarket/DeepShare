FROM ubuntu:16.04
RUN apt-get update && apt-get install wget -y 
RUN apt-get install tar -y
#RUN wget -P ~/Documents/ http://apache.mirrors.hoobly.com/spark/spark-2.4.0/spark-2.4.0-bin-hadoop2.7.tgz
<<<<<<< HEAD
RUN wget -P /home/newslab/Documents/ http://apache.mirrors.hoobly.com/spark/spark-2.4.0/spark-2.4.0-bin-hadoop2.7.tgz
Run ls
RUN tar zxvf /home/newslab/Documents/spark-2.4.0-bin-hadoop2.7.tgz -C /tmp/
RUN ls
RUN apt install openjdk-8-jre-headless -y
RUN mv /tmp/spark-2.4.0-bin-hadoop2.7 /home/newslab/Documents/
RUN ls /home/newslab/Documents/
ENV SPARK_HOME=/home/newslab/Documents/spark-2.4.0-bin-hadoop2.7
#RUN ls /home/
=======
RUN wget -P /home/$USER/Documents/ http://apache.mirrors.hoobly.com/spark/spark-2.4.0/spark-2.4.0-bin-hadoop2.7.tgz
Run ls
RUN tar zxvf /home/$USER/Documents/spark-2.4.0-bin-hadoop2.7.tgz -C /tmp/
RUN ls
RUN apt install openjdk-8-jre-headless -y
RUN mv /tmp/spark-2.4.0-bin-hadoop2.7 /home/$USER/Documents/
#RUN ls /home/$USER/Documents/
ENV SPARK_HOME=/home/$USER/Documents/spark-2.4.0-bin-hadoop2.7
>>>>>>> 7fea6876eea99e3122fb34eba8317c8f009dfddf
RUN $SPARK_HOME/sbin/start-slave.sh
