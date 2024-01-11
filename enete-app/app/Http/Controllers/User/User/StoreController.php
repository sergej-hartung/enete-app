<?php

namespace App\Http\Controllers\User\User;

use App\Mail\VerifyEmail;
use App\Models\User\User;
use Illuminate\Support\Str;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use App\Http\Requests\User\User\StoreUserRequest;

class StoreController extends Controller
{
    public function __invoke(StoreUserRequest $request)
    {
        // Получение данных из запроса
        $data = $request->validated();
        $data['password'] = Hash::make($data['password']);

        // Генерация email_verification_hash
        $data['email_verification_hash'] = md5(Str::random(40)); 
        // Создание нового пользователя
        $user = User::create($data);

        // Отправка Email с ссылкой для подтверждения
        Mail::to($user->email)->send(new VerifyEmail($user));
        $user->email_sent = now();
        $user->save();

        // Возвращаем ответ или перенаправляем
        return response([], 201);
    }
}
