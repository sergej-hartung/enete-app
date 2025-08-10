<?php

namespace App\Http\Controllers\Egon;

use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\ValidationException;

use App\Http\Controllers\Controller;

class EgonApiController extends Controller{

    protected string $baseUrl;
    protected string $token;
    protected string $resellerId;

    /**
     * Erlaubte Filter für Tarife.
     *
     * @var array<string, string>
     */
    protected array $rateFilters = [
        'rateId' => 'string',
        'rateName' => 'string',
        'providerName' => 'string',
        'basePriceYear' => 'string',
        'basePriceMonth' => 'string',
        'workPrice' => 'string',
        'totalPrice' => 'string',
        'totalPriceMonth' => 'string',
        'rateFileId' => 'string',
        'selfPayment' => 'boolean',
        'requiredEmail' => 'boolean',
        'optEco' => 'boolean',
        'providerChangeFast' => 'boolean',
        'providerDigitalSigned' => 'boolean',
        'providerId' => 'string',
        'cancel' => 'string',
        'cancelType' => 'string',
        'providerBirthdayMax' => 'string',
        'optBonus' => 'string',
        'optBonusLoyalty' => 'string',
        'optGuarantee' => 'string',
        'optTerm' => 'string',
    ];

    /**
     * Erlaubte Query-Parameter und deren Typen.
     *
     * @var array<string, string>
     */
    protected array $allowedQueryParamsMap = [
        'zip' => 'digits:5',
        'city' => 'string',
        'street' => 'string',
        'houseNumber' => 'string',
        'country' => 'integer',
        'consum' => 'integer',
        'consumNt' => 'integer',
        'type' => 'string',
        'branch' => 'string',
        'netzProviderId' => 'integer',
        'priceDate' => 'date',
        'counterType' => 'integer',
        'rateReadingType' => 'integer',
        'rateType' => 'integer',
        'basePriceYear' => 'numeric',
        'workPrice' => 'numeric',
        'workPriceNt' => 'numeric',
        'rateId' => 'integer',
        'providerId' => 'integer',
    ];

    public function __construct()
    {
        $this->baseUrl = config('services.egon.url');
        $this->token = config('services.egon.token');
        $this->resellerId = config('services.egon.reseller_id');
    }

