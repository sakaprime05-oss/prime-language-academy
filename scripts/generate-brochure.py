#!/usr/bin/env python3
"""Génère la brochure PDF publique de Prime Language Academy.

Le contenu suit le livret des offres officiel (méthode ISO+, 3 parcours,
grille tarifaire par cycle de 2 mois, plannings des centres, modules ESP).

Usage:
    pip install reportlab
    python3 scripts/generate-brochure.py

Sortie: public/brochure-pla-2026.pdf
"""

from pathlib import Path

from reportlab.lib import colors
from reportlab.lib.pagesizes import A4
from reportlab.lib.units import mm
from reportlab.lib.utils import ImageReader
from reportlab.pdfgen import canvas

ROOT = Path(__file__).resolve().parents[1]
OUTPUT = ROOT / "public" / "brochure-pla-2026.pdf"
LOGO = ROOT / "public" / "logo.png"

W, H = A4
RED = colors.HexColor("#E7162A")
DARK = colors.HexColor("#0D0D14")
CREAM = colors.HexColor("#F5F0E8")
GREY = colors.HexColor("#6B6B73")
LIGHT = colors.HexColor("#F2F2F4")

SESSION = "Cycle Novembre - Décembre 2026"
DATES = "2 novembre - 31 décembre 2026"
PHONE = "+225 0161337864"
EMAIL = "primelanguageacademy9@gmail.com"
SITE = "www.primelangageacademy.com"


def header(c, eyebrow, title):
    c.setFillColor(DARK)
    c.rect(0, H - 34 * mm, W, 34 * mm, fill=1, stroke=0)
    c.setFillColor(RED)
    c.setFont("Helvetica-Bold", 8)
    c.drawString(18 * mm, H - 17 * mm, eyebrow.upper())
    c.setFillColor(CREAM)
    c.setFont("Helvetica-Bold", 19)
    c.drawString(18 * mm, H - 27 * mm, title)
    c.setFillColor(RED)
    c.rect(0, H - 35.5 * mm, W, 1.5 * mm, fill=1, stroke=0)


def footer(c, page_no):
    c.setFillColor(LIGHT)
    c.rect(0, 0, W, 16 * mm, fill=1, stroke=0)
    c.setFillColor(GREY)
    c.setFont("Helvetica", 7.5)
    c.drawString(18 * mm, 6.5 * mm, f"Prime Language Academy · {PHONE} (WhatsApp) · {EMAIL}")
    c.setFont("Helvetica-Bold", 7.5)
    c.drawRightString(W - 18 * mm, 6.5 * mm, f"{SITE}  ·  {page_no}")


def wrap(c, text, x, y, width, font="Helvetica", size=9, leading=12.5, fill=GREY):
    c.setFont(font, size)
    c.setFillColor(fill)
    words = text.split()
    line = ""
    for word in words:
        trial = f"{line} {word}".strip()
        if c.stringWidth(trial, font, size) <= width:
            line = trial
        else:
            c.drawString(x, y, line)
            y -= leading
            line = word
    if line:
        c.drawString(x, y, line)
        y -= leading
    return y


