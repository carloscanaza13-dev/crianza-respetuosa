# Crianza Respetuosa - Android App

Asistente IA en Crianza Respetuosa - Herramienta psicoeducativa para padres de niños de 3 a 10 años.

## 🤖 Conexión a IA Real

La app funciona en **modo híbrido**:
- **Con IA real**: Si hay conexión a internet y un servidor configurado
- **Sin IA (fallback)**: Si no hay conexión, usa respuestas predefinidas locales

### Paso 1: Desplegar el Servidor

El servidor con IA está en el proyecto principal. Opciones de despliegue:

#### Opción A: Vercel (Recomendado - Gratis)
```bash
# En la raíz del proyecto Next.js
vercel --prod
```

#### Opción B: Railway, Render, etc.
```bash
# Cualquier plataforma que soporte Next.js
```

### Paso 2: Configurar la URL en la App

Edita `app/src/main/assets/index.html` y cambia:

```javascript
// Línea 739 - Cambia esta URL por la de tu servidor
const API_URL = 'https://tu-servidor.vercel.app/api/chat';
```

### Paso 3: Reconstruir el APK

```bash
cd android-app
./gradlew assembleDebug
```

## 📱 Opciones de Instalación

### Opción 1: PWA (Más Fácil)

La app funciona como Progressive Web App:

1. Abre la aplicación en Chrome (Android)
2. Espera a que cargue completamente
3. Menú (⋮) → "Añadir a pantalla de inicio"

### Opción 2: APK Nativo

#### Requisitos
- Android Studio instalado
- JDK 17 o superior
- Android SDK (API 26+)

#### Pasos

1. **Abrir en Android Studio**
   - File → Open → Selecciona la carpeta `android-app`
   - Espera a que sincronice Gradle

2. **Generar APK**
   - Build → Build Bundle(s) / APK(s) → Build APK(s)
   - El APK estará en: `app/build/outputs/apk/debug/app-debug.apk`

3. **Instalar en dispositivo**
   - Transfiere el APK a tu dispositivo
   - Habilita "Instalar de fuentes desconocidas"
   - Abre el APK e instala

## 🛠️ Estructura del Proyecto

```
android-app/
├── app/src/main/
│   ├── java/com/crianza/respetuosa/
│   │   ├── MainActivity.java      # WebView principal
│   │   └── SplashActivity.java    # Pantalla de inicio
│   ├── assets/index.html          # App completa (HTML/JS/CSS)
│   ├── res/                       # Recursos Android
│   └── AndroidManifest.xml
├── build.gradle
└── settings.gradle
```

## 🎨 Personalización

### Cambiar colores
Edita `res/values/colors.xml`:
```xml
<color name="sage_primary">#5B8C5A</color>
```

### Cambiar iconos
Reemplaza los archivos en `res/mipmap-*/`

## 📋 Características

- ✅ Consulta IA especializada en crianza
- ✅ 6 módulos psicoeducativos
- ✅ Biblioteca de frases modelo
- ✅ Seguimiento de progreso semanal
- ✅ Funciona offline (modo fallback)
- ✅ Diseño responsive
- ✅ Splash screen animado

## 🔧 API Endpoint

El servidor expone:

```
POST /api/chat

Body:
{
  "message": "Mi hijo tiene berrinches",
  "history": [{ "role": "user", "content": "..." }]
}

Response:
{
  "success": true,
  "response": "**💚 Validación para ti**..."
}
```

## ⚠️ Notas Importantes

- La app funciona offline con respuestas locales
- Para IA real, necesitas un servidor desplegado
- Los datos se guardan localmente en el dispositivo
- No requiere permisos especiales

## 🆘 Solución de Problemas

| Problema | Solución |
|----------|----------|
| Gradle sync failed | File → Invalidate Caches → Restart |
| APK no genera | Build → Clean Project → Rebuild |
| App no conecta a IA | Verifica la URL del servidor |
| Error de certificado | Usa HTTPS válido en el servidor |

## 📲 Distribución

1. **Debug APK**: Solo para pruebas
2. **Release APK**: Firmado para distribución
   ```bash
   ./gradlew assembleRelease
   ```
3. **Google Play**: Requiere cuenta de desarrollador ($25 USD)
