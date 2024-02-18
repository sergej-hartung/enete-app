<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class UpdateLastVisitMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        if (Auth::check()) { // Проверяем, аутентифицирован ли пользователь
            $user = Auth::user();
            $user->last_visit = now(); // Обновляем last_visit текущим временем
            $user->save();
        }

        return $next($request); // Продолжаем обработку запроса
    }
}
