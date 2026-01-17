"use client";

import { useState } from "react";
import { useTour } from "@/contexts/tour-context";
import { useClickOutside } from "@/hooks/use-click-outside";
import { useUiTranslations } from "@/hooks/use-ui-translations";
import type { TourStep } from "@/contexts/tour-context";

type ProductKey = "auth" | "aml" | "identity" | "connect" | "cards" | "payments" | "tx" | "ai" | "discounts";

const PRODUCT_STEPS: Record<ProductKey, TourStep[]> = {
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
          position: "right" as const,
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
      position: "right" as const,
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
      position: "right" as const,
      url: "/pages/products/discounts-coupons",
    },
    {
      id: "discounts-create",
      target: "tour-discounts-create",
      title: "Crear Nuevo Cupón",
      content:
        "Crea nuevos cupones personalizados desde cero. Define el nombre del cupón, tipo de descuento (monto fijo o porcentaje), condiciones de aplicación, fechas de validez, límites de uso y configura las reglas de uso según tus necesidades de marketing.",
      position: "left" as const,
      url: "/pages/products/discounts-coupons/create",
    },
    {
      id: "discounts-coupon-detail",
      target: "tour-discounts-coupon-detail",
      title: "Detalles del Cupón",
      content:
        "Revisa la información completa de cualquier cupón. Puedes ver todos los detalles, estadísticas de uso, fechas de creación y expiración, y editar la configuración del cupón cuando sea necesario.",
      position: "right" as const,
      url: "/pages/products/discounts-coupons",
    },
    {
      id: "discounts-analytics",
      target: "tour-discounts-analytics",
      title: "Analítica y Uso",
      content:
        "Monitorea el rendimiento de tus cupones con análisis detallados. Analiza cuántas veces se han usado, qué cupones son más populares, tasas de conversión y obtén insights valiosos para optimizar tus campañas de descuentos y aumentar el ROI.",
      position: "right" as const,
      url: "/pages/products/discounts-coupons/analytics",
    },
  ],
};

