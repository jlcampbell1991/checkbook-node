FROM heroku/heroku:20

# Dependencies for running container as normal user like in production
RUN useradd --create-home --home-dir /app --shell /bin/bash web-app \
  && chown -R web-app:web-app /app \
  || echo "web-app user already exists"

# Dependencies similar to using heroku/nodejs buildpack
ENV APT_KEY_DONT_WARN_ON_DANGEROUS_USAGE=1
RUN dpkg-query -W -f'${Status}' nodejs 2>/dev/null | grep -q "ok installed" \
  || curl -sL https://deb.nodesource.com/setup_14.x | bash -
RUN echo 'debconf debconf/frontend select Noninteractive' | debconf-set-selections
RUN apt-get install dialog apt-utils -y
RUN dpkg-query -W -f'${Status}' nodejs 2>/dev/null | grep -q "ok installed" \
  || apt-get install -y nodejs
RUN apt-get install g++ -y

USER web-app
WORKDIR /app

COPY ./package*.json ./
RUN npm ci