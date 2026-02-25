# 📱 Crianza Respetuosa - Instrucciones de Instalación

## 🎯 Opción 1: Instalar como PWA (Más Fácil - Recomendada)

La aplicación es una **Progressive Web App (PWA)** que puedes instalar directamente desde el navegador:

### En Android (Chrome):
1. Abre Chrome en tu dispositivo
2. Ve a la URL de la aplicación
3. Espera a que cargue completamente
4. Toca el menú ⋮ (tres puntos arriba a la derecha)
5. Selecciona **"Añadir a pantalla de inicio"** o **"Instalar aplicación"**
6. Confirma la instalación
7. ¡Listo! El ícono aparecerá en tu pantalla de inicio

### En iOS (Safari):
1. Abre Safari en tu iPhone/iPad
2. Ve a la URL de la aplicación
3. Toca el botón de compartir (cuadrado con flecha hacia arriba)
4. Selecciona **"Añadir a pantalla de inicio"**
5. Escribe un nombre para la app
6. Toca **"Añadir"**

### Ventajas de PWA:
- ✅ No requiere APK
- ✅ Se actualiza automáticamente
- ✅ Funciona offline
- ✅ Ocupa menos espacio
- ✅ Funciona en cualquier dispositivo

---

## 🔧 Opción 2: Compilar APK con Android Studio

Si necesitas un APK instalable, sigue estos pasos:

### Requisitos:
- **Android Studio** instalado (última versión)
- **JDK 17** o superior
- Conexión a internet

### Pasos:

#### 1. Descargar el Proyecto Android
El archivo `CrianzaRespetuosa-Android.zip` está en la carpeta `/dist/`

#### 2. Descomprimir el proyecto
```bash
unzip CrianzaRespetuosa-Android.zip
```

#### 3. Abrir en Android Studio
- Abre Android Studio
- Selecciona **File → Open**
- Navega a la carpeta `android-app` descomprimida
- Clic en **OK**

#### 4. Sincronizar Gradle
- Android Studio detectará automáticamente el proyecto
- Espera a que termine la sincronización
- Si hay errores, clic en **"Sync Project with Gradle Files"**

#### 5. Generar APK
- Menú **Build → Build Bundle(s) / APK(s) → Build APK(s)**
- Espera a que compile (puede tomar unos minutos)
- Cuando termine, aparecerá una notificación
- Clic en **"locate"** para encontrar el APK

#### 6. Instalar en tu dispositivo
**Opción A - Via USB:**
- Habilita "Depuración USB" en tu dispositivo
- Conecta tu dispositivo a la PC
- En Android Studio: **Run → Run 'app'**

**Opción B - Transferencia directa:**
- Transfiere el APK a tu dispositivo
- En tu dispositivo, ve a Configuración → Seguridad
- Habilita "Instalar de fuentes desconocidas"
- Abre el archivo APK con el gestor de archivos
- Toca **"Instalar"**

---

## 📂 Estructura del Proyecto Android

```
android-app/
├── app/
│   ├── src/main/
│   │   ├── java/com/crianza/respetuosa/
│   │   │   ├── MainActivity.java      # Actividad principal
│   │   │   └── SplashActivity.java    # Pantalla de bienvenida
│   │   ├── assets/
│   │   │   └── index.html             # App HTML/JS completa
│   │   ├── res/
│   │   │   ├── layout/                # Layouts XML
│   │   │   ├── values/                # Strings y colores
│   │   │   ├── drawable/              # Iconos vectoriales
│   │   │   └── mipmap-*/              # Iconos de la app
│   │   └── AndroidManifest.xml
│   └── build.gradle
├── build.gradle
├── settings.gradle
└── README.md
```

---

## 🎨 Personalizar la App

### Cambiar colores:
Edita `app/src/main/res/values/colors.xml`

### Cambiar nombre:
Edita `app/src/main/res/values/strings.xml`

### Cambiar iconos:
1. Crea iconos PNG en los tamaños: 48, 72, 96, 144, 192 px
2. Colócalos en las carpetas `mipmap-*` correspondientes

### Conectar con servidor online:
Edita `MainActivity.java`:
```java
private static final String APP_URL = "https://tu-servidor.com";
```

---

## ⚠️ Solución de Problemas

### Error: "SDK not found"
1. Abre Android Studio
2. Ve a **Tools → SDK Manager**
3. Descarga Android SDK 34

### Error: "Gradle sync failed"
1. File → Invalidate Caches / Restart
2. O actualiza Gradle en `gradle-wrapper.properties`

### Error: "Failed to install APK"
1. Verifica que la depuración USB esté habilitada
2. Desinstala versiones anteriores de la app
3. Habilita "Instalar de fuentes desconocidas"

### La app no carga
1. Verifica la conexión a internet
2. Si usas versión offline, asegúrate de que `index.html` esté en `assets/`

---

## 📊 Para Investigación Académica

La aplicación incluye:
- Registro anónimo de participantes
- Evaluaciones pre/post intervención
- Exportación de datos en JSON y CSV
- Métricas de uso para estudios cuasi-experimentales

---

## 📞 Soporte

Si tienes problemas técnicos:
1. Consulta la documentación de Android Studio
2. Verifica que tengas la última versión del SDK
3. Intenta limpiar el proyecto: Build → Clean Project

---

## ✅ Funcionalidades Incluidas

- 🤖 Consulta IA especializada en crianza
- 📚 6 módulos psicoeducativos
- 💬 Biblioteca de frases modelo
- 📈 Seguimiento de progreso semanal
- 🔒 Funciona offline (versión completa embebida)
- 🎨 Diseño profesional y responsive
- 📱 Splash screen animado
- 🌐 PWA instalable desde navegador
