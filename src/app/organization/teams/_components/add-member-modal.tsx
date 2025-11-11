"use client";

import InputGroup from "@/components/FormElements/InputGroup";
import { EmailIcon, UserIcon, CallIcon } from "@/assets/icons";
import { useClickOutside } from "@/hooks/use-click-outside";
import { useState } from "react";

type AddMemberModalProps = {
  onClose: () => void;
  onAdd: (data: {
    fullName: string;
    email: string;
    phone?: string;
  }) => void;
};

export function AddMemberModal({ onClose, onAdd }: AddMemberModalProps) {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const modalRef = useClickOutside<HTMLDivElement>(() => onClose());

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAdd({
      fullName,
      email,
      phone: phone || undefined,
    });
    setFullName("");
    setEmail("");
    setPhone("");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div
        ref={modalRef}
        className="w-full max-w-md rounded-[10px] bg-white shadow-1 dark:bg-gray-dark dark:shadow-card"
      >
        <div className="border-b border-stroke px-6 py-4 dark:border-dark-3">
          <h2 className="text-heading-6 font-bold text-dark dark:text-white">
            Añadir Miembro al Equipo
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="space-y-5">
            <InputGroup
              label="Nombre Completo"
              type="text"
              name="fullName"
              placeholder="Ej: Juan Pérez"
              value={fullName}
              handleChange={(e) => setFullName(e.target.value)}
              icon={<UserIcon />}
              iconPosition="left"
              required
            />

            <InputGroup
              label="Email"
              type="email"
              name="email"
              placeholder="Ej: juan.perez@example.com"
              value={email}
              handleChange={(e) => setEmail(e.target.value)}
              icon={<EmailIcon />}
              iconPosition="left"
              required
            />

            <InputGroup
              label="Teléfono Móvil (Opcional)"
              type="tel"
              name="phone"
              placeholder="Ej: +52 55 1234 5678"
              value={phone}
              handleChange={(e) => setPhone(e.target.value)}
              icon={<CallIcon />}
              iconPosition="left"
            />
          </div>

          <div className="mt-6 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-stroke px-6 py-2.5 font-medium text-dark hover:shadow-1 dark:border-dark-3 dark:text-white"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="rounded-lg bg-primary px-6 py-2.5 font-medium text-white hover:bg-opacity-90"
            >
              Añadir Miembro
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

