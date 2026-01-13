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

