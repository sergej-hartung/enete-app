<?php
namespace App\Services\Pdf\Templates;

class PdfOfferTemplate
{
    protected array $params;

    protected array $company = [
        'name' => 'enete GmbH',
        'street' => 'Cloppenburger Str.',
        'HouseNumber' => '10A',
        'zip' => '49696',
        'city' => 'Molbergen',
        'manager' => 'Jakob Walder',
        'bankName' => 'Volksbank Kur- und Rheinpfalz',
        'iban' => 'DE66 280662 14 0253613700',
        'ustIdNr' => 'DE 260268727',
        'court' => 'Amtsgericht Oldenburg',
        'hrb' => '209581',
        'phonePrefix' => '+49 (0) 4475',
        'phone' => '941920',
        'faxPrefix' => '+49 (0) 4475',
        'fax' => '9419215',
        'email' => 'info@enete.de',
        'homepage' => 'www.enete.de',
    ];

    public string $energyTitle = 'Ihr persönliches %s vom';
    public string $title = 'Ihr persönliches Angebot im Detail';
    public string $EnergyText =
    "Sehr geehrte%s %s %s %s,\n\n".
    "wir möchten Ihre Entscheidung für einen neuen Energieanbieter mit einem Vergleich optimal unterstützen. ".
    "Anhand Ihrer angegebenen Verbrauchsdaten in %s %s und einem Verbrauch von %s kWh / Jahr haben wir für Sie ".
    "auf den folgenden Seiten Ihre persönlichen Vergleichsangebote zusammengestellt.\n\n".
    "Haben Sie noch Fragen zu diesem Angebot? Ich beantworte diese gern!\n\n".
    "Sie erreichen mich unter den oben aufgeführten Kontaktinformationen.\n\n".
    "Freundliche Grüße\n\n";


    public string $defaultText = <<<EOT
Sehr geehrte%s %s %s %s,

vielen Dank für Ihr Interesse an unserem Service und Ihr Vertrauen.

Anhand Ihrer Wünsche haben wir für Sie folgendes Angebot ab der Seite 2 zusammengestellt. Die Preise verstehen sich inklusive MwSt. Abweichende Tarife werden gesondert gekennzeichnet.

Wir würden uns sehr freuen, wenn unser Angebot Ihre Zustimmung findet.

Haben Sie noch Fragen zu diesem Angebot? Gerne klären wir alle Details telefonisch, per E-Mail oder noch besser in einem persönlichen Gespräch.

Mit den besten Grüßen

enete GmbH
EOT;

    public string $energyTariffNotice = 'Die Preise beziehen sich auf das erste Jahr und berücksichtigen einmalige
                                        Freieinheiten und Rabatte. Weitere Angaben entnehmen Sie bitte den jeweiligen
                                        Anbieter- und Tarifseiten. Alle Daten © 2025 ENETE GmbH. Die Preise dürfen nur
                                        von registrierten Vertriebspartnern genutzt werden. Es handelt sich teilweise um
                                        Preise, die nur dem Direktvertrieb zur Verfügung stehen und nur über den
                                        Direktvertrieb vermarktet werden dürfen. Die ENETE GmbH übernimmt für die
                                        Richtigkeit der dargestellten Tarife und für durch falsch dargestellte Preise
                                        entstehende Schäden, gleich welcher Art, keinerlei Haftung.';
    public string $companyDescription = 'Ihr Partner für Energie und Telekommunikation';

    // protected array $lastPageText = [
    //     'title' => 'Wie geht es weiter?',
    //     'text_1' => 'Sie erhalten ein nach den Angebotsangaben ausgefülltes Auftragsformular zur Unterschrift.',
    //     'text_2' => 'Mit Ihrer Unterschrift erteilen Sie uns den Auftrag.',
    //     'text_3' => 'Wir kümmern uns ab sofort um alle Formalitäten und leiten den Wechsel ein.',
    //     'text_4' => 'Der neue Anbieter kündigt ihren bestehenden Vertrag und meldet Sie bei Netzbetreiber um.',
    //     'text_5' => 'Der Wechselprozess dauert nur wenige Wochen. Für den gesamten Wechselprozess sollten Sie ',
    //     'text_6' => 'in der Regel vier bis sechs Wochen einkalkulieren.',
    //     'text_7' => 'Sobald alle Bestätigungen vorliegen, erhalten Sie ein Begrüßungsschreiben. [...]',
    //     'text_8' => 'Fotografieren Sie am besten Ihren Zählerstand am Tag der Umstellung.',
    //     'text_9' => 'Unser Service ist 100% kostenfrei für Sie! Wir möchten Sie auch bei Ihrem nächsten Wechsel betreuen',
    // ];

