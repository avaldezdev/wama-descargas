# Descargas WAMA — descargas.wama.com.py

Portal estático de descargas de las apps complementarias de Wama-SIS. Hoy: **Print Agent para
Android** (`/print-agent`) y **Print Agent para Windows** (`/print-agent-windows`). La web principal `wama.com.py` sigue en Hostinger; este subdominio apunta
por IP al servidor propio (Coolify).

## Cómo se actualiza una versión

**No se toca este sitio.** La página lee la última versión desde GitHub Releases
(`avaldezdev/wama-print-agent-releases`). Para publicar, desde el repo `Print-Agent`:

```bash
node scripts/publicar.mjs --notas "Qué cambió"            # Android (release vX.Y.Z, "latest")
node scripts/publicar-windows.mjs --notas "Qué cambió"    # Windows (release windows-vX.Y.Z, NO latest)
```

La página de Android usa `/releases/latest` y la de Windows busca el release más nuevo con
etiqueta `windows-v*`. Por eso los releases de Windows nunca se marcan como "latest".

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
- [ ] `/print-agent-windows` muestra la versión de Windows y el botón baja el instalador.
- [ ] `/windows` y `/print-agent/windows` redirigen a `/print-agent-windows`.

## Sumar otra descarga

Copiar `print-agent.html` como `<producto>.html`, agregar su tarjeta en `index.html` y su
repo de releases. El `Dockerfile` ya copia todos los `.html`.
