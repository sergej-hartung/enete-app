<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class TransformStringBooleans
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $booleanFields = [
            'business_registration',
            'billing_blocked',
            'id_card',
            'payout_blocked',
            'sales_tax_liability',
            'vat_liability_proven',
        ];

        $requestData = $request->all();

        $transformedData = $this->transformBooleans($requestData, $booleanFields);

        $request->replace($transformedData);

        return $next($request);
    }

    /**
     * Recursively transform string booleans to boolean values.
     *
     * @param array $data
     * @param array $booleanFields
     * @return array
     */
    protected function transformBooleans(array $data, array $booleanFields): array
    {
        foreach ($data as $key => &$value) {
            if (is_array($value)) {
                $value = $this->transformBooleans($value, $booleanFields);
            } elseif (in_array($key, $booleanFields, true) && is_string($value)) {
                $value = filter_var($value, FILTER_VALIDATE_BOOLEAN);
            }
        }

        return $data;
    }
}