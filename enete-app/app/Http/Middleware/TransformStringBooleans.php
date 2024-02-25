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
        $booleanFields = ['business_registration','billing_blocked', 'id_card', 'payout_blocked', 'sales_tax_liability', 'vat_liability_proven', 'is_admin'];
    
        foreach ($booleanFields as $field) {
            if ($request->has($field)) {
                $request->merge([$field => filter_var($request->get($field), FILTER_VALIDATE_BOOLEAN)]);
            }
        }

        return $next($request);
    }
}