    public function __construct(array $params = [])
    {
        $this->params = $params;
    }

    public function getEnergyOfferTextTariff(){
        return $this->energyTariffNotice;
    }

    // public function getLogo(): string
    // {
    //     return $this->params['img'] . '/logo-mitel.png';
    // }

    // public function getCheckmark(): string
    // {
    //     return $this->params['img'] . '/checkmark.png';
    // }

    public function getCompany(): array
    {
        return $this->company;
    }

    public function getTitle(): string
    {
        return $this->title;
    }

    public function getEnergyTitle(string $branch = ''): string
    {
        return sprintf($this->energyTitle, $branch === 'electric' ? 'Stromangebot' : 'Gasangebot');
    }

    public function getOfferText(string $salutation = '', string $firstName = '', string $lastName = ''): string
    {
        $form = strtolower(trim($salutation)) === 'herr' ? 'r' : '';
        return sprintf($this->defaultText, $form, $salutation, $firstName, $lastName);
    }

    public function getEnergyOfferText(
        string $salutation = '',
        string $firstName = '',
        string $lastName = '',
        string $zip = '',
        string $city = '',
        string $consum = ''
    ): string {
        $form = strtolower(trim($salutation)) === 'herr' ? 'r' : '';
        return sprintf($this->energyText, $form, $salutation, $firstName, $lastName, $zip, $city, $consum);
    }

    public function getCompanyDescription(): string
    {
        return $this->companyDescription;
    }

    public function getEnergyTariffNotice(): string
    {
        return $this->energyTariffNotice;
    }

    public function getTextLastSite(): array
    {
        return $this->lastPageText;
    }

    public function getLogoPath(): string
    {
        return public_path('images/pdf/logo-mitel.png');   // ← PNG hast du hochgeladen
    }

    public function getCheckmarkPath(): string 
    {
        return public_path('images/pdf/checkmark.png');
    }

    public function greetingText(array $client, string $branch): string
    {
        $form   = strtolower($client['salutation']) === 'herr' ? 'r' : '';
        $angebot = $branch === 'electric' ? 'Stromangebot' : 'Gasangebot';

        return sprintf(
            "Ihr persönliches %s vom %s\n\n".
            "Sehr geehrte%s %s %s,\n\n".
            "vielen Dank für Ihr Interesse an unserem Service und Ihr Vertrauen.\n\n".
            "Anhand Ihrer Wünsche haben wir für Sie folgendes Angebot zusammengestellt.\n\n",
            $angebot,
            now()->format('d.m.Y | H:i:s'),
            $form,
            $client['salutation'],
            $client['lastName']
        );
    }

    /* =========  Ansprechpartner-Block  ============ */
    public function sellerBlock(array $seller): string
    {
        return sprintf(
            "%s\n%s %s\n%s %s\n%s %s\n\nTel.: %s %s\nMobil: %s %s\nE-Mail: %s",
            $seller['company'],
            $seller['salutation'],
            $seller['firstName'],
            $seller['lastName'],
            $seller['street'],
            $seller['HouseNumber'],
            $seller['zip'],
            $seller['city'],
            $seller['phonePrefix'],
            $seller['phone'],
            $seller['mobilePrefix'],
            $seller['mobile'],
            $seller['email']
        );
    }


    public function energyLetter(array $client, array $rates): string
{
    $form = strtolower($client['salutation']) === 'herr' ? 'r' : '';

    /*  ❗  Hier PLZ, Ort und Verbrauch einsetzen  */
    $zip     = $client['plz']  ?? '';
    $city    = $client['city'] ?? '';
    $consum  = $rates['consum'] ?? '';

    return sprintf(
        $this->EnergyText,
        $form,                                // %s1  („r“ bei Herr)
        $client['salutation'],                // %s2
        $client['firstName']  ?? '',          // %s3
        $client['lastName']   ?? '',          // %s4
        $zip,                                 // %s5
        $city,                                // %s6
        $consum                               // %s7
    );
}
    
}