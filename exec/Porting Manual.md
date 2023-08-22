# RealCart Porting Manual
- [Web FrontEnd](#web-frontend)
- [Web BackEnd](#web-backend)
- [Signaling Server](#signal-server)
- [Game Server](#game-server)
- [IOT](#iot)
- [Scenario](https://lab.ssafy.com/s08-webmobile3-sub2/S08P12A403/-/blob/master/exec/%EC%8B%9C%EC%97%B0_%EC%8B%9C%EB%82%98%EB%A6%AC%EC%98%A4.png)

## Web FrontEnd
---
### What you need
- Visual Studio Code 1.75.1
- npm 8.1.2
- Node 16.13.2

### Dependencies
	"@emotion/react": "^11.10.5",
    "@emotion/styled": "^11.10.5",
    "@fontsource/roboto": "^4.5.8",
    "@material-ui/core": "^4.12.4",
    "@mui/icons-material": "^5.11.0",
    "@mui/joy": "^5.0.0-alpha.65",
    "@mui/material": "^5.11.4",
    "@mui/x-data-grid": "^5.17.19",
    "@reduxjs/toolkit": "^1.9.1",
    "@testing-library/jest-dom": "^5.16.5",
    "@testing-library/react": "^13.4.0",
    "@testing-library/user-event": "^13.5.0",
    "axios": "^1.2.3",
    "bootstrap": "^5.2.3",
    "draft-js": "^0.11.7",
    "draftjs-to-html": "^0.9.1",
    "express": "^4.18.2",
    "freeice": "^2.2.2",
    "immutable": "^4.2.2",
    "isomorphic-ws": "^5.0.0",
    "js-cookie": "^3.0.1",
    "kurento-utils": "^6.18.0",
    "net": "^1.0.2",
    "prop": "^0.1.1",
    "prop-types": "^15.8.1",
    "query-string": "^8.1.0",
    "react": "^18.2.0",
    "react-bootstrap": "^2.7.0",
    "react-dev-utils-3.3.0-bug-fixed-version": "github:WoolimRyu/react-dev-utils-3.3.0-bug-fixed-version",
    "react-dom": "^18.2.0",
    "react-draft-wysiwyg": "^1.15.0",
    "react-redux": "^8.0.5",
    "react-router-dom": "^6.6.2",
    "react-scripts": "5.0.1",
    "redux-thunk": "^2.4.2",
    "socket.io": "^4.5.4",
    "socket.io-client": "^4.5.4",
    "tar": "^6.1.13",
    "stompjs": "^2.3.3",
    "types": "^0.1.1",
    "web-vitals": "^2.1.4",
    "ws": "^8.12.0"

### package.json
---

### 환경변수
.env.development :  
// 개발 전용 백엔드 및 미디어 서버 URL  
REACT_APP_BACKEND_URL  
REACT_APP_MEDIA_URL  

.env.production :  
// 빌드 전용 백엔드 및 미디어 서버 URL(NGINX 프록시 반영)  
REACT_APP_BACKEND_URL  
REACT_APP_MEDIA_URL  


--- 

## NGINX
---
```
server {
    server_name  i8a403.p.ssafy.io;

    location /api/ {
        proxy_pass http://13.125.13.39:8060/;
    }

    location / {
        root   /home/ubuntu/ssafy/S08P12A403/Frontend/build;
        index  index.html index.htm;
        try_files $uri $uri/ /index.html;
    }

    error_page   500 502 503 504  /50x.html;
    location = /50x.html {
        root   /usr/share/nginx/html;
    }

    listen 443 ssl; # managed by Certbot
    ssl_certificate /etc/letsencrypt/live/i8a403.p.ssafy.io/fullchain.pem; # managed by Certbot
    ssl_certificate_key /etc/letsencrypt/live/i8a403.p.ssafy.io/privkey.pem; # managed by Certbot
    include /etc/letsencrypt/options-ssl-nginx.conf; # managed by Certbot
    ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem; # managed by Certbot

}

server {
    if ($host = i8a403.p.ssafy.io) {
        return 301 https://$host$request_uri;
    } # managed by Certbot


    listen       80;
    server_name  i8a403.p.ssafy.io;
    return 404; # managed by Certbot

}

server {

        listen 8581 ssl;  # websocket for player 1

        server_name i8a403.p.ssafy.io;

        ### ssl 인증서 관련 코드 ####
        ssl_certificate /etc/letsencrypt/live/i8a403.p.ssafy.io/fullchain.pem; # managed by Certbot
        ssl_certificate_key /etc/letsencrypt/live/i8a403.p.ssafy.io/privkey.pem; # managed by Certbot

        location / {
                proxy_pass http://localhost:8886/; #실제 채팅서버의 아이피와 포트
                proxy_set_header X-Real-IP $remote_addr;
                proxy_set_header Host $http_host;
                proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
                proxy_http_version 1.1;
                proxy_set_header Upgrade $http_upgrade;
                proxy_set_header Connection "Upgrade";
                proxy_set_header Accept-Encoding "";
        }
}

server {

        listen 8582 ssl;  # websocket for player 2

        server_name i8a403.p.ssafy.io;

        ssl_certificate /etc/letsencrypt/live/i8a403.p.ssafy.io/fullchain.pem; # managed by Certbot
        ssl_certificate_key /etc/letsencrypt/live/i8a403.p.ssafy.io/privkey.pem; # managed by Certbot

        location / {
                proxy_pass http://localhost:8887/; #실제 채팅서버의 아이피와 포트
                proxy_set_header X-Real-IP $remote_addr;
                proxy_set_header Host $http_host;
                proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
                proxy_http_version 1.1;
                proxy_set_header Upgrade $http_upgrade;
                proxy_set_header Connection "Upgrade";
                proxy_set_header Accept-Encoding "";
        }
}

server {

        listen 8070 ssl;

        server_name i8a403.p.ssafy.io;

        ### ssl 인증서 관련 코드 ####
        ssl_certificate /etc/letsencrypt/live/i8a403.p.ssafy.io/fullchain.pem; # managed by Certbot
        ssl_certificate_key /etc/letsencrypt/live/i8a403.p.ssafy.io/privkey.pem; # managed by Certbot

        location / {
                proxy_pass http://localhost:8090/; #실제 채팅서버의 아이피와 포트
                proxy_set_header X-Real-IP $remote_addr;
                proxy_set_header Host $http_host;
                proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
                proxy_http_version 1.1;
                proxy_set_header Upgrade $http_upgrade;
                proxy_set_header Connection "Upgrade";
                proxy_set_header Accept-Encoding "";
                proxy_connect_timeout 36000s;
                proxy_send_timeout 36000s;
                proxy_read_timeout 36000s;
        }
}
```


## Web BackEnd
---
### What you need
- STS or Intellij (I am using both STS Version 3 and Intellij IDEA 2021.2)
- Java 11
- Springboot Version 2.7.7
- Gradle 7.6

### Dependencies
	implementation 'org.springframework.boot:spring-boot-starter-data-jpa'
	implementation 'org.springframework.boot:spring-boot-starter-data-redis'
	implementation 'org.springframework.boot:spring-boot-starter-mail'
	implementation 'org.springframework.boot:spring-boot-starter-security'
	implementation 'org.springframework.boot:spring-boot-starter-oauth2-client'
	implementation 'org.springframework.boot:spring-boot-starter-validation'
	implementation 'org.springframework.boot:spring-boot-starter-web'
	implementation 'org.springframework.boot:spring-boot-starter-websocket'
	implementation 'org.springframework.boot:spring-boot-starter-test'
	implementation 'org.springframework.boot:spring-boot-starter-actuator'
	implementation 'org.springdoc:springdoc-openapi-ui:1.6.14'
	implementation 'io.jsonwebtoken:jjwt-api:0.11.2'
	implementation 'com.google.code.gson:gson:2.10.1'
	implementation 'io.micrometer:micrometer-registry-prometheus:1.10.3'
	compileOnly 'org.projectlombok:lombok'
	runtimeOnly 'com.mysql:mysql-connector-j'
	runtimeOnly 'io.jsonwebtoken:jjwt-impl:0.11.2'
	runtimeOnly 'io.jsonwebtoken:jjwt-jackson:0.11.2'
	annotationProcessor 'org.projectlombok:lombok'
	testImplementation 'org.springframework.boot:spring-boot-starter-test'
	testImplementation 'org.springframework.security:spring-security-test'

### Application.yml
---
#### JPA (Case Sensitivity)
- jpa.hibernate.namig.physical-strategy: org.hibernate.boot.model.naming.PhysicalNamingStrategyStandardImpl 
#### Mail (Sending Email via GMail)
- mail.host: smtp.gmail.com
- mail.username: {YOUR_EMAIL}
- mail.port: 587
- mail.properties.mail.smtp.starttls.enable: true
- mail.properties.mail.smtp.timeout: 5000
- mail.properties.mail.smtp.auth: true
- mail.properties.mail.smtp.password: {YOUR_PASSWORD}
#### Spring Security (OAUTH2)
- security.oauth2.client.registration.google.clientId: {YOUR_ID}
- security.oauth2.client.registration.google.clientSecret: {YOUR_PASSWORD}
- security.oauth2.client.registration.google.scope: email, profile
- security.oauth2.client.registration.google.redirect-uri: {YOUR_REDIRECT_ADDRESS}
#### JWT
- app.auth.tokenSecret: {YOUR_TOKEN_SECRET}
- app.auth.tokenExpiry: {ACCESS_TOKEN_EXPIRY}
- app.auth.tokenSecret: {REFRESH_TOKEN_EXPIRY}
- app.oauth2.authorizedRedirectUris: {YOUR_AUTHORIZED_URIS}
- jwt.secret: {YOUR_JWT_SECRET}
#### MatterMost Notification
- notification.mattermost.webhook-url: {YOUR_WEBHOOK_URL}
- notification.mattermost.enabled: true
#### CORS
- cors.allowed-origins: {YOUR_ALLOWED_ORIGINS}
- cors.allowed-methods: {YOUR_ALLOWED_METHODS}
- cors.allowed-headers: {Your_ALLOWED_HEADERS}
- cors.max-age {MAX_AGE}

### Third Party Apps
| App | Reference |
|-----|----|
|Gmail|https://support.google.com/a/answer/176600?hl=en|
|Google OAUTH2|https://developers.google.com/identity/openid-connect/openid-connect|
|MatterMost|https://developers.mattermost.com/integrate/webhooks/incoming|


### DB
We use MySql version 8.0.31
[Dump Files](https://lab.ssafy.com/s08-webmobile3-sub2/S08P12A403/-/tree/master/exec/Dump)

## Signal Server
---
### What you need
- STS or Intellij (I am using both STS Version 3 and Intellij IDEA 2021.2)
- Java 11
- Springboot Version 2.7.8
- Gradle 7.6

### Dependencies
	implementation 'org.springframework.boot:spring-boot-starter-aop'
	implementation 'org.springframework.boot:spring-boot-starter-web'
	implementation 'org.springframework.boot:spring-boot-starter-websocket'
	implementation 'org.springframework.boot:spring-boot-starter-validation'
	implementation 'org.kurento:kurento-client:6.18.0'
	testImplementation 'org.springframework.boot:spring-boot-starter-test'
	compileOnly 'org.projectlombok:lombok'
	annotationProcessor 'org.projectlombok:lombok'

### Application.yml
#### MatterMost
Same as MatterMost Setting in Web BackEnd

### [Media Server Install Guide](#https://doc-kurento.readthedocs.io/en/latest/user/installation.html)

### Notice
Signal Server must be with Media Server

## Game Server
---
### What you need
- Intellij (Intellij IDEA 2021.2)
- Java 11
- Gradle 7.6

### Dependencies
	implementation 'org.java-websocket:Java-WebSocket:1.5.3'
    implementation 'org.slf4j:slf4j-api:2.0.6'
    implementation 'javax.xml.bind:jaxb-api:2.2.4'
    implementation 'com.google.code.gson:gson:2.8.9'
    testImplementation 'org.slf4j:slf4j-simple:2.0.6'
    testImplementation 'org.junit.jupiter:junit-jupiter-api:5.8.1'
    testRuntimeOnly 'org.junit.jupiter:junit-jupiter-engine:5.8.1'

