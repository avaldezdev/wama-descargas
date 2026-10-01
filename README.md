# Descargas WAMA — descargas.wama.com.py

Portal estático de descargas de las apps complementarias de Wama-SIS. Hoy: **Print Agent**
(`/print-agent`). La web principal `wama.com.py` sigue en Hostinger; este subdominio apunta
por IP al servidor propio (Coolify).

## Cómo se actualiza una versión

**No se toca este sitio.** La página lee la última versión desde GitHub Releases
(`avaldezdev/wama-print-agent-releases`). Para publicar, desde el repo `Print-Agent`:

```bash
node scripts/publicar.mjs --notas "Qué cambió" --notas "Otra novedad"
```

## Deploy (una sola vez)

1. **Coolify:** New Resource → Git Repository → este repo, rama `main`, **Build Pack: Dockerfile**,
   **Port: 80**. Activar auto-deploy al hacer push.
2. **Coolify → Domains:** `https://descargas.wama.com.py`.
3. **Hostinger → Dominios → wama.com.py → DNS:** registro **A**, nombre `descargas`, valor = IP del
   servidor Coolify, TTL por defecto. (No tocar los registros de `@` ni `www`: son la web principal.)
4. Esperar a que propague el DNS y que Coolify emita el certificado SSL.

## Verificar

- [ ] `https://descargas.wama.com.py` abre con candado.
- [ ] `/print-agent` muestra la versión y las novedades (vienen de GitHub).
- [ ] El botón **Descargar para Android** baja el APK.
- [ ] `/print-agent/apk` redirige al último APK.

## Sumar otra descarga

Copiar `print-agent.html` como `<producto>.html`, agregar su tarjeta en `index.html` y su
repo de releases. El `Dockerfile` ya copia todos los `.html`.
