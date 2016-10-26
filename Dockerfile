FROM python:3.6

RUN curl -sL https://deb.nodesource.com/setup_4.x | bash -
RUN apt-get -y install nodejs
RUN apt-get -y install libcairo-dev

#RUN pip install virtualenv

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

COPY requirements.txt /usr/src/app/
RUN pip install --no-cache-dir -r requirements.txt

COPY . /usr/src/app

#ENTRYPOINT ["./docker-entrypoint"]
