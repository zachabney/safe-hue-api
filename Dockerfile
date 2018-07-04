FROM node:alpine

ADD crontab.txt /crontab.txt
COPY . /root
RUN apk update && apk add tzdata &&\
    cp /usr/share/zoneinfo/America/Chicago /etc/localtime &&\
    echo "America/Chicago" > /etc/timezone &&\
    apk del tzdata && rm -rf /var/cache/apk/*
RUN /usr/bin/crontab /crontab.txt

CMD ["/usr/sbin/crond", "-f"]