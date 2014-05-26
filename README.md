** Notas **
* Si usamos Apache en GNU/Linux necesitamos habilitar los módulos proxy, proxy_http y mod_rewrite con el comando a2enmod.
* En el configuración del sitio, debemos agregar la línea "AllowOverride FileInfo" en la configuración del directorio para permitir el enrutado. Por ejemplo:

        <Directory /home/user/dev/project/www/cdn/>
                AllowOverride FileInfo
                Require all granted
        </Directory>
