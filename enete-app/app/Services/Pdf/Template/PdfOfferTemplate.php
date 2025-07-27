<?php
namespace App\Services\Pdf\Template;

/**
 * Stellt alle statischen Texte und Pfade zur Verfügung,
 * die im PDF wiederverwendet werden.
 *
 * ─ Wird von den Page‑Klassen benötigt für:
 *   • Logo‑ & Checkmark‑Pfad
 *   • Firmenfuß / Ansprechpartner‑Block
 *   • Anschreibentext (Seite 1)
 *   • Disclaimer (Vergleichsseiten)
 *   • Check‑Liste (letzte Seite)
 */
class PdfOfferTemplate
{
    /* -----------------------------------------------------------------
       1) Fixe Unternehmens­daten (Fußzeile & Anschrift)
    ----------------------------------------------------------------- */
    private array $company = [
        'name'        => 'enete GmbH',
        'street'      => 'Cloppenburger Str.',
        'HouseNumber' => '10A',
        'zip'         => '49696',
        'city'        => 'Molbergen',
        'manager'     => 'Jakob Walder',
        'bankName'    => 'Volksbank Kur‑ und Rheinpfalz',
        'iban'        => 'DE66 2806 6214 0253 6137 00',
        'ustIdNr'     => 'DE 260268727',
        'court'       => 'Amtsgericht Oldenburg',
        'hrb'         => '209581',
        'phonePrefix' => '+49 (0) 4475',
        'phone'       => '941920',
        'faxPrefix'   => '+49 (0) 4475',
        'fax'         => '9419215',
        'email'       => 'info@enete.de',
        'homepage'    => 'www.enete.de',
    ];

    /* -----------------------------------------------------------------
       2) Texte
    ----------------------------------------------------------------- */
    /** Platzhalter‑Letter für Seite 1 (Strom/Gas) */
    private const ENERGY_LETTER_TMPL = <<<TXT
Sehr geehrte%s %s %s %s,

wir möchten Ihre Entscheidung für einen neuen Energieanbieter mit einem Vergleich optimal unterstützen. Anhand Ihrer angegebenen Verbrauchsdaten in %s %s und einem Verbrauch von %s kWh / Jahr haben wir für Sie auf den folgenden Seiten Ihre persönlichen Vergleichsangebote zusammengestellt.

Haben Sie noch Fragen zu diesem Angebot? Ich beantworte diese gern!

Sie erreichen mich unter den oben aufgeführten Kontaktinformationen.

Freundliche Grüße

TXT;

    /** kleines Motto unter der Signatur */
    private const COMPANY_SLOGAN = 'Ihr Partner für Energie und Telekommunikation';

    /** Disclaimer unter jeder Vergleichsseite */
    private const TARIFF_DISCLAIMER = <<<TXT
Die Preise beziehen sich auf das erste Jahr und berücksichtigen einmalige Freieinheiten und Rabatte.
Weitere Angaben entnehmen Sie bitte den jeweiligen Anbieter und Tarifseiten. Alle Daten © 2025 ENETE GmbH.
Die Preise dürfen nur von registrierten Vertriebspartnern genutzt werden. Es handelt sich teilweise um Preise,
die nur dem Direktvertrieb zur Verfügung stehen und nur über den Direktvertrieb vermarktet werden dürfen.
Die ENETE GmbH übernimmt für die Richtigkeit der dargestellten Tarife und für durch falsch dargestellte
Preise entstehende Schäden, gleich welcher Art, keinerlei Haftung.
TXT;

    /** Check‑Liste „Wie geht es weiter?” (letzte Seite) */
    private array $lastSteps = [
        'Sie erhalten ein nach den Angebotsangaben ausgefülltes Auftragsformular zur Unterschrift.',
        'Mit Ihrer Unterschrift erteilen Sie uns den Auftrag.',
        'Wir kümmern uns ab sofort um alle Formalitäten und leiten den Wechsel ein.',
        'Der neue Anbieter kündigt Ihren bestehenden Vertrag und meldet Sie beim Netzbetreiber um.',
        'Der Wechselprozess dauert nur wenige Wochen. Für den gesamten Wechselprozess sollten Sie in der Regel vier bis sechs Wochen einkalkulieren.',
        'Sobald alle Bestätigungen vorliegen, erhalten Sie ein Begrüßungsschreiben. Darin teilt Ihnen der neue Versorger mit, ab wann Sie beliefert werden.',
        'Fotografieren Sie am besten Ihren Zählerstand am Tag der Umstellung.',
        'Unser Service ist 100 % kostenfrei für Sie! Wir möchten Sie auch bei Ihrem nächsten Wechsel betreuen.',
    ];

    /* -----------------------------------------------------------------
       3) Pfade für Logo & Häkchen
    ----------------------------------------------------------------- */
    public function getLogoPath(): string
    {
        return public_path('images/pdf/logo-mitel.png');
    }

    public function getCheckmarkPath(): string
    {
        return public_path('images/pdf/checkmark.png');
    }

    /* -----------------------------------------------------------------
       4) Getter, die von den Page‑Klassen gebraucht werden
    ----------------------------------------------------------------- */
    public function getCompany(): array
    {
        return $this->company;
    }

    public function getCompanyDescription(): string
    {
        return self::COMPANY_SLOGAN;
    }

    /**
     * „Ihr persönliches Strom‑/Gasangebot vom …”
     */
    public function getEnergyTitle(string $branch): string
    {
        $word = $branch === 'gas' ? 'Gasangebot' : 'Stromangebot';
        return sprintf('Ihr persönliches %s vom', $word);
    }

    /**
     * Personalisierter Fließtext auf Seite 1.
     */
    public function energyLetter(array $client, array $rates): string
    {
        $form   = strtolower($client['salutation'] ?? '') === 'herr' ? 'r' : '';
        $zip    = $client['plz']   ?? '';
        $city   = $client['city']  ?? '';
        $consum = $rates['consum'] ?? '';

        return sprintf(
            self::ENERGY_LETTER_TMPL,
            $form,
            $client['salutation'] ?? '',
            $client['firstName']  ?? '',
            $client['lastName']   ?? '',
            $zip,
            $city,
            $consum
        );
    }

    /**
     * Hinweis‑Block unter jeder Vergleichsseite.
     */
    public function getTariffDisclaimer(): string
    {
        return self::TARIFF_DISCLAIMER;
    }

    /**
     * Aufzählung für die letzte Seite („Wie geht es weiter?”)
     */
    public function getLastSteps(): array
    {
        return $this->lastSteps;
    }
}