def cover(c):
    c.setFillColor(DARK)
    c.rect(0, 0, W, H, fill=1, stroke=0)
    c.setFillColor(RED)
    c.rect(0, H - 6 * mm, W, 6 * mm, fill=1, stroke=0)

    if LOGO.exists():
        try:
            c.drawImage(ImageReader(str(LOGO)), 18 * mm, H - 52 * mm, width=38 * mm,
                        height=26 * mm, preserveAspectRatio=True, mask="auto")
        except Exception:
            pass

    c.setFillColor(RED)
    c.setFont("Helvetica-Bold", 9)
    c.drawString(18 * mm, H - 66 * mm, "CENTRE DE FORMATION & CONSULTING · ABIDJAN")

    c.setFillColor(CREAM)
    c.setFont("Helvetica-Bold", 40)
    c.drawString(18 * mm, H - 88 * mm, "Parlez anglais.")
    c.setFillColor(RED)
    c.drawString(18 * mm, H - 105 * mm, "Devenez Vraiment")
    c.drawString(18 * mm, H - 120 * mm, "Bon en Anglais.")

    c.setFillColor(CREAM)
    y = wrap(
        c,
        "Livret des offres. Méthode ISO+, trois parcours vendables, "
        "deux centres à Cocody et la visioconférence. Un palier de niveau tous les deux mois.",
        18 * mm, H - 136 * mm, W - 60 * mm, size=11, leading=16, fill=colors.HexColor("#B8B4AE"),
    )

    boxes = [
        ("Formation Régulière", "Tous niveaux · 2 à 4 séances / semaine", "80 000 - 120 000 FCFA"),
        ("Club d'Anglais", "English Only Environment · dès Autonome", "50 000 - 100 000 FCFA"),
        ("Formule Weekend Hybride", "Samedi ou dimanche · 10h00 - 14h00", "50 000 FCFA"),
    ]
    y = H - 175 * mm
    for title, sub, price in boxes:
        c.setStrokeColor(colors.HexColor("#2A2A35"))
        c.setFillColor(colors.HexColor("#15151F"))
        c.roundRect(18 * mm, y, W - 36 * mm, 20 * mm, 3 * mm, fill=1, stroke=1)
        c.setFillColor(CREAM)
        c.setFont("Helvetica-Bold", 12)
        c.drawString(25 * mm, y + 12 * mm, title)
        c.setFillColor(GREY)
        c.setFont("Helvetica", 8.5)
        c.drawString(25 * mm, y + 5.5 * mm, sub)
        c.setFillColor(RED)
        c.setFont("Helvetica-Bold", 11)
        c.drawRightString(W - 25 * mm, y + 8.5 * mm, price)
        y -= 24 * mm

    c.setFillColor(RED)
    c.rect(0, 0, W, 22 * mm, fill=1, stroke=0)
    c.setFillColor(colors.white)
    c.setFont("Helvetica-Bold", 10)
    c.drawString(18 * mm, 13 * mm, f"{SESSION} · {DATES}")
    c.setFont("Helvetica", 8.5)
    c.drawString(18 * mm, 7 * mm, f"Inscriptions ouvertes · Frais d'inscription offerts · {PHONE} (WhatsApp uniquement)")
    c.showPage()


def page_method(c):
    header(c, "01 · La méthode", "ISO+ : quatre piliers, une progression mesurable")

    pillars = [
        ("INPUT", "Nourrir la compréhension",
         "Exposition massive à l'anglais réel, apprentissage par chunks (blocs de langue) et immersion sonore quotidienne."),
        ("STRUCTURATION", "Comprendre la logique",
         "Grammaire fonctionnelle, fonctions langagières et comparaisons systématiques avec le français pour lever les blocages."),
        ("OUTPUT", "Produire dès la première séance",
         "Prise de parole immédiate, jeux de rôle, présentations courtes et défis chronométrés pour ancrer l'expression."),
        ("AUTOMATISATION", "Réagir sans traduire",
         "Répétition espacée, réactivation régulière et exercices sous pression jusqu'à la réponse réflexe."),
    ]

    y = H - 50 * mm
    for index, (name, claim, desc) in enumerate(pillars, start=1):
        c.setFillColor(LIGHT)
        c.roundRect(18 * mm, y - 20 * mm, W - 36 * mm, 24 * mm, 3 * mm, fill=1, stroke=0)
        c.setFillColor(RED)
        c.setFont("Helvetica-Bold", 20)
        c.drawString(24 * mm, y - 9 * mm, f"0{index}")
        c.setFillColor(DARK)
        c.setFont("Helvetica-Bold", 11)
        c.drawString(40 * mm, y - 3 * mm, f"{name} — {claim}")
        wrap(c, desc, 40 * mm, y - 10 * mm, W - 70 * mm, size=8.5, leading=11)
        y -= 29 * mm

    c.setFillColor(DARK)
    c.setFont("Helvetica-Bold", 13)
    c.drawString(18 * mm, y - 4 * mm, "Votre progression, cycle après cycle")
    y -= 14 * mm

    steps = [
        ("Débutant", "Autonome", "2 mois"),
        ("Autonome", "Mastery", "2 mois"),
        ("Mastery", "Mastery Professionnel", "2 mois"),
    ]
    box_w = (W - 36 * mm - 8 * mm) / 3
    x = 18 * mm
    for start, end, duration in steps:
        c.setStrokeColor(RED)
        c.setFillColor(colors.HexColor("#FDF0F1"))
        c.roundRect(x, y - 22 * mm, box_w, 22 * mm, 3 * mm, fill=1, stroke=1)
        c.setFillColor(GREY)
        c.setFont("Helvetica-Bold", 8)
        c.drawString(x + 6 * mm, y - 7 * mm, start.upper())
        c.setFillColor(RED)
        c.setFont("Helvetica-Bold", 10)
        c.drawString(x + 6 * mm, y - 13.5 * mm, f"→ {end}")
        c.setFillColor(GREY)
        c.setFont("Helvetica", 8)
        c.drawString(x + 6 * mm, y - 19 * mm, duration)
        x += box_w + 4 * mm

    y -= 32 * mm
    wrap(c,
         "Mastery = fluidité en anglais général. Mastery Professionnel = fluidité en anglais de spécialité. "
         "Six cycles de deux mois se succèdent chaque année : janvier-février, mars-avril, mai-juin, "
         "juillet-août, septembre-octobre, novembre-décembre.",
         18 * mm, y, W - 36 * mm, size=9, leading=12.5)

    footer(c, 2)
    c.showPage()


