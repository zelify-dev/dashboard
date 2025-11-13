"use client";

import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import { ShowcaseSection } from "@/components/Layouts/showcase-section";
import { useState } from "react";
import { TeamsList } from "./_components/teams-list";
import { CreateTeamModal } from "./_components/create-team-modal";
import { AddMemberModal } from "./_components/add-member-modal";

export type Team = {
  id: string;
  name: string;
  description: string;
  products: string[];
  members: TeamMember[];
  createdAt: string;
};

export type TeamMember = {
  id: string;
  fullName: string;
  email: string;
  phone?: string;
  role: "admin" | "member";
};

export default function TeamsPage() {
  const [teams, setTeams] = useState<Team[]>([
    {
      id: "1",
      name: "Administrators",
      description: "Equipo de administradores del sistema",
      products: [],
      members: [
        {
          id: "1",
          fullName: "Usuario por defecto",
          email: "admin@example.com",
          role: "admin",
        },
      ],
      createdAt: new Date().toISOString(),
    },
  ]);

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isAddMemberModalOpen, setIsAddMemberModalOpen] = useState(false);
  const [selectedTeamId, setSelectedTeamId] = useState<string | null>(null);

  const handleCreateTeam = (teamData: {
    name: string;
    description: string;
    products: string[];
  }) => {
    const newTeam: Team = {
      id: Date.now().toString(),
      name: teamData.name,
      description: teamData.description,
      products: teamData.products,
      members: [],
      createdAt: new Date().toISOString(),
    };
    setTeams([...teams, newTeam]);
    setIsCreateModalOpen(false);
  };

  const handleAddMember = (memberData: {
    fullName: string;
    email: string;
    phone?: string;
  }) => {
    if (!selectedTeamId) return;

    const newMember: TeamMember = {
      id: Date.now().toString(),
      fullName: memberData.fullName,
      email: memberData.email,
      phone: memberData.phone,
      role: "member",
    };

    setTeams(
      teams.map((team) =>
        team.id === selectedTeamId
          ? { ...team, members: [...team.members, newMember] }
          : team
      )
    );
    setIsAddMemberModalOpen(false);
    setSelectedTeamId(null);
  };

  const handleOpenAddMember = (teamId: string) => {
    setSelectedTeamId(teamId);
    setIsAddMemberModalOpen(true);
  };

  return (
    <div className="mx-auto w-full max-w-[1200px]">
      <Breadcrumb pageName="Teams" />

      <div className="mb-6 flex justify-end">
        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="rounded-lg bg-primary px-6 py-2.5 font-medium text-white hover:bg-opacity-90"
        >
          Crear Equipo
        </button>
      </div>

      <TeamsList teams={teams} onAddMember={handleOpenAddMember} />

      {isCreateModalOpen && (
        <CreateTeamModal
          onClose={() => setIsCreateModalOpen(false)}
          onCreate={handleCreateTeam}
        />
      )}

      {isAddMemberModalOpen && selectedTeamId && (
        <AddMemberModal
          onClose={() => {
            setIsAddMemberModalOpen(false);
            setSelectedTeamId(null);
          }}
          onAdd={handleAddMember}
        />
      )}
    </div>
  );
}








