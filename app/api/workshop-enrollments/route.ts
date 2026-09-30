import { NextResponse } from "next/server";
import { enrollInFreeWorkshop } from "@/lib/data/workshop-enrollment";
import { checkRateLimit, RATE_LIMIT_TIERS } from "@/lib/rateLimiter";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError) {
      return NextResponse.json(
        { error: "Impossible de vérifier votre session." },
        { status: 401 },
      );
    }
    if (!user) {
      return NextResponse.json(
        { error: "Vous devez être connecté pour vous inscrire à cet atelier." },
        { status: 401 },
      );
    }

    const rateLimit = checkRateLimit(
      `workshop-enrollment:${user.id}`,
      RATE_LIMIT_TIERS.CHECKOUT_PAYMENT.limit,
      RATE_LIMIT_TIERS.CHECKOUT_PAYMENT.windowMs,
    );
    if (!rateLimit.allowed) {
      return NextResponse.json(
        { error: "Trop de demandes. Veuillez patienter avant de réessayer." },
        { status: 429 },
      );
    }

    const body: unknown = await request.json();
    const workshopId =
      typeof body === "object" && body !== null && "workshopId" in body
        ? body.workshopId
        : null;
    if (typeof workshopId !== "string" || !workshopId) {
      return NextResponse.json(
        { error: "L'identifiant de l'atelier est requis." },
        { status: 400 },
      );
    }

    const { data: workshop, error: workshopError } = await supabase
      .from("workshops")
      .select("id, price")
      .eq("id", workshopId)
      .eq("is_published", true)
      .maybeSingle();

    if (workshopError) {
      console.error(
        "[WorkshopEnrollment] Unable to load workshop:",
        workshopError,
      );
      return NextResponse.json(
        { error: "Impossible de vérifier cet atelier." },
        { status: 500 },
      );
    }
    if (!workshop) {
      return NextResponse.json(
        { error: "Atelier introuvable." },
        { status: 404 },
      );
    }
    if (Number(workshop.price ?? 0) !== 0) {
      return NextResponse.json(
        { error: "Cet atelier nécessite un paiement." },
        { status: 400 },
      );
    }

    await enrollInFreeWorkshop(user.id, workshop.id);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[WorkshopEnrollment] Unable to register:", error);
    return NextResponse.json(
      { error: "Impossible d'enregistrer votre inscription à l'atelier." },
      { status: 500 },
    );
  }
}