    /**
     * Holt Städte basierend auf einer Postleitzahl.
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function getCitiesByZip(Request $request): JsonResponse
    {
        $request->merge(['zip' => $request->zip]);
        try {
            $request->validate(['zip' => 'required|digits:5']);

            $response = $this->makeApiRequest("cities/{$request->zip}");
            return response()->json($response);
        } catch (ValidationException $e) {
            return response()->json(['error' => $e->errors()], 422);
        }
    }

    /**
     * Prüft eine IBAN.
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function checkIban(Request $request): JsonResponse
    {
        $request->merge(['iban' => $request->iban]);
        try {
           $request->validate(['iban' => 'required|size:22']);

            $response = $this->makeApiRequest("checkIban/{$request->iban}");

            return response()->json($response);
        } catch (ValidationException $e) {
            return response()->json(['error' => $e->errors()], 422);
        }
    }

    /**
     * Holt Informationen zum Vorversorger basierend auf einer Tarif-ID.
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function getBeforeProvider(Request $request): JsonResponse
    {
        $request->merge(['rateId' => $request->rateId]);

        $request->validate(['rateId' => 'required|integer']);

        $response = $this->makeApiRequest("beforeProvider/{$request->rateId}");

        return response()->json($response);
    }

    /**
     * Holt rechtliche Formulare basierend auf einer Tarif-ID.
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function getLegalForm(Request $request): JsonResponse
    {
        $request->merge(['rateId' => $request->rateId]);
        $request->validate(['rateId' => 'required|integer']);

        $response = $this->makeApiRequest("legalForm/{$request->rateId}");

        return response()->json($response);
    }

    /**
     * Holt Straßen basierend auf Postleitzahl und Stadt.
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function getStreets(Request $request): JsonResponse
    {
        $request->merge(['zip' => $request->zip, 'city' => $request->city]);
        try {
            $request->validate([
                'zip' => 'required|digits:5',
                'city' => 'required|string',
            ]);
            $uri = "streets/{$request->zip}/" . urlencode($request->city);
            $response = $this->makeApiRequest($uri);
            return response()->json($response);
        } catch (ValidationException $e) {
            return response()->json(['error' => $e->errors()], 422);
        }
    }

    /**
     * Holt Netzbetreiber basierend auf Adressdaten.
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function getNetzProvider(Request $request): JsonResponse
    {
        try {
            $params = $this->validateQueryParams($request, ['zip', 'city', 'street', 'houseNumber', 'branch']);
            $uri = $this->createUri('netzProvider/', $params);
            $response = $this->makeApiRequest($uri);
            return response()->json($response);
        } catch (ValidationException $e) {
            return response()->json(['error' => $e->errors()], 422);
        }
    }

    /**
     * Holt Basisanbieter basierend auf Anfragedaten.
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function getBaseProvider(Request $request): JsonResponse
    {
        try {
            $params = $this->validateQueryParams($request, ['branch', 'type', 'zip', 'city', 'consum'], ['consumNt', 'country']);
            $uri = $this->createUri('baseProvider/', $params);
            $response = $this->makeApiRequest($uri);

            return response()->json($response);
        } catch (ValidationException $e) {
            return response()->json(['error' => $e->errors()], 422);
        }
    }

    /**
     * Holt Tarife basierend auf Anfragedaten und Filtern.
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function getRates(Request $request): JsonResponse
    {
        try {
           // var_dump('test');
            $params = $this->validateQueryParams(
                $request,
                ['zip', 'city', 'street', 'houseNumber', 'consum', 'type', 'branch'],
                [
                    'consumNt',
                    'country',
                    'netzProvider',
                    'priceDate',
                    'counterType',
                    'rateReadingType',
                    'rateType',
                    'basePriceYear',
                    'workPrice',
                    'workPriceNt',
                    'rateId',
                    'providerId',
                ]
            );
    
            $filters = $this->getRateFilters($request);
            $uri = $this->createUri('rates/', $params, $filters);
            //var_dump($uri);
            $response = $this->makeApiRequest($uri);
    
            return response()->json($response);
        } catch (ValidationException $e) {
            return response()->json(['error' => $e->errors()], 422);
        }
        
    }

    /**
     * Holt ein leeres Vertragsdokument basierend auf Tarif-ID und Datei-ID.
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function getContractFileBlank(Request $request): JsonResponse
    {
        $request->merge(['rateId' => $request->rateId, 'rateFileId' => $request->rateFileId]);
        try {
            $request->validate([
                'rateId' => 'required|string',
                'rateFileId' => 'required|string',
            ]);

            $uri = "rateService/contractFile/{$request->rateId}/{$request->rateFileId}";
            $response = $this->makeApiRequest($uri);
            var_dump($response);
            //return response()->json($response);
        } catch (ValidationException $e) {
            return response()->json(['error' => $e->errors()], 422);
        }
    }

    /**
     * Holt ein Bestelldokument basierend auf einer Bestell-ID.
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function getOrderFile(Request $request): JsonResponse
    {
        $request->validate(['orderId' => 'required|integer']);

        $uri = "order/{$request->orderId}/document/create";
        $response = $this->makeApiRequest($uri, 'POST');

        return response()->json($response);
    }

    /**
     * Erstellt eine neue Bestellung.
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function createNewOrder(Request $request): JsonResponse
    {
        $params = $request->validate([
            // Definiere Validierungsregeln basierend auf erwarteten Daten
            '*' => 'nullable',
        ]);

        $response = $this->makeApiRequest('order', 'PUT', $params);

        return response()->json($response);
    }

    // /**
    //  * Führt eine API-Anfrage an die Egon-API aus.
    //  *
    //  * @param string $uri
    //  * @param string $method
    //  * @param array|null $data
    //  * @return array|null
    //  */
    // protected function makeApiRequest(string $uri, string $method = 'GET', ?array $data = null): ?array
    // {
    //     try {
    //         $request = Http::withHeaders([
    //             'Authorization' => 'Bearer '.$this->token,
    //             //'reseller-id' => $this->resellerId,
    //         ]);

