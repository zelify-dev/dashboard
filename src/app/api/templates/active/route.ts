"use server";

import { NextRequest, NextResponse } from "next/server";

const REMOTE_BASE_URL = process.env.NOTIFICATIONS_SERVICE_URL ?? "http://localhost:3002";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const response = await fetch(`${REMOTE_BASE_URL}/api/templates/active`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: `Upstream activation failed with status ${response.status}` },
        { status: response.status },
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error proxying template activation", error);
    return NextResponse.json({ error: "Failed to activate template" }, { status: 500 });
  }
}