export function TourModal() {
  const { isModalOpen, closeModal, startTour } = useTour();
  const translations = useUiTranslations();
  const modalRef = useClickOutside<HTMLDivElement>(() => closeModal());
  const [showProductSelection, setShowProductSelection] = useState(true);
  const [selectedProducts, setSelectedProducts] = useState<Set<ProductKey>>(new Set());

  const productLabels: Record<ProductKey, string> = {
    auth: translations.sidebar.menuItems.auth,
    aml: translations.sidebar.menuItems.aml,
    identity: translations.sidebar.menuItems.identity,
    connect: translations.sidebar.menuItems.connect,
    cards: translations.sidebar.menuItems.cards,
    payments: translations.sidebar.menuItems.payments,
    tx: translations.sidebar.menuItems.tx,
    ai: translations.sidebar.menuItems.ai,
    discounts: translations.sidebar.menuItems.discountsCoupons,
  };

  const toggleProduct = (product: ProductKey) => {
    setSelectedProducts((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(product)) {
        newSet.delete(product);
      } else {
        newSet.add(product);
      }
      return newSet;
    });
  };

  const selectAll = () => {
    setSelectedProducts(new Set(Object.keys(PRODUCT_STEPS) as ProductKey[]));
  };

  const deselectAll = () => {
    setSelectedProducts(new Set());
  };

  const handleContinue = () => {
    if (selectedProducts.size === 0) {
      return;
    }
    setShowProductSelection(false);
  };

  const handleStartTour = () => {
    closeModal();
    setTimeout(() => {
      const tourSteps: TourStep[] = [
        {
          id: "sidebar",
          target: "tour-sidebar",
          title: "Sección de productos",
          content: "Se muestran los productos de zelify",
          position: "right" as const,
        },
      ];

      // Agregar pasos de cada producto seleccionado
      selectedProducts.forEach((product) => {
        tourSteps.push(...PRODUCT_STEPS[product]);
      });

      startTour(tourSteps);
    }, 300);
  };

  const handleBack = () => {
    setShowProductSelection(true);
  };

  if (!isModalOpen) return null;

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/50 p-4">
      <div
        ref={modalRef}
        className="relative w-full max-w-2xl rounded-lg bg-white p-6 shadow-xl dark:bg-dark-2"
      >
        <button
          onClick={closeModal}
          className="absolute right-4 top-4 text-dark-6 hover:text-dark dark:text-dark-6 dark:hover:text-white"
        >
          <svg
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        {showProductSelection ? (
          <>
            <div className="mb-6">
          <h2 className="mb-2 text-2xl font-bold text-dark dark:text-white">
                Selecciona los productos
          </h2>
          <p className="text-sm text-dark-6 dark:text-dark-6">
                Elige los productos que deseas incluir en el tour. Puedes seleccionar uno o varios productos.
          </p>
        </div>

            <div className="mb-4 flex gap-2">
              <button
                onClick={selectAll}
                className="rounded-lg border border-stroke px-3 py-1.5 text-xs font-medium text-dark transition-colors hover:bg-gray-2 dark:border-stroke-dark dark:text-white dark:hover:bg-dark-3"
              >
                Seleccionar todos
              </button>
              <button
                onClick={deselectAll}
                className="rounded-lg border border-stroke px-3 py-1.5 text-xs font-medium text-dark transition-colors hover:bg-gray-2 dark:border-stroke-dark dark:text-white dark:hover:bg-dark-3"
              >
                Deseleccionar todos
              </button>
            </div>

            <div className="mb-6 grid grid-cols-2 gap-3 max-h-[400px] overflow-y-auto">
              {(Object.keys(PRODUCT_STEPS) as ProductKey[]).map((product) => (
                <button
                  key={product}
                  onClick={() => toggleProduct(product)}
                  className={`rounded-lg border-2 p-4 text-left transition-all ${selectedProducts.has(product)
                    ? "border-primary bg-primary/10 dark:bg-primary/20"
                    : "border-stroke hover:border-primary/50 dark:border-stroke-dark"
                    }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`flex h-5 w-5 items-center justify-center rounded border-2 ${selectedProducts.has(product)
                        ? "border-primary bg-primary"
                        : "border-gray-300 dark:border-gray-600"
                        }`}
                    >
                      {selectedProducts.has(product) && (
                        <svg
                          className="h-3 w-3 text-white"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={3}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      )}
                    </div>
                    <span className="font-medium text-dark dark:text-white">
                      {productLabels[product]}
                    </span>
                  </div>
                </button>
              ))}
            </div>

        <div className="flex gap-3">
          <button
            onClick={closeModal}
            className="flex-1 rounded-lg border border-stroke px-4 py-2 text-sm font-medium text-dark transition-colors hover:bg-gray-2 dark:border-stroke-dark dark:text-white dark:hover:bg-dark-3"
          >
            Cancelar
          </button>
              <button
                onClick={handleContinue}
                disabled={selectedProducts.size === 0}
                className="flex-1 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white transition-colors hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Continuar
              </button>
            </div>
          </>
        ) : (
          <>
            <div className="mb-4">
              <h2 className="mb-2 text-2xl font-bold text-dark dark:text-white">
                Bienvenido al Tour
              </h2>
              <p className="text-sm text-dark-6 dark:text-dark-6">
                A continuación se mostrará un tour de los productos seleccionados que te
                ayudará a conocer las funcionalidades principales de la aplicación.
              </p>
              <div className="mt-3">
                <p className="text-xs font-medium text-dark dark:text-white mb-2">
                  Productos seleccionados:
                </p>
                <div className="flex flex-wrap gap-2">
                  {Array.from(selectedProducts).map((product) => (
                    <span
                      key={product}
                      className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary dark:bg-primary/20"
                    >
                      {productLabels[product]}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleBack}
                className="flex-1 rounded-lg border border-stroke px-4 py-2 text-sm font-medium text-dark transition-colors hover:bg-gray-2 dark:border-stroke-dark dark:text-white dark:hover:bg-dark-3"
              >
                Volver
              </button>
          <button
            onClick={handleStartTour}
            className="flex-1 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white transition-colors hover:opacity-90"
          >
            Comenzar Tour
          </button>
        </div>
          </>
        )}
      </div>
    </div>
  );
}
