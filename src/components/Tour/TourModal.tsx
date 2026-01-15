"use client";

import { useTour } from "@/contexts/tour-context";
import { useClickOutside } from "@/hooks/use-click-outside";

export function TourModal() {
  const { isModalOpen, closeModal, startTour } = useTour();
  const modalRef = useClickOutside<HTMLDivElement>(() => closeModal());

  const handleStartTour = () => {
    closeModal();
    // Iniciar el tour después de cerrar el modal
    setTimeout(() => {
      const tourSteps = [
        {
          id: "sidebar",
          target: "tour-sidebar",
          title: "Sección de productos",
          content: "Se muestran los 10 productos de zelify",
          position: "right" as const,
        },
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
        // AML - Validación de listas globales
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
          id: "aml-validation-form",
          target: "tour-aml-validation-form",
          title: "Formulario de Validación",
          content:
            "Ingresa el número de documento y selecciona el país para realizar la búsqueda. Zelify consultará automáticamente todas las listas configuradas y te mostrará los resultados detallados.",
          position: "left" as const,
        },
        {
          id: "aml-validations-list",
          target: "tour-aml-validations-list",
          title: "Historial de Validaciones",
          content:
            "Aquí puedes ver el historial completo de todas tus validaciones AML realizadas, incluyendo su estado, fecha de creación y resultados de las búsquedas en las listas globales.",
          position: "top" as const,
        },
        // Identidad - Flujo de trabajo
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
          id: "identity-workflow-config",
          target: "tour-identity-workflow-config",
          title: "Configuración del Flujo",
          content:
            "Personaliza cada aspecto del flujo de verificación: selecciona el país, tipo de documento, método de captura y verificación biométrica. Puedes previsualizar cómo se verá para tus usuarios.",
          position: "left" as const,
        },
        {
          id: "identity-workflow-preview",
          target: "tour-identity-workflow-preview",
          title: "Vista Previa del Dispositivo",
          content:
            "Visualiza cómo se verá el flujo de verificación de identidad en dispositivos móviles y web. Zelify te permite ver exactamente la experiencia que tendrán tus usuarios en sus dispositivos.",
          position: "right" as const,
        },
        // Conectar
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
            "Visualiza cómo se verá la interfaz de vinculación de cuentas bancarias en dispositivos móviles y web. La experiencia está optimizada para ser intuitiva y segura en cualquier dispositivo.",
          position: "right" as const,
        },
        // Tarjetas
        {
          id: "cards-product",
          target: "tour-product-cards",
          title: "Tarjetas",
          content:
            "El módulo de Tarjetas te permite diseñar, emitir y gestionar tarjetas personalizadas para tus usuarios, incluyendo diseño visual, transacciones y diligencia debida.",
          position: "right" as const,
        },
        {
          id: "cards-issuing-design",
          target: "tour-cards-issuing-design",
          title: "Diseño de Tarjetas",
          content:
            "Crea diseños personalizados para tus tarjetas. Elige colores, gradientes, redes de tarjetas y personaliza la apariencia visual para que refleje la identidad de tu marca.",
          position: "right" as const,
          url: "/pages/products/cards/issuing/design",
        },
        {
          id: "cards-design-editor",
          target: "tour-cards-design-editor",
          title: "Editor de Diseño",
          content:
            "Utiliza el editor visual para personalizar cada detalle de tus tarjetas. Puedes previsualizar el diseño en tiempo real y ver cómo se verá en formato físico.",
          position: "left" as const,
        },
        {
          id: "cards-preview",
          target: "tour-cards-preview",
          title: "Vista Previa del Dispositivo",
          content:
            "Visualiza cómo se verá la tarjeta diseñada en un dispositivo móvil. Puedes rotar la tarjeta y ver todos los detalles del diseño en una vista previa realista.",
          position: "right" as const,
        },
        {
          id: "cards-transactions",
          target: "tour-cards-transactions",
          title: "Transacciones",
          content:
            "Gestiona y monitorea todas las transacciones realizadas con las tarjetas emitidas. Zelify te proporciona un registro completo y detallado de cada operación.",
          position: "right" as const,
          url: "/pages/products/cards/transactions",
        },
        // Transferencias
        {
          id: "transfers-product",
          target: "tour-product-transfers",
          title: "Transferencias",
          content:
            "El módulo de Transferencias te permite configurar y gestionar transferencias de dinero, incluyendo servicios básicos y transferencias personalizadas entre diferentes regiones.",
          position: "right" as const,
        },
        {
          id: "transfers-config",
          target: "tour-transfers-config",
          title: "Configuración de Transferencias",
          content:
            "Configura las opciones de transferencia disponibles para tus usuarios. Selecciona las regiones, métodos de pago y personaliza la experiencia según tus necesidades.",
          position: "right" as const,
          url: "/pages/products/payments/transfers",
        },
        {
          id: "transfers-region-panel",
          target: "tour-transfers-region-panel",
          title: "Configuración por Región",
          content:
            "Define las regiones donde estarán disponibles las transferencias y configura los métodos de pago específicos para cada región según las regulaciones locales.",
          position: "left" as const,
        },
        {
          id: "transfers-preview",
          target: "tour-transfers-preview",
          title: "Vista Previa del Dispositivo",
          content:
            "Visualiza cómo se verá la interfaz de transferencias en dispositivos móviles. La experiencia está diseñada para ser clara, segura y fácil de usar en cualquier dispositivo.",
          position: "right" as const,
        },
        // Tx - Transferencias Internacionales
        {
          id: "tx-product",
          target: "tour-product-tx",
          title: "Tx - Transferencias Internacionales",
          content:
            "El módulo Tx te permite gestionar transferencias internacionales de manera eficiente, facilitando el envío de dinero entre diferentes países y monedas.",
          position: "right" as const,
        },
        {
          id: "tx-international-transfers",
          target: "tour-tx-international-transfers",
          title: "Transferencias Internacionales",
          content:
            "Configura y gestiona transferencias internacionales. Zelify te proporciona las herramientas necesarias para procesar envíos de dinero a nivel global de forma segura.",
          position: "right" as const,
          url: "/pages/products/tx/transferencias-internacionales",
        },
        {
          id: "tx-config",
          target: "tour-tx-config",
          title: "Configuración de Transferencias",
          content:
            "Personaliza las opciones de transferencias internacionales: selecciona países de origen y destino, tipos de cambio, métodos de pago y comisiones aplicables.",
          position: "left" as const,
        },
        {
          id: "tx-preview",
          target: "tour-tx-preview",
          title: "Vista Previa del Dispositivo",
          content:
            "Visualiza cómo se verá la interfaz de transferencias internacionales en dispositivos móviles. La experiencia está optimizada para guiar a los usuarios a través del proceso de envío internacional desde cualquier dispositivo.",
          position: "right" as const,
        },
        // IA - Alaiza
        {
          id: "ai-product",
          target: "tour-product-ai",
          title: "IA - Alaiza",
          content:
            "Alaiza es el asistente de inteligencia artificial de Zelify que te ayuda a automatizar tareas, responder consultas y mejorar la experiencia de tus usuarios mediante conversaciones inteligentes.",
          position: "right" as const,
        },
        {
          id: "ai-alaiza",
          target: "tour-ai-alaiza",
          title: "Alaiza - Asistente IA",
          content:
            "Configura y personaliza tu asistente de inteligencia artificial. Alaiza puede responder preguntas, ayudar con tareas y proporcionar soporte automatizado a tus usuarios.",
          position: "right" as const,
          url: "/pages/products/ai/alaiza",
        },
        {
          id: "ai-alaiza-config",
          target: "tour-ai-alaiza-config",
          title: "Configuración de Alaiza",
          content:
            "Personaliza el comportamiento, respuestas y capacidades de Alaiza. Define el tono de voz, temas de conversación y funciones específicas según las necesidades de tu negocio.",
          position: "left" as const,
        },
        {
          id: "ai-alaiza-preview",
          target: "tour-ai-alaiza-preview",
          title: "Vista Previa del Dispositivo",
          content:
            "Visualiza cómo se verá la interfaz de chat con Alaiza en dispositivos móviles. Prueba diferentes conversaciones y ve cómo el asistente responde a las consultas de tus usuarios desde cualquier dispositivo.",
          position: "right" as const,
        },
        // Pagos
        {
          id: "payments-product",
          target: "tour-product-payments",
          title: "Pagos",
          content:
            "El módulo de Pagos te permite configurar diferentes métodos de pago, incluyendo claves personalizadas y códigos QR, para facilitar las transacciones de tus usuarios.",
          position: "right" as const,
        },
        {
          id: "payments-custom-keys",
          target: "tour-payments-custom-keys",
          title: "Claves Personalizadas",
          content:
            "Configura claves de pago personalizadas que tus usuarios pueden usar para realizar transacciones de forma rápida y segura sin necesidad de ingresar datos bancarios completos.",
          position: "right" as const,
          url: "/pages/products/payments/custom-keys",
        },
        {
          id: "payments-qr",
          target: "tour-payments-qr",
          title: "Pagos con Código QR",
          content:
            "Habilita pagos mediante códigos QR. Tus usuarios pueden escanear códigos QR para realizar pagos de manera instantánea y sin contacto, mejorando la experiencia de pago.",
          position: "right" as const,
          url: "/pages/products/payments/qr",
        },
        {
          id: "payments-preview",
          target: "tour-payments-preview",
          title: "Vista Previa del Dispositivo",
          content:
            "Visualiza cómo se verán las diferentes opciones de pago en dispositivos móviles. La interfaz está diseñada para ser intuitiva y facilitar las transacciones desde cualquier dispositivo.",
          position: "right" as const,
        },
        // Descuentos y Cupones
        {
          id: "discounts-product",
          target: "tour-product-discounts",
          title: "Descuentos y Cupones",
          content:
            "El módulo de Descuentos y Cupones te permite crear, gestionar y analizar cupones de descuento para promocionar tus productos y servicios, aumentando la participación de tus usuarios.",
          position: "right" as const,
        },
        {
          id: "discounts-coupons",
          target: "tour-discounts-coupons",
          title: "Gestión de Cupones",
          content:
            "Crea y gestiona cupones de descuento para tus productos y servicios. Define descuentos, condiciones de uso, fechas de validez y límites de uso para cada cupón.",
          position: "right" as const,
          url: "/pages/products/discounts-coupons",
        },
        {
          id: "discounts-create",
          target: "tour-discounts-create",
          title: "Crear Nuevo Cupón",
          content:
            "Crea nuevos cupones personalizados. Define el tipo de descuento, monto o porcentaje, condiciones de aplicación y configura las reglas de uso según tus necesidades de marketing.",
          position: "left" as const,
          url: "/pages/products/discounts-coupons/create",
        },
        {
          id: "discounts-analytics",
          target: "tour-discounts-analytics",
          title: "Analítica y Uso",
          content:
            "Monitorea el rendimiento de tus cupones. Analiza cuántas veces se han usado, qué cupones son más populares y obtén insights valiosos para optimizar tus campañas de descuentos.",
          position: "right" as const,
          url: "/pages/products/discounts-coupons/analytics",
        },
      ];
      startTour(tourSteps);
    }, 300);
  };

  if (!isModalOpen) return null;

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/50 p-4">
      <div
        ref={modalRef}
        className="relative w-full max-w-md rounded-lg bg-white p-6 shadow-xl dark:bg-dark-2"
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

        <div className="mb-4">
          <h2 className="mb-2 text-2xl font-bold text-dark dark:text-white">
            Bienvenido al Tour
          </h2>
          <p className="text-sm text-dark-6 dark:text-dark-6">
            A continuación se mostrará un tour del producto super simple que te
            ayudará a conocer las funcionalidades principales de la aplicación.
          </p>
        </div>

        <div className="flex gap-3">
          <button
            onClick={closeModal}
            className="flex-1 rounded-lg border border-stroke px-4 py-2 text-sm font-medium text-dark transition-colors hover:bg-gray-2 dark:border-stroke-dark dark:text-white dark:hover:bg-dark-3"
          >
            Cancelar
          </button>
          <button
            onClick={handleStartTour}
            className="flex-1 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white transition-colors hover:opacity-90"
          >
            Comenzar Tour
          </button>
        </div>
      </div>
    </div>
  );
}