def page_programs(c):
    header(c, "02 · Les parcours", "Trois façons d'apprendre, un seul objectif")

    programs = [
        ("Formation Régulière", "Tous niveaux, du débutant au niveau professionnel",
         ["Grammaire, vocabulaire, compréhension orale et écrite, expression orale",
          "Base solide pour les examens internationaux : IELTS, TOEFL",
          "2, 3 ou 4 séances de 2h par semaine, 16h-18h ou 18h-20h",
          "En centre (Angré 8e Tranche, 2 Plateaux Vallon) ou en visioconférence"]),
        ("Club d'Anglais", "Niveau Autonome et plus, et anciens apprenants PLA",
         ["English Only Environment : on ne parle que l'anglais, du début à la fin",
          "Débats, jeux de rôle, storytelling, simulations professionnelles",
          "Networking et prise de parole en public",
          "Accès aux modules ESP (anglais de spécialité)"]),
        ("Formule Weekend Hybride", "Pour les emplois du temps saturés",
         ["4 heures par weekend, samedi ou dimanche, de 10h00 à 14h00",
          "Structuration puis pratique guidée au format Club",
          "Au Centre Poincaré ou en visioconférence",
          "Prolongement sur la plateforme entre deux séances"]),
    ]

    y = H - 50 * mm
    for title, subtitle, bullets in programs:
        c.setFillColor(DARK)
        c.roundRect(18 * mm, y - 40 * mm, W - 36 * mm, 44 * mm, 3 * mm, fill=1, stroke=0)
        c.setFillColor(RED)
        c.setFont("Helvetica-Bold", 13)
        c.drawString(25 * mm, y - 6 * mm, title)
        c.setFillColor(colors.HexColor("#B8B4AE"))
        c.setFont("Helvetica", 8.5)
        c.drawString(25 * mm, y - 12 * mm, subtitle)
        by = y - 20 * mm
        for bullet in bullets:
            c.setFillColor(RED)
            c.setFont("Helvetica-Bold", 8)
            c.drawString(25 * mm, by, "•")
            c.setFillColor(CREAM)
            c.setFont("Helvetica", 8.5)
            c.drawString(29 * mm, by, bullet)
            by -= 6 * mm
        y -= 49 * mm

    c.setFillColor(DARK)
    c.setFont("Helvetica-Bold", 12)
    c.drawString(18 * mm, y - 2 * mm, "ESP · English for Specific Purposes")
    y = wrap(c,
             "Accessible dès le niveau Autonome, en Formation Régulière ou au Club. Neuf modules d'anglais métier :",
             18 * mm, y - 9 * mm, W - 36 * mm, size=8.5, leading=11)

    modules = ["Legal English", "Civil Engineering & Construction", "Medical English",
               "Business & Management", "Electronics & Electrical Engineering",
               "Hospitality, Tourism & Aviation", "Finance & Accounting",
               "IT & Tech English", "Oil & Gas / Mining"]
    col_w = (W - 36 * mm) / 3
    for i, module in enumerate(modules):
        cx = 18 * mm + (i % 3) * col_w
        cy = y - (i // 3) * 6 * mm
        c.setFillColor(RED)
        c.setFont("Helvetica-Bold", 8)
        c.drawString(cx, cy, "›")
        c.setFillColor(GREY)
        c.setFont("Helvetica", 8.5)
        c.drawString(cx + 4 * mm, cy, module)

    footer(c, 3)
    c.showPage()


def page_pricing(c):
    header(c, "03 · Investissement", "Grille tarifaire · session de 2 mois")

    groups = [
        ("Présentiel", "Centre Programme 6 & Centre Poincaré", [
            ("Formation Régulière", ["80 000", "100 000", "120 000"]),
            ("Club d'Anglais", ["60 000", "80 000", "100 000"]),
        ]),
        ("En ligne", "Visioconférence, où que vous soyez", [
            ("Formation Régulière", ["70 000", "90 000", "110 000"]),
            ("Club d'Anglais", ["50 000", "70 000", "90 000"]),
        ]),
    ]

    y = H - 52 * mm
    col_x = [78 * mm, 116 * mm, 154 * mm]
    for title, subtitle, rows in groups:
        c.setFillColor(DARK)
        c.setFont("Helvetica-Bold", 12)
        c.drawString(18 * mm, y, title)
        c.setFillColor(GREY)
        c.setFont("Helvetica", 8.5)
        c.drawString(18 * mm, y - 5.5 * mm, subtitle)

        c.setFillColor(RED)
        c.setFont("Helvetica-Bold", 8)
        for label, x in zip(["2 SÉANCES", "3 SÉANCES", "4 SÉANCES"], col_x):
            c.drawCentredString(x, y, label)

        ry = y - 13 * mm
        for name, prices in rows:
            c.setFillColor(LIGHT)
            c.roundRect(18 * mm, ry - 4 * mm, W - 36 * mm, 11 * mm, 2 * mm, fill=1, stroke=0)
            c.setFillColor(DARK)
            c.setFont("Helvetica-Bold", 9.5)
            c.drawString(23 * mm, ry, name)
            c.setFont("Helvetica-Bold", 10)
            c.setFillColor(RED)
            for price, x in zip(prices, col_x):
                c.drawCentredString(x, ry, price)
            ry -= 14 * mm
        y = ry - 8 * mm

    c.setFillColor(DARK)
    c.roundRect(18 * mm, y - 18 * mm, W - 36 * mm, 20 * mm, 3 * mm, fill=1, stroke=0)
    c.setFillColor(RED)
    c.setFont("Helvetica-Bold", 11)
    c.drawString(25 * mm, y - 6 * mm, "Formule Weekend Hybride")
    c.setFillColor(colors.HexColor("#B8B4AE"))
    c.setFont("Helvetica", 8.5)
    c.drawString(25 * mm, y - 13 * mm, "4h par weekend · samedi ou dimanche · 10h00 - 14h00")
    c.setFillColor(CREAM)
    c.setFont("Helvetica-Bold", 14)
    c.drawRightString(W - 25 * mm, y - 9 * mm, "50 000 FCFA")

    y -= 30 * mm
    notes = [
        "Frais d'inscription : 0 FCFA. Offerts dans le cadre de l'offre de lancement.",
        "Tous les tarifs s'entendent pour une session complète de 2 mois.",
        "Le solde total est exigé avant le début de la formation : un acompte ne verrouille pas la place.",
        "Aucun frais caché : supports pédagogiques, plateforme et suivi sont inclus.",
        "Formations corporate, B2B et privées : tarification et calendrier sur devis, après rendez-vous.",
    ]
    for note in notes:
        c.setFillColor(RED)
        c.setFont("Helvetica-Bold", 9)
        c.drawString(18 * mm, y, "•")
        y = wrap(c, note, 23 * mm, y, W - 45 * mm, size=9, leading=11.5) - 2 * mm

    footer(c, 4)
    c.showPage()


def page_schedule(c):
    header(c, "04 · Organisation", "Plannings, centres et confort d'apprentissage")

    centers = [
        ("Centre Programme 6", "Cocody Angré 8e Tranche", [
            "Lundi & mercredi — Club d'Anglais : 16h-18h / 18h-20h",
            "Mardi & jeudi — Formation Régulière : 16h-18h / 18h-20h",
            "Vendredi — Régulière ou Club : 16h-18h / 18h-20h",
        ]),
        ("Centre Poincaré", "2 Plateaux Vallon, Établissement Henri Poincaré", [
            "Lundi & mercredi — Formation Régulière : 18h-20h",
            "Mardi & jeudi — Club d'Anglais : 18h-20h",
            "Vendredi — Régulière ou Club : 18h-20h",
            "Samedi & dimanche — Weekend Hybride : 10h-14h",
        ]),
        ("En ligne · visioconférence", "Depuis Abidjan, l'intérieur du pays ou l'étranger", [
            "Lundi & mercredi, mardi & jeudi, vendredi — Régulière / Club : 16h-18h / 18h-20h",
            "Samedi & dimanche — Weekend Hybride : 10h-14h",
        ]),
    ]

    y = H - 50 * mm
    for name, place, lines in centers:
        height = 12 * mm + len(lines) * 5.5 * mm
        c.setFillColor(LIGHT)
        c.roundRect(18 * mm, y - height, W - 36 * mm, height + 4 * mm, 3 * mm, fill=1, stroke=0)
        c.setFillColor(DARK)
        c.setFont("Helvetica-Bold", 11)
        c.drawString(24 * mm, y - 5 * mm, name)
        c.setFillColor(GREY)
        c.setFont("Helvetica", 8)
        c.drawString(24 * mm, y - 10.5 * mm, place)
        ly = y - 17 * mm
        for line in lines:
            c.setFillColor(RED)
            c.setFont("Helvetica-Bold", 8)
            c.drawString(24 * mm, ly, "›")
            c.setFillColor(colors.HexColor("#3A3A42"))
            c.setFont("Helvetica", 8.5)
            c.drawString(28 * mm, ly, line)
            ly -= 5.5 * mm
        y -= height + 9 * mm

    c.setFillColor(GREY)
    c.setFont("Helvetica-Oblique", 8.5)
    c.drawString(18 * mm, y, "Session du lundi au samedi. Un suivi est également possible le dimanche.")
    y -= 12 * mm

    columns = [
        ("Dès votre inscription", [
            "Test de niveau initial",
            "Accès immédiat à la plateforme",
            "Documentation pédagogique offerte",
            "Préformation avant le démarrage",
            "Séances d'accompagnement en visio",
        ]),
        ("Votre confort", [
            "15 places maximum par salle",
            "Salles sécurisées et climatisées",
            "WiFi haut débit",
            "Parking et espace vert",
            "Espace Breakout rafraîchissements",
        ]),
    ]
    col_w = (W - 40 * mm) / 2
    x = 18 * mm
    for title, items in columns:
        c.setFillColor(DARK)
        c.setFont("Helvetica-Bold", 11)
        c.drawString(x, y, title)
        iy = y - 8 * mm
        for item in items:
            c.setFillColor(RED)
            c.setFont("Helvetica-Bold", 8)
            c.drawString(x, iy, "•")
            c.setFillColor(GREY)
            c.setFont("Helvetica", 8.5)
            c.drawString(x + 4 * mm, iy, item)
            iy -= 5.5 * mm
        x += col_w + 4 * mm

    c.setFillColor(DARK)
    c.rect(0, 16 * mm, W, 34 * mm, fill=1, stroke=0)
    c.setFillColor(RED)
    c.setFont("Helvetica-Bold", 8)
    c.drawString(18 * mm, 42 * mm, "PRENEZ RENDEZ-VOUS AVEC UN CONSULTANT — GRATUIT")
    c.setFillColor(CREAM)
    c.setFont("Helvetica", 8.5)
    c.drawString(18 * mm, 35 * mm, "Orientation, test de niveau et devis personnalisé (particuliers et entreprises).")
    c.setFont("Helvetica-Bold", 10)
    c.drawString(18 * mm, 27 * mm, f"WhatsApp uniquement : 0161337864  ·  Appel : Orange  ·  {EMAIL}")
    c.setFillColor(colors.HexColor("#B8B4AE"))
    c.setFont("Helvetica", 8.5)
    c.drawString(18 * mm, 21 * mm, f"{SITE}  ·  {SESSION} ({DATES})")

    footer(c, 5)
    c.showPage()


def main():
    OUTPUT.parent.mkdir(parents=True, exist_ok=True)
    c = canvas.Canvas(str(OUTPUT), pagesize=A4)
    c.setTitle("Prime Language Academy — Livret des offres 2026")
    c.setAuthor("Prime Language Academy")
    c.setSubject(f"Offres, tarifs et plannings · {SESSION}")
    cover(c)
    page_method(c)
    page_programs(c)
    page_pricing(c)
    page_schedule(c)
    c.save()
    print(f"Brochure générée : {OUTPUT} ({OUTPUT.stat().st_size // 1024} Ko)")


if __name__ == "__main__":
    main()
