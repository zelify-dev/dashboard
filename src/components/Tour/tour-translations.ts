import type { Language } from "@/contexts/language-context";
import type { TourStep } from "@/contexts/tour-context";

type ProductKey = "auth" | "aml" | "identity" | "connect" | "cards" | "payments" | "tx" | "ai" | "discounts";

export const TOUR_TRANSLATIONS: Record<Language, Record<ProductKey, TourStep[]>> = {
  es: {
    auth: [
      {
        id: "auth-product",
        target: "tour-product-auth",
        title: "Autenticación",
        content:
          "Se encarga del manejo de inicio de sesión, registro de usuarios e información del dispositivo. Puedes expandir para ver sus opciones y funcionalidades.",
        position: "right" as const,
      },
      {
        id: "auth-authentication",
        target: "tour-auth-authentication",
        title: "Autenticación",
        content:
          "Esta es la opción principal de autenticación. Aquí puedes configurar el inicio de sesión y registro de usuarios.",
        position: "right" as const,
        url: "/pages/products/auth/authentication",
      },
      {
        id: "auth-preview",
        target: "tour-auth-preview",
        title: "Interfaz de Autenticación",
        content:
          "Zelify provee de una interfaz que tus usuarios inicien sesión fácilmente",
        position: "right" as const,
      },
      {
        id: "branding-customization",
        target: "tour-branding-content",
        title: "Personalización de Marca",
        content:
          "Personaliza la identidad visual de tu empresa adaptando los colores corporativos y agregando tu logotipo para que la interfaz de autenticación refleje la marca de tu negocio.",
        position: "left" as const,
      },
      {
        id: "auth-preview-register",
        target: "tour-auth-preview",
        title: "Vista de Registro",
        content:
          "Aquí puedes ver la interfaz de registro de usuarios. Zelify te permite personalizar los campos y el flujo de registro según las necesidades de tu negocio.",
        position: "right" as const,
      },
      {
        id: "auth-preview-otp",
        target: "tour-auth-preview",
        title: "Verificación por Código",
        content:
          "Zelify proporciona un sistema de verificación mediante códigos temporales que se pueden enviar por correo electrónico, SMS o WhatsApp, garantizando la seguridad y autenticidad de los usuarios durante el proceso de registro.",
        position: "right" as const,
      },
      {
        id: "auth-geolocalization",
        target: "tour-geolocalization",
        title: "Geolocalización",
        content:
          "La geolocalización permite rastrear y validar la ubicación de los usuarios, proporcionando seguridad adicional y funcionalidades basadas en la ubicación para tu aplicación.",
        position: "right" as const,
        url: "/pages/products/auth/geolocalization",
      },
      {
        id: "geolocalization-device",
        target: "tour-geolocalization-device",
        title: "Vista Previa Móvil",
        content:
          "Zelify pedirá el permiso de ubicación del usuario mediante un modal nativo del sistema operativo, garantizando una experiencia familiar y segura.",
        position: "right" as const,
      },
      {
        id: "geolocalization-search",
        target: "tour-geolocalization-search",
        title: "Búsqueda de Ubicación",
        content:
          "Puedes buscar información detallada de cualquier ubicación ingresando sus coordenadas. El sistema te proporcionará datos completos sobre la ubicación especificada.",
        position: "left" as const,
      },
      {
        id: "geolocalization-results",
        target: "tour-geolocalization-results",
        title: "Resultados de Búsqueda",
        content:
          "Zelify proporciona información detallada y estructurada sobre la ubicación, incluyendo dirección formateada, país, ciudad, calles, código postal y datos técnicos adicionales.",
        position: "left" as const,
      },
      {
        id: "device-information",
        target: "tour-device-information",
        title: "Información del Dispositivo",
        content:
          "Este es el servicio de inteligencia del dispositivo para saber qué tan confiable es un dispositivo o no. Zelify analiza múltiples factores del dispositivo para determinar su nivel de confiabilidad y detectar posibles riesgos de seguridad.",
        position: "right" as const,
        url: "/pages/products/auth/device-information",
      },
      {
        id: "device-information-table",
        target: "tour-device-information-table",
        title: "Registro de Dispositivos",
        content:
          "Aquí se muestra un registro de todos los dispositivos que tienen actividad una vez aceptado el permiso de ubicación. Cada registro contiene información única del dispositivo y su historial de actividad.",
        position: "top" as const,
      },
      {
        id: "device-information-first-row",
        target: "tour-device-information-first-row",
        title: "Seleccionar Dispositivo",
        content:
          "Puedes hacer clic en cualquier registro para ver los detalles completos del dispositivo, incluyendo su información de ubicación, características del navegador y sistema operativo.",
        position: "top" as const,
      },
      {
        id: "device-information-modal",
        target: "tour-device-information-modal",
        title: "Información del Dispositivo",
        content:
          "Zelify proporciona información detallada sobre la confiabilidad del dispositivo. Puedes ver si el dispositivo utiliza VPN, si se hace pasar por un atacante, su nivel de confianza, y otros factores de seguridad que ayudan a determinar si el dispositivo es confiable o presenta riesgos.",
        position: "left" as const,
      },
    ],
    aml: [
      {
        id: "aml-product",
        target: "tour-product-aml",
        title: "AML - Validación de Listas Globales",
        content:
          "El módulo AML te permite validar personas y entidades contra listas globales de sanciones, PEPs y otras bases de datos de cumplimiento para garantizar el cumplimiento normativo.",
        position: "right" as const,
      },
      {
        id: "aml-validation-global-list",
        target: "tour-aml-validation-global-list",
        title: "Validación de Listas Globales",
        content:
          "Aquí puedes realizar validaciones AML ingresando el número de documento de identificación. El sistema buscará en múltiples listas globales de sanciones y PEPs.",
        position: "right" as const,
        url: "/pages/products/aml/validation-global-list",
      },
      {
        id: "aml-preview",
        target: "tour-aml-preview",
        title: "Vista Previa del Dispositivo",
        content:
          "La validación de listas negras se realiza automáticamente durante el proceso de verificación de identidad, integrando AML con Identity para validaciones en tiempo real.",
        position: "right" as const,
        url: "/pages/products/aml/validation-global-list",
      },
      {
        id: "aml-validations-list",
        target: "tour-aml-validations-list",
        title: "Historial de Validaciones",
        content:
          "Aquí puedes ver el historial completo de todas tus validaciones AML realizadas, incluyendo su estado, fecha de creación y resultados de las búsquedas en las listas globales.",
        position: "top" as const,
        url: "/pages/products/aml/validation-global-list",
      },
      {
        id: "aml-list-config",
        target: "tour-aml-list-config",
        title: "Configuración de Listas AML",
        content:
          "Selecciona y configura las listas negras que deseas utilizar en tus validaciones. Puedes activar o desactivar listas específicas, crear grupos personalizados y gestionar las fuentes de datos según tus necesidades de cumplimiento.",
        position: "top" as const,
        url: "/pages/products/aml/validation-global-list",
      },
    ],
    identity: [
      {
        id: "identity-product",
        target: "tour-product-identity",
        title: "Identidad - Flujo de Trabajo",
        content:
          "El módulo de Identidad te permite configurar flujos de trabajo personalizados para la verificación de identidad de tus usuarios, incluyendo captura de documentos y verificación biométrica.",
        position: "right" as const,
      },
      {
        id: "identity-workflow",
        target: "tour-identity-workflow",
        title: "Flujo de Trabajo",
        content:
          "Configura flujos de trabajo personalizados para la verificación de identidad. Define los pasos, documentos requeridos y métodos de verificación según las necesidades de tu negocio.",
        position: "right" as const,
        url: "/pages/products/identity/workflow",
      },
      {
        id: "identity-new-workflow-button",
        target: "tour-identity-new-workflow-button",
        title: "Crear Nuevo Flujo",
        content:
          "Puedes crear un nuevo flujo de verificación de identidad por país. Cada país puede tener su propio flujo personalizado con diferentes requisitos de documentos y métodos de verificación según las regulaciones locales.",
        position: "left" as const,
        url: "/pages/products/identity/workflow",
      },
      {
        id: "identity-workflow-preview",
        target: "tour-identity-workflow-preview",
        title: "Vista Previa del Dispositivo",
        content:
          "Visualiza cómo se verá el flujo de verificación de identidad en dispositivos móviles y web. Zelify te permite ver exactamente la experiencia que tendrán tus usuarios en sus dispositivos.",
        position: "right" as const,
        url: "/pages/products/identity/workflow",
      },
      {
        id: "identity-workflow-config",
        target: "tour-identity-workflow-config-country",
        title: "Configuración del Flujo",
        content:
          "Puedes configurar el flujo de verificación de identidad para cada país (Ecuador, México, Colombia). Cada país puede tener requisitos y regulaciones diferentes, por lo que puedes personalizar el flujo según las necesidades locales.",
        position: "left" as const,
        url: "/pages/products/identity/workflow",
      },
      {
        id: "identity-workflow-config-documents",
        target: "tour-identity-workflow-config-documents",
        title: "Tipos de Documento",
        content:
          "Selecciona los tipos de documento permitidos para la verificación: Licencia de conducir, Documento nacional o Pasaporte. Puedes habilitar uno o varios según los requisitos de tu negocio.",
        position: "left" as const,
        url: "/pages/products/identity/workflow",
      },
    ],
    connect: [
      {
        id: "connect-product",
        target: "tour-product-connect",
        title: "Conectar",
        content:
          "El módulo Conectar permite vincular cuentas bancarias de tus usuarios de forma segura, facilitando la integración con servicios financieros y pagos.",
        position: "right" as const,
      },
      {
        id: "connect-bank-account-linking",
        target: "tour-connect-bank-account-linking",
        title: "Vinculación de Cuentas Bancarias",
        content:
          "Configura el proceso de vinculación de cuentas bancarias. Zelify proporciona una interfaz segura y fácil de usar para que tus usuarios conecten sus cuentas bancarias.",
        position: "right" as const,
        url: "/pages/products/connect/bank-account-linking",
      },
      {
        id: "connect-config",
        target: "tour-connect-config",
        title: "Configuración de Países",
        content:
          "Selecciona los países donde estarán disponibles los servicios de vinculación bancaria. Puedes configurar diferentes opciones para cada país según las regulaciones locales.",
        position: "left" as const,
      },
      {
        id: "connect-preview",
        target: "tour-connect-preview",
        title: "Vista Previa del Dispositivo",
        content:
          "Puedes conectar a diferentes bancos de la plaza local seleccionada. La interfaz te permite vincular cuentas bancarias de forma segura e intuitiva desde cualquier dispositivo.",
        position: "right" as const,
      },
      {
        id: "connect-credentials",
        target: "tour-connect-credentials",
        title: "Ingreso de Credenciales",
        content:
          "El usuario simplemente ingresa sus credenciales bancarias para conectar su cuenta. El proceso es seguro y se realiza de forma automática una vez que se proporcionan los datos de acceso.",
        position: "right" as const,
        url: "/pages/products/connect/bank-account-linking",
      },
      {
        id: "connect-wallet",
        target: "tour-connect-wallet",
        title: "Billetera y Cash-in",
        content:
          "Una vez conectada la cuenta bancaria, el usuario puede realizar un cash-in o ingreso de fondos desde su billetera. La interfaz permite gestionar los fondos de forma segura y realizar depósitos desde las cuentas bancarias vinculadas.",
        position: "right" as const,
        url: "/pages/products/connect/bank-account-linking",
      },
    ],
    cards: [
      {
        id: "cards-product",
        target: "tour-product-cards",
        title: "Tarjetas",
        content:
          "El módulo de Tarjetas te permite diseñar, emitir y gestionar tarjetas personalizadas para tus usuarios. Incluye herramientas para personalizar el diseño visual, monitorear transacciones y realizar diligencia debida de forma integral.",
        position: "right" as const,
      },
      {
        id: "cards-config-branding",
        target: "tour-cards-config-branding",
        title: "Configuración de Branding",
        content:
          "Personaliza la identidad visual de tus tarjetas configurando logos y paletas de colores para los temas claro y oscuro. Esta configuración se aplica globalmente a todas las tarjetas emitidas.",
        position: "left" as const,
        url: "/pages/products/cards",
      },
      {
        id: "cards-preview-main",
        target: "tour-cards-preview-main",
        title: "Vista Previa Principal",
        content:
          "Visualiza cómo se verán las tarjetas en dispositivos móviles con la configuración de branding aplicada. La vista previa muestra la tarjeta con todas las acciones disponibles para tus usuarios.",
        position: "right" as const,
        url: "/pages/products/cards",
      },
      {
        id: "cards-issuing-design",
        target: "tour-cards-issuing-design",
        title: "Diseño de Tarjetas",
        content:
          "Gestiona los diseños de tarjetas disponibles. Puedes crear múltiples diseños personalizados con diferentes colores, gradientes, redes de tarjetas y acabados para ofrecer variedad a tus usuarios.",
        position: "bottom" as const,
        url: "/pages/products/cards/issuing/design",
      },
      {
        id: "cards-create-design",
        target: "tour-cards-create-design",
        title: "Crear Nuevo Diseño",
        content:
          "Crea un nuevo diseño de tarjeta desde cero. Define el nombre del diseño y personaliza todos los aspectos visuales para que refleje la identidad de tu marca.",
        position: "left" as const,
        url: "/pages/products/cards/issuing/design",
      },
      {
        id: "cards-design-editor",
        target: "tour-cards-design-editor",
        title: "Panel de Personalización",
        content:
          "Personaliza cada detalle de tu tarjeta: nombre del titular, tipo de color (sólido o gradiente), colores del gradiente, acabado de la tarjeta (estándar, grabado o metálico) y red de tarjetas (Visa o Mastercard).",
        position: "left" as const,
      },
      {
        id: "cards-preview",
        target: "tour-cards-preview",
        title: "Vista Previa 3D",
        content:
          "Visualiza tu diseño en tiempo real con una vista previa 3D interactiva. Puedes rotar la tarjeta para ver ambos lados y verificar cómo se verá el diseño final antes de guardarlo.",
        position: "right" as const,
      },
      {
        id: "cards-transactions",
        target: "tour-cards-transactions",
        title: "Transacciones",
        content:
          "Monitorea y gestiona todas las transacciones realizadas con las tarjetas emitidas. Accede a un registro completo con detalles de cada operación, incluyendo monto, comercio, categoría, fecha y estado.",
        position: "right" as const,
        url: "/pages/products/cards/transactions",
      },
      {
        id: "cards-transactions-detail",
        target: "tour-cards-transactions-detail",
        title: "Detalles de Transacción",
        content:
          "Haz clic en cualquier transacción para ver información detallada, incluyendo ID de transacción, tipo, fecha y hora exacta, categoría, información de la tarjeta y datos del comercio.",
        position: "right" as const,
        url: "/pages/products/cards/transactions",
      },
      {
        id: "cards-diligence",
        target: "tour-cards-diligence",
        title: "Diligencia Debida",
        content:
          "Gestiona los procesos de diligencia debida para las tarjetas emitidas. Realiza verificaciones de identidad, validaciones de documentos y evaluaciones de riesgo para cumplir con las regulaciones.",
        position: "right" as const,
        url: "/pages/products/cards/diligence",
      },
      {
        id: "cards-diligence-create",
        target: "tour-cards-diligence-create",
        title: "Nueva Diligencia Debida",
        content:
          "Crea un nuevo proceso de diligencia debida. Completa el formulario con la información del usuario, documentos requeridos y criterios de evaluación para iniciar el proceso de verificación.",
        position: "left" as const,
        url: "/pages/products/cards/diligence",
      },
      {
        id: "cards-diligence-list",
        target: "tour-cards-diligence-list",
        title: "Lista de Diligencias",
        content:
          "Revisa el estado de todas las diligencias debidas realizadas. Puedes ver el estado de cada proceso, fecha de envío y hacer clic en cualquier elemento para ver los detalles completos.",
        position: "bottom" as const,
        url: "/pages/products/cards/diligence",
      },
    ],
    payments: [
      {
        id: "payments-product",
        target: "tour-product-payments",
        title: "Pagos y transferencias",
        content:
          "El módulo de Pagos y transferencias te permite configurar diferentes métodos de pago, incluyendo servicios básicos, transferencias, claves personalizadas y códigos QR, para facilitar las transacciones de tus usuarios.",
        position: "right" as const,
      },
      {
        id: "payments-basic-services",
        target: "tour-payments-basic-services",
        title: "Servicios Básicos",
        content:
          "Configura los servicios básicos de pago disponibles para tus usuarios. Define los métodos de pago habilitados, límites transaccionales y personaliza la experiencia según tus necesidades.",
        position: "right" as const,
        url: "/pages/products/payments/servicios-basicos",
      },
      {
        id: "transfers-config",
        target: "tour-transfers-config",
        title: "Configuración de Transferencias",
        content:
          "Gestiona las transferencias nacionales e internacionales. Configura las opciones de transferencia disponibles, personaliza el branding y define las regiones donde estarán disponibles los servicios.",
        position: "right" as const,
        url: "/pages/products/payments/transfers",
      },
      {
        id: "transfers-branding",
        target: "tour-transfers-branding",
        title: "Personalización de Marca",
        content:
          "Personaliza la identidad visual de las transferencias. Configura logos y colores personalizados para los temas claro y oscuro, asegurando que la interfaz refleje la identidad de tu marca.",
        position: "left" as const,
        url: "/pages/products/payments/transfers",
      },
      {
        id: "transfers-region-panel",
        target: "tour-transfers-region-panel",
        title: "Configuración por Región",
        content:
          "Define las regiones donde estarán disponibles las transferencias y configura los métodos de pago específicos para cada región según las regulaciones locales y las necesidades de tu negocio.",
        position: "left" as const,
        url: "/pages/products/payments/transfers",
      },
      {
        id: "transfers-preview",
        target: "tour-transfers-preview",
        title: "Vista Previa del Dispositivo",
        content:
          "Visualiza cómo se verá la interfaz de transferencias en dispositivos móviles. La experiencia está diseñada para ser clara, segura y fácil de usar, permitiendo a tus usuarios realizar transferencias de forma intuitiva.",
        position: "right" as const,
        url: "/pages/products/payments/transfers",
      },
      {
        id: "payments-custom-keys",
        target: "tour-payments-custom-keys",
        title: "Claves Personalizadas",
        content:
          "Configura claves de pago personalizadas que tus usuarios pueden usar para realizar transacciones de forma rápida y segura. Permite pagos mediante cédula, teléfono o correo electrónico sin necesidad de ingresar datos bancarios completos.",
        position: "right" as const,
        url: "/pages/products/payments/custom-keys",
      },
      {
        id: "payments-custom-keys-config",
        target: "tour-payments-custom-keys-config",
        title: "Configuración de Claves",
        content:
          "Personaliza los tipos de claves disponibles, configura notificaciones, alertas de contacto y opciones de seguridad como autenticación de dos factores y cierre de sesión automático.",
        position: "left" as const,
        url: "/pages/products/payments/custom-keys",
      },
      {
        id: "payments-custom-keys-preview",
        target: "tour-payments-custom-keys-preview",
        title: "Vista Previa de Claves",
        content:
          "Visualiza cómo tus usuarios verán y usarán las claves personalizadas en dispositivos móviles. La interfaz muestra la lista de contactos con claves configuradas y permite realizar pagos rápidos.",
        position: "right" as const,
        url: "/pages/products/payments/custom-keys",
      },
      {
        id: "payments-qr",
        target: "tour-payments-qr",
        title: "Pagos con Código QR",
        content:
          "Habilita pagos mediante códigos QR. Tus usuarios pueden escanear códigos QR para realizar pagos de manera instantánea y sin contacto, mejorando la experiencia de pago y reduciendo el tiempo de transacción.",
        position: "right" as const,
        url: "/pages/products/payments/qr",
      },
      {
        id: "payments-qr-config",
        target: "tour-payments-qr-config",
        title: "Configuración de QR",
        content:
          "Configura webhooks para recibir notificaciones de eventos de pago, personaliza el branding de los códigos QR y define qué eventos quieres recibir (pagos exitosos, fallidos, reembolsos, etc.).",
        position: "left" as const,
        url: "/pages/products/payments/qr",
      },
      {
        id: "payments-qr-preview",
        target: "tour-payments-qr-preview",
        title: "Vista Previa de QR",
        content:
          "Visualiza cómo se verá la interfaz de pagos con código QR en dispositivos móviles. La experiencia permite escanear códigos QR y realizar pagos de forma rápida y segura.",
        position: "right" as const,
        url: "/pages/products/payments/qr",
      },
    ],
    tx: [
      {
        id: "tx-product",
        target: "tour-product-tx",
        title: "Tx - Transferencias Internacionales",
        content:
          "El módulo Tx te permite gestionar transferencias internacionales de manera eficiente, facilitando el envío de dinero entre diferentes países y monedas con validaciones automáticas y procesamiento en tiempo real.",
        position: "right" as const,
      },
      {
        id: "tx-international-transfers",
        target: "tour-tx-international-transfers",
        title: "Transferencias Internacionales",
        content:
          "Configura y gestiona transferencias internacionales. Zelify te proporciona las herramientas necesarias para procesar envíos de dinero a nivel global de forma segura, con soporte para múltiples países y monedas.",
        position: "right" as const,
        url: "/pages/products/tx/transferencias-internacionales",
      },
      {
        id: "tx-branding",
        target: "tour-tx-branding",
        title: "Personalización de Marca",
        content:
          "Personaliza la identidad visual de las transferencias internacionales. Configura logos y colores personalizados para los temas claro y oscuro, asegurando una experiencia consistente con tu marca.",
        position: "left" as const,
        url: "/pages/products/tx/transferencias-internacionales",
      },
      {
        id: "tx-config",
        target: "tour-tx-config",
        title: "Configuración de Regiones",
        content:
          "Define las regiones donde estarán disponibles las transferencias internacionales. Configura países de origen y destino, tipos de cambio, métodos de pago y comisiones aplicables según las regulaciones locales.",
        position: "left" as const,
        url: "/pages/products/tx/transferencias-internacionales",
      },
      {
        id: "tx-preview",
        target: "tour-tx-preview",
        title: "Vista Previa del Dispositivo",
        content:
          "Visualiza cómo se verá la interfaz de transferencias internacionales en dispositivos móviles. La experiencia está optimizada para guiar a los usuarios a través del proceso de envío internacional, mostrando tipos de cambio, comisiones y tiempos estimados.",
        position: "right" as const,
        url: "/pages/products/tx/transferencias-internacionales",
      },
    ],
    ai: [
      {
        id: "ai-product",
        target: "tour-product-ai",
        title: "IA - Alaiza",
        content:
          "Alaiza es el asistente de inteligencia artificial de Zelify que te ayuda a automatizar tareas, responder consultas y mejorar la experiencia de tus usuarios mediante conversaciones inteligentes y análisis de comportamiento.",
        position: "right" as const,
      },
      {
        id: "ai-alaiza",
        target: "tour-ai-alaiza",
        title: "Alaiza - Asistente IA",
        content:
          "Configura y personaliza tu asistente de inteligencia artificial. Alaiza puede responder preguntas, ayudar con tareas, proporcionar soporte automatizado y asistir a tus usuarios en tiempo real mediante conversaciones naturales.",
        position: "right" as const,
        url: "/pages/products/ai/alaiza",
      },
      {
        id: "ai-alaiza-config",
        target: "tour-ai-alaiza-config",
        title: "Configuración de Alaiza",
        content:
          "Personaliza el comportamiento, respuestas y capacidades de Alaiza. Define límites de longitud de mensajes, número máximo de conversaciones, frecuencia de acceso al chat, límites de archivos y otras configuraciones según las necesidades de tu negocio.",
        position: "left" as const,
        url: "/pages/products/ai/alaiza",
      },
      {
        id: "ai-alaiza-preview",
        target: "tour-ai-alaiza-preview",
        title: "Vista Previa del Chat",
        content:
          "Visualiza cómo se verá la interfaz de chat con Alaiza en dispositivos móviles. Prueba diferentes conversaciones y ve cómo el asistente responde a las consultas de tus usuarios. La interfaz está diseñada para ser intuitiva y facilitar la interacción con el asistente IA.",
        position: "right" as const,
        url: "/pages/products/ai/alaiza",
      },
    ],
    discounts: [
      {
        id: "discounts-product",
        target: "tour-product-discounts",
        title: "Descuentos y Cupones",
        content:
          "El módulo de Descuentos y Cupones te permite crear, gestionar y analizar cupones de descuento para promocionar tus productos y servicios, aumentando la participación de tus usuarios y fomentando la fidelización.",
        position: "right" as const,
      },
      {
        id: "discounts-coupons",
        target: "tour-discounts-coupons",
        title: "Gestión de Cupones",
        content:
          "Visualiza y gestiona todos tus cupones de descuento. Puedes ver el estado de cada cupón, fechas de validez, límites de uso y hacer clic en cualquier cupón para ver los detalles completos y editarlos.",
        position: "bottom" as const,
        url: "/pages/products/discounts-coupons",
      },
      {
        id: "discounts-create",
        target: "tour-discounts-create",
        title: "Crear Nuevo Cupón",
        content:
          "Crea nuevos cupones personalizados desde cero. Define el nombre del cupón, tipo de descuento (monto fijo o porcentaje), condiciones de aplicación, fechas de validez, límites de uso y configura las reglas de uso según tus necesidades de marketing.",
        position: "bottom" as const,
        url: "/pages/products/discounts-coupons/create",
      },
      {
        id: "discounts-coupon-detail",
        target: "tour-discounts-coupon-detail",
        title: "Detalles del Cupón",
        content:
          "Revisa la información completa de cualquier cupón. Puedes ver todos los detalles, estadísticas de uso, fechas de creación y expiración, y editar la configuración del cupón cuando sea necesario.",
        position: "bottom" as const,
        url: "/pages/products/discounts-coupons",
      },
      {
        id: "discounts-analytics",
        target: "tour-discounts-analytics",
        title: "Analítica y Uso",
        content:
          "Monitorea el rendimiento de tus cupones con análisis detallados. Analiza cuántas veces se han usado, qué cupones son más populares, tasas de conversión y obtén insights valiosos para optimizar tus campañas de descuentos y aumentar el ROI.",
        position: "bottom" as const,
        url: "/pages/products/discounts-coupons/analytics",
      },
    ],
  },
  en: {
    auth: [
      {
        id: "auth-product",
        target: "tour-product-auth",
        title: "Authentication",
        content:
          "Handles user login, registration, and device information. You can expand to see its options and functionalities.",
        position: "right" as const,
      },
      {
        id: "auth-authentication",
        target: "tour-auth-authentication",
        title: "Authentication",
        content:
          "This is the main authentication option. Here you can configure user login and registration.",
        position: "right" as const,
        url: "/pages/products/auth/authentication",
      },
      {
        id: "auth-preview",
        target: "tour-auth-preview",
        title: "Authentication Interface",
        content:
          "Zelify provides an interface for your users to log in easily",
        position: "right" as const,
      },
      {
        id: "branding-customization",
        target: "tour-branding-content",
        title: "Brand Customization",
        content:
          "Customize your company's visual identity by adapting corporate colors and adding your logo so that the authentication interface reflects your business brand.",
        position: "left" as const,
      },
      {
        id: "auth-preview-register",
        target: "tour-auth-preview",
        title: "Registration View",
        content:
          "Here you can see the user registration interface. Zelify allows you to customize fields and registration flow according to your business needs.",
        position: "right" as const,
      },
      {
        id: "auth-preview-otp",
        target: "tour-auth-preview",
        title: "Code Verification",
        content:
          "Zelify provides a verification system using temporary codes that can be sent via email, SMS, or WhatsApp, ensuring security and authenticity of users during the registration process.",
        position: "right" as const,
      },
      {
        id: "auth-geolocalization",
        target: "tour-geolocalization",
        title: "Geolocation",
        content:
          "Geolocation allows tracking and validating user locations, providing additional security and location-based features for your application.",
        position: "right" as const,
        url: "/pages/products/auth/geolocalization",
      },
      {
        id: "geolocalization-device",
        target: "tour-geolocalization-device",
        title: "Mobile Preview",
        content:
          "Zelify will request the user's location permission through a native operating system modal, ensuring a familiar and secure experience.",
        position: "right" as const,
      },
      {
        id: "geolocalization-search",
        target: "tour-geolocalization-search",
        title: "Location Search",
        content:
          "You can search for detailed information about any location by entering its coordinates. The system will provide complete data about the specified location.",
        position: "left" as const,
      },
      {
        id: "geolocalization-results",
        target: "tour-geolocalization-results",
        title: "Search Results",
        content:
          "Zelify provides detailed and structured information about the location, including formatted address, country, city, streets, postal code, and additional technical data.",
        position: "left" as const,
      },
      {
        id: "device-information",
        target: "tour-device-information",
        title: "Device Information",
        content:
          "This is the device intelligence service to determine how reliable a device is. Zelify analyzes multiple device factors to determine its reliability level and detect potential security risks.",
        position: "right" as const,
        url: "/pages/products/auth/device-information",
      },
      {
        id: "device-information-table",
        target: "tour-device-information-table",
        title: "Device Registry",
        content:
          "Here is a registry of all devices that have activity once location permission is accepted. Each record contains unique device information and its activity history.",
        position: "top" as const,
      },
      {
        id: "device-information-first-row",
        target: "tour-device-information-first-row",
        title: "Select Device",
        content:
          "You can click on any record to see complete device details, including location information, browser and operating system characteristics.",
        position: "top" as const,
      },
      {
        id: "device-information-modal",
        target: "tour-device-information-modal",
        title: "Device Information",
        content:
          "Zelify provides detailed information about device reliability. You can see if the device uses VPN, if it's impersonating an attacker, its trust level, and other security factors that help determine if the device is reliable or presents risks.",
        position: "left" as const,
      },
    ],
    aml: [
      {
        id: "aml-product",
        target: "tour-product-aml",
        title: "AML - Global List Validation",
        content:
          "The AML module allows you to validate people and entities against global sanctions lists, PEPs, and other compliance databases to ensure regulatory compliance.",
        position: "right" as const,
      },
      {
        id: "aml-validation-global-list",
        target: "tour-aml-validation-global-list",
        title: "Global List Validation",
        content:
          "Here you can perform AML validations by entering the identification document number. The system will search multiple global sanctions and PEP lists.",
        position: "right" as const,
        url: "/pages/products/aml/validation-global-list",
      },
      {
        id: "aml-preview",
        target: "tour-aml-preview",
        title: "Device Preview",
        content:
          "Blacklist validation is performed automatically during the identity verification process, integrating AML with Identity for real-time validations.",
        position: "right" as const,
        url: "/pages/products/aml/validation-global-list",
      },
      {
        id: "aml-validations-list",
        target: "tour-aml-validations-list",
        title: "Validation History",
        content:
          "Here you can see the complete history of all your AML validations performed, including their status, creation date, and results from searches in global lists.",
        position: "top" as const,
        url: "/pages/products/aml/validation-global-list",
      },
      {
        id: "aml-list-config",
        target: "tour-aml-list-config",
        title: "AML List Configuration",
        content:
          "Select and configure the blacklists you want to use in your validations. You can activate or deactivate specific lists, create custom groups, and manage data sources according to your compliance needs.",
        position: "top" as const,
        url: "/pages/products/aml/validation-global-list",
      },
    ],
    identity: [
      {
        id: "identity-product",
        target: "tour-product-identity",
        title: "Identity - Workflow",
        content:
          "The Identity module allows you to configure custom workflows for user identity verification, including document capture and biometric verification.",
        position: "right" as const,
      },
      {
        id: "identity-workflow",
        target: "tour-identity-workflow",
        title: "Workflow",
        content:
          "Configure custom workflows for identity verification. Define steps, required documents, and verification methods according to your business needs.",
        position: "right" as const,
        url: "/pages/products/identity/workflow",
      },
      {
        id: "identity-new-workflow-button",
        target: "tour-identity-new-workflow-button",
        title: "Create New Workflow",
        content:
          "You can create a new identity verification workflow by country. Each country can have its own custom workflow with different document requirements and verification methods according to local regulations.",
        position: "left" as const,
        url: "/pages/products/identity/workflow",
      },
      {
        id: "identity-workflow-preview",
        target: "tour-identity-workflow-preview",
        title: "Device Preview",
        content:
          "Visualize how the identity verification flow will look on mobile and web devices. Zelify allows you to see exactly the experience your users will have on their devices.",
        position: "right" as const,
        url: "/pages/products/identity/workflow",
      },
      {
        id: "identity-workflow-config",
        target: "tour-identity-workflow-config-country",
        title: "Workflow Configuration",
        content:
          "You can configure the identity verification flow for each country (Ecuador, Mexico, Colombia). Each country can have different requirements and regulations, so you can customize the flow according to local needs.",
        position: "left" as const,
        url: "/pages/products/identity/workflow",
      },
      {
        id: "identity-workflow-config-documents",
        target: "tour-identity-workflow-config-documents",
        title: "Document Types",
        content:
          "Select the document types allowed for verification: Driver's license, National ID, or Passport. You can enable one or several according to your business requirements.",
        position: "left" as const,
        url: "/pages/products/identity/workflow",
      },
    ],
    connect: [
      {
        id: "connect-product",
        target: "tour-product-connect",
        title: "Connect",
        content:
          "The Connect module allows secure linking of your users' bank accounts, facilitating integration with financial services and payments.",
        position: "right" as const,
      },
      {
        id: "connect-bank-account-linking",
        target: "tour-connect-bank-account-linking",
        title: "Bank Account Linking",
        content:
          "Configure the bank account linking process. Zelify provides a secure and easy-to-use interface for your users to connect their bank accounts.",
        position: "right" as const,
        url: "/pages/products/connect/bank-account-linking",
      },
      {
        id: "connect-config",
        target: "tour-connect-config",
        title: "Country Configuration",
        content:
          "Select the countries where bank linking services will be available. You can configure different options for each country according to local regulations.",
        position: "left" as const,
      },
      {
        id: "connect-preview",
        target: "tour-connect-preview",
        title: "Device Preview",
        content:
          "You can connect to different banks in the selected local market. The interface allows you to securely and intuitively link bank accounts from any device.",
        position: "right" as const,
      },
      {
        id: "connect-credentials",
        target: "tour-connect-credentials",
        title: "Credential Entry",
        content:
          "The user simply enters their bank credentials to connect their account. The process is secure and performed automatically once access data is provided.",
        position: "right" as const,
        url: "/pages/products/connect/bank-account-linking",
      },
      {
        id: "connect-wallet",
        target: "tour-connect-wallet",
        title: "Wallet and Cash-in",
        content:
          "Once the bank account is connected, the user can perform a cash-in or fund deposit from their wallet. The interface allows secure fund management and deposits from linked bank accounts.",
        position: "right" as const,
        url: "/pages/products/connect/bank-account-linking",
      },
    ],
    cards: [
      {
        id: "cards-product",
        target: "tour-product-cards",
        title: "Cards",
        content:
          "The Cards module allows you to design, issue, and manage custom cards for your users. Includes tools to customize visual design, monitor transactions, and perform due diligence comprehensively.",
        position: "right" as const,
      },
      {
        id: "cards-config-branding",
        target: "tour-cards-config-branding",
        title: "Branding Configuration",
        content:
          "Customize the visual identity of your cards by configuring logos and color palettes for light and dark themes. This configuration applies globally to all issued cards.",
        position: "left" as const,
        url: "/pages/products/cards",
      },
      {
        id: "cards-preview-main",
        target: "tour-cards-preview-main",
        title: "Main Preview",
        content:
          "Visualize how cards will look on mobile devices with the branding configuration applied. The preview shows the card with all available actions for your users.",
        position: "right" as const,
        url: "/pages/products/cards",
      },
      {
        id: "cards-issuing-design",
        target: "tour-cards-issuing-design",
        title: "Card Design",
        content:
          "Manage available card designs. You can create multiple custom designs with different colors, gradients, card networks, and finishes to offer variety to your users.",
        position: "bottom" as const,
        url: "/pages/products/cards/issuing/design",
      },
      {
        id: "cards-create-design",
        target: "tour-cards-create-design",
        title: "Create New Design",
        content:
          "Create a new card design from scratch. Define the design name and customize all visual aspects to reflect your brand identity.",
        position: "left" as const,
        url: "/pages/products/cards/issuing/design",
      },
      {
        id: "cards-design-editor",
        target: "tour-cards-design-editor",
        title: "Customization Panel",
        content:
          "Customize every detail of your card: cardholder name, color type (solid or gradient), gradient colors, card finish (standard, embossed, or metallic), and card network (Visa or Mastercard).",
        position: "left" as const,
      },
      {
        id: "cards-preview",
        target: "tour-cards-preview",
        title: "3D Preview",
        content:
          "Visualize your design in real-time with an interactive 3D preview. You can rotate the card to see both sides and verify how the final design will look before saving.",
        position: "right" as const,
      },
      {
        id: "cards-transactions",
        target: "tour-cards-transactions",
        title: "Transactions",
        content:
          "Monitor and manage all transactions made with issued cards. Access a complete record with details of each operation, including amount, merchant, category, date, and status.",
        position: "right" as const,
        url: "/pages/products/cards/transactions",
      },
      {
        id: "cards-transactions-detail",
        target: "tour-cards-transactions-detail",
        title: "Transaction Details",
        content:
          "Click on any transaction to see detailed information, including transaction ID, type, exact date and time, category, card information, and merchant data.",
        position: "right" as const,
        url: "/pages/products/cards/transactions",
      },
      {
        id: "cards-diligence",
        target: "tour-cards-diligence",
        title: "Due Diligence",
        content:
          "Manage due diligence processes for issued cards. Perform identity verifications, document validations, and risk assessments to comply with regulations.",
        position: "right" as const,
        url: "/pages/products/cards/diligence",
      },
      {
        id: "cards-diligence-create",
        target: "tour-cards-diligence-create",
        title: "New Due Diligence",
        content:
          "Create a new due diligence process. Complete the form with user information, required documents, and evaluation criteria to start the verification process.",
        position: "left" as const,
        url: "/pages/products/cards/diligence",
      },
      {
        id: "cards-diligence-list",
        target: "tour-cards-diligence-list",
        title: "Diligence List",
        content:
          "Review the status of all due diligence processes performed. You can see the status of each process, submission date, and click on any item to view complete details.",
        position: "bottom" as const,
        url: "/pages/products/cards/diligence",
      },
    ],
    payments: [
      {
        id: "payments-product",
        target: "tour-product-payments",
        title: "Payments and Transfers",
        content:
          "The Payments and Transfers module allows you to configure different payment methods, including basic services, transfers, custom keys, and QR codes, to facilitate your users' transactions.",
        position: "right" as const,
      },
      {
        id: "payments-basic-services",
        target: "tour-payments-basic-services",
        title: "Basic Services",
        content:
          "Configure basic payment services available for your users. Define enabled payment methods, transaction limits, and customize the experience according to your needs.",
        position: "right" as const,
        url: "/pages/products/payments/servicios-basicos",
      },
      {
        id: "transfers-config",
        target: "tour-transfers-config",
        title: "Transfer Configuration",
        content:
          "Manage national and international transfers. Configure available transfer options, customize branding, and define regions where services will be available.",
        position: "right" as const,
        url: "/pages/products/payments/transfers",
      },
      {
        id: "transfers-branding",
        target: "tour-transfers-branding",
        title: "Brand Customization",
        content:
          "Customize the visual identity of transfers. Configure logos and custom colors for light and dark themes, ensuring the interface reflects your brand identity.",
        position: "left" as const,
        url: "/pages/products/payments/transfers",
      },
      {
        id: "transfers-region-panel",
        target: "tour-transfers-region-panel",
        title: "Region Configuration",
        content:
          "Define regions where transfers will be available and configure specific payment methods for each region according to local regulations and your business needs.",
        position: "left" as const,
        url: "/pages/products/payments/transfers",
      },
      {
        id: "transfers-preview",
        target: "tour-transfers-preview",
        title: "Device Preview",
        content:
          "Visualize how the transfer interface will look on mobile devices. The experience is designed to be clear, secure, and easy to use, allowing your users to make transfers intuitively.",
        position: "right" as const,
        url: "/pages/products/payments/transfers",
      },
      {
        id: "payments-custom-keys",
        target: "tour-payments-custom-keys",
        title: "Custom Keys",
        content:
          "Configure custom payment keys that your users can use to make transactions quickly and securely. Allows payments via ID, phone, or email without needing to enter complete banking data.",
        position: "right" as const,
        url: "/pages/products/payments/custom-keys",
      },
      {
        id: "payments-custom-keys-config",
        target: "tour-payments-custom-keys-config",
        title: "Key Configuration",
        content:
          "Customize available key types, configure notifications, contact alerts, and security options such as two-factor authentication and automatic logout.",
        position: "left" as const,
        url: "/pages/products/payments/custom-keys",
      },
      {
        id: "payments-custom-keys-preview",
        target: "tour-payments-custom-keys-preview",
        title: "Keys Preview",
        content:
          "Visualize how your users will see and use custom keys on mobile devices. The interface shows the list of contacts with configured keys and allows quick payments.",
        position: "right" as const,
        url: "/pages/products/payments/custom-keys",
      },
      {
        id: "payments-qr",
        target: "tour-payments-qr",
        title: "QR Code Payments",
        content:
          "Enable payments via QR codes. Your users can scan QR codes to make payments instantly and contactless, improving the payment experience and reducing transaction time.",
        position: "right" as const,
        url: "/pages/products/payments/qr",
      },
      {
        id: "payments-qr-config",
        target: "tour-payments-qr-config",
        title: "QR Configuration",
        content:
          "Configure webhooks to receive payment event notifications, customize QR code branding, and define which events you want to receive (successful payments, failed, refunds, etc.).",
        position: "left" as const,
        url: "/pages/products/payments/qr",
      },
      {
        id: "payments-qr-preview",
        target: "tour-payments-qr-preview",
        title: "QR Preview",
        content:
          "Visualize how the QR code payment interface will look on mobile devices. The experience allows scanning QR codes and making payments quickly and securely.",
        position: "right" as const,
        url: "/pages/products/payments/qr",
      },
    ],
    tx: [
      {
        id: "tx-product",
        target: "tour-product-tx",
        title: "Tx - International Transfers",
        content:
          "The Tx module allows you to manage international transfers efficiently, facilitating money transfers between different countries and currencies with automatic validations and real-time processing.",
        position: "right" as const,
      },
      {
        id: "tx-international-transfers",
        target: "tour-tx-international-transfers",
        title: "International Transfers",
        content:
          "Configure and manage international transfers. Zelify provides the necessary tools to process global money transfers securely, with support for multiple countries and currencies.",
        position: "right" as const,
        url: "/pages/products/tx/transferencias-internacionales",
      },
      {
        id: "tx-branding",
        target: "tour-tx-branding",
        title: "Brand Customization",
        content:
          "Customize the visual identity of international transfers. Configure logos and custom colors for light and dark themes, ensuring a consistent experience with your brand.",
        position: "left" as const,
        url: "/pages/products/tx/transferencias-internacionales",
      },
      {
        id: "tx-config",
        target: "tour-tx-config",
        title: "Region Configuration",
        content:
          "Define regions where international transfers will be available. Configure origin and destination countries, exchange rates, payment methods, and applicable fees according to local regulations.",
        position: "left" as const,
        url: "/pages/products/tx/transferencias-internacionales",
      },
      {
        id: "tx-preview",
        target: "tour-tx-preview",
        title: "Device Preview",
        content:
          "Visualize how the international transfer interface will look on mobile devices. The experience is optimized to guide users through the international sending process, showing exchange rates, fees, and estimated times.",
        position: "right" as const,
        url: "/pages/products/tx/transferencias-internacionales",
      },
    ],
    ai: [
      {
        id: "ai-product",
        target: "tour-product-ai",
        title: "AI - Alaiza",
        content:
          "Alaiza is Zelify's artificial intelligence assistant that helps you automate tasks, answer queries, and improve your users' experience through intelligent conversations and behavior analysis.",
        position: "right" as const,
      },
      {
        id: "ai-alaiza",
        target: "tour-ai-alaiza",
        title: "Alaiza - AI Assistant",
        content:
          "Configure and customize your artificial intelligence assistant. Alaiza can answer questions, help with tasks, provide automated support, and assist your users in real-time through natural conversations.",
        position: "right" as const,
        url: "/pages/products/ai/alaiza",
      },
      {
        id: "ai-alaiza-config",
        target: "tour-ai-alaiza-config",
        title: "Alaiza Configuration",
        content:
          "Customize Alaiza's behavior, responses, and capabilities. Define message length limits, maximum number of conversations, chat access frequency, file limits, and other settings according to your business needs.",
        position: "left" as const,
        url: "/pages/products/ai/alaiza",
      },
      {
        id: "ai-alaiza-preview",
        target: "tour-ai-alaiza-preview",
        title: "Chat Preview",
        content:
          "Visualize how the chat interface with Alaiza will look on mobile devices. Try different conversations and see how the assistant responds to your users' queries. The interface is designed to be intuitive and facilitate interaction with the AI assistant.",
        position: "right" as const,
        url: "/pages/products/ai/alaiza",
      },
    ],
    discounts: [
      {
        id: "discounts-product",
        target: "tour-product-discounts",
        title: "Discounts and Coupons",
        content:
          "The Discounts and Coupons module allows you to create, manage, and analyze discount coupons to promote your products and services, increasing user engagement and fostering loyalty.",
        position: "right" as const,
      },
      {
        id: "discounts-coupons",
        target: "tour-discounts-coupons",
        title: "Coupon Management",
        content:
          "View and manage all your discount coupons. You can see the status of each coupon, validity dates, usage limits, and click on any coupon to view complete details and edit them.",
        position: "bottom" as const,
        url: "/pages/products/discounts-coupons",
      },
      {
        id: "discounts-create",
        target: "tour-discounts-create",
        title: "Create New Coupon",
        content:
          "Create new custom coupons from scratch. Define the coupon name, discount type (fixed amount or percentage), application conditions, validity dates, usage limits, and configure usage rules according to your marketing needs.",
        position: "bottom" as const,
        url: "/pages/products/discounts-coupons/create",
      },
      {
        id: "discounts-coupon-detail",
        target: "tour-discounts-coupon-detail",
        title: "Coupon Details",
        content:
          "Review the complete information of any coupon. You can see all details, usage statistics, creation and expiration dates, and edit the coupon configuration when necessary.",
        position: "bottom" as const,
        url: "/pages/products/discounts-coupons",
      },
      {
        id: "discounts-analytics",
        target: "tour-discounts-analytics",
        title: "Analytics and Usage",
        content:
          "Monitor your coupons' performance with detailed analytics. Analyze how many times they've been used, which coupons are most popular, conversion rates, and get valuable insights to optimize your discount campaigns and increase ROI.",
        position: "bottom" as const,
        url: "/pages/products/discounts-coupons/analytics",
      },
    ],
  },
};
