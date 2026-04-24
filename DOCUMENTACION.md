# Documentación de Desarrollo: Carrito Seguidor App 🚗📱

Este documento detalla el proceso de desarrollo, arquitectura y características técnicas de la aplicación móvil desarrollada por el **Equipo Dinastía**, diseñada como complemento digital para el proyecto del carrito seguidor de línea.

---

## 1. Objetivo del Proyecto 🎯

El objetivo principal fue desarrollar una aplicación móvil funcional e intuitiva que sirva como bitácora interactiva y presentación digital del proyecto físico (el carrito seguidor de línea). La app permite visualizar de manera organizada la información técnica, lógica, visual y funcional del prototipo.

## 2. Tecnologías Utilizadas 🛠️

La aplicación fue construida utilizando un stack moderno enfocado en rendimiento y diseño fluido:

*   **Framework Principal:** React Native (Framework multiplataforma para aplicaciones nativas).
*   **Entorno de Desarrollo:** Expo (Facilita el desarrollo, testeo y construcción final del APK).
*   **Navegación:** React Navigation (`@react-navigation/native`, `stack`, `bottom-tabs`). Se implementó una arquitectura de navegación híbrida (Stack + Tabs).
*   **Manejo de Multimedia:** `expo-av` para la reproducción fluida de videos de evidencia.
*   **Diseño y UI:** `expo-linear-gradient` para fondos degradados, `expo-font` para tipografías, e iconos vectoriales (`@expo/vector-icons`).
*   **Animaciones:** API nativa `Animated` de React Native (utilizada en el efecto de máquina de escribir, tarjetas 3D y transiciones de desvanecimiento).

## 3. Arquitectura y Estructura del Código 📂

Para mantener el proyecto escalable y ordenado, el código fuente se estructuró siguiendo el patrón de diseño basado en componentes:

```text
Carrito/
├── assets/                 # Recursos multimedia (imágenes, logos, videos locales)
├── src/
│   ├── components/         # Componentes reutilizables de UI
│   │   ├── FadeInView.js   # Animación de aparición progresiva
│   │   ├── Typewriter.js   # Efecto de máquina de escribir en textos
│   │   └── Tutorial.js     # Componente complejo de tarjetas deslizables
│   ├── navigation/         # Configuración de rutas
│   │   └── MainTabs.js     # Configuración del Bottom Tab Navigator
│   └── screens/            # Vistas principales de la aplicación
│       ├── HomeScreen.js   # Pantalla de inicio animada
│       ├── InfoScreen.js   # Propósito y funcionamiento general
│       ├── TeamScreen.js   # Perfiles de los miembros del equipo
│       ├── ComponentsScreen.js # Lista de materiales interactiva
│       ├── LogicScreen.js  # Diagrama de flujo e IFs lógicos
│       ├── GalleryScreen.js# Galería multimedia y reproductor de video
│       └── CreditsScreen.js# Créditos y enlace al repositorio
├── App.js                  # Punto de entrada y precarga de fuentes
├── app.json                # Configuración de metadatos de Expo (Iconos, Splash)
└── eas.json                # Configuración para la construcción del APK
```

## 4. Características Clave de UI / UX 🎨

La interfaz fue diseñada para dar una sensación "premium" y tecnológica, acorde a un proyecto de ingeniería:

1.  **Splash Screen y Precarga:** La aplicación retiene la pantalla de carga dinámicamente hasta que las fuentes e iconos (`Ionicons`) están totalmente listos, evitando "parpadeos" visuales (`expo-splash-screen`).
2.  **Transiciones Animadas:** En lugar de pantallas estáticas, se usó el componente `FadeInView` para que el contenido entre con un suave desplazamiento (Fade & Slide).
3.  **Tutorial Interactivo (Paso a Paso):** Se construyó un carrusel tipo "Tinder" de tarjetas interactivas que combinan texto, advertencias, imágenes y video para explicar el ensamblaje. Además, se implementó ScrollView para manejar textos largos sin recortes.
4.  **Galería Multimedia Avanzada:** 
    *   Reproductor de video nativo (`expo-av`) para la demostración en pista, configurado para modo "fullscreen" inmersivo y sin interrupciones (siempre muteado como recurso visual).
    *   Imágenes con capacidad de hacer zoom dinámico sobre un fondo oscurecido para examinar los detalles del hardware.

