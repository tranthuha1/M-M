FROM ipcam.vivas.vn:5086/nginx_run_v:2.1
ADD ./.nginx.default.conf /etc/nginx/conf.d/default.conf
ADD ./dist /usr/share/nginx/html