    //         if ($method === 'POST' || $method === 'PUT') {
    //             $response = $request->$method($this->baseUrl . $uri, $data);
    //         } else {
    //             $response = $request->get($this->baseUrl . $uri);
    //         }

    //         $response->throw();

    //         return $response->json();
    //     } catch (\Exception $e) {
    //         Log::error("Fehler bei Egon-API-Anfrage ($uri): " . $e->getMessage());
    //         return null;
    //     }
    // }

    protected function makeApiRequest(string $uri, string $method = 'GET', ?array $data = null): array
    {
        $base = rtrim($this->baseUrl, '/').'/';

        $client = Http::withHeaders([
            'Authorization' => 'Bearer '.$this->token,
            // 'reseller-id' => $this->resellerId,
        ])->acceptJson()->timeout(15);

        $response = match (strtoupper($method)) {
            'POST' => $client->post($base.$uri, $data ?? []),
            'PUT'  => $client->put($base.$uri, $data ?? []),
            default => $client->get($base.$uri),
        };

        // Wichtig: NICHT throw(), damit wir Body und Status auch bei 4xx/5xx sehen.
        return [
            'ok'     => $response->successful(),
            'status' => $response->status(),
            'body'   => $response->json() ?? [],
            'raw'    => $response->body(),
        ];
    }

    /**
     * Validiert und parst Query-Parameter.
     *
     * @param Request $request
     * @param array $requiredParams
     * @param array $optionalParams
     * @return array
     * @throws ValidationException
     */
    protected function validateQueryParams(Request $request, array $requiredParams, array $optionalParams = []): array
    {
        $rules = [];
        foreach ($requiredParams as $param) {
            if (isset($this->allowedQueryParamsMap[$param])) {
                $rules[$param] = 'required|' . $this->allowedQueryParamsMap[$param];
            }
        }

        foreach ($optionalParams as $param) {
            if (isset($this->allowedQueryParamsMap[$param])) {
                $rules[$param] = 'nullable|' . $this->allowedQueryParamsMap[$param];
            }
        }

        return $request->validate($rules);
    }

    /**
     * Extrahiert und validiert Filter für Tarife.
     *
     * @param Request $request
     * @return array
     * @throws ValidationException
     */
    protected function getRateFilters(Request $request): array
    {
        $filters = json_decode($request->query('filters'), true);

        if (!is_array($filters) || empty($filters)) {
            return [];
        }

        $result = [];
        foreach ($filters as $filter) {
            $key = array_key_first($filter);
            if (isset($this->rateFilters[$key])) {
                $value = $filter[$key];
                $rule = $this->rateFilters[$key];

                if ($rule === 'integer' && !is_int($value)) {
                    throw ValidationException::withMessages([$key => "Der Filter $key muss ein Integer sein."]);
                } elseif ($rule === 'numeric' && !is_numeric($value)) {
                    throw ValidationException::withMessages([$key => "Der Filter $key muss numerisch sein."]);
                } elseif ($rule === 'string' && !is_string($value)) {
                    throw ValidationException::withMessages([$key => "Der Filter $key muss ein String sein."]);
                } elseif ($rule === 'boolean' && !is_bool($value)) {
                    throw ValidationException::withMessages([$key => "Der Filter $key muss ein Boolean sein."]);
                }

                $result[$key] = $value;
            }
        }

        return $result;
    }

    /**
     * Erstellt eine URI mit Query-Parametern und Filtern.
     *
     * @param string $endpoint
     * @param array $params
     * @param array $filters
     * @return string
     */
    protected function createUri(string $endpoint, array $params, array $filters = []): string
    {
        $uri = $endpoint . '?' . http_build_query($params);

        foreach ($filters as $key => $value) {
            $uri .= sprintf('&[filter][%s][is]=%s', $key, is_bool($value) ? ($value ? 'true' : 'false') : $value);
        }

        return $uri;
    }
}