## 5. Retos Técnicos y Soluciones Implementadas 🔧

Durante el desarrollo se enfrentaron y resolvieron diversos obstáculos técnicos complejos para lograr una experiencia fluida y compilar la app correctamente:

*   **Problema de "Magic Bytes" en la Compilación AAPT de Android:** Al generar el APK con EAS Build, el compilador estricto de Android rechazó la compilación debido a archivos multimedia con extensiones "falsas" (ej. un archivo WebP o JPEG nombrado internamente como `.png`). 
    *   *Solución:* Se desarrolló un script en PowerShell para leer los 8 primeros bytes (*magic bytes*) de las imágenes en hexadecimal, identificar su formato real subyacente y renombrarlos a su extensión nativa (`.webp`, `.jpg`), desbloqueando exitosamente el *pipeline* de compilación.
*   **Gestión del Splash Screen y "Flickering" de Fuentes:** En las primeras versiones, la UI parpadeaba mostrando cuadros en blanco o desacomodados antes de cargar los íconos de vector (`Ionicons`).
    *   *Solución:* Se implementó `expo-splash-screen` en combinación con el Hook `useFonts` para interceptar el montaje inicial, reteniendo dinámicamente la pantalla de carga principal de la app hasta que todos los recursos tipográficos se guardaran en memoria asíncronamente.
*   **Rendimiento a 60 FPS en Animaciones Simultáneas:** La app coordina múltiples animaciones a la vez (efecto máquina de escribir caracter por caracter, FadeIn progresivo en cascada para listas, y gestos Swipe en tarjetas 3D).
    *   *Solución:* Toda la lógica de interpolación matemática en componentes como `FadeInView` o la Galería se delegó obligatoriamente a la capa nativa usando `useNativeDriver: true`. Esto impidió bloqueos en el hilo principal de Javascript (UI Thread) manteniendo una navegación completamente suave.
*   **Control Dinámico del Layout (Scroll vs Estricto):** El componente `Tutorial.js` requiere dimensiones fijas estrictas basadas en `Dimensions.get('window')` para lograr su efecto de tarjetas deslizables apiladas, pero algunos pasos tenían mucho más texto que otros, lo que causaba texto cortado.
    *   *Solución:* Se embebieron componentes `ScrollView` inteligentes que no despliegan barra vertical visual, adaptando dinámicamente el `contentContainerStyle` para absorber el exceso de texto largo sin comprometer las matemáticas exactas que definen la posición y sombra "3D" de las tarjetas.
*   **Pantalla Completa Inmersiva para el Reproductor:** El reproductor de video de la galería se rehusaba a ocupar el 100% de la pantalla cuando el usuario activaba el modo Fullscreen, ya que estaba contenido dentro de un `SafeAreaView` restrictivo.
    *   *Solución:* Se reprogramaron los estilos para reaccionar a la variable de estado `isFullscreen`, inyectando dinámicamente propiedades `flexGrow: 1` y dimensionamiento de altura `auto`, rompiendo las restricciones iniciales para lograr inmersión total.

## 6. Despliegue y Distribución 🚀

La aplicación está completamente sincronizada con control de versiones en **GitHub**.
La generación del archivo instalable final (`.apk`) se llevó a cabo en la nube utilizando **EAS (Expo Application Services)**, bajo el perfil `release`, lo que asegura que la aplicación está optimizada y lista para instalarse en cualquier dispositivo Android moderno sin necesidad de estar conectado a la red local de desarrollo.